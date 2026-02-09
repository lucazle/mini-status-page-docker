const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const client = require('prom-client');
const cors = require('cors');

const app = express();
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

// =====================
// MÉTRICAS PROMETHEUS
// =====================
client.collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// =====================
// ROTAS
// =====================

// Lista serviços (status atual)
app.get('/services', async (req, res) => {
  const result = await pool.query('SELECT * FROM services');
  res.json(result.rows);
});

// Histórico de um serviço
app.get('/services/:id/history', async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT status, checked_at
     FROM service_status_history
     WHERE service_id = $1
     ORDER BY checked_at DESC
     LIMIT 20`,
    [id]
  );

  res.json(result.rows);
});

// =====================
// HEALTH CHECK + HISTÓRICO
// =====================
async function checkServices() {
  try {
    const services = await pool.query('SELECT * FROM services');

    for (const service of services.rows) {
      let newStatus = 'OFFLINE';

      try {
        await axios.get(service.url, { timeout: 5000 });
        newStatus = 'ONLINE';
      } catch {
        newStatus = 'OFFLINE';
      }

      // Só registra se o status mudou
      if (newStatus !== service.status) {
        // Atualiza status atual
        await pool.query(
          'UPDATE services SET status=$1, last_check=NOW() WHERE id=$2',
          [newStatus, service.id]
        );

        // Insere no histórico
        await pool.query(
          `INSERT INTO service_status_history (service_id, status)
           VALUES ($1, $2)`,
          [service.id, newStatus]
        );
      } else {
        // Apenas atualiza o last_check
        await pool.query(
          'UPDATE services SET last_check=NOW() WHERE id=$1',
          [service.id]
        );
      }
    }
  } catch (err) {
    console.error('Erro no health check:', err.message);
  }
}

// Executa a cada 30 segundos
setInterval(checkServices, 30000);

// =====================
app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});