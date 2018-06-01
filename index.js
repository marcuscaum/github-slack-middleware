const express = require('express');
const request = require('request');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post('/pull-requests', (req, res) => {
  var options = {
    uri: 'https://hooks.slack.com/services/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',
    method: 'POST',
    json: {
      "text": "test"
    }
  };

  request(options, (error, response, body) => {
    console.log(error);
    if (!error && response.statusCode == 200) {
      console.log(body.id) // Print the shortened url.
    }
  });

  res.send(req.body);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))