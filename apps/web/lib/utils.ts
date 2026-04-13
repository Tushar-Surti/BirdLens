export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatBytes(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function pickIndexedItem<T>(items: T[], seed: string) {
  if (items.length === 0) {
    throw new Error("Cannot pick an item from an empty array.");
  }

  const hash = seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return items[hash % items.length];
}
