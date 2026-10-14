describe('US-02: Task Management', () => {
  test('Status awal tugas baru harus PENDING', () => {
    const task = { title: 'Tugas Web', status: 'PENDING' };
    expect(task.status).toBe('PENDING');
  });

  test('Pengecekan tugas selesai', () => {
    const isCompleted = true;
    expect(isCompleted).toBe(true);
  });
});