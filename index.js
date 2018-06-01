const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post('/pull-requests', (req, res) => {
  res.send(req.body);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))