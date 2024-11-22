const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const distanceRoutes = require('./routes/distance');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/distances', distanceRoutes);

mongoose
  .connect('mongodb://localhost:27017/calc-distance')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
