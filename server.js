require('dotenv').config()

const express = require('express');
const path = require('path');
const fs = require("fs");
const app = express();

app.use(express.static(path.join(__dirname, 'pages')));

app.get("/", (req, res) => {
  fs.readFile("./pages/index.html", (err, data) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    res.end();
  });
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

require('./bot.js')