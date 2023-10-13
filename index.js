const mongoose = require('mongoose');
const express = require("express");
var cors = require('cors');

const app = express();

//const { createServer } = require("http");
//const { Server } = require("socket.io");

//const httpServer = createServer(app);
//const io = new Server(httpServer);


const routes = require('./routes/index');
const mainFunction = require('./main');
const saveSymbol = require('./UtilFunctions/saveSymbols');




const uri = "mongodb+srv://nightfuury:Bbdnitm%402014@tradebot.74say.mongodb.net/?retryWrites=true&w=majority";

//const url ='mongodb+srv://nightfuury:Bbdnitm%402014@tradebot.74say.mongodb.net/tradebot'

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/', routes);


mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => {

    const server = app.listen(5000);

    const io = require('./socket').init(server);

    io.on('connection', socket => {
      console.log('Client connected');
    })

  })
  .then(() => {
    console.log('Server Started');

    timedTrx();
  })
  .catch(err => console.log(err));


const timedTrx = () => {
  setInterval(() => {
    mainFunction.main();
  }, 28000);
}