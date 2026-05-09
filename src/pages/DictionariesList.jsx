import React, { useState } from 'react';
import '../App.css';

export const DictionariesList = ({ dictionaries, onOpen, onDelete, onAdd }) => {
  // Состояние для хранения словаря, который пользователь хочет удалить (для модального окна)
  const [dictToDelete, setDictToDelete] = useState(null);

// Функции управления модальным окном

  const confirmDelete = (dict) => {
    setDictToDelete(dict); // Запоминаем словарь и показываем окно
  };

  const executeDelete = () => {
    onDelete(dictToDelete.id); // Вызываем функцию удаления из главного App.jsx
    setDictToDelete(null); // Закрываем окно
  };

  const cancelDelete = () => {
    setDictToDelete(null); // Закрываем окно без удаления
  };

  return (
    <main className="container">
      {/* Заголовок экрана */}
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '40px' }}>Мои словари</h1>

      {/* Кнопка добавления нового словаря */}
      <button className="add-task" onClick={onAdd} style={{ cursor: 'pointer', marginBottom: '30px', textAlign: 'center' }}>
        <i className="bi bi-journal-plus" style={{ marginRight: '10px' }}></i>
        Создать новый словарь
      </button>

      {/* Список существующих словарей */}
      <ul className="notes">
        {dictionaries.map((dict) => (
          <li key={dict.id} className="task-item">
            <span
              style={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => onOpen(dict.id)}
            >
              <i className="bi bi-journal-text" style={{ marginRight: '12px', fontSize: '1.2em', color: '#00d2d3' }}></i>
              {dict.name}
            </span>

            {/* Кнопка удаления конкретного словаря */}
            <button
              onClick={() => confirmDelete(dict)}
              style={{ backgroundColor: '#ff4757', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>

      {/* Модальное окно подтверждения (появляется только при удалении) */}
      {dictToDelete && (
        <div style={modalOverlayStyle}>
          <div style={modalBoxStyle}>
            <h2 style={{ color: 'black', marginTop: 0 }}>Удаление словаря</h2>
            <p style={{ color: '#333' }}>
              Вы уверены, что хотите удалить словарь <b>"{dictToDelete.name}"</b>?<br/>
              Все слова внутри него будут потеряны!
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={cancelDelete} style={btnCancelStyle}>Отмена</button>
              <button onClick={executeDelete} style={btnDeleteStyle}>Да, удалить</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

// Стили оформления

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000,
};

const modalBoxStyle = {
  backgroundColor: 'white', padding: '30px', borderRadius: '16px',
  maxWidth: '400px', width: '90%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
};

const btnCancelStyle = {
  padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc',
  backgroundColor: 'white', cursor: 'pointer', color: 'black'
};

const btnDeleteStyle = {
  padding: '10px 20px', borderRadius: '8px', border: 'none',
  backgroundColor: '#ff4757', color: 'white', cursor: 'pointer', fontWeight: 'bold'
};