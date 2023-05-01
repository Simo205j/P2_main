global.EventSource = jest.fn()

const mockEventSource = {
  addEventListener: jest.fn(),
  }

global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn() };
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn() };
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);

const { createLogbookEntry } = require('../../scripts/logbook')
describe('createLogbookEntry', () => {
  test('returns a div element with the correct structure and content', () => {
    // Set up test data
    const headerText = 'Example header';
    const paragraphText = 'Example paragraph';

    // Call the function being tested
    const result = createLogbookEntry(headerText, paragraphText);

    // Check that the returned element has the correct structure and content
    expect(result.tagName).toBe('DIV');
    expect(result.classList).toContain('index');
    expect(result.children).toHaveLength(2);

    const headerDiv = result.children[0];
    expect(headerDiv.tagName).toBe('DIV');
    expect(headerDiv.children).toHaveLength(3);

    const checkbox = headerDiv.children[0];
    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox.type).toBe('checkbox');

    const header = headerDiv.children[1];
    expect(header.tagName).toBe('H3');
    expect(header.textContent).toBe(headerText);

    const deleteBtn = headerDiv.children[2];
    expect(deleteBtn.tagName).toBe('INPUT');
    expect(deleteBtn.value).toBe('Delete');

    const paragraph = result.children[1];
    expect(paragraph.tagName).toBe('P');
    expect(paragraph.textContent).toBe(paragraphText);
  });
});