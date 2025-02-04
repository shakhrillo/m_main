export const imagesCountRender = (imageUrls: string[]) => {
  const count = imageUrls.length
  if (count === 0) return "No images"

  return count === 1 ? `${count} image` : `${count} images`
}
