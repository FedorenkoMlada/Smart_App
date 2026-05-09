import React, { useState, useEffect } from 'react';

export const TestPage = ({ words, onBack, voiceAnswer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Следим за голосовым ответом от Ассистента
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
    if (feedback) return; // Чтобы не частили с ответами

    const cleanUserAnswer = answer.trim().toLowerCase();
    const isCorrect = cleanUserAnswer === currentWord.en.toLowerCase();

    if (isCorrect) {
      setFeedback('correct');
      setScore(score + 1);
    } else {
      setFeedback('error');
    }

    // Через 2 секунды переходим к следующему слову
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
        <h1>Тест завершен!</h1>
        <p style={{ fontSize: '24px' }}>Ваш результат: {score} из {words.length}</p>
        <button onClick={onBack} className="add-task" style={{ width: 'auto', padding: '0 40px' }}>
          Вернуться в меню
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8e8eab' }}>
        <span>Слово {currentIndex + 1} из {words.length}</span>
        <span>Счет: {score}</span>
      </div>

      <div style={{ margin: '40px 0' }}>
        <p style={{ color: '#8e8eab', marginBottom: '10px' }}>Как переводится:</p>
        <h1 style={{ color: 'white', fontSize: '48px', textTransform: 'capitalize' }}>
          {currentWord.ru}
        </h1>
      </div>

      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Введите перевод..."
          disabled={feedback !== null}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck(userInput)}
          className="add-task-input"
          style={{
            textAlign: 'center',
            fontSize: '20px',
            borderBottom: feedback === 'correct' ? '2px solid #2ecc71' :
                          feedback === 'error' ? '2px solid #e74c3c' : '2px solid #3d3d4e'
          }}
        />

        {feedback === 'correct' && (
          <p style={{ color: '#2ecc71', marginTop: '10px', fontWeight: 'bold' }}>
            Правильно! 🎉
          </p>
        )}
        {feedback === 'error' && (
          <p style={{ color: '#e74c3c', marginTop: '10px', fontWeight: 'bold' }}>
            Ошибка! Правильно: {currentWord.en}
          </p>
        )}
      </div>

      <button
        onClick={() => handleCheck(userInput)}
        className="add-task"
        style={{ marginTop: '20px', opacity: feedback ? 0.5 : 1 }}
      >
        Проверить
      </button>

      <p style={{ color: '#8e8eab', marginTop: '30px', fontSize: '14px' }}>
        Можно ответить голосом: "Ответ [слово]"
      </p>
    </div>
  );
};