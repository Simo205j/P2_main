//IN PROGRESS

global.EventSource = jest.fn()

const mockEventSource = {
  addEventListener: jest.fn(),
  }

global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn(), appendChild: jest.fn() };
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn(), appendChild: jest.fn() };
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);
const elementMockC = { addEventListener: jest.fn(), appendChild: jest.fn() };
jest.spyOn(document, 'createElement').mockImplementation(() => elementMockC);

const { makeLogbookContainerDivContent } = require('../../scripts/logbook')

describe("makeLogbookContainerDivContent", () => {
  let testData;
  let testContainer;

  

  beforeEach(() => {
    testData = [      {        _id: "logbook-entry-1",        date: "2022-05-01",        HeaderArray: ["Header 1", "Header 2", "Header 3"],
         ParagraphArray: ["Para 1", "Para 2", "Para 3"], CheckboxArray: [true, false, true],
      },
    ];
    testContainer = document.createElement("div");
    testContainer.id = "logbook-entry-container";

  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("creates logbook entry container div content", () => {
    const lastTemp = {
      remove: jest.fn(),
      querySelector: jest.fn()
    };
    jest.spyOn(document, "getElementById").mockReturnValue(lastTemp);

    makeLogbookContainerDivContent(testData, testContainer);

    const tempDiv = document.getElementById("temp");
    expect(tempDiv).toBeTruthy();

    const tempLogbookDate = tempDiv.querySelector("h2");
    console.log(tempLogbookDate);
    expect(tempLogbookDate.textContent).toEqual("2022-05-01");

    const tempHeaderContainers = tempDiv.querySelectorAll(".index");
    expect(tempHeaderContainers.length).toBe(3);

    const tempHeader1 = tempHeaderContainers[0].querySelector("h3");
    const tempParagraph1 = tempHeaderContainers[0].querySelector("p");
    expect(tempHeader1.textContent).toBe("Header 1");
    expect(tempParagraph1.textContent).toBe("");

    const tempHeader2 = tempHeaderContainers[1].querySelector("h3");
    const tempParagraph2 = tempHeaderContainers[1].querySelector("p");
    expect(tempHeader2.textContent).toBe("Header 2");
    expect(tempParagraph2.textContent).toBe("");

    const tempHeader3 = tempHeaderContainers[2].querySelector("h3");
    const tempParagraph3 = tempHeaderContainers[2].querySelector("p");
    expect(tempHeader3.textContent).toBe("Header 3");
    expect(tempParagraph3.textContent).toBe("");

    const saveBtn = testContainer.querySelector(".save-btn");
    expect(saveBtn).toBeTruthy();

    expect(lastTemp.remove).toHaveBeenCalled();

    document.getElementById.mockRestore();
  });
});
