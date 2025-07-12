// Initialize camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => document.getElementById('video').srcObject = stream)
  .catch(err => {
    console.error('Camera access error:', err);
    document.getElementById('status').textContent = 'Camera access denied!';
  });

// Capture image from video
function capture() {
  const canvas = document.getElementById('canvas');
  const video = document.getElementById('video');
  const status = document.getElementById('status');

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(async (blob) => {
    const fileName = `user_${Date.now()}.jpg`;

    try {
      // TODO: Fetch pre-signed URL from backend/Lambda
      const s3Url = 'YOUR_S3_PRESIGNED_URL'; // Replace via API call

      const response = await fetch(s3Url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg'
        },
        body: blob
      });

      if (response.ok) {
        status.textContent = 'Image uploaded. Waiting for face match result...';

        // Optional: Notify backend to trigger Rekognition and poll for result
        // await fetch('/triggerRekognition?fileName=' + encodeURIComponent(fileName));
      } else {
        status.textContent = 'Upload failed. Try again.';
      }
    } catch (error) {
      console.error('Upload error:', error);
      status.textContent = 'Error occurred during upload.';
    }
  }, 'image/jpeg');
}
