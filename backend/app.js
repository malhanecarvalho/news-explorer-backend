const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const routerUser = require("./routes/users");
const routerAuth = require("./routes/auth");
const bodyParser = require('body-parser');
const User = require("./models/user");
const { DATABASE} = process.env

const app = express();
app.use(cors());
app.options('*', cors());

async function ensureCollectionsExits() {
  await User.init()
  console.log("Coleções criadas com sucesso");
}

async function connectMongoose() {
  await mongoose.connect(`mongodb+srv://malhanesilva26:${DATABASE}@clustermy.jw5r3.mongodb.net/`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  try {
    console.log('Conexão com o MongoDB estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  };
};

const { PORT = 3000 } = process.env;


connectMongoose().then(ensureCollectionsExits).catch(console.error);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use("/users", routerUser);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('O servidor travará agora');
  }, 0);
});

app.use("/", routerAuth);

app.get('/', (req, res) => {
  res.send('Bem-vindo à API do Projeto Around da TripleTen');
});

app.use((req, res) => {
  res.status(404).json({ message: 'A solicitação não foi encontrada' });
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`O App está escutando na porta ${PORT}`);
});
