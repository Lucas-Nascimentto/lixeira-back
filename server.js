const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Conectar ao MongoDB
mongoose.connect('mongodb+srv://la7371180:VtYDZ97iMzQBuTD@cluster.hjlu8.mongodb.net/lixeira?retryWrites=true&w=majority&appName=Cluster')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

// Definição do schema e modelo da lixeira
const lixeiraSchema = new mongoose.Schema({
  nivel: { type: Number, default: 0 },
});

const Lixeira = mongoose.model('Lixeira', lixeiraSchema);

Lixeira.findOne().then(lixeira => {
  if (!lixeira) {
    const novaLixeira = new Lixeira({ nivel: 0 });
    novaLixeira.save().then(() => console.log('Lixeira criada com nível inicial 0'));
  }
});


// Rota para obter o nível da lixeira
app.get('/api/nivel', async (req, res) => {
  try {
      const lixeira = await Lixeira.findOne();
      if (!lixeira) {
          return res.status(404).json({ message: 'Lixeira não encontrada' });
      }
      
      res.json({ nivel: lixeira.nivel });
  } catch (err) {
      res.status(500).json({ message: 'Erro ao acessar a lixeira' });
  }
});


// Rota para atualizar o nível da lixeira
app.post('/api/aumentarNivel', async (req, res) => {
  const lixeira = await Lixeira.findOne();
  if (!lixeira) {
    return res.status(404).json({ message: 'Lixeira não encontrada' });
  }
  lixeira.nivel = req.body.nivel;
  await lixeira.save();
  res.json(lixeira);
});

// Rota para esvaziar a lixeira
app.post('/api/esvaziarLixeira', async (req, res) => {
  const lixeira = await Lixeira.findOne();
  if (!lixeira) {
    return res.status(404).json({ message: 'Lixeira não encontrada' });
  }
  lixeira.nivel = 0;
  await lixeira.save();
  res.json(lixeira);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
