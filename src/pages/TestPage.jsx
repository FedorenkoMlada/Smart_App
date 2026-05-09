import React, { useState, useEffect } from 'react';

export const TestPage = ({ words, onBack, voiceAnswer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (voiceAnswer && !isFinished) {
      handleCheck(voiceAnswer);
    }
  }, [voiceAnswer]);

  if (!words || words.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', color: 'white' }}>
        <h2>В словаре нет слов для теста</h2>
        <button onClick={onBack} className="add-task">Назад</button>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  const handleCheck = (answer) => {
    if (feedback) return;

    const cleanUserAnswer = answer.trim().toLowerCase();
    const isCorrect = cleanUserAnswer === currentWord.en.toLowerCase();

    if (isCorrect) {
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

  // Экран завершения
  if (isFinished) {
    return (
      <div className="container" style={{ textAlign: 'center', color: 'white' }}>
        <i className="bi bi-trophy-fill" style={{ fontSize: '80px', color: '#f1c40f', marginBottom: '20px', display: 'block' }}></i>
        <h1>Тест завершен!</h1>
        <p style={{ fontSize: '24px', margin: '20px 0' }}>Ваш результат: <b>{score}</b> из <b>{words.length}</b></p>
        <button onClick={onBack} className="add-task" style={{ width: 'auto', padding: '0 40px' }}>
           Вернуться к словам
        </button>
      </div>
    );
  }

  const getInputStyle = () => {
    let borderColor = '#3d3d4e';
    let shadowColor = 'transparent';
    if (feedback === 'correct') { borderColor = '#2ecc71'; shadowColor = 'rgba(46, 204, 113, 0.3)'; }
    else if (feedback === 'error') { borderColor = '#e74c3c'; shadowColor = 'rgba(231, 76, 60, 0.3)'; }

    return {
      width: '100%', backgroundColor: '#1e1e2f', color: 'white',
      border: `2px solid ${borderColor}`, borderRadius: '16px',
      padding: '20px', fontSize: '24px', textAlign: 'center',
      outline: 'none', transition: 'all 0.3s ease',
      boxShadow: `0 0 20px ${shadowColor}`, marginBottom: '10px'
    };
  };

  return (
    <div className="container" style={{ textAlign: 'center' }}>

      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button
          onClick={onBack}
          style={{ background: 'transparent', border: '1px solid #4a4a6a', color: '#8e8eab', padding: '8px 15px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <i className="bi bi-x-lg"></i> Завершить
        </button>

        <div style={{ color: '#8e8eab' }}>
          <span>Слово {currentIndex + 1} / {words.length}</span>
        </div>

        <div style={{ color: '#2ecc71', fontWeight: 'bold' }}>
          <i className="bi bi-star-fill" style={{ marginRight: '5px' }}></i> {score}
        </div>
      </div>

      <div style={{ marginBottom: '50px' }}>
        <h1 style={{ color: 'white', fontSize: '56px', fontWeight: 'bold', margin: 0 }}>
          {currentWord.ru}
        </h1>
        <p style={{ color: '#8e8eab', marginTop: '10px' }}>Напишите или скажите перевод</p>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Текст перевода..."
          disabled={feedback !== null}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck(userInput)}
          style={getInputStyle()}
        />

        <div style={{ height: '40px', marginTop: '10px' }}>
          {feedback === 'correct' && (
            <p style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '18px' }}>
              <i className="bi bi-emoji-sunglasses-fill" style={{ marginRight: '10px' }}></i>
              Отлично!
            </p>
          )}
          {feedback === 'error' && (
            <p style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '18px' }}>
              <i className="bi bi-emoji-tear-fill" style={{ marginRight: '10px' }}></i>
              Ответ: {currentWord.en}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => handleCheck(userInput)}
        className="add-task"
        style={{
          marginTop: '30px',
          width: '200px',
          opacity: feedback ? 0.5 : 1,
          backgroundColor: feedback === 'correct' ? '#2ecc71' : feedback === 'error' ? '#e74c3c' : '#6c5ce7'
        }}
      >
        Проверить
      </button>

      <p style={{ color: '#4a4a6a', marginTop: '40px', fontSize: '14px' }}>
        <i className="bi bi-mic-fill" style={{ marginRight: '8px' }}></i>
        Команда: "Ответ [слово]"
      </p>
    </div>
  );
};