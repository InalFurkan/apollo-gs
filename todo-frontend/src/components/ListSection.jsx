import React from 'react';
import TodoList from './TodoList';
import CompletedList from './CompletedList';

const ListSection = ({ tasks, onToggleTask }) => {
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TodoList tasks={activeTasks} onToggleTask={onToggleTask} />
        <CompletedList tasks={completedTasks} onToggleTask={onToggleTask} />
      </div>
    </div>
  );
};

export default ListSection; 