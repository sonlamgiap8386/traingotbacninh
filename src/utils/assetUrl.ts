/**
 * Resolves a public asset for both local Vite and a GitHub Pages project site.
 * Do not use root-relative `/assets/...` URLs directly: they omit the
 * repository name on GitHub Pages and cause image requests to 404.
 */
export const publicAssetUrl = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
