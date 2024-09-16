export type ColorTriple = [number, number, number]; // [r, g, b]

export function interpolateColor(value: number, valueColorPairs: [number, ColorTriple][]): string {
    if (valueColorPairs.length === 0) return "rgb(0, 0, 0)"; // Default if no pairs provided

    // Sort pairs by value
    const sortedPairs = [...valueColorPairs].sort((a, b) => a[0] - b[0]);

    // If the value is out of range, return the nearest color
    if (value <= sortedPairs[0][0]) return `rgb(${sortedPairs[0][1].join(", ")})`;
    if (value >= sortedPairs[sortedPairs.length - 1][0]) return `rgb(${sortedPairs[sortedPairs.length - 1][1].join(", ")})`;

    // Find the two closest pairs to interpolate between
    for (let i = 0; i < sortedPairs.length - 1; i++) {
        const [v1, color1] = sortedPairs[i];
        const [v2, color2] = sortedPairs[i + 1];

        if (value >= v1 && value <= v2) {
            const t = (value - v1) / (v2 - v1); // Interpolation factor

            const r = Math.round(color1[0] + t * (color2[0] - color1[0]));
            const g = Math.round(color1[1] + t * (color2[1] - color1[1]));
            const b = Math.round(color1[2] + t * (color2[2] - color1[2]));

            return `rgb(${r}, ${g}, ${b})`;
        }
    }

    return "rgb(0, 0, 0)"; // Fallback
}
