/*
const fetchMock = require('jest-fetch-mock');
global.fetch = fetchMock;

global.EventSource = jest.fn()


const mockEventSource = {
  addEventListener: jest.fn(),
  }

global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn() };
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn() };
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);

const { addNewAssignee } = require('../../scripts/assignee')

describe('addNewAssignee', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      fetchMock.resetMocks();
    });
  
    test('should make a POST request to add a new assignee and log the response data', async () => {
      // Set up test data
      const event = {
        preventDefault: jest.fn(),
      };
      const response = {
        status: 'success',
        assigneeName: 'AssigneeTestName',
      };
      const expectedData = { assigneeName: 'AssigneeTestName' };
  
      // Mock the fetch API
      fetchMock.mockResponseOnce(JSON.stringify(response));
  
      // Call the function being tested
      await addNewAssignee(event);
  
      // Check that preventDefault was called on the event
      expect(event.preventDefault).toHaveBeenCalled();
  
      // Check that the correct POST request was made
      expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/Assignee/SendAssignee');
      expect(fetchMock.mock.calls[0][1]).toMatchObject({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expectedData),
      });
  
      // Check that the response data was logged
      expect(console.log).toHaveBeenCalledWith(response.status, response);
    });
  
    test('should log an error when the fetch request fails', async () => {
      // Set up test data
      const event = {
        preventDefault: jest.fn(),
      };
      const expectedError = new Error('Fetch failed');
  
      // Mock the fetch API to throw an error
      fetchMock.mockRejectOnce(expectedError);
  
      // Call the function being tested
      await addNewAssignee(event);
  
      // Check that preventDefault was called on the event
      expect(event.preventDefault).toHaveBeenCalled();
  
      // Check that the error was logged
      expect(console.error).toHaveBeenCalledWith(expectedError);
    });
  });
  */
  global.EventSource = jest.fn()
  const mockEventSource = {
    addEventListener: jest.fn(),
    }
  global.EventSource.mockImplementation(() => mockEventSource);
  
  const { sortTasks } = require('../../scripts/board');
  
  describe("sortTasks function", () => {
    it("should sort tasks by end date and priority correctly", () => {
      const tasks = [
        { TaskAttributes: { EndDate: "2023-04-18", Priority: "high" } },
        { TaskAttributes: { EndDate: "2023-04-16", Priority: "medium" } },
        { TaskAttributes: { EndDate: "2023-04-17", Priority: "low" } },
      ];
      const expectedTasks = [
        { TaskAttributes: { EndDate: "2023-04-16", Priority: "medium" } },
        { TaskAttributes: { EndDate: "2023-04-17", Priority: "low" } },
        { TaskAttributes: { EndDate: "2023-04-18", Priority: "high" } },
      ];
  
      const sortedTasks = sortTasks(tasks);
      expect(sortedTasks).toEqual(expectedTasks);
    });
  });