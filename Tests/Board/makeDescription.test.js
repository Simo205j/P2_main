global.EventSource = jest.fn()
const mockEventSource = {
  addEventListener: jest.fn(),
  }
global.EventSource.mockImplementation(() => mockEventSource);
  
  const { makeDescription } = require('../../scripts/board');
  
  describe('makeDescription function', () => {
    test("should toggle description upon click on task", () => {
      const task = { 
        TaskAttributes: { 
          Description: "task description", 
          Assignee: "assignee name", 
          Priority: "high", 
          StartDate: '2023-04-15', 
          EndDate: '2023-04-18', 
          Status: 'done' 
        }
      };
      
      const newTask = document.createElement("div");
      makeDescription(newTask, task);
  
      const descriptionDiv = newTask.querySelector(".task-details");
      expect(descriptionDiv.style.display).toBe("none");
    
      newTask.dispatchEvent(new Event("click"));
      expect(descriptionDiv.style.display).toBe("block");
    
      newTask.dispatchEvent(new Event("click"));
      expect(descriptionDiv.style.display).toBe("none");
    });
  });
  