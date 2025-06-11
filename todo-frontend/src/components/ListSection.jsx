import React from 'react';
import TodoList from './TodoList';
import CompletedList from './CompletedList';

const ListSection = () => {
  return (
    <div className="py-6">
      <div className="flex flex-col gap-8">
        <TodoList />
        <CompletedList />
      </div>
    </div>
  );
};

export default ListSection; 