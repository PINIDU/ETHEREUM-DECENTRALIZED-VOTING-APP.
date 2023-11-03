const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const url = process.env.ATLAS_URI;
global.URL = url;

mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true});
const connection = mongoose.connection;

connection.once('open',()=>{
    console.log("MongoDB connection successfully.");
});


app.use(session({
  secret: 'thesecretkey',
  cookie:{maxAge:60000},
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.ATLAS_URI })
}));

app.use(express.json());

const staff = require('./routes/staff.js');
app.use('/staff', staff);

const election = require('./routes/election.js');
app.use('/election', election);


const electionResult = require('./routes/election_result.js');
app.use('/electionResult', electionResult);


app.listen(port,() =>{
    console.log(`Server is running on port: ${port}`);
});
