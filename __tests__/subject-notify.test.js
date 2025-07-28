// Test for Subject Class - notify method

const fs = require('fs');
const path = require('path');

const uiManagerCode = fs.readFileSync(path.join(__dirname, '../static/js/ui-manager.js'), 'utf8');
eval(uiManagerCode);

describe('Subject Class - notify method', () => {
  let subject;

  beforeEach(() => {
    subject = new Subject();
  });

  test('notify all attached observers with state', () => {
    const observer1 = { update: jest.fn() };
    const observer2 = { update: jest.fn() };
    Object.setPrototypeOf(observer1, Observer.prototype);
    Object.setPrototypeOf(observer2, Observer.prototype);
    subject.attach(observer1);
    subject.attach(observer2);
    const testState = { data: 'test' };
    subject.notify(testState);
    expect(observer1.update).toHaveBeenCalledWith(testState);
    expect(observer2.update).toHaveBeenCalledWith(testState);
    expect(observer1.update).toHaveBeenCalledTimes(1);
    expect(observer2.update).toHaveBeenCalledTimes(1);
  });

  test('handle observer errors and continue notifying others', () => {
    const observer1 = { 
      update: jest.fn().mockImplementation(() => {
        throw new Error('Observer 1 error');
      })
    };
    const observer2 = { update: jest.fn() };
    Object.setPrototypeOf(observer1, Observer.prototype);
    Object.setPrototypeOf(observer2, Observer.prototype);
    subject.attach(observer1);
    subject.attach(observer2);
    const testState = { data: 'test' };
    
    subject.notify(testState);
    
    expect(observer1.update).toHaveBeenCalledWith(testState);
    expect(observer2.update).toHaveBeenCalledWith(testState);
    expect(console.error).toHaveBeenCalledWith('Error notifying observer:', expect.any(Error));
  });

  test('handle empty observer list', () => {
    const testState = { data: 'test' };
    expect(() => subject.notify(testState)).not.toThrow();
  });
});
