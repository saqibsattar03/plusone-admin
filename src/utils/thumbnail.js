export const generateVideoThumbnail = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const video = document.createElement('video');

    // this is important
    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(file);
    video.currentTime = 10;

    video.onloadeddata = () => {
      let ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();
      return resolve(canvas.toDataURL('image/png'));
    };
  });
};

//using function
export const getVideoThumbnail = async (file) => {
  const thumbnail = await generateVideoThumbnail(file);
  return thumbnail;
};

export const dataURLtoFile = (dataurl, filename) => {
  let arr, mime, bstr, u8arr, n;
  arr = dataurl.split(',');
  mime = arr[0].match(/:(.*?);/)[1];
  bstr = atob(arr[1]);
  u8arr = new Uint8Array(bstr.length);
  n = bstr.length;

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const image = new File([u8arr], filename, { type: mime });
  return image;
};
