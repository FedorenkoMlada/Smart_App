import React, { useState } from "react";
import "../App.css";

export const AddWord = ({ onAdd }) => {
  const [ruWord, setRuWord] = useState('');
  const [enWord, setEnWord] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (ruWord.trim() && enWord.trim()) {
      onAdd({ ru: ruWord.trim(), en: enWord.trim() });
      setRuWord('');
      setEnWord('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '30px' }}
    >
      <input
        className="add-task"
        style={{ marginTop: 0, flex: 1, fontSize: '18px', padding: '0 16px' }}
        type="text"
        placeholder="Русское слово"
        value={ruWord}
        onChange={(e) => setRuWord(e.target.value)}
        required
      />
      <input
        className="add-task"
        style={{ marginTop: 0, flex: 1, fontSize: '18px', padding: '0 16px' }}
        type="text"
        placeholder="Перевод (English)"
        value={enWord}
        onChange={(e) => setEnWord(e.target.value)}
        required
      />
      <button
        type="submit"
        style={{
          padding: '0 20px', borderRadius: '16px', border: 'none',
          backgroundColor: '#00d2d3', color: '#1e1e2f', fontWeight: 'bold', cursor: 'pointer'
        }}
      >
        Добавить
      </button>
    </form>
  );
};