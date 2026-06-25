import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskList } from '../components/TaskList';
import type { Task } from '../types/task';

const mockTasks: Task[] = [
	{
		id: 1,
		title: 'Première tâche',
		description: 'Description 1',
		completed: false,
		createdAt: '2026-01-15T10:00:00Z',
		updatedAt: '2026-01-15T10:00:00Z',
	},
	{
		id: 2,
		title: 'Deuxième tâche',
		description: null,
		completed: true,
		createdAt: '2026-01-16T10:00:00Z',
		updatedAt: '2026-01-16T10:00:00Z',
	},
];

vi.mock('../components/TaskItem', () => ({
	TaskItem: ({ task, onToggle, onDelete, onEdit }: any) => (
		<div
			data-testid="mock-task-item"
			data-id={task.id}
			onClick={() => {
				onToggle(task.id);
				onDelete(task.id);
				onEdit(task.id, { title: 'Edited' });
			}}
		>
			{task.title}
		</div>
	),
}));



describe('TaskList', () => {
	it('shows loading state', () => {
		render(
			<TaskList
				tasks={[]}
				loading={true}
				error={null}
				onToggle={vi.fn()}
				onDelete={vi.fn()}
				onEdit={vi.fn()}
			/>
		);

		expect(screen.getByTestId('loading')).toBeInTheDocument();
		expect(screen.getByText('Chargement des tâches...')).toBeInTheDocument();
	});

	it('shows error state', () => {
		render(
			<TaskList
				tasks={[]}
				loading={false}
				error="Impossible de charger"
				onToggle={vi.fn()}
				onDelete={vi.fn()}
				onEdit={vi.fn()}
			/>
		);

		expect(screen.getByTestId('error')).toBeInTheDocument();
		expect(screen.getByText(/Impossible de charger/)).toBeInTheDocument();
	});

	it('shows empty state when no tasks', () => {
		render(
			<TaskList
				tasks={[]}
				loading={false}
				error={null}
				onToggle={vi.fn()}
				onDelete={vi.fn()}
				onEdit={vi.fn()}
			/>
		);

		expect(screen.getByTestId('empty')).toBeInTheDocument();
		expect(screen.getByText('Aucune tâche')).toBeInTheDocument();
	});

	it('renders list of tasks', () => {
		render(
			<TaskList
				tasks={mockTasks}
				loading={false}
				error={null}
				onToggle={vi.fn()}
				onDelete={vi.fn()}
				onEdit={vi.fn()}
			/>
		);

		expect(screen.getByTestId('task-list')).toBeInTheDocument();
		expect(screen.getByText('Première tâche')).toBeInTheDocument();
		expect(screen.getByText('Deuxième tâche')).toBeInTheDocument();
	});

	it('shows correct task count and completed count', () => {
		render(
			<TaskList
				tasks={mockTasks}
				loading={false}
				error={null}
				onToggle={vi.fn()}
				onDelete={vi.fn()}
				onEdit={vi.fn()}
			/>
		);

		expect(screen.getByText('2 tâches')).toBeInTheDocument();
		expect(screen.getByText('1 terminée')).toBeInTheDocument();
	});

	it('renders a TaskItem for each task', () => {
		render(
			<TaskList
				tasks={mockTasks}
				loading={false}
				error={null}
				onToggle={vi.fn()}
				onDelete={vi.fn()}
				onEdit={vi.fn()}
			/>
		);

		const items = screen.getAllByTestId('mock-task-item');
		expect(items.length).toBe(2);
	});


	it('passes callbacks correctly to TaskItem', () => {
		const onToggle = vi.fn();
		const onDelete = vi.fn();
		const onEdit = vi.fn();

		render(
			<TaskList
				tasks={mockTasks}
				loading={false}
				error={null}
				onToggle={onToggle}
				onDelete={onDelete}
				onEdit={onEdit}
			/>
		);

		const firstItem = screen.getAllByTestId('mock-task-item')[0];

		firstItem.click();

		expect(onToggle).toHaveBeenCalledWith(1);
		expect(onDelete).toHaveBeenCalledWith(1);
		expect(onEdit).toHaveBeenCalledWith(1, { title: 'Edited' });
	});

});
