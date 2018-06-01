const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post('/pull-requests', (req, res) => {
  res.send(req.body);

  fetch('https://hooks.slack.com/services/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', {
    method: 'POST',
    body: { "text": "Hello newbies! "},
  });
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))