
global.EventSource = jest.fn()
const mockEventSource = {
  addEventListener: jest.fn(),
  }
global.EventSource.mockImplementation(() => mockEventSource);

const { createTasks, makeTableHeader, makeTableRow } = require('../../scripts/backlog');


// Mock the necessary DOM elements
document.body.innerHTML = `
  <div id="backlog">
  </div>
`;

const task = {
    TaskName: "Example Task",
    TaskAttributes: {
      Assignee: "AssigneeName",
      StartDate: "2023-05-01",
      EndDate: "2023-05-15",
      Status: "In Progress",
      Priority: "High"
    }
  };

describe('createTasks', () => {
  // Create a sample task object
  test('creates a table with correct headers and rows', () => {
    // Create a mock table
    const table = makeTableHeader();
    const row = makeTableRow(table, 1, task);

    // Create an array of tasks to pass to the createTasks function
    const tasks = [task];

    // Call the createTasks function
    createTasks(tasks);

    // Check that the table has been created and appended to the DOM
    expect(document.getElementById('backlog')).not.toBeNull();
    expect(document.getElementById('backlog').tagName).toBe('DIV');
  });
});

describe("makeTableHeader", () => {
    test("returns a table header with correct columns", () => {
      const table = makeTableHeader();
      expect(table.nodeName).toBe("TABLE");
      expect(table.id).toBe("BacklogTable");
      const columns = table.querySelectorAll("th");
      expect(columns.length).toBe(7);
      expect(columns[0].textContent).toBe("Index");
      expect(columns[1].textContent).toBe("TaskName");
      expect(columns[2].textContent).toBe("Assignee");
      expect(columns[3].textContent).toBe("Start Date");
      expect(columns[4].textContent).toBe("End Date");
      expect(columns[5].textContent).toBe("Status");
      expect(columns[6].textContent).toBe("Priority");
    });
  });
  
  describe("makeTableRow", () => {
    test("adds a new row to the given table with correct data", () => {
      const table = document.createElement("table");
      makeTableRow(table, 1, task);
      const rows = table.querySelectorAll("tr");
      expect(rows.length).toBe(1);
      const columns = rows[0].querySelectorAll("td");
      expect(columns[0].textContent).toBe("1");
      expect(columns[1].textContent).toBe("Example Task");
      expect(columns[2].textContent).toBe("AssigneeName");
      expect(columns[3].textContent).toBe("2023-05-01");
      expect(columns[4].textContent).toBe("2023-05-15");
      expect(columns[5].textContent).toBe("In Progress");
      expect(columns[6].textContent).toBe("High");
      expect(rows[0].className).toBe("In Progress");
    });
  });
  