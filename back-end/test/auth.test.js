describe('US-02: Task Management', () => {
  // Fungsi logika sederhana
  const createTask = (title) => ({ title, status: 'PENDING' });
  const completeTask = (task) => ({ ...task, status: 'COMPLETED' });

  test('Tugas baru otomatis berstatus PENDING', () => {
    const task = createTask('Tugas Web');
    expect(task.status).toBe('PENDING');
  });

  test('Fungsi completeTask mengubah status menjadi COMPLETED', () => {
    const task = createTask('Tugas Web');
    const updatedTask = completeTask(task);
    expect(updatedTask.status).toBe('COMPLETED');
  });
});