const express = require('express');
const router = express.Router();
const DataStore = require("nedb");

const logbookDataBase = new DataStore({ filename: "./Databases/logbookDataBase.db", autoload: true });
logbookDataBase.loadDatabase();

let clients = [];

router.get('/logbook', (req, res) => {
  res.sendFile(__dirname + '/views/logbook.html')
});

// Additional logbook routes can be defined here

router.delete("/Delete", (req, res) => {
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
  
  router.post("/UpdatePost", (req, res) => {
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
  router.post('/SendLogbook', (req, res) => {
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
  
  
  router.patch("/UpdateStatus", (req, res) => {
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
  
  router.get('/events', eventsHandlerLogbooks);
  
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

module.exports = router;
