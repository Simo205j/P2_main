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

// Import the function to test
const { addNewAssignee } = require('../../scripts/assignee');

describe('addNewAssignee', () => {
  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  test('handles successful assignment creation', async () => {
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