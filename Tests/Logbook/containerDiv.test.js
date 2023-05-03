/* Need to rewrite the entire logbook, to not use global variables to make this work
global.TextDecoder = require('text-encoding').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
const { JSDOM } = require('jsdom');
global.EventSource = jest.fn()

const mockEventSource = {
  addEventListener: jest.fn(),
  }

global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn() };
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn()};
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);
const { makeLogbookContainerDivContent } = require('../../scripts/logbook')

describe('makeLogbookContainerDivContent', () => {
  beforeEach(() => {
    // Create a fake DOM environment
    const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="displayLogbookContainerDiv"></div></body></html>`);
    global.document = dom.window.document;
    
  });

  test('creates a logbook container div with the correct structure and content', () => {
    // Set up test data
    const data = [
      {
        _id: 'some_id',
        date: '2023-05-03',
        HeaderArray: [
          'Header 1',
          'Header 2',
        ],
        ParagraphArray: [
          'Paragraph 1',
          'Paragraph 2',
        ],
        CheckboxArray: [
          true,
          false,
        ],
      },
    ];
    const lastTemp = {
      remove: jest.fn(),
    };
    jest.spyOn(document, "getElementById").mockReturnValue(lastTemp);
    const logbookEntryContainer = document.createElement('div');

    // Call the function being tested
      // Call the function being tested
  makeLogbookContainerDivContent(data, logbookEntryContainer);

  // Check that the logbook container div has the correct structure and content
  const logbookContainerDiv = document.querySelector(`.${data[0]._id}`);
  expect(logbookContainerDiv).not.toBeNull();

  console.log(logbookContainerDiv)
  if (logbookContainerDiv) { // check if logbookContainerDiv is not null
    const logbookDate = logbookContainerDiv.querySelector('h2');
    console.log(logbookDate);
    expect(logbookDate).not.toBeNull();
    expect(logbookDate.textContent).toBe(data[0].date);

    const logbookEntries = logbookContainerDiv.querySelectorAll('.index');
    expect(logbookEntries).toHaveLength(data[0].HeaderArray.length);

    logbookEntries.forEach((entry, index) => {
      const checkbox = entry.querySelector('input[type="checkbox"]');
      expect(checkbox).not.toBeNull();
      expect(checkbox.checked).toBe(data[0].CheckboxArray[index]);

      const header = entry.querySelector('h3');
      expect(header).not.toBeNull();
      expect(header.textContent).toBe(data[0].HeaderArray[index]);

      const deleteBtn = entry.querySelector('input[type="button"]');
      expect(deleteBtn).not.toBeNull();
      expect(deleteBtn.value).toBe('Delete');

      const paragraph = entry.querySelector('p');
      expect(paragraph).not.toBeNull();
    });
  }
});
});
*/
