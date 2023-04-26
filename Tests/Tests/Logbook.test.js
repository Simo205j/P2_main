/** @jest-environment jsdom */

global.EventSource = jest.fn();

// Import the functions to test
const { makeLogbookList, makeDeleteBtnLogbookEntry, makeNewEdit } = require("../../scripts/logbook");

describe("Logbook functions", () => {
  let logbookEntry;

  beforeAll(() => {
    // Create a fake DOM environment for the tests to run in
    const dom = new JSDOM(`
      <html>
        <body>
          <div id="logbookList"></div>
        </body>
      </html>
    `);
    // Set up global variables used in the file
    global.logbookListDiv = dom.window.document.getElementById("logbookList");
    
    
    // Create a mock logbook entry object to use in the tests
    logbookEntry = {
      _id: "123",
      date: "2022-01-01",
    };
  });

  describe("makeLogbookList", () => {
    test("should create a logbook entry container", () => {
      makeLogbookList(logbookEntry);

      const logbookEntryContainer = logbookListDiv.firstChild;
      expect(logbookEntryContainer.tagName).toBe("DIV");
      expect(logbookEntryContainer.id).toBe("123");
    });

    test("should create a logbook entry date", () => {
      const logbookEntryContainer = logbookListDiv.firstChild;
      const logbookEntryDate = logbookEntryContainer.firstChild;

      expect(logbookEntryDate.tagName).toBe("P");
      expect(logbookEntryDate.textContent).toBe("Logbook: 2022-01-01");
    });

    test("should create a delete button for the logbook entry", () => {
      const logbookEntryContainer = logbookListDiv.firstChild;
      const logbookEntryDeleteBtn = logbookEntryContainer.lastChild;

      expect(logbookEntryDeleteBtn.tagName).toBe("INPUT");
      expect(logbookEntryDeleteBtn.type).toBe("button");
      expect(logbookEntryDeleteBtn.value).toBe("Delete");
    });

    test("should call makeDeleteBtnLogbookEntry with the logbook entry container", () => {
      // Mock the makeDeleteBtnLogbookEntry function
      const mockMakeDeleteBtnLogbookEntry = jest.fn();
      global.makeDeleteBtnLogbookEntry = mockMakeDeleteBtnLogbookEntry;

      makeLogbookList(logbookEntry);

      expect(mockMakeDeleteBtnLogbookEntry).toHaveBeenCalledTimes(1);
      expect(mockMakeDeleteBtnLogbookEntry).toHaveBeenCalledWith(logbookListDiv.firstChild);

      // Clean up the mock function
      delete global.makeDeleteBtnLogbookEntry;
    });
  });

  describe("makeDeleteBtnLogbookEntry", () => {
    test("should add a click event listener to the delete button", () => {
      const logbookEntryContainer = document.createElement("div");
      const logbookEntryDeleteBtn = document.createElement("input");
      logbookEntryDeleteBtn.type = "button";
      logbookEntryDeleteBtn.value = "Delete";
      logbookEntryContainer.appendChild(logbookEntryDeleteBtn);

      makeDeleteBtnLogbookEntry(logbookEntryContainer);

      const mockFetch = jest.fn();
      global.fetch = mockFetch;

      logbookEntryDeleteBtn.click();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      // Finish the body of the test
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/Logbook/Delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: logbookEntryContainer.id }),
      });
    });
  });
});
