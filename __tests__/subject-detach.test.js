// Test for Subject Class - detach method

const fs = require('fs');
const path = require('path');

const uiManagerCode = fs.readFileSync(path.join(__dirname, '../static/js/ui-manager.js'), 'utf8');
eval(uiManagerCode);

describe('Subject Class - detach method', () => {
  let subject;

  beforeEach(() => {
    subject = new Subject();
  });

  test('remove an attached observer', () => {
    const observer1 = { update: jest.fn() };
    const observer2 = { update: jest.fn() };
    Object.setPrototypeOf(observer1, Observer.prototype);
    Object.setPrototypeOf(observer2, Observer.prototype);
    
    subject.attach(observer1);
    subject.attach(observer2);
    subject.detach(observer1);
    expect(subject.observers).toHaveLength(1);
    expect(subject.observers).not.toContain(observer1);
    expect(subject.observers).toContain(observer2);
  });

  test('handle detaching non existent observer', () => {
    const observer1 = { update: jest.fn() };
    const observer2 = { update: jest.fn() };
    Object.setPrototypeOf(observer1, Observer.prototype);
    Object.setPrototypeOf(observer2, Observer.prototype);
    
    subject.attach(observer1);
    subject.detach(observer2); 
    expect(subject.observers).toHaveLength(1);
    expect(subject.observers).toContain(observer1);
  });
});
