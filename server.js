const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


const taskRoutes = require('./routes/serverTasks');
const logbookRoutes = require('./routes/serverLogbook');
const assigneeRoutes = require('./routes/serverAssignee');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/Tasks', taskRoutes);
app.use('/Logbook', logbookRoutes);
app.use('/Assignee', assigneeRoutes);
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'styles')));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/board.html');
});
app.get('/board', (req, res) => {
  res.sendFile(__dirname + '/views/board.html');
});
app.get('/gantt', (req, res) => {
  res.sendFile(__dirname + '/views/gantt.html')
})
app.get('/backlog', (req, res) => {
  res.sendFile(__dirname + '/views/backlog.html')
})
app.get('/logbook', (req, res) => {
  res.sendFile(__dirname + '/views/logbook.html')
})

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}/board`);
});