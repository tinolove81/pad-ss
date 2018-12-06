const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/asset', express.static(__dirname + '/asset'));
app.use('/lib', express.static(__dirname + '/lib'));

app.listen(PORT, () => {
    console.log(`you are server is running on ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});
app.get('/pad-ss/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});
app.get('*', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8'); 
    res.send({'a': 'Who 100 !'});
});