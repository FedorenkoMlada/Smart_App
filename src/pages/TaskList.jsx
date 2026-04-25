import React from 'react';
import {AddTask} from '../components/AddTask';
import {TaskItemList} from '../components/TaskItemList';

export const TaskList = (props) => {
  // Достаем onClearAll из свойств
  const { items, onAdd, onDone, onClearAll } = props;

  return (
    <main className="container">
      <AddTask
        onAdd = { onAdd }
      />

      {/* Рисуем кнопку очистки только если есть хотя бы 1 задача */}
      {items.length > 0 && (
        <button
          className="clear-all-btn"
          onClick={onClearAll}
        >
          Удалить все задачи
        </button>
      )}

      <TaskItemList
        items  = { items }
        onDone = { onDone }
      />
    </main>
  )
}