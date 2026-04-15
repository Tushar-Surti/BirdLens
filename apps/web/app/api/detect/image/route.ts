import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { writeFile, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

type PythonResult = {
  code: number;
  stdout: string;
  stderr: string;
};

function runPythonInference(args: string[], cwd: string): Promise<PythonResult> {
  const pythonBin = process.env.IMAGE_PYTHON_PATH ?? process.env.AUDIO_PYTHON_PATH ?? "python";
  const repoSrc = path.join(cwd, "src");

  const env = {
    ...process.env,
    PYTHONPATH: process.env.PYTHONPATH
      ? `${repoSrc}${path.delimiter}${process.env.PYTHONPATH}`
      : repoSrc
  };

  return new Promise((resolve) => {
    const child = spawn(pythonBin, args, { cwd, env });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });

    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("close", (code) => {
      resolve({
        code: code ?? 1,
        stdout,
        stderr
      });
    });

    child.on("error", (error) => {
      resolve({
        code: 1,
        stdout,
        stderr: error.message
      });
    });
  });
}

export async function POST(request: Request) {
  const repoRoot = path.resolve(process.cwd(), "..", "..");
  const modelPath = path.join(repoRoot, "models", "vision", "indian_birds_image_classifier.pth");

  const formData = await request.formData();
  const uploaded = formData.get("file");

  if (!(uploaded instanceof File)) {
    return NextResponse.json({ error: "No image file received." }, { status: 400 });
  }

  const extension = path.extname(uploaded.name || "").toLowerCase() || ".jpg";
  const tempPath = path.join(tmpdir(), `birdlens-image-${randomUUID()}${extension}`);

  try {
    const buffer = Buffer.from(await uploaded.arrayBuffer());
    await writeFile(tempPath, buffer);

    const args = [
      "-m",
      "birdlens.vision.infer",
      "--image-path",
      tempPath,
      "--model-path",
      modelPath,
      "--top-k",
      "5"
    ];

    const result = await runPythonInference(args, repoRoot);

    if (result.code !== 0) {
      return NextResponse.json(
        {
          error: result.stderr.trim() || "Python inference process failed."
        },
        { status: 500 }
      );
    }

    const lines = result.stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const lastLine = lines.at(-1);

    if (!lastLine) {
      return NextResponse.json(
        {
          error: "Python inference returned empty output."
        },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(lastLine);
    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected inference error.";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await unlink(tempPath).catch(() => {
      return undefined;
    });
  }
}
