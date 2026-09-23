import BehindTheVeilPage, { generateMetadata as btvGenerateMetadata } from "../unveiler/books/behind-the-veil/page";

// The page ensures its associated publication on first request and must not be
// prerendered (which would attempt that write during the build).
export const dynamic = "force-dynamic";

export const generateMetadata = btvGenerateMetadata;

export default BehindTheVeilPage;
