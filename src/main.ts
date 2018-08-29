/**
 * cf. https://qiita.com/komakomako/items/8efd4184f6d7cf1363f2
 * cf. https://qiita.com/komakomako/items/8efd4184f6d7cf1363f2#comment-b4821ac62eea8fea0dfa
 * cf. https://codepen.io/anon/pen/wrzgQL
 */
import { resizeImage } from './resizeImage';

const THUMBNAIL_SIZE = 500;

const isSupportedImage = (file: File) =>
  file.type === 'image/jpeg' || file.type === 'image/png';

class App {
  private blob: Blob | null = null;

  constructor() {
    const uploadButton = document.querySelector('.upload-button');
    const fileInput = document.querySelector('.file-input');
    if (!uploadButton || !fileInput) {
      throw new Error('Fail to initialize');
    }

    const self = this;
    uploadButton.addEventListener('click', function() {
      return self.handleUpload();
    });
    fileInput.addEventListener('change', function(this: HTMLInputElement) {
      return self.handleChange(this);
    });
  }

  private handleChange = (element: HTMLInputElement) => {
    const file = element.files && element.files[0];
    if (file && !isSupportedImage(file)) {
      return;
    }

    const image = new Image();
    image.onload = () => this.handleLoadImage(image);
    image.src = URL.createObjectURL(file);
  };

  private handleLoadImage = async (image: HTMLImageElement) => {
    const blob = await resizeImage(image, { maxSize: THUMBNAIL_SIZE });
    this.blob = blob;
    this.renderPreview(blob);
  };

  private handleUpload = () => {
    if (!this.blob) {
      return;
    }

    const fd = new FormData();
    fd.append('file', this.blob);
  };

  private renderPreview(blob: Blob) {
    const preview = new Image();
    preview.src = URL.createObjectURL(blob);
    document.body.appendChild(preview);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
