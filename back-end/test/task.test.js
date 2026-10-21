describe('US-02: Task Management', () => {
  // Logika pembantu untuk simulasi pengerjaan tugas
  const createTask = (title) => ({ title, status: 'PENDING' });
  const completeTask = (task) => ({ ...task, status: 'COMPLETED' });

  test('Status awal tugas baru harus PENDING', () => {
    const task = createTask('Tugas Web');
    expect(task.status).toBe('PENDING');
  });

  test('Status tugas berubah menjadi COMPLETED saat diselesaikan', () => {
    const initialTask = createTask('Tugas Web');
    const updatedTask = completeTask(initialTask);
    expect(updatedTask.status).toBe('COMPLETED');
  });
});