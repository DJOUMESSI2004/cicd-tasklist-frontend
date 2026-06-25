import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTasks } from '../hooks/useTasks';
import * as taskApi from '../api/taskApi';
import type { Task } from '../types/task';

vi.mock('../api/taskApi');

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Tâche 1',
    description: 'Desc 1',
    completed: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 2,
    title: 'Tâche 2',
    description: null,
    completed: true,
    createdAt: '2026-01-02',
    updatedAt: '2026-01-02',
  },
];

describe('useTasks (unit tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads tasks successfully on mount', async () => {
    (taskApi.getTasks as vi.Mock).mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useTasks());

    expect(result.current.loading).toBe(true);

    await act(async () => {});

    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles error when loading tasks', async () => {
    (taskApi.getTasks as vi.Mock).mockRejectedValue(new Error('Erreur API'));

    const { result } = renderHook(() => useTasks());

    await act(async () => {});

    expect(result.current.error).toBe('Erreur API');
    expect(result.current.loading).toBe(false);
  });

  it('addTask adds a new task at the top', async () => {
    const newTask = {
      id: 3,
      title: 'Nouvelle tâche',
      description: 'Test',
      completed: false,
      createdAt: '2026-01-03',
      updatedAt: '2026-01-03',
    };

    (taskApi.getTasks as vi.Mock).mockResolvedValue(mockTasks);
    (taskApi.createTask as vi.Mock).mockResolvedValue(newTask);

    const { result } = renderHook(() => useTasks());
    await act(async () => {});

    await act(async () => {
      await result.current.addTask({ title: 'Nouvelle tâche', description: 'Test' });
    });

    expect(result.current.tasks[0]).toEqual(newTask);
    expect(result.current.tasks.length).toBe(3);
  });

  it('editTask updates the correct task', async () => {
    const updated = { ...mockTasks[0], title: 'Modifié' };

    (taskApi.getTasks as vi.Mock).mockResolvedValue(mockTasks);
    (taskApi.updateTask as vi.Mock).mockResolvedValue(updated);

    const { result } = renderHook(() => useTasks());
    await act(async () => {});

    await act(async () => {
      await result.current.editTask(1, { title: 'Modifié' });
    });

    expect(result.current.tasks[0].title).toBe('Modifié');
  });

  it('removeTask deletes the correct task', async () => {
    (taskApi.getTasks as vi.Mock).mockResolvedValue(mockTasks);
    (taskApi.deleteTask as vi.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useTasks());
    await act(async () => {});

    await act(async () => {
      await result.current.removeTask(1);
    });

    expect(result.current.tasks.length).toBe(1);
    expect(result.current.tasks[0].id).toBe(2);
  });

  it('toggleComplete updates task completion', async () => {
    const toggled = { ...mockTasks[0], completed: true };

    (taskApi.getTasks as vi.Mock).mockResolvedValue(mockTasks);
    (taskApi.updateTask as vi.Mock).mockResolvedValue(toggled);

    const { result } = renderHook(() => useTasks());
    await act(async () => {});

    await act(async () => {
      await result.current.toggleComplete(1);
    });

    expect(result.current.tasks[0].completed).toBe(true);
  });

  it('toggleComplete does nothing if task not found', async () => {
    (taskApi.getTasks as vi.Mock).mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useTasks());
    await act(async () => {});

    await act(async () => {
      await result.current.toggleComplete(999);
    });

    // aucune modification
    expect(result.current.tasks).toEqual(mockTasks);
  });

  it('loadTasks can be called manually', async () => {
    (taskApi.getTasks as vi.Mock).mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useTasks());
    await act(async () => {});

    (taskApi.getTasks as vi.Mock).mockResolvedValue([mockTasks[0]]);

    await act(async () => {
      await result.current.loadTasks();
    });

    expect(result.current.tasks.length).toBe(1);
  });
});
