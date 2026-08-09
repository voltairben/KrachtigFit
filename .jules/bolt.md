## 2024-08-09 - Missing Priority on LCP Image
**Learning:** Found a missing `priority` prop on a critical LCP image (Hero component's background image in `src/components/sections/hero.tsx`). Next.js's `<Image>` requires explicit `priority` flag for images above the fold to skip lazy-loading and preload them.
**Action:** When inspecting Next.js apps for performance, always ensure all above-the-fold or LCP-critical `<Image>` components have the `priority` prop set to true to improve Largest Contentful Paint.
