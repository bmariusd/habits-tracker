import { HabitFacade } from './contracts.js';

describe('HabitFacade token', () => {
  it('uses the shared application token', () => {
    expect(HabitFacade.$).toBe(Symbol.for('@org/habits/HabitFacade'));
  });
});
