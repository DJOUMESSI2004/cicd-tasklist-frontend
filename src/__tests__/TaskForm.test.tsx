import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from '../components/TaskForm';

describe('TaskForm (unit tests)', () => {
  it('renders create mode title by default', () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    expect(screen.getByText('Nouvelle tâche')).toBeInTheDocument();
  });

  it('renders edit mode title', () => {
    render(<TaskForm onSubmit={vi.fn()} mode="edit" />);
    expect(screen.getByText('Modifier la tâche')).toBeInTheDocument();
  });

  it('renders initial values when provided', () => {
    render(
      <TaskForm
        onSubmit={vi.fn()}
        initialValues={{ title: 'Init', description: 'Init desc' }}
      />
    );

    expect(screen.getByLabelText('Titre')).toHaveValue('Init');
    expect(screen.getByLabelText('Description')).toHaveValue('Init desc');
  });

  it('shows validation error when submitting empty title', () => {
    render(<TaskForm onSubmit={vi.fn()} />);

    fireEvent.submit(screen.getByTestId('task-form'));

    expect(screen.getByRole('alert')).toHaveTextContent('Le titre est requis');
  });

  it('clears validation error when typing again', () => {
    render(<TaskForm onSubmit={vi.fn()} />);

    fireEvent.submit(screen.getByTestId('task-form'));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Titre'), { target: { value: 'A' } });

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('submits trimmed values', () => {
    const onSubmit = vi.fn();

    render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Titre'), {
      target: { value: '  Hello  ' },
    });

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: '  World  ' },
    });

    fireEvent.submit(screen.getByTestId('task-form'));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Hello',
      description: 'World',
    });
  });

  it('resets fields after submit in create mode', () => {
    const onSubmit = vi.fn();

    render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Titre'), {
      target: { value: 'Test' },
    });

    fireEvent.submit(screen.getByTestId('task-form'));

    expect(screen.getByLabelText('Titre')).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
  });

  it('does not reset fields in edit mode', () => {
    const onSubmit = vi.fn();

    render(
      <TaskForm
        onSubmit={onSubmit}
        mode="edit"
        initialValues={{ title: 'Old', description: 'Old desc' }}
      />
    );

    fireEvent.submit(screen.getByTestId('task-form'));

    expect(screen.getByLabelText('Titre')).toHaveValue('Old');
    expect(screen.getByLabelText('Description')).toHaveValue('Old desc');
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();

    render(<TaskForm onSubmit={vi.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Annuler'));

    expect(onCancel).toHaveBeenCalled();
  });
});
