describe('US-03: Pomodoro Timer', () => {
  test('Validasi durasi timer harus lebih dari 0 menit', () => {
    const isValidDuration = (minutes) => minutes > 0;
    expect(isValidDuration(25)).toBe(true);
  });
});