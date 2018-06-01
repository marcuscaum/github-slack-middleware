const express = require('express');
const request = require('request');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const isActionOpenOrLabeled = action => (action === "opened") || (actions === "labeled");

const sendMessageToSlackChannel = () => {
  var options = {
    uri: 'https://hooks.slack.com/services/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',
    method: 'POST',
    json: {
      "text": "test"
    }
  };

  return request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log('Message sent!') // Print the shortened url.
    } else {
      console.log(error);
    }
  });
}


app.post('/pull-requests', (req, res) => {
  res.send(req.body);
  
  if (res.statusCode == 200) {
    sendMessageToSlackChannel();
  }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))