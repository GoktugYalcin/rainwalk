/**
 * PREVIEW builds run inside a sandboxed page (no third-party iframes or network),
 * so they swap YouTube for the procedural rain scene and use sample stations.
 */
export const PREVIEW = import.meta.env.MODE === "preview";
