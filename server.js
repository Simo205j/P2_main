const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const DataStore = require("nedb");
const router = express.Router();
const path = require('path')

const taskDataBase = new DataStore({ filename: "./Databases/taskDataBase.db", autoload: true });
taskDataBase.loadDatabase();

const app = express();

router.get('/board', (req, res) => {
  res.sendFile(__dirname + '/views/board.html');
});
router.get('/gantt', (req, res) => {
  res.sendFile(__dirname + '/views/gantt.html')
})
router.get('/backlog', (req, res) => {
  res.sendFile(__dirname + '/views/backlog.html')
})

app.use('/', router)
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'styles')));


const PORT = 3000;

let clients = [];

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}/board`);
});



app.get('/events', eventsHandler);

function eventsHandler(request, response) {
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
  taskDataBase.find({}, (err, data) => {
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
let lastSentData = null;

function sendEventsToAll() {
  taskDataBase.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else if (JSON.stringify(data) !== JSON.stringify(lastSentData)) {
      console.log(data);
      clients.forEach(client => client.response.write(`data: ${JSON.stringify(data)}\n\n`));
      lastSentData = data;
    }
  });
}

setInterval(sendEventsToAll, 1000); // sends events to all clients every 10 seconds

app.patch("/Tasks/UpdateStatus", (req, res) => {
  console.log("GOT PATCH request to update task status")
  const data = req.body;
  console.log(data)

  //SEARCH FOR TASK WITH ID,                        REPLACED ATTRIBUES
  taskDataBase.update({_id: data.id}, {$set: {"TaskAttributes.Status": data.Status}}, {}, (err, numUpdated) => {  
    if(err) 
    {
      res.status(500).send({ error: err });
    }
    else
    {
      res.status(200).json({
        status: "PATCHED TASK",
        task: data
      });
    }
  });
});

app.patch("/Tasks/Edit", (req, res) => {
  console.log("GOT PATCH request to update task")
  const data = req.body;
  console.log(data)

  //SEARCH FOR TASK WITH ID,                        REPLACED ATTRIBUES
  taskDataBase.update({_id: data.id}, {$set: { TaskName: data.TaskName, TaskAttributes: data.TaskAttributes} },{}, (err, updatedTask) => {
    if(err) 
    {
      res.status(500).send({ error: err });
    }
    else
    {
      res.status(200).json({
        status: "PATCHED TASK",
        task: data
      });
    }
  });
});
app.post('/Tasks/SendTask', (req, res) => {
  console.log("Got POST submitTask request", req.body);
  const data = req.body;
  taskDataBase.insert(data, (err, newTask) => {
    if (err) {
      res.status(500).send({ error: err });
    } 
    else {
      res.status(200).json({
        TaskName: newTask.TaskName,
      });
    }
  });
})

app.delete("/api/Task/", (req, res) => {
  console.log("Got request to delete task:" + req.body.TaskName);
  taskDataBase.remove({TaskName: req.body.TaskName, _id: req.body._id}, {}, function (err, numRemoved) {
    if (err) {
      res.status(500).send({ error: err });
    } else {
      res.status(200).send(req.body.TaskName + " Deleted");
    }
  });
});
