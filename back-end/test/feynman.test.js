describe('US-04: Feynman Notes', () => {
  test('Validasi catatan minimal 10 karakter', () => {
    const isNoteValid = (text) => text.trim().length >= 10;
    expect(isNoteValid('Ringkasan materi jaringan komputer')).toBe(true);
  });
});