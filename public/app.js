const API_URL = 'https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev/api/resolve';

document.getElementById('year').textContent = new Date().getFullYear();
const form = document.getElementById('download-form');
const urlInput = document.getElementById('ig-url');
const resultEl = document.getElementById('result');
const previewEl = document.getElementById('preview');
const downloadsEl = document.getElementById('downloads');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultEl.classList.add('hidden');
  previewEl.innerHTML = '';
  downloadsEl.innerHTML = '';

  const url = urlInput.value.trim();
  if (!url) return alert('Please enter a valid Instagram URL.');

  document.getElementById('submit-btn').disabled = true;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Failed to fetch media');

    data.result.items.forEach(item => {
      const media = document.createElement('div');
      media.className = 'media';
      if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.url;
        video.controls = true;
        media.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = item.url;
        media.appendChild(img);
      }
      previewEl.appendChild(media);

      const link = document.createElement('a');
      link.href = item.url;
      link.download = '';
      link.textContent = `Download ${item.type}`;
      downloadsEl.appendChild(link);
    });

    resultEl.classList.remove('hidden');
  } catch (err) {
    alert(err.message);
  } finally {
    document.getElementById('submit-btn').disabled = false;
  }
});
