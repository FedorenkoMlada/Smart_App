import React from 'react';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';

import './App.css';
import { DictionariesList } from './pages/DictionariesList';
import { WordsPage } from './pages/WordsPage'; // Подключили нашу новую страницу
import { TestPage } from './pages/TestPage'; //

const initializeAssistant = (getState /*: any*/, getRecoveryState) => {
  if (process.env.NODE_ENV === 'development') {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? '',
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
      nativePanel: {
        defaultText: '',
        screenshotMode: false,
        tabIndex: -1,
      },
    });
  } else {
    return createAssistant({ getState });
  }
};

export class App extends React.Component {
  constructor(props) {
    super(props);
    console.log('constructor');

    this.state = {
      // --- НАВИГАЦИЯ ---
      currentScreen: 'home',
      activeDictId: null,

      // --- БАЗА ДАННЫХ ---
      dictionaries:[],

      lastVoiceAnswer: null,
    };

    this.assistant = initializeAssistant(() => this.getStateForAssistant());

    this.assistant.on('data', (event) => {
      if (event.type === 'character') {
        // ...
      } else if (event.type === 'insets') {
        // ...
      } else {
        const { action } = event;
        this.dispatchAssistantAction(action);
      }
    });

    this.assistant.on('start', (event) => { console.log(`assistant.on(start)`, event); });
    this.assistant.on('command', (event) => { console.log(`assistant.on(command)`, event); });
    this.assistant.on('error', (event) => { console.log(`assistant.on(error)`, event); });
    this.assistant.on('tts', (event) => { console.log(`assistant.on(tts)`, event); });
  }

  // --- ДАННЫЕ ДЛЯ ГОЛОСОВОГО АССИСТЕНТА ---
  getStateForAssistant() {
    return {
      item_selector: {
        items: [],
        ignored_words:['добавить', 'удалить', 'тест'],
      },
    };
  }

  dispatchAssistantAction(action) {
    if (action) {
      switch (action.type) {
        case 'add_word':
          return this.add_word_from_voice(action.ru);
        case 'start_test':
          return this.start_test();
        case 'check_answer':
          // Сохраняем ответ в state, чтобы TestPage его подхватил
        this.setState({ lastVoiceAnswer: action.answer });
        // Сбрасываем через мгновение, чтобы можно было обрабатывать одинаковые ответы подряд
        setTimeout(() => this.setState({ lastVoiceAnswer: null }), 100);
          return;
        default:
          return;
      }
    }
  }

  // --- МЕТОДЫ НАВИГАЦИИ ---
  open_dictionary = (dictId) => {
    this.setState({ currentScreen: 'words', activeDictId: dictId });
  };

  go_home = () => {
    this.setState({ currentScreen: 'home', activeDictId: null });
  };

  start_test = () => {
    console.log('Запуск теста!');
    this.setState({ currentScreen: 'test' });
  };


  // --- МЕТОДЫ УПРАВЛЕНИЯ СЛОВАРЯМИ ---
  add_dictionary = () => {
    const name = prompt('Введите название нового словаря:', 'Новый словарь');
    if (!name) return;

    const newDict = {
      id: Math.random().toString(36).substring(7),
      name: name,
      words: [],
    };

    this.setState({ dictionaries:[...this.state.dictionaries, newDict] });
  };

  delete_dictionary = (dictId) => {
    this.setState({
      dictionaries: this.state.dictionaries.filter((dict) => dict.id !== dictId),
    });
  };


  // --- МЕТОДЫ УПРАВЛЕНИЯ СЛОВАМИ ---
  // --- НОВАЯ ФУНКЦИЯ ДЛЯ УМНОГО ПЕРЕВОДА ---
  add_word_from_voice = async (ruWord) => {
    try {
      // Идем в бесплатный переводчик в интернете
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${ruWord}&langpair=ru|en`);
      const data = await response.json();

      // Достаем английский перевод из ответа
      let enWord = data.responseData.translatedText.toLowerCase();

      // Добавляем готовую пару в наш словарь!
      this.add_word_to_dict({ ru: ruWord, en: enWord });
    } catch (error) {
      console.error("Ошибка при переводе:", error);
      // Если нет интернета, добавим хотя бы русское слово
      this.add_word_to_dict({ ru: ruWord, en: "???" });
    }
  };
  add_word_to_dict = (wordData) => {
    this.setState((prevState) => ({
      dictionaries: prevState.dictionaries.map((dict) => {
        if (dict.id === prevState.activeDictId) {
          return {
            ...dict,
            words:[...dict.words, { id: Math.random().toString(36).substring(7), ru: wordData.ru, en: wordData.en }]
          };
        }
        return dict;
      })
    }));
  };

  delete_word_from_dict = (wordId) => {
    this.setState((prevState) => ({
      dictionaries: prevState.dictionaries.map((dict) => {
        if (dict.id === prevState.activeDictId) {
          return {
            ...dict,
            words: dict.words.filter((w) => w.id !== wordId)
          };
        }
        return dict;
      })
    }));
  };

  edit_word_in_dict = (wordId, newRu, newEn) => {
    this.setState((prevState) => ({
      dictionaries: prevState.dictionaries.map((dict) => {
        if (dict.id === prevState.activeDictId) {
          return {
            ...dict,
            words: dict.words.map((w) =>
              w.id === wordId ? { ...w, ru: newRu, en: newEn } : w
            )
          };
        }
        return dict;
      })
    }));
  };


  // --- ГЛАВНЫЙ РЕНДЕР ---
  render() {
    const { currentScreen, dictionaries, activeDictId } = this.state;
    const activeDictionary = dictionaries.find((d) => d.id === activeDictId);

    return (
      <div style={{ minHeight: '100vh', padding: '20px 0' }}>

        {/* ЭКРАН 1: СПИСОК СЛОВАРЕЙ */}
        {currentScreen === 'home' && (
          <DictionariesList
            dictionaries={dictionaries}
            onOpen={this.open_dictionary}
            onDelete={this.delete_dictionary}
            onAdd={this.add_dictionary}
          />
        )}

        {/* ЭКРАН 2: ВНУТРИ СЛОВАРЯ (ГРУППЫ) */}
        {currentScreen === 'words' && activeDictionary && (
          <WordsPage
            activeItem={activeDictionary}
            onBack={this.go_home}
            onAddWord={this.add_word_to_dict}
            onDeleteWord={this.delete_word_from_dict}
            onEditWord={this.edit_word_in_dict}
            onDeleteGroup={() => {
              this.delete_dictionary(activeDictionary.id);
              this.go_home();
            }}
            onStartTest={this.start_test}
          />
        )}

        {/* ЭКРАН 3: ТЕСТИРОВАНИЕ (пока заглушка) */}
        {currentScreen === 'test' && activeDictionary && (
          <TestPage
            words={activeDictionary.words}
            onBack={this.go_home}
            voiceAnswer={this.state.lastVoiceAnswer}
          />
        )}

      </div>
    );
  }
}