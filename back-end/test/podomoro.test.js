describe('US-03: Pomodoro Timer', () => {
  const isValidDuration = (minutes) => typeof minutes === 'number' && minutes > 0;

  test('Durasi valid jika lebih dari 0 menit', () => {
    expect(isValidDuration(25)).toBe(true);
  });

  test('Durasi tidak valid jika 0 atau bernilai negatif', () => {
    expect(isValidDuration(0)).toBe(false);
    expect(isValidDuration(-5)).toBe(false);
  });
});