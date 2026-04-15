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
      "Analyze calls and songs from field recordings using the updated LightBirdNet acoustic workflow.",
    highlights: ["Audio upload", "5s log-Mel analysis", "Top-5 ranked matches"],
    footnote: "Best for dawn choruses, hidden birds, and call-driven identification with ranked confidence."
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
    note: "Designed to surface top-ranked species from 5-second log-Mel spectrogram structure and vocal patterns."
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
    headline: "Top-5 acoustic ranking complete",
    summary:
      "The 5-second analysis window maps most strongly to Asian Koel, with confidence driven by repeated tonal rise and stable phrase contour.",
    primary: {
      species: "Asian Koel",
      confidence: 91.8,
      note: "Pitch contour and phrase repetition align strongly with the model's learned Koel vocal signature."
    },
    alternatives: [
      {
        species: "Common Hawk-Cuckoo",
        confidence: 76.3,
        note: "Phrase repetition overlaps, but the harmonic envelope is less stable than the top match."
      },
      {
        species: "Large-billed Crow",
        confidence: 58.7,
        note: "Mid-band energy overlap appears in short segments, but phrase spacing diverges." 
      },
      {
        species: "Red-vented Bulbul",
        confidence: 41.9,
        note: "Energetic chirp clusters partially align, though the sustained motif is weaker."
      },
      {
        species: "Coppersmith Barbet",
        confidence: 29.6,
        note: "Narrow-band rhythmic components are present, but cadence consistency is lower."
      }
    ],
    metrics: [
      { label: "Window", value: "5.0s" },
      { label: "Sample rate", value: "22.05 kHz mono" },
      { label: "Feature map", value: "128x128 log-Mel" }
    ],
    caution: "Overlapping dawn-chorus vocals can spread confidence across close acoustic neighbors in the top-5 list."
  },
  {
    headline: "Rhythmic call family cluster detected",
    summary:
      "The updated pipeline favors Coppersmith Barbet from metallic repeated phrase structure and compact tonal rhythm.",
    primary: {
      species: "Coppersmith Barbet",
      confidence: 89.4,
      note: "The classifier responds strongly to repetitive hammering cadence and stable narrow-band energy." 
    },
    alternatives: [
      {
        species: "White-cheeked Barbet",
        confidence: 80.8,
        note: "Very close alternate when phrase tempo matches, with slightly broader harmonic spread."
      },
      {
        species: "Brown-headed Barbet",
        confidence: 61.7,
        note: "Related cadence class with weaker alignment in dominant spectral regions."
      },
      {
        species: "Red-whiskered Bulbul",
        confidence: 37.5,
        note: "Short repetitive phrases overlap at onset but diverge in sustained timing."
      },
      {
        species: "Common Tailorbird",
        confidence: 24.6,
        note: "Low-confidence edge candidate activated by compact chirp repetition."
      }
    ],
    metrics: [
      { label: "Window", value: "5.0s" },
      { label: "Inference", value: "Top-5 softmax" },
      { label: "Transform", value: "Log-dB -> [0,1]" }
    ],
    caution: "Barbet species remain close acoustic neighbors, so review habitat context before final identification."
  },
  {
    headline: "High-energy short phrases prioritized",
    summary:
      "The model favors Red-vented Bulbul from clustered short-call bursts and fast frequency movement across the analysis window.",
    primary: {
      species: "Red-vented Bulbul",
      confidence: 87.2,
      note: "Phrase density and short tonal bursts align with a common bulbul-like call signature." 
    },
    alternatives: [
      {
        species: "Red-whiskered Bulbul",
        confidence: 75.8,
        note: "Family-level overlap is strong, though cadence remains closer to Red-vented in this clip."
      },
      {
        species: "Common Tailorbird",
        confidence: 62.9,
        note: "Short-call rhythm overlaps, but frequency distribution appears broader and less periodic."
      },
      {
        species: "Common Myna",
        confidence: 39.1,
        note: "Busy phrase transitions overlap at onset, with weaker consistency through the full window."
      },
      {
        species: "Oriental Magpie-Robin",
        confidence: 27.2,
        note: "Low-confidence fallback triggered by energetic phrase transitions."
      }
    ],
    metrics: [
      { label: "Window", value: "5.0s" },
      { label: "Sample rate", value: "22.05 kHz mono" },
      { label: "Output", value: "Ranked top-5" }
    ],
    caution: "Urban ambience and overlapping human noise can soften class separation for short-call species."
  }
];
