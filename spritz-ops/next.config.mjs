/** @type {import('next').NextConfig} */
const nextConfig = {
  // Two things at once.
  //
  // `.nosync`: the repo lives on the Desktop, which iCloud syncs, and iCloud
  // was evicting freshly-written files inside `.next/` mid-run. Folders named
  // `*.nosync` are never touched. Vercel has no iCloud and expects the default
  // ".next", so the rename is local-only.
  //
  // Separate dev and build folders: running `next build` while `next dev` is
  // up overwrites the manifests the dev server is holding open, and dev then
  // 500s with "Could not find the module ... in the React Client Manifest"
  // until the folder is deleted. Giving them a folder each costs a line.
  distDir: process.env.VERCEL
    ? ".next"
    : process.env.NODE_ENV === "development"
      ? ".next.dev.nosync"
      : ".next.nosync",
};

export default nextConfig;
