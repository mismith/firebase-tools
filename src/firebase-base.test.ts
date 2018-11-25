import FirebaseBase from './firebase-base';

it('provides all required keys', () => {
  expect(Object.keys(FirebaseBase.keys)).toMatchSnapshot();
});
it('converts a String to a Date', () => {
  const date1 = FirebaseBase.getDate();
  const date2 = FirebaseBase.getDate(new Date().toString());
  expect(date1 instanceof Date).toBe(true);
  expect(date2 instanceof Date).toBe(true);
});
it('converts a Date to a String', () => {
  const date1 = FirebaseBase.getDateString();
  const date2 = FirebaseBase.getDateString(new Date());
  expect(typeof date1).toBe('string');
  expect(typeof date2).toBe('string');
});
