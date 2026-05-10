import React, { useState, useEffect } from 'react';

export const TestPage = ({ words, onBack, voiceAnswer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // ФУНКЦИЯ ОЗВУЧКИ (TTS)
  const speakEnglish = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Устанавливаем английский язык
    utterance.rate = 0.9;     // Чуть замедлим для четкости
    window.speechSynthesis.speak(utterance);
  };

  // Озвучиваем слово при смене индекса
  useEffect(() => {
    if (words[currentIndex] && !isFinished) {
      speakEnglish(words[currentIndex].en);
    }
  }, [currentIndex, isFinished]);

  useEffect(() => {
    if (voiceAnswer && !isFinished) {
      handleCheck(voiceAnswer);
    }
  }, [voiceAnswer]);

  if (!words || words.length === 0) return null;

  const currentWord = words[currentIndex];

  const handleCheck = (answer) => {
    if (feedback) return;

    const userSays = answer.trim().toLowerCase();
    const correctAnswer = currentWord.ru.toLowerCase();

    // Теперь проверяем русское слово! Сбер поймет его идеально.
    if (userSays === correctAnswer) {
      setFeedback('correct');
      setScore(score + 1);
    } else {
      setFeedback('error');
    }

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setFeedback(null);
        setUserInput('');
      } else {
        setIsFinished(true);
      }
    }, 2000);
  };

  if (isFinished) {
    return (
      <div className="container" style={{ textAlign: 'center', color: 'white' }}>
        <i className="bi bi-trophy-fill" style={{ fontSize: '80px', color: '#f1c40f' }}></i>
        <h1>Тест завершен!</h1>
        <p style={{ fontSize: '24px' }}>Результат: {score} из {words.length}</p>
        <button onClick={onBack} className="add-task">Назад к словам</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8e8eab' }}>
        <button onClick={onBack} style={{ background: 'none', border: '1px solid #4a4a6a', color: '#8e8eab', borderRadius: '12px', cursor: 'pointer' }}>
          <i className="bi bi-x-lg"></i> Завершить
        </button>
        <span>Слово {currentIndex + 1} / {words.length}</span>
      </div>

      <div style={{ margin: '50px 0' }}>
        {/* Показываем АНГЛИЙСКОЕ слово */}
        <h1 style={{ color: '#00d2d3', fontSize: '64px', fontWeight: 'bold', margin: 0 }}>
          {currentWord.en}
        </h1>
        <button
          onClick={() => speakEnglish(currentWord.en)}
          style={{ background: 'none', border: 'none', color: '#8e8eab', cursor: 'pointer', fontSize: '24px' }}
        >
          <i className="bi bi-volume-up-fill"></i> Послушать
        </button>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Перевод на русский..."
          disabled={feedback !== null}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck(userInput)}
          className="add-task-input"
          style={{
            textAlign: 'center',
            fontSize: '24px',
            borderBottom: feedback === 'correct' ? '2px solid #2ecc71' : feedback === 'error' ? '2px solid #e74c3c' : '2px solid #3d3d4e'
          }}
        />
        <div style={{ height: '40px', marginTop: '10px' }}>
          {feedback === 'correct' && <p style={{ color: '#2ecc71' }}><i className="bi bi-emoji-sunglasses-fill"></i> Верно!</p>}
          {feedback === 'error' && <p style={{ color: '#e74c3c' }}><i className="bi bi-bookmark-check-fill"></i> Правильно: {currentWord.ru}</p>}
        </div>
      </div>
    </div>
  );
};