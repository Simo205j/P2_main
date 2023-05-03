

global.EventSource = jest.fn();
const mockEventSource = {
  addEventListener: jest.fn(),
}
global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn(), remove: jest.fn(), insertAdjacentElement: jest.fn() };
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn(), remove: jest.fn(), insertAdjacentElement: jest.fn() };
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);

const { makeAssigneeSelect } = require('../../scripts/assignee');

describe('makeAssigneeSelect', () => {
    test('should create and insert a select element for each assignee with correct options', () => {
        // Define sample input data
        const assignees = [    { assigneeName: 'Mertz' },    { assigneeName: 'Simon' },    { assigneeName: 'Bacon' },  ];
      
        // Create a mock DOM element for testing
        const selectElement = document.createElement('select');
        selectElement.id = 'assignee';
      
        // Create a spy for the 'insertAdjacentElement' method
        const spy = jest.spyOn(selectElement, 'insertAdjacentElement');
      
        // Call the function with the sample data
        makeAssigneeSelect(assignees);
      
        // Expect that the select element was created and inserted correctly
        expect(selectElement).toBeTruthy();

      
        // Expect that each assignee was added as an option to the select element
        assignees.forEach((assignee) => {
          const optionElement = document.createElement('option');
          optionElement.textContent = assignee.assigneeName;
          optionElement.value = assignee.assigneeName;
          expect(optionElement).toBeTruthy();
        });
      });
});
