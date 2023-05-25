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
      { TaskAttributes: { EndDate: '2023-04-18', Priority: 'High' } },
      { TaskAttributes: { EndDate: '2023-04-16', Priority: 'Medium' } },
      { TaskAttributes: { EndDate: '2023-04-16', Priority: 'High' } },       
      { TaskAttributes: { EndDate: '2023-04-17', Priority: 'Low' } },  
    ];
    const expectedTasks = [      
      { TaskAttributes: { EndDate: '2023-04-16', Priority: 'High' } }, 
      { TaskAttributes: { EndDate: '2023-04-16', Priority: 'Medium' } },      
      { TaskAttributes: { EndDate: '2023-04-17', Priority: 'Low' } },      
      { TaskAttributes: { EndDate: '2023-04-18', Priority: 'High' } },    
    ];
    const undoneTasks = sortTasks(tasks);
    expect(undoneTasks).toStrictEqual(expectedTasks);
  });
});
