import React, { useState } from 'react';
import '../App.css';

export const DictionariesList = ({ dictionaries, onOpen, onDelete, onAdd }) => {
  // Состояние для хранения словаря, который пользователь хочет удалить (для модального окна)
  const [dictToDelete, setDictToDelete] = useState(null);

  // Состояние для текста в поле ввода
  const [newDictName, setNewDictName] = useState('');

  // Функция для обработки нажатия кнопки или Enter
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newDictName.trim()) return;
    onAdd(newDictName);
    setNewDictName('');
  };

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
            <form onSubmit={handleAddSubmit} className="add-dict-form">
        <input
          type="text"
          placeholder="Название нового словаря..."
          value={newDictName}
          onChange={(e) => setNewDictName(e.target.value)}
          className="add-dict-input"
        />
        <button type="submit" className="add-dict-btn">
          <i className="bi bi-journal-plus"></i>
          Создать
        </button>
      </form>

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
              className="delete-btn-simple"
              style={{ background: 'transparent', color: '#ff4757', border: '1px solid #ff4757', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer' }}
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
              <h2 style={{ color: 'white', marginTop: 0, fontSize: '22px' }}>Удаление словаря</h2>

              <p style={{ color: '#8e8eab', lineHeight: '1.5' }}>
                Вы уверены, что хотите удалить словарь <b style={{ color: '#00d2d3' }}>"{dictToDelete.name}"</b>?
                <br/>Все данные будут безвозвратно удалены.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
                <button onClick={cancelDelete} style={btnCancelStyle}>Отмена</button>
                <button
                  onClick={executeDelete}
                  style={{ ...btnDeleteStyle, borderRadius: '10px' }}
                >
                  Да, удалить
                </button>
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
  backgroundColor: '#1e1e2f',
  padding: '30px',
  borderRadius: '20px',
  maxWidth: '400px',
  width: '90%',
  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  border: '1px solid #3d3d4e',
};

const btnCancelStyle = {
  padding: '10px 20px',
  borderRadius: '10px',
  border: '1px solid #4a4a6a',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: '#8e8eab',
  fontWeight: '500'
};

const btnDeleteStyle = {
  padding: '10px 20px', borderRadius: '8px', border: 'none',
  backgroundColor: '#ff4757', color: 'white', cursor: 'pointer', fontWeight: 'bold'
};