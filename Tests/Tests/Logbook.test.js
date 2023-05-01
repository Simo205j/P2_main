/*global.TextDecoder = require('text-encoding').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
const { JSDOM } = require('jsdom');
global.EventSource = jest.fn()

const mockEventSource = {
  addEventListener: jest.fn(),
  }


global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn() };
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn() };
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);

const mockFetch = jest.fn();
global.fetch = mockFetch;

// Import the functions to test
const { makeLogbookList, makeDeleteBtnLogbookEntry, makeEditAble } = require("../../scripts/logbook");

describe("Logbook functions", () => {
  let logbookEntry;
  let logbookListDiv
  beforeAll(() => {
    // Create a fake DOM environment for the tests to run in
    const dom = new JSDOM(`
      <html>
        <body>
          <div id="logbookList"></div>
        </body>
      </html>
    `);
    
    global.document = dom.window.document
    logbookListDiv = document.getElementById("logbookList")

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
      
      makeLogbookList(logbookEntry);
      jest.spyOn(document.body, 'appendChild');
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
*/
describe('Jest configuration', () => {
  it('should log to console', () => {
    console.log('Hello, worldv2!');
  });
});