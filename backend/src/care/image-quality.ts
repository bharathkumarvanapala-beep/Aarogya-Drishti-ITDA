import sharp from 'sharp';
import { BadRequestException } from '@nestjs/common';
export async function assessPhoto(data: string) {
  try {
    const image = sharp(Buffer.from(data.split(',')[1] || '', 'base64'), { limitInputPixels: 24000000, failOn: 'error' });
    const meta = await image.metadata();
    if (!['jpeg', 'png'].includes(meta.format || '') || !meta.width || !meta.height || meta.width < 640 || meta.height < 480) throw new Error('Resolution below 640 × 480');
    const { data: pixels, info } = await image.rotate().resize(256, 256, { fit: 'fill' }).greyscale().raw().toBuffer({ resolveWithObject: true });
    let sum = 0, glare = 0, lap = 0, squares = 0, n = 0;
    for (const v of pixels) { sum += v; if (v > 250) glare++; }
    for (let y = 1; y < info.height - 1; y++) for (let x = 1; x < info.width - 1; x++) {
      const i = y * info.width + x, v = pixels[i - 1] + pixels[i + 1] + pixels[i - info.width] + pixels[i + info.width] - 4 * pixels[i];
      lap += v; squares += v * v; n++;
    }
    const brightness = sum / pixels.length, glareRatio = glare / pixels.length, sharpness = squares / n - (lap / n) ** 2;
    const reasons = [];
    if (brightness < 35 || brightness > 225) reasons.push('Adjust lighting / వెలుతురు సరిచేయండి');
    if (glareRatio > 0.08) reasons.push('Reduce glare / ప్రతిబింబం తగ్గించండి');
    if (sharpness < 25) reasons.push('Hold steady and refocus / స్థిరంగా ఉంచి ఫోకస్ చేయండి');
    if (reasons.length) throw new Error(reasons.join('; '));
    return { verdict: 'ACCEPTABLE', brightness, glareRatio, sharpness, width: meta.width, height: meta.height, algorithm: 'image-quality-heuristics-v1', clinicalInference: false };
  } catch (e) { throw new BadRequestException(`Retake photo / ఫోటో మళ్లీ తీయండి: ${e instanceof Error ? e.message : 'Invalid image'}`); }
}
