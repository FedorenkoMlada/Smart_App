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
        <form onSubmit={handleSubmit} className="add-word-form">
      <input
        className="add-word-input"
        type="text"
        placeholder="Русское слово"
        value={ruWord}
        onChange={(e) => setRuWord(e.target.value)}
        required
      />
      <input
        className="add-word-input"
        type="text"
        placeholder="Перевод (English)"
        value={enWord}
        onChange={(e) => setEnWord(e.target.value)}
        required
      />
      <button type="submit" className="add-word-btn">
        Добавить
      </button>
    </form>
  );
};