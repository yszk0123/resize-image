/**
 * cf. https://qiita.com/komakomako/items/8efd4184f6d7cf1363f2
 * cf. https://qiita.com/komakomako/items/8efd4184f6d7cf1363f2#comment-b4821ac62eea8fea0dfa
 * cf. https://codepen.io/anon/pen/wrzgQL
 */
const isSupportedImage = file =>
  file.type === 'image/jpeg' || file.type === 'image/png';

const THUMBNAIL_SIZE = 500;

class App {
  private blob: Blob | null = null;

  constructor() {
    const self = this;
    document
      .querySelector('.upload-button')
      .addEventListener('click', function() {
        return self.handleUpload();
      });
    document
      .querySelector('.file-input')
      .addEventListener('change', function() {
        return self.handleChange(this);
      });
  }

  private handleChange = element => {
    const file = element.files[0];
    if (!isSupportedImage(file)) {
      return;
    }

    const image = new Image();
    image.onload = () => this.handleLoadImage(image);
    image.src = URL.createObjectURL(file);
  };

  private handleLoadImage = (image: HTMLImageElement) => {
    const ratio = image.naturalWidth / image.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = ratio >= 1 ? THUMBNAIL_SIZE : THUMBNAIL_SIZE * ratio;
    canvas.height = ratio < 1 ? THUMBNAIL_SIZE : THUMBNAIL_SIZE / ratio;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      this.blob = blob;
      this.renderPreview(blob);
    });
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
