import $ from 'jquery';

const isSupportedImage = file =>
  file.type === 'image/jpeg' || file.type === 'image/png';

const MAX_THUMBNAIL_WIDTH = 500;
const MAX_THUMBNAIL_HEIGHT = 500;
const UPLOAD_URL = 'http://example.com';

class App {
  private file: File | null = null;
  private blob: Blob | null = null;

  constructor() {
    const self = this;
    $('#upload').on('click', function() {
      return self.handleUpload();
    });
    $('input[type=file]').on('change', function() {
      return self.handleChange(this);
    });
  }

  handleChange = element => {
    const file = $(element).prop('files')[0];
    if (!isSupportedImage(file)) {
      return;
    }

    this.file = file;

    const reader = new FileReader();
    reader.onload = e => {
      const image = new Image();
      image.onload = () => this.handleLoadImage(image);
      image.src = (e.target as any).result;
    };
    reader.readAsDataURL(file);
  };

  handleLoadImage = (image: HTMLImageElement) => {
    let width;
    let height;
    if (image.width > image.height) {
      // 横長の画像は横のサイズを指定値にあわせる
      const ratio = image.height / image.width;
      width = MAX_THUMBNAIL_WIDTH;
      height = MAX_THUMBNAIL_WIDTH * ratio;
    } else {
      // 縦長の画像は縦のサイズを指定値にあわせる
      const ratio = image.width / image.height;
      width = MAX_THUMBNAIL_HEIGHT * ratio;
      height = MAX_THUMBNAIL_HEIGHT;
    }

    const canvas = $('#canvas')
      .attr('width', width)
      .attr('height', height);

    const ctx = canvas[0].getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

    // canvasからbase64画像データを取得
    const base64 = canvas.get(0).toDataURL('image/jpeg');
    // base64からBlobデータを作成
    let barr, bin, i, len;
    bin = atob(base64.split('base64,')[1]);
    len = bin.length;
    barr = new Uint8Array(len);
    i = 0;
    while (i < len) {
      barr[i] = bin.charCodeAt(i);
      i++;
    }
    const blob = new Blob([barr], { type: 'image/jpeg' });
    console.log(blob);
    this.blob = blob;
  };

  handleUpload = () => {
    if (!this.file || !this.blob) {
      return;
    }

    const fd = new FormData();
    fd.append('file', this.blob);

    $.ajax({
      url: UPLOAD_URL,
      type: 'POST',
      dataType: 'json',
      data: fd,
      processData: false,
      contentType: false
    })
      .then(() => {
        console.log('success');
      })
      .catch(error => {
        console.error(error);
      });
  };
}

$(() => {
  new App();
});
