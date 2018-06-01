const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.post('/pull-requests', (req, res) => {
  console.log(req, res);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))