global.EventSource = jest.fn();
const mockEventSource = {
  addEventListener: jest.fn(),
}
global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn() };
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn() };
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

const { addNewAssignee } = require('../../scripts/assignee');

describe('addNewAssignee', () => {
  //After each test clear all mocks, and reset the fetchMock, so the next test can utilise it. (resetting the testing environment)
  afterEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  //Tests if the creation of assignee handled correctly correctly when being posted.
  test('handles successful assignee creation', async () => {
    const mockResponse = {
      status: 200,
      body: JSON.stringify({ status: 'success' }),
    };

    fetchMock.mockResponseOnce(mockResponse);

    await addNewAssignee(new Event('submit'));

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/Assignee/SendAssignee',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }),
    );
  });

  //Tests 
  test('handles errors from the server', async () => {
    const mockResponse = {
      status: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };

    fetchMock.mockResponseOnce(mockResponse);

    await addNewAssignee(new Event('submit'));

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/Assignee/SendAssignee',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }),
    );
  });
}); 