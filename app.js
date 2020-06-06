const dialogflow = require('dialogflow');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const sessionId = uuid.v4();

var currentIntent;

app.use(bodyParser.urlencoded({
  extended:false
}))

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.static('public'));

app.post('/send-msg',(req,res)=>{
  runSample(req.body.MSG).then(data=>{
    let message = "" + currentIntent + '$>';
    
    for(let i=0;i<data.length;i++) {
      let msg = data[i].text.text[0];
      if (i == data.length-1) {
        message = message + msg;
      }
      else {
        message = message + msg + "||";
      }
    }
    
    res.send({Reply:message});
  })
})

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(msg,projectId = 'chatbotspardha-qvdowa') {

  const sessionClient = new dialogflow.SessionsClient({
    keyFilename:"D:/Spardha/Spardha/ChatbotSpardha-7670a67c0787.json"
  });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: msg,
        languageCode: 'en-US',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult.fulfillmentMessages;
  currentIntent = responses[0].queryResult.intent.displayName;

  return result;
}

app.listen(port, "0.0.0.0");
