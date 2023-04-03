const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const DataStore = require("nedb");
const router = express.Router();
const path = require('path')



const taskDataBase = new DataStore({ filename: "./Databases/taskDataBase.db", autoload: true });
taskDataBase.loadDatabase();

const logbookDataBase = new DataStore({ filename: "./Databases/logbookDataBase.db", autoload: true });
logbookDataBase.loadDatabase();

const assigneeDataBase = new DataStore({ filename: "./Databases/assigneeDataBase.db", autoload: true });
assigneeDataBase.loadDatabase();

const app = express();

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/board.html');
});
router.get('/board', (req, res) => {
  res.sendFile(__dirname + '/views/board.html');
});
router.get('/gantt', (req, res) => {
  res.sendFile(__dirname + '/views/gantt.html')
})
router.get('/backlog', (req, res) => {
  res.sendFile(__dirname + '/views/backlog.html')
})
router.get('/logbook', (req, res) => {
  res.sendFile(__dirname + '/views/logbook.html')
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

app.post('/Tasks/SendLogbook', (req, res) => {
  console.log("Got POST submitLogbook request", req.body);
  const data = req.body;
  logbookDataBase.insert(data, (err, newLogbook) => {
    if (err) {
      res.status(500).send({ error: err });
    } 
    else {
      res.status(200).json({
        LogbookName: newLogbook.LogbookName,
      });
    }
  });
})

app.delete("/api/Task", (req, res) => {
  console.log("Got request to delete task:" + req.body.TaskName);
  taskDataBase.remove({TaskName: req.body.TaskName, _id: req.body._id}, {}, function (err, numRemoved) {
    if (err) {
      res.status(500).send({ error: err });
    } else {
      res.status(200).json(req.body.TaskName + " Deleted");
    }
  });
});

app.delete("/Logbook/Delete", (req, res) => {
  const data =  req.body._id
  console.log("Deleting logbook with _id:", data);
  logbookDataBase.remove({_id: data}, {}, function (err, numRemoved) {
  if (err) {
    console.error("Error deleting logbook:", err);
    res.status(500).send({ error: err });
  } else {
    console.log("Deleted logbook:", numRemoved);
    res.status(200).json(data + " Deleted");
  }
});

});

app.get("/api/Logbook/Get", (req, res) => {
  console.log("Got request to get logbook data:");
  logbookDataBase.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      res.send(data)
    }
  });
});

app.post("/Logbook/UpdatePost", (req, res) => {
  logbookEntry = req.body; 
  console.log(req.body)
  console.log("Got request to POST new logbook:" + logbookEntry._id);
  logbookDataBase.update(
    { _id: logbookEntry._id }, // query to find the document
    { $push: { paragraphs: logbookEntry.paragraphs, headers: logbookEntry.headers } }, // update operation to insert new element
    {}, // options (empty in this case)
    function (err, numReplaced, upsert) {
      if (err) {
        console.log(err);
        res.status(500)
      } else {
        console.log('Updated', numReplaced, 'documents');
        res.status(200)
      } 
    }
  );
});

app.post('/Logbook/SendLogbook', (req, res) => {
  console.log("Got POST submitLogbook request", req.body);
  const data = req.body;
  logbookDataBase.insert(data, (err, newLogbook) => {
    if (err) {
      res.status(500).send({ error: err });
    } 
    else {
      res.status(200).json({
        LogbookName: newLogbook.LogbookName,
      });
    }
  });
})


app.patch("/Logbook/UpdateStatus", (req, res) => {
  const data = req.body;
  console.log("GOT PATCH request to update logbook", data._id)
  console.log("LINE 248: ", data.status)
  //SEARCH FOR TASK WITH ID,                        REPLACED ATTRIBUES
  logbookDataBase.update({_id: data._id}, {$set: { status: data.status} },{}, (err, updatedTask) => {
    if(err) 
    {
      res.status(500).send({ error: err });
    }
    else
    {
      res.status(200).json({
        status: "PATCHED Logbook",
        data: data
      });
    }
  });
});

app.get('/events/Logbooks', eventsHandlerLogbooks);

function eventsHandlerLogbooks(request, response) {
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
  logbookDataBase.find({}, (err, data) => {
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
let lastSentDataLogbook = null;
function sendEventsToAlle() {
  logbookDataBase.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else if (JSON.stringify(data) !== JSON.stringify(lastSentDataLogbook)) {
      console.log(data);
      clients.forEach(client => client.response.write(`data: ${JSON.stringify(data)}\n\n`));
      lastSentDataLogbook = data;
    }
  });
}

setInterval(sendEventsToAlle, 1000); // sends events to all clients every 10 seconds






app.get('/events/Assignee', eventsHandlerAssignee);

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



app.post("/SendAssignee", (req, res) => {
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

