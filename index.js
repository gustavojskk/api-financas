const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Transaction = mongoose.model('Transaction', {
  description: String,
  amount: Number,
  category: String,
});

app.post('/api/transactions', async (req, res) => {
  try {
    const { description, amount, category } = req.body;
    const transaction = new Transaction({ description, amount, category });
    await transaction.save();
    res.status(201).send(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor');
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).send(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor');
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category } = req.body;
    
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { description, amount, category },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).send('Transação não encontrada');
    }

    res.status(200).send(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor');
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).send('Transação não encontrada');
    }

    res.status(200).send(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
