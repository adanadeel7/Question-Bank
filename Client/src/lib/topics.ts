export const TOPIC_OPTIONS = [
  { label: "Quadratics", value: "quadratics" },
  { label: "Functions", value: "functions" },
  { label: "Coordinate geometry", value: "coordinate-geometry" },
  { label: "Circular measure", value: "circular-measure" },
  { label: "Trigonometry", value: "trigonometry" },
  { label: "Series", value: "series" },
  { label: "Differentiation", value: "differentiation" },
  { label: "Integration", value: "integration" },
];

export function topicLabel(value: string) {
  return TOPIC_OPTIONS.find((t) => t.value === value)?.label ?? value;
}
