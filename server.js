const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'www')));

app.use('*', (request, response) => {
    response.sendFile('index.html', { root: path.join(__dirname, 'www')});
});

const PORT = process.env.PORT || 5002;
app.listen( PORT, () => {
    console.log(`Server Listening on port ${PORT}`);
});

