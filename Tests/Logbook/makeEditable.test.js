global.TextDecoder = require('text-encoding').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
const { JSDOM } = require('jsdom');
global.EventSource = jest.fn()

const mockEventSource = {
  addEventListener: jest.fn(),
  }

global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn(), querySelector: jest.fn(), appendChild: jest.fn() };
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn(), querySelector: jest.fn(), appendChild: jest.fn() };
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);

const { makeEditable } = require('../../scripts/logbook')

describe('makeEditable', () => {
  it('should replace the element with a textarea element when clicked', () => {
    document.body.innerHTML = `
      <div>
        <h3 id="editableHeader">Editable Header</h3>
      </div>
    `;
    const header = document.getElementById('editableHeader');
    makeEditable(header);
    const textarea = document.querySelector('textarea');
    expect(textarea).toBeTruthy();
  });
});