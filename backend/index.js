const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const client = require('prom-client');
const cors = require('cors');

const app = express(); // ⚠️ precisa vir ANTES de usar app
const port = 3000;

app.use(cors());
app.use(express.json());

// Conexão com o banco
const pool = new Pool({
  host: 'db',
  user: 'admin',
  password: 'admin',
  database: 'statusdb',
});

// Métricas Prometheus
client.collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Endpoint principal
app.get('/services', async (req, res) => {
  const result = await pool.query('SELECT * FROM services');
  res.json(result.rows);
});

// Health check
async function checkServices() {
  try {
    const services = await pool.query('SELECT * FROM services');

    for (const service of services.rows) {
      try {
        await axios.get(service.url);
        await pool.query(
          'UPDATE services SET status=$1, last_check=NOW() WHERE id=$2',
          ['ONLINE', service.id]
        );
      } catch {
        await pool.query(
          'UPDATE services SET status=$1, last_check=NOW() WHERE id=$2',
          ['OFFLINE', service.id]
        );
      }
    }
  } catch (err) {
    console.error('Erro no health check:', err.message);
  }
}

setInterval(checkServices, 30000);

app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});
