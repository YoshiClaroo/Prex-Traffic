document.addEventListener('DOMContentLoaded', () => {
  const pathParts = window.location.pathname.split('/');
  const code = pathParts[pathParts.length - 1];
  
  if (!code) {
    window.location.href = '/';
    return;
  }

  fetchStats(code);
});

async function fetchStats(code) {
  try {
    const response = await fetch(`/api/stats/${code}`);
    const data = await response.json();
    
    if (response.ok) {
      displayStats(data);
    } else {
      throw new Error(data.error || 'Error al cargar estadísticas');
    }
  } catch (error) {
    document.getElementById('shortUrlDisplay').textContent = 'Error: ' + error.message;
  }
}

function displayStats(data) {
  // Mostrar información básica
  document.getElementById('shortUrlDisplay').textContent = window.location.host + '/' + data.short_code;
  document.getElementById('originalUrl').textContent = data.original_url;
  document.getElementById('totalClicks').textContent = data.clicks;
  document.getElementById('createdAt').textContent = new Date(data.created_at).toLocaleString();
  
  // Configurar gráfico
  const ctx = document.getElementById('dailyChart').getContext('2d');
  const dailyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.dailyStats.map(item => item.date),
      datasets: [{
        label: 'Clicks por día',
        data: data.dailyStats.map(item => item.clicks),
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        borderColor: 'rgba(67, 97, 238, 1)',
        borderWidth: 2,
        tension: 0.1,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });

  // Gráfico de dispositivos (ejemplo estático)
  const devicesCtx = document.getElementById('devicesChart').getContext('2d');
  new Chart(devicesCtx, {
    type: 'doughnut',
    data: {
      labels: ['Móvil', 'Escritorio', 'Tablet'],
      datasets: [{
        data: [65, 30, 5],
        backgroundColor: [
          'rgba(67, 97, 238, 0.7)',
          'rgba(72, 149, 239, 0.7)',
          'rgba(76, 201, 240, 0.7)'
        ]
      }]
    }
  });
}
