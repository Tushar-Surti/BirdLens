export type NavigationItem = {
  label: string;
  href: string;
};

export type DetectionMode = {
  icon: "image" | "audio";
  eyebrow: string;
  title: string;
  href: string;
  description: string;
  highlights: string[];
  footnote: string;
};

export type PredictionCandidate = {
  species: string;
  confidence: number;
  note: string;
};

export type PredictionSession = {
  headline: string;
  summary: string;
  primary: PredictionCandidate;
  alternatives: PredictionCandidate[];
  metrics: Array<{
    label: string;
    value: string;
  }>;
  caution: string;
};

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Detection", href: "/detect" },
  { label: "Image", href: "/detect/image" },
  { label: "Audio", href: "/detect/audio" },
  { label: "About", href: "/#about" }
];

export const detectionModes: DetectionMode[] = [
  {
    icon: "image",
    eyebrow: "Vision Model",
    title: "Image Detection",
    href: "/detect/image",
    description:
      "Upload a bird photograph to identify likely Indian species through plumage, silhouette, posture, and visible field marks.",
    highlights: ["Photo upload", "Species shortlist", "Confidence-led result"],
    footnote: "Best for perched birds, field photos, and clear silhouette-led sightings."
  },
  {
    icon: "audio",
    eyebrow: "Acoustic Model",
    title: "Audio Detection",
    href: "/detect/audio",
    description:
      "Analyze calls and songs from short recordings to recognize species when the bird is heard before it is seen.",
    highlights: ["Audio upload", "Call pattern analysis", "Alternative matches"],
    footnote: "Best for dawn choruses, hidden birds, and call-driven identification."
  }
];

export const howItWorksSteps = [
  {
    step: "01",
    title: "Choose a modality",
    description:
      "Begin with either a bird photo or a field recording, depending on what evidence you captured in the moment."
  },
  {
    step: "02",
    title: "Submit the strongest cue",
    description:
      "Provide the clearest crop or clip available so the model can focus on species-level traits rather than noise."
  },
  {
    step: "03",
    title: "Review the shortlist",
    description:
      "BirdLens returns a primary prediction, confidence estimate, and a refined set of nearby alternatives."
  }
];

export const multimodalReasons = [
  {
    title: "Some sightings are visual first",
    description:
      "Rich plumage, wing shape, crest, beak structure, and habitat context are often enough to narrow a species quickly."
  },
  {
    title: "Others are acoustic first",
    description:
      "Dense foliage, dawn movement, and fast flyovers often reveal themselves through song or call before a photograph is possible."
  },
  {
    title: "BirdLens supports both field realities",
    description:
      "The platform is organized around the way birding actually happens: partial evidence, shifting light, distant calls, and fast decisions."
  }
];

export const supportedModeHighlights = [
  {
    title: "Image-led identification",
    caption: "For field photos, mobile captures, and documented sightings.",
    note: "Optimized for species cues like plumage contrast, silhouette geometry, and visible head markings."
  },
  {
    title: "Audio-led identification",
    caption: "For recordings of calls, songs, and ambient bird vocalizations.",
    note: "Designed to surface the most likely species from spectro-temporal structure and vocal patterns."
  },
  {
    title: "Human-in-the-loop review",
    caption: "Results are presented as a refined decision aid, not a black-box verdict.",
    note: "Confidence, alternative species, and a clear result layout help keep interpretation grounded."
  }
];

export const aboutStats = [
  { value: "2", label: "Detection modalities" },
  { value: "Indian", label: "Birdlife focus" },
  { value: "Deep Learning", label: "Core research approach" }
];

export const imagePredictionLibrary: PredictionSession[] = [
  {
    headline: "Strong visual agreement",
    summary:
      "The uploaded photo aligns most strongly with Indian Roller through head coloration, wing tone, and posture silhouette.",
    primary: {
      species: "Indian Roller",
      confidence: 94.2,
      note: "Wing coloration and head profile closely match the model's strongest visual cluster."
    },
    alternatives: [
      {
        species: "White-throated Kingfisher",
        confidence: 82.4,
        note: "Similar saturated coloration, but the beak and body proportions diverge."
      },
      {
        species: "Blue-tailed Bee-eater",
        confidence: 68.1,
        note: "Blue-green tonality overlaps, though tail and beak geometry are less consistent."
      },
      {
        species: "Indian Peafowl",
        confidence: 31.6,
        note: "Low-confidence alternative based on color presence rather than full-body structure."
      }
    ],
    metrics: [
      { label: "Visual fit", value: "High" },
      { label: "Response", value: "1.6s" },
      { label: "Frame quality", value: "Clear" }
    ],
    caution: "Use the shortlist as decision support and validate against range, season, and observer context."
  },
  {
    headline: "Distinct plumage cues detected",
    summary:
      "The frame favors Rose-ringed Parakeet based on body tone, curved beak shape, and the strong lateral head silhouette.",
    primary: {
      species: "Rose-ringed Parakeet",
      confidence: 91.3,
      note: "Body color, neck contour, and facial shape align tightly with the trained visual embeddings."
    },
    alternatives: [
      {
        species: "Alexandrine Parakeet",
        confidence: 76.8,
        note: "A close family match, but shoulder detail appears less consistent."
      },
      {
        species: "Plum-headed Parakeet",
        confidence: 58.9,
        note: "The silhouette is related, though head coloration is not strongly supported."
      },
      {
        species: "Coppersmith Barbet",
        confidence: 24.7,
        note: "Low-confidence fallback driven by color distribution only."
      }
    ],
    metrics: [
      { label: "Visual fit", value: "Very High" },
      { label: "Response", value: "1.4s" },
      { label: "Frame quality", value: "Balanced" }
    ],
    caution: "Parakeet species can converge in outline, so background context and shoulder markings are worth checking."
  },
  {
    headline: "Silhouette-first classification",
    summary:
      "The image points toward Black Drongo, with the model leaning on tail shape, upright stance, and dark tonal consistency.",
    primary: {
      species: "Black Drongo",
      confidence: 89.5,
      note: "Tail fork and pose geometry are the strongest contributing cues in this prediction."
    },
    alternatives: [
      {
        species: "Ashy Drongo",
        confidence: 71.4,
        note: "A close structural neighbour, but tonal depth suggests Black Drongo more strongly."
      },
      {
        species: "Oriental Magpie-Robin",
        confidence: 55.1,
        note: "Shape is partly compatible, though the chest contrast pattern is weaker here."
      },
      {
        species: "Indian Robin",
        confidence: 29.9,
        note: "Low-confidence fallback driven by dark body cues."
      }
    ],
    metrics: [
      { label: "Visual fit", value: "High" },
      { label: "Response", value: "1.5s" },
      { label: "Frame quality", value: "Moderate" }
    ],
    caution: "Dark-bodied species benefit from a sharper crop around tail structure and bill shape."
  }
];

export const audioPredictionLibrary: PredictionSession[] = [
  {
    headline: "Dominant song signature matched",
    summary:
      "The audio pattern maps most strongly to Asian Koel, especially across the repeated tonal rise and sustained phrase shape.",
    primary: {
      species: "Asian Koel",
      confidence: 92.1,
      note: "Pitch contour and phrase repetition align with a stable vocal signature in the acoustic model."
    },
    alternatives: [
      {
        species: "Common Hawk-Cuckoo",
        confidence: 73.5,
        note: "There is partial overlap in repetitive phrasing, though the tonal envelope differs."
      },
      {
        species: "Brainfever Bird",
        confidence: 61.2,
        note: "Rhythmic rise is related, but the dominant band structure is less consistent."
      },
      {
        species: "Red-vented Bulbul",
        confidence: 27.8,
        note: "A low-confidence alternative triggered by general call energy rather than exact phrasing."
      }
    ],
    metrics: [
      { label: "Signal quality", value: "Clean" },
      { label: "Response", value: "1.8s" },
      { label: "Clip length", value: "12s" }
    ],
    caution: "Nearby overlapping calls can influence acoustic confidence, especially in mixed dawn recordings."
  },
  {
    headline: "Barbet-like phrase structure identified",
    summary:
      "The clip most closely resembles Coppersmith Barbet through its repeating metallic pattern and stable rhythmic interval.",
    primary: {
      species: "Coppersmith Barbet",
      confidence: 88.6,
      note: "The model responds strongly to the repetitive hammering cadence and narrow-band call profile."
    },
    alternatives: [
      {
        species: "White-cheeked Barbet",
        confidence: 79.1,
        note: "A close alternate when phrase tempo is similar, though this sample is more compact in tone."
      },
      {
        species: "Brown-headed Barbet",
        confidence: 57.3,
        note: "Related cadence, but the dominant spectral region is less aligned."
      },
      {
        species: "Common Tailorbird",
        confidence: 22.5,
        note: "Low-confidence noise edge from repetitive short chirps."
      }
    ],
    metrics: [
      { label: "Signal quality", value: "Good" },
      { label: "Response", value: "1.7s" },
      { label: "Clip length", value: "9s" }
    ],
    caution: "Barbet species are close acoustic neighbours, so confidence should be read alongside location and habitat cues."
  },
  {
    headline: "Short-call sequence favored",
    summary:
      "The acoustic model leans toward Red-vented Bulbul, primarily from the clustered short phrases and lively frequency movement.",
    primary: {
      species: "Red-vented Bulbul",
      confidence: 86.4,
      note: "Phrase density and short tonal bursts align with a frequent bulbul-like call pattern."
    },
    alternatives: [
      {
        species: "Red-whiskered Bulbul",
        confidence: 74.2,
        note: "Family-level overlap is strong, but the cadence sits closer to Red-vented in this clip."
      },
      {
        species: "Common Tailorbird",
        confidence: 59.8,
        note: "The short-call rhythm is related, though the frequency range appears broader here."
      },
      {
        species: "Oriental Magpie-Robin",
        confidence: 26.4,
        note: "Low-confidence alternative activated by energetic phrase transitions."
      }
    ],
    metrics: [
      { label: "Signal quality", value: "Moderate" },
      { label: "Response", value: "1.9s" },
      { label: "Clip length", value: "11s" }
    ],
    caution: "Urban ambience and overlapping human noise can soften the distinction between short-call species."
  }
];
