global.TextDecoder = require('text-encoding').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
const { JSDOM } = require('jsdom');
global.EventSource = jest.fn()

const mockEventSource = {
  addEventListener: jest.fn(),

}
global.EventSource.mockImplementation(() => mockEventSource);

const mockFetch = jest.fn();
global.fetch = mockFetch;

const elementMock = { addEventListener: jest.fn() };
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn() };
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);


const { makeLogbookList } = require("../../scripts/logbook");

describe('makeLogbookList function', () => {
  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="logbookList"></div></body></html>`);
    global.document = dom.window.document;
  });

  it('should create a logbook entry and append it to the logbook list', () => {
    // Create a mock logbookEntry object
    const logbookEntry = {
      _id: '123',
      date: '2022-05-01',
    };

    // Get the logbook list element
    const logbookListDiv = document.getElementById('logbookList');

    // Call the makeLogbookList function with the mock objects
    makeLogbookList(logbookEntry, logbookListDiv);

    // Retrieve the generated logbook entry
    const logbookEntryElement = document.querySelector('.logbook-entry');

    // Assert that the logbook entry element exists
    expect(logbookEntryElement).not.toBeNull();

    // Assert that the logbook entry element contains the correct text
    expect(logbookEntryElement.textContent).toContain(`Logbook: ${logbookEntry.date}`);
  });
});
