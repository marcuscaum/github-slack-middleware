const express = require('express');
const request = require('request');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const getPriority = labels => {
  const getPriorityName = label => label && label.substring(10);
  const priorityLabel = labels.filter(label => label.name.includes('priority'))[0];

  return getPriorityName(priorityLabel) || 'Not defined';
};

const isReadyForReview = labels => Boolean(labels.filter(label => label.name === 'help wanted').length);

const slackMessage = (data, messageType) => {
  if (data.action !== 'labeled' || !isReadyForReview(data.pull_request.labels)) return false;

  const priority = getPriority(data.pull_request.labels);
  const title = `${data.pull_request.title}#${data.pull_request.number}`;
  const text = data.pull_request.head.repo.full_name;
  const url = data.pull_request.html_url;
  const assigned = data.pull_request.assignee && data.pull_request.assignee.login || 'unassigned';
  let pretext = 'A new PR is ready to review!';
  let color = '#764FA5';

  switch (messageType) { //TODO: Define mess  age and color based on PR status
    case 'changesRequested':
      pretext = 'Changes requested!'
      color = '#F35A00';
      break;
    default:
      break;
  }

  const message = {
    'attachments': [
      {
        'color': color,
        'pretext': pretext,
        'title': title,
        'title_link': url,
        'text': text,
        'fields': [
          {
            'title': 'Priority',
            'value': priority,
            'short': true
          },
          {
            'title': 'Assigned to',
            'value': assigned,
            'short': true
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