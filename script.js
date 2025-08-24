async function downloadMedia() {
  const url = document.getElementById('urlInput').value;
  const resultDiv = document.getElementById('result');
  if (!url) {
    alert('Please enter a URL');
    return;
  }

  resultDiv.innerHTML = '<p>Fetching media...</p>';

  try {
    const response = await fetch(`https://instagram-downloader.p.rapidapi.com/index?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY',
        'X-RapidAPI-Host': 'instagram-downloader.p.rapidapi.com'
      }
    });
    const data = await response.json();
    if (data && data.media) {
      resultDiv.innerHTML = `<a href="${data.media}" target="_blank" download>Click here to download</a>`;
    } else {
      resultDiv.innerHTML = '<p>Could not fetch media. Check the URL.</p>';
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = '<p>Error fetching media.</p>';
  }
}
