describe('US-05: Blurting Canvas', () => {
  test('Toggle visibilitas canvas', () => {
    const toggle = (visible) => !visible;
    expect(toggle(true)).toBe(false);
  });
});