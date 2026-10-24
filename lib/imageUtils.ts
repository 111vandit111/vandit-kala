export const PLACEHOLDER_IMAGE = "/vanditkalahero.png";

const LOGO_EXTENSION = /\.svg$/i;

// Only the personal profile photos live on Cloudinary; every other image is a local file under public/img.
export const CLOUDINARY_ROOT_FOLDER = "vandit-portfolio";
const LOCAL_IMAGE_ROOT = "/img";
const CLOUDINARY_DELIVERY_HOST = "https://res.cloudinary.com";
const CLOUDINARY_TRANSFORMS = "f_auto,q_auto";
export const PROFILE_FOLDER = "profile";

// SVGs are delivered as-is with their extension: f_auto would rasterise them to a small PNG and the site shows them unoptimised.
export function buildCloudinaryUrl(cloudName: string, publicId: string, extension?: string): string {
  const base = `${CLOUDINARY_DELIVERY_HOST}/${cloudName}/image/upload`;
  return extension?.toLowerCase() === "svg" ? `${base}/${publicId}.svg` : `${base}/${CLOUDINARY_TRANSFORMS}/${publicId}`;
}

export function cloudinaryPublicId(folder: string, slug: string): string {
  return `${CLOUDINARY_ROOT_FOLDER}/${folder}/${slug}`;
}

export function localImagePath(folder: string, slug: string, extension: string): string {
  return `${LOCAL_IMAGE_ROOT}/${folder}/${slug}.${extension.toLowerCase()}`;
}

// The only place that reads the cloud name for image URLs (the profile photos).
export function cloudinaryImageUrl(folder: string, slug: string, extension?: string): string {
  const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "").trim();
  if (!cloudName) throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  return buildCloudinaryUrl(cloudName, cloudinaryPublicId(folder, slug), extension);
}

export const PROFILE_IMAGE_SLUGS = { recruiter: "vandit-hero", playful: "vandit-playful" } as const;

export const profileImageUrl = (variant: keyof typeof PROFILE_IMAGE_SLUGS): string =>
  cloudinaryImageUrl(PROFILE_FOLDER, PROFILE_IMAGE_SLUGS[variant]);

export const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

export const isPlaceholderImage = (image?: string) => !image || image === PLACEHOLDER_IMAGE;

// SVG files are logos or glyphs: they are shown whole (object-contain); every other image is a photo or screenshot.
export const isLogoImage = (image: string) => LOGO_EXTENSION.test(image.split("?")[0]);
