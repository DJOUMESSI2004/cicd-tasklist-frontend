import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTasks, createTask, updateTask, deleteTask } from '../api/taskApi';

const mockTask = {
    id: 1,
    title: 'Test',
    description: null,
    completed: false,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
};

beforeEach(() => {
    vi.restoreAllMocks();
});

describe('taskApi', () => {
    // -----------------------------
    // GET TASKS
    // -----------------------------
    it('getTasks returns array', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve([mockTask]),
            })
        );

        const tasks = await getTasks();
        expect(tasks).toEqual([mockTask]);
        expect(fetch).toHaveBeenCalledWith('/api/tasks');
    });

    it('getTasks throws on error response', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({ error: 'fail' }),
            })
        );

        await expect(getTasks()).rejects.toThrow();
    });

    // -----------------------------
    // CREATE TASK
    // -----------------------------
    it('createTask sends POST and returns created task', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockTask),
            })
        );

        const task = await createTask({ title: 'Test' });
        expect(task).toEqual(mockTask);
        expect(fetch).toHaveBeenCalledWith('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Test' }),
        });
    });

    it('createTask throws on error response', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({ error: 'fail' }),
            })
        );

        await expect(createTask({ title: 'X' })).rejects.toThrow();
    });

    // -----------------------------
    // UPDATE TASK
    // -----------------------------
    it('updateTask sends PUT and returns updated task', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockTask),
            })
        );

        const task = await updateTask(1, { title: 'Updated' });
        expect(task).toEqual(mockTask);
        expect(fetch).toHaveBeenCalledWith('/api/tasks/1', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Updated' }),
        });
    });

    it('updateTask throws on error response', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({ error: 'fail' }),
            })
        );

        await expect(updateTask(1, { title: 'X' })).rejects.toThrow();
    });

    // -----------------------------
    // DELETE TASK
    // -----------------------------
    it('deleteTask sends DELETE and returns void on success', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
            })
        );

        await deleteTask(1);
        expect(fetch).toHaveBeenCalledWith('/api/tasks/1', {
            method: 'DELETE',
        });
    });

    it('deleteTask throws on error response', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({ error: 'fail' }),
            })
        );

        await expect(deleteTask(1)).rejects.toThrow();
    });
});
