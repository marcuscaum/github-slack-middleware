const express = require('express');
const request = require('request');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const isActionOpenedOrLabeled = action => (action === "opened") || (action === "labeled");
const isReadyForReview = labels => Boolean(labels.filter(label => label.name === "help wanted").length);

const slackMessage = data => {
  console.log(isActionOpenedOrLabeled(data.action), isReadyForReview(data.pull_request.labels));
  if (!isActionOpenedOrLabeled(data.action) || !isReadyForReview(data.pull_request.labels)) return false;

  const message = {
    "attachments": [
      {
        "pretext": "A new PR is ready to review!",
        "title": `${data.pull_request.title}#${data.pull_request.number}`,
        "title_link": data.pull_request.url,
        "text": data.pull_request.head.full_name,
        "fields": [
          {
            "title": "Priority",
            "value": "High",
            "short": true
          },
          {
            "title": "Assigned to",
            "value": data.pull_request.assignee,
            "short": true
          }
        ]
      }
    ]
  };

  return message;
}

const sendMessageToSlackChannel = data => {
  const message = slackMessage(data);

  var options = {
    uri: 'https://hooks.slack.com/services/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',
    method: 'POST',
    json: message,
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
  sendMessageToSlackChannel(req.body);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))