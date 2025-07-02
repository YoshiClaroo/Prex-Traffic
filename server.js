const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configuración
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Base de datos
const db = new sqlite3.Database('./database/links.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id INTEGER NOT NULL,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(link_id) REFERENCES links(id)
  )`);
});

// Generar código corto mejorado
function generateShortCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Endpoints API
app.post('/api/shorten', (req, res) => {
  const { url, customCode } = req.body;
  
  if (!url) return res.status(400).json({ error: 'URL requerida' });

  const shortCode = customCode || generateShortCode();

  db.run(
    'INSERT INTO links (original_url, short_code) VALUES (?, ?)',
    [url, shortCode],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(400).json({ error: 'Código ya existe' });
        }
        return res.status(500).json({ error: 'Error en base de datos' });
      }
      
      res.json({ 
        originalUrl: url,
        shortUrl: `${req.headers.host}/${shortCode}`,
        shortCode
      });
    }
  );
});

app.get('/:code', (req, res) => {
  const { code } = req.params;

  db.get(
    'SELECT id, original_url FROM links WHERE short_code = ?',
    [code],
    (err, link) => {
      if (err || !link) return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));

      // Registrar click
      db.run('INSERT INTO clicks (link_id) VALUES (?)', [link.id]);
      // Actualizar contador
      db.run('UPDATE links SET clicks = clicks + 1 WHERE id = ?', [link.id]);

      res.redirect(link.original_url);
    }
  );
});

app.get('/api/stats/:code', (req, res) => {
  const { code } = req.params;

  db.get(
    `SELECT l.*, 
    (SELECT COUNT(*) FROM clicks WHERE link_id = l.id) as total_clicks,
    (SELECT strftime('%Y-%m-%d', clicked_at) as date, COUNT(*) as clicks 
     FROM clicks WHERE link_id = l.id 
     GROUP BY date ORDER BY date) as daily_stats
    FROM links l WHERE short_code = ?`,
    [code],
    (err, link) => {
      if (err || !link) return res.status(404).json({ error: 'Enlace no encontrado' });

      // Formatear estadísticas diarias
      db.all(
        `SELECT strftime('%Y-%m-%d', clicked_at) as date, COUNT(*) as clicks 
        FROM clicks WHERE link_id = ? 
        GROUP BY date ORDER BY date`,
        [link.id],
        (err, dailyStats) => {
          res.json({
            ...link,
            dailyStats: dailyStats || []
          });
        }
      );
    }
  );
});

// Servir archivos estáticos
app.get('/stats/:code', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
