import React from 'react';
import { AddWord } from '../components/AddWord';
import { WordCard } from '../components/WordCard';

export const WordsPage = ({ activeItem, onBack, onAddWord, onDeleteWord, onDeleteGroup, onStartTest, onEditWord, testError }) => {
  return (
    <main className="container">

      {/* ШАПКА ЭКРАНА */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={onBack}
          style={{ backgroundColor: 'transparent', color: '#8e8eab', border: '1px solid #8e8eab', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>
          ← Назад
        </button>

        <h2 style={{ margin: 0, color: 'white', textAlign: 'center', flex: 1 }}>{activeItem.name}</h2>

        {/* Маленькая кнопка удаления группы */}
        <button
          onClick={onDeleteGroup}
          style={{ backgroundColor: 'transparent', color: '#ff4757', border: '1px solid #ff4757', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>
          Удалить группу
        </button>
      </div>

      {/* Кнопка запуска тестирования */}
      <button
        onClick={onStartTest}
        style={{ width: '100%', backgroundColor: '#6c5ce7', color: 'white', border: 'none', padding: '15px', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
        Начать голосовой тест
      </button>

      {testError && (
          <p style={{
            color: '#ff4757',
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: '15px',
            animation: 'fadeIn 0.3s'
          }}>
            <i className="bi bi-exclamation-circle" style={{ marginRight: '8px' }}></i>
            {testError}
          </p>
      )}

      {/* Форма добавления слова */}
      <AddWord onAdd={onAddWord} />

      {/* Список слов */}
      <ul className="notes">
        {activeItem.words && activeItem.words.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#8e8eab' }}>Слов пока нет. Добавьте первую пару!</p>
        ) : (
          activeItem.words.map((word) => (
            <WordCard
              key={word.id}
              wordPair={word}
              onDeleteWord={onDeleteWord}
              onEditWord={onEditWord}
            />
          ))
        )}
      </ul>
    </main>
  );
};