import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskItem } from '../components/TaskItem';
import type { Task } from '../types/task';

const mockTask: Task = {
  id: 1,
  title: 'Ma tâche',
  description: 'Une description',
  completed: false,
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
};

describe('TaskItem (unit tests)', () => {
  it('renders task information', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    expect(screen.getByText('Ma tâche')).toBeInTheDocument();
    expect(screen.getByText('Une description')).toBeInTheDocument();
    expect(screen.getByTestId('task-item')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onToggle={onToggle}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('enters edit mode when clicking edit button', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText('Modifier'));

    expect(screen.getByLabelText('Modifier le titre')).toBeInTheDocument();
    expect(screen.getByLabelText('Modifier la description')).toBeInTheDocument();
  });

  it('updates title and description while editing', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText('Modifier'));

    fireEvent.change(screen.getByLabelText('Modifier le titre'), {
      target: { value: 'Nouveau titre' },
    });

    fireEvent.change(screen.getByLabelText('Modifier la description'), {
      target: { value: 'Nouvelle description' },
    });

    expect(screen.getByLabelText('Modifier le titre')).toHaveValue('Nouveau titre');
    expect(screen.getByLabelText('Modifier la description')).toHaveValue('Nouvelle description');
  });

  it('does not save if title is empty', () => {
    const onEdit = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={onEdit}
      />
    );

    fireEvent.click(screen.getByLabelText('Modifier'));

    fireEvent.change(screen.getByLabelText('Modifier le titre'), {
      target: { value: '   ' },
    });

    fireEvent.click(screen.getByText('Enregistrer'));

    expect(onEdit).not.toHaveBeenCalled();
  });

  it('saves edited values', () => {
    const onEdit = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={onEdit}
      />
    );

    fireEvent.click(screen.getByLabelText('Modifier'));

    fireEvent.change(screen.getByLabelText('Modifier le titre'), {
      target: { value: 'Titre modifié' },
    });

    fireEvent.change(screen.getByLabelText('Modifier la description'), {
      target: { value: 'Desc modifiée' },
    });

    fireEvent.click(screen.getByText('Enregistrer'));

    expect(onEdit).toHaveBeenCalledWith(1, {
      title: 'Titre modifié',
      description: 'Desc modifiée',
    });
  });

  it('cancels editing and restores original values', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText('Modifier'));

    fireEvent.change(screen.getByLabelText('Modifier le titre'), {
      target: { value: 'Changement' },
    });

    fireEvent.click(screen.getByText('Annuler'));

    expect(screen.queryByLabelText('Modifier le titre')).toBeNull();
    expect(screen.getByText('Ma tâche')).toBeInTheDocument();
  });

  it('requires two clicks to delete', () => {
    const onDelete = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onToggle={vi.fn()}
        onDelete={onDelete}
        onEdit={vi.fn()}
      />
    );

    const deleteBtn = screen.getByLabelText('Supprimer');

    // 1st click → confirmation
    fireEvent.click(deleteBtn);
    expect(deleteBtn).toHaveTextContent('⚠️');

    // 2nd click → delete
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('confirmation delete resets after 3 seconds', () => {
    vi.useFakeTimers();

    render(
      <TaskItem
        task={mockTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    const deleteBtn = screen.getByLabelText('Supprimer');

    fireEvent.click(deleteBtn);
    expect(deleteBtn).toHaveTextContent('⚠️');

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(deleteBtn).toHaveTextContent('🗑️');

    vi.useRealTimers();
  });

  it('displays formatted date', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    expect(screen.getByText(/15 janvier 2026/i)).toBeInTheDocument();
  });
});
