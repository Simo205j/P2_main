/* In Progress
global.EventSource = jest.fn()

const mockEventSource = {
    addEventListener: jest.fn(),
    appendChild: jest.fn(),
    }
  
  global.EventSource.mockImplementation(() => mockEventSource);
  
  const elementMock = { addEventListener: jest.fn(), appendChild: jest.fn() };
  jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
  const elementMockQ = { addEventListener: jest.fn(), appendChild: jest.fn()};
  jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);

const {  makeLogbookContainerSaveBtn } = require('../../scripts/logbook')

const logbookHeaderArray = ['Header 1', 'Header 2'];
const logbookParagraphArray = ['Paragraph 1', 'Paragraph 2'];
const logbookCheckboxArray = [true, false];

describe('makeLogbookContainerSaveBtn', () => {
  it('should make a PATCH request to save logbook entry', async () => {
    const fetchSpy = jest.spyOn(window, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });

    const tempDiv = document.createElement('div');
    const logbookEntryContainer = { id: 'logbook-entry-id' };
    const logbookHeaderArray = ['Header 1', 'Header 2'];
    const logbookParagraphArray = ['Paragraph 1', 'Paragraph 2'];
    const logbookCheckboxArray = [true, false];

    makeLogbookContainerSaveBtn(
      logbookEntryContainer,
      logbookHeaderArray,
      logbookParagraphArray,
      logbookCheckboxArray,
      tempDiv
    );

    const saveButton = tempDiv.querySelector('input[type="button"]');
    saveButton.click();

    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:3000/Logbook/SaveLogbookEntry',
      expect.objectContaining({
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"HeaderArray":["Header 1","Header 2"],"ParagraphArray":["Paragraph 1","Paragraph 2"],"CheckboxArray":[true,false]'),
      })
    );

    fetchSpy.mockRestore();
  });
});
*/







