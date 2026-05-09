import React, { useState } from "react";
import "../App.css";

export const WordCard = ({ wordPair, onDeleteWord, onEditWord }) => {
  const [isEditing, setIsEditing] = useState(false);
  const[ruText, setRuText] = useState(wordPair.ru);
  const [enText, setEnText] = useState(wordPair.en);

  const handleSave = () => {
    onEditWord(wordPair.id, ruText, enText);
    setIsEditing(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSave();
  };

  if (isEditing) {
    return (
      <li className="task-item" style={{ padding: '10px 20px' }}>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', margin: 0 }}
        >
          <input
            value={ruText}
            onChange={(e) => setRuText(e.target.value)}
            className="add-task"
            style={{ height: '40px', margin: 0, flex: 1, fontSize: '16px' }}
            autoFocus
          />
          <input
            value={enText}
            onChange={(e) => setEnText(e.target.value)}
            className="add-task"
            style={{ height: '40px', margin: 0, flex: 1, fontSize: '16px' }}
          />
          <button
            type="submit"
            style={{ backgroundColor: '#00d2d3', color: '#1e1e2f', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', fontSize: '18px' }}
            title="Сохранить"
          >
            <i className="bi bi-check-lg"></i>
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className="task-item" style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', paddingRight: '20px' }}>
        <span style={{ fontWeight: "bold", color: '#00d2d3', flex: 1 }}>{wordPair.ru}</span>
        <span style={{ color: 'white', flex: 1, textAlign: 'right' }}>{wordPair.en}</span>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setIsEditing(true)}
          style={{ backgroundColor: 'transparent', color: '#8e8eab', border: 'none', fontSize: '20px', cursor: 'pointer', transition: 'color 0.2s' }}
          title="Редактировать"
          onMouseEnter={(e) => e.target.style.color = '#00d2d3'}
          onMouseLeave={(e) => e.target.style.color = '#8e8eab'}
        >
          <i className="bi bi-pencil-square" style={{ pointerEvents: 'none' }}></i>
        </button>

        <button
          onClick={() => onDeleteWord(wordPair.id)}
          style={{ backgroundColor: 'transparent', color: '#8e8eab', border: 'none', fontSize: '20px', cursor: 'pointer', transition: 'color 0.2s' }}
          title="Удалить слово"
          onMouseEnter={(e) => e.target.style.color = '#ff4757'}
          onMouseLeave={(e) => e.target.style.color = '#8e8eab'}
        >
          <i className="bi bi-trash3" style={{ pointerEvents: 'none' }}></i>
        </button>
      </div>
    </li>
  );
};