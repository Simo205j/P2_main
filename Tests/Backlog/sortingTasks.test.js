global.EventSource = jest.fn()
const mockEventSource = {
  addEventListener: jest.fn(),
  }
global.EventSource.mockImplementation(() => mockEventSource);

const { sortTasks } = require('../../scripts/backlog');

describe('sortTasks function', () => {
  // Should sort tasks by end date and priority correctly
  test('should sort tasks by end date and priority correctly', () => {
    const tasks = [      
      { TaskAttributes: { EndDate: '2023-04-18', Priority: 'high' } },
      { TaskAttributes: { EndDate: '2023-04-16', Priority: 'medium' } },      
      { TaskAttributes: { EndDate: '2023-04-17', Priority: 'low' } },  
    ];
    const expectedTasks = [      
      { TaskAttributes: { EndDate: '2023-04-16', Priority: 'medium' } },      
      { TaskAttributes: { EndDate: '2023-04-17', Priority: 'low' } },      
      { TaskAttributes: { EndDate: '2023-04-18', Priority: 'high' } },    
    ];
    const undoneTasks = sortTasks(tasks);
    expect(undoneTasks).toStrictEqual(expectedTasks);
  });
});
