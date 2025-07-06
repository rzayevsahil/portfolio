// Image-related helper functions

export function getImageUrl(img, BASE_URL, emptyImg) {
  if (!img) return emptyImg;
  if (img.startsWith('http')) return img;
  if (img.startsWith('/')) return BASE_URL.replace(/\/api$/, '') + img;
  return img;
} 