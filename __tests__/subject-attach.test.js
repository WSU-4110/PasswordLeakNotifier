// Test for Subject Class - attach method

const fs = require('fs');
const path = require('path');

const uiManagerCode = fs.readFileSync(path.join(__dirname, '../static/js/ui-manager.js'), 'utf8');
eval(uiManagerCode);

describe('Subject Class - attach method', () => {
  let subject;

  beforeEach(() => {
    subject = new Subject();
  });

  test('attach a valid observer', () => {
    const mockObserver = { update: jest.fn() };
    Object.setPrototypeOf(mockObserver, Observer.prototype);
    subject.attach(mockObserver);
    expect(subject.observers).toHaveLength(1);
    expect(subject.observers[0]).toBe(mockObserver);
  });

  test('throw error when attaching non observer object', () => {
    const invalidObserver = { someMethod: () => {} };
    expect(() => subject.attach(invalidObserver))
      .toThrow('Observer must implement Observer interface');
  });

  test('handle multiple observers', () => {
    const observer1 = { update: jest.fn() };
    const observer2 = { update: jest.fn() };
    Object.setPrototypeOf(observer1, Observer.prototype);
    Object.setPrototypeOf(observer2, Observer.prototype);
    subject.attach(observer1);
    subject.attach(observer2);
    expect(subject.observers).toHaveLength(2);
    expect(subject.observers).toContain(observer1);
    expect(subject.observers).toContain(observer2);
  });
});
