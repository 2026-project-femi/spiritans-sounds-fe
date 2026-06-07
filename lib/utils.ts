import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrlFromResponse = (doc: any) => doc.featuredImage && typeof doc.featuredImage === "object" ? doc.featuredImage.url : null