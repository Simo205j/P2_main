global.EventSource = jest.fn()

const mockEventSource = {
  addEventListener: jest.fn(),
  }


global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn() };
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn() };
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);


const { fixContainerIndexes } = require('../../scripts/logbook')

describe('fixContainerIndexes', () => {
    beforeEach(() => {
      // Set up a test environment
      document.body.innerHTML = 
       `<div class="index"></div>
        <div class="index"></div>
        <div class="index"></div>`;
    });
  
    test('sets the id attribute of each index div to its correct index', () => {
      // Call the function being tested
      fixContainerIndexes();
  
      // Check that each index div has its id attribute set to its index
      const indexDivs = document.querySelectorAll('div[class="index"]');
      expect(indexDivs[0].id).toBe('0');
      expect(indexDivs[1].id).toBe('1');
      expect(indexDivs[2].id).toBe('2');
    });
  });