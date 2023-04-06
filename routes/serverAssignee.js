const express = require('express');
const router = express.Router();
const DataStore = require("nedb");
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const assigneeDataBase = new DataStore({ filename: "./Databases/assigneeDataBase.db", autoload: true });
assigneeDataBase.loadDatabase();

let clients = [];

router.get('/events', eventsHandlerAssignee);

function eventsHandlerAssignee(request, response) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response
  };
  clients.push(newClient);
  console.log("New client: " + clientId);

  // Immediately send the current task data to the new client
  assigneeDataBase.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      response.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  });
  
  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });
}

router.post("/SendAssignee", (req, res) => {
    console.log("Got POST submit Assignee request", req.body);
    const data = req.body;
    assigneeDataBase.insert(data, (err, newAssignee) => {
      if (err) {
        res.status(500).send({ error: err });
      } 
      else {
        res.status(200).json({
          AssigneeName: newAssignee.assigneeName,
        });
      }
    });
  })

let lastSentDataAssignee = null;
function sendAssigneeToAll() {
  assigneeDataBase.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else if (JSON.stringify(data) !== JSON.stringify(lastSentDataAssignee)) {
      console.log(data);
      clients.forEach(client => client.response.write(`data: ${JSON.stringify(data)}\n\n`));
      lastSentDataAssignee = data;
    }
  });
}

setInterval(sendAssigneeToAll, 1000); // sends events to all clients every 10 seconds

module.exports = router;