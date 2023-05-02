global.EventSource = jest.fn()

const mockEventSource = {
  addEventListener: jest.fn(),
  }


global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn() };
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn() };
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);


const { resetLogbookData } = require('../../scripts/logbook')
let logbookHeaderArray = [];
let logbookParagraphArray = [];
let logbookCheckboxArray = [];
describe('resetLogbookData', () => {
  test('correctly handles missing HeaderArray in input', () => {
    // Set up test data
    const data = [{ ParagraphArray: [], CheckboxArray: [] }];

    // Call the function being tested
    resetLogbookData(data);

    // Check that the logbook arrays have been correctly cleared
    expect(logbookHeaderArray).toEqual([]);
    expect(logbookParagraphArray).toEqual([]);
    expect(logbookCheckboxArray).toEqual([]);
  });
});


  