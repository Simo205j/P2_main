global.EventSource = jest.fn()

const mockEventSource = {
  addEventListener: jest.fn(),
  }

global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn() };
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn() };
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);

const {
    createCheckbox,
    createHeader,
    createParagraph,
    createDeleteButton,
  } = require("../../scripts/logbook");

  describe("createCheckbox", () => {
    test("should create an input checkbox", () => {
      const checkbox = createCheckbox();
  
      expect(checkbox).toBeDefined();
      expect(checkbox.tagName).toBe("INPUT");
      expect(checkbox.type).toBe("checkbox");
    });
  });
  
  describe("createHeader", () => {
    test("should create an h3 header with the given text content", () => {
      const headerText = "Header text";
      const header = createHeader(headerText);
  
      expect(header).toBeDefined();
      expect(header.tagName).toBe("H3");
      expect(header.textContent).toBe(headerText);
    });
  });
  
  describe("createParagraph", () => {
    test("should create a p paragraph with the given text content", () => {
      const paragraphText = "Paragraph text";
      const paragraph = createParagraph(paragraphText);
  
      expect(paragraph).toBeDefined();
      expect(paragraph.tagName).toBe("P");
      expect(paragraph.textContent).toBe(paragraphText);
    });
  });
  
  describe("createDeleteButton", () => {
    test("should create an input button with the value 'Delete'", () => {
      const container = document.createElement("div");
      const deleteBtn = createDeleteButton(container);
  
      expect(deleteBtn).toBeDefined();
      expect(deleteBtn.tagName).toBe("INPUT");
      expect(deleteBtn.type).toBe("button");
      expect(deleteBtn.value).toBe("Delete");
    });
  });