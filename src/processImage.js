// processImage.js
import sharp from 'sharp';

export default async function processImage(buffer) {
  return await sharp(buffer)
    .webp({
      quality: 85,       // Set the quality of the output image
      effort: 1,         // Set the effort level for compression
      lossless: false     // Enable lossy compression
    })
    .toBuffer();
}
