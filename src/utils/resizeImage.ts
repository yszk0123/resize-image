const DEFAULT_TIMEOUT = 30000;

const rejectAfter = (timeout: number) =>
  new Promise((_, reject) => setTimeout(reject, timeout));

export interface ResizeOptions {
  maxSize: number;
  timeout?: number;
}

export const resizeImage = (
  image: HTMLImageElement,
  { maxSize, timeout = DEFAULT_TIMEOUT }: ResizeOptions
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ratio = image.naturalWidth / image.naturalHeight;
  canvas.width = ratio >= 1 ? maxSize : maxSize * ratio;
  canvas.height = ratio < 1 ? maxSize : maxSize / ratio;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return Promise.race([
    new Promise(resolve => canvas.toBlob(resolve)),
    rejectAfter(timeout) as any
  ]);
};
