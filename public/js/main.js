document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('urlInput');
  const shortenBtn = document.getElementById('shortenBtn');
  const customCode = document.getElementById('customCode');
  const resultContainer = document.getElementById('resultContainer');
  const shortUrl = document.getElementById('shortUrl');
  const copyBtn = document.getElementById('copyBtn');
  const statsLink = document.getElementById('statsLink');

  shortenBtn.addEventListener('click', shortenUrl);
  copyBtn.addEventListener('click', copyToClipboard);

  async function shortenUrl() {
    const url = urlInput.value.trim();
    const code = customCode.value.trim();
    
    if (!url) {
      showAlert('Por favor ingresa una URL válida', 'error');
      return;
    }

    try {
      shortenBtn.disabled = true;
      shortenBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url, 
          customCode: code || undefined 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showResult(data);
      } else {
        throw new Error(data.error || 'Error al acortar URL');
      }
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      shortenBtn.disabled = false;
      shortenBtn.innerHTML = '<i class="fas fa-rocket"></i> Acortar';
    }
  }

  function showResult(data) {
    shortUrl.href = `http://${data.shortUrl}`;
    shortUrl.textContent = data.shortUrl;
    statsLink.href = `/stats/${data.shortCode}`;
    resultContainer.classList.remove('hidden');
    urlInput.value = '';
    customCode.value = '';
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(shortUrl.href)
      .then(() => {
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="far fa-copy"></i>';
        }, 2000);
      })
      .catch(err => {
        console.error('Error al copiar:', err);
      });
  }

  function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
      <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
      ${message}
    `;
    
    const container = document.querySelector('.shortener-card');
    container.insertBefore(alert, container.firstChild);
    
    setTimeout(() => {
      alert.remove();
    }, 5000);
  }
});
