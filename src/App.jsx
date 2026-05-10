import React from 'react';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';

import './App.css';
import { DictionariesList } from './pages/DictionariesList';
import { WordsPage } from './pages/WordsPage';
import { TestPage } from './pages/TestPage';

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
      // НАВИГАЦИЯ
      currentScreen: 'home',
      activeDictId: null,

      // БАЗА ДАННЫХ
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

  // ДАННЫЕ ДЛЯ ГОЛОСОВОГО АССИСТЕНТА
  getStateForAssistant() {
    return {
      item_selector: {
        items: [],
        ignored_words:['добавить', 'удалить', 'тест'],
      },
    };
  }

  dispatchAssistantAction(action) {
    if (!action) return;

    // Очистка текста от возможных XML-тегов Сбера (важно для модерации!)
    const clean = (text) => text ? text.replace(/<[^>]*>/g, "").trim() : "";

    switch (action.type) {
        case 'add_word':
            const ru = clean(action.ru);
            const en = clean(action.en);

            if (en) {
                // Если голос прислал и слово и перевод - добавляем сразу
                this.add_word_to_dict({ ru, en });
            } else {
                // Если только русское - отправляем на перевод в API
                this.add_word_from_voice(ru);
            }
            break;

        case 'create_dictionary':
            return this.add_dictionary(clean(action.name));

        case 'open_dictionary':
            const dictName = clean(action.name).toLowerCase();
            const foundDict = this.state.dictionaries.find(d => d.name.toLowerCase() === dictName);

            if (foundDict) {
              this.open_dictionary(foundDict.id);
            } else {
              // Если не нашли, просим ассистента сказать об этом
              this.assistant.sendText(`Словарь "${clean(action.name)}" не найден`);
            }
            break;

        case 'delete_dictionary':
            const dictToDel = this.state.dictionaries.find(d => d.name.toLowerCase() === clean(action.name).toLowerCase());
            if (dictToDel) this.delete_dictionary(dictToDel.id);
            break;

        case 'delete_word':
            const activeD = this.state.dictionaries.find(d => d.id === this.state.activeDictId);
            const wordToDel = activeD?.words.find(w => w.ru.toLowerCase() === clean(action.ru).toLowerCase());
            if (wordToDel) this.delete_word_from_dict(wordToDel.id);
            break;

        case 'start_test':
            return this.start_test();

        case 'check_answer':
            this.setState({ lastVoiceAnswer: clean(action.answer) });
            setTimeout(() => this.setState({ lastVoiceAnswer: null }), 100);
            break;

        case 'open_screen':
            return this.setState({ currentScreen: action.screen });

        default:
            console.log("Неизвестный экшен:", action.type);
    }
  }

  // МЕТОДЫ НАВИГАЦИИ
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

  go_back_to_words = () => {
  this.setState({ currentScreen: 'words' });
  };


  // МЕТОДЫ УПРАВЛЕНИЯ СЛОВАРЯМИ
  add_dictionary = (name) => {
    // Если имя пустое (например, нажали добавить ничего не введя), ставим дефолтное
    const finalName = name.trim() || 'Новый словарь';

    const newDict = {
      id: Math.random().toString(36).substring(7),
      name: finalName,
      words: [],
    };

    this.setState({ dictionaries: [...this.state.dictionaries, newDict] });
  };

  delete_dictionary = (dictId) => {
    this.setState({
      dictionaries: this.state.dictionaries.filter((dict) => dict.id !== dictId),
    });
  };


  // МЕТОДЫ УПРАВЛЕНИЯ СЛОВАМИ
  // ФУНКЦИЯ ДЛЯ УМНОГО ПЕРЕВОДА
  add_word_from_voice = async (ruWord) => {
    try {
      // Бесплатный переводчик в интернете
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${ruWord}&langpair=ru|en`);
      const data = await response.json();

      // Достаем английский перевод из ответа
      let enWord = data.responseData.translatedText.toLowerCase();

      // Добавляем готовую пару в наш словарь
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


  // ГЛАВНЫЙ РЕНДЕР
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

        {/* ЭКРАН 3: ТЕСТИРОВАНИЕ */}
        {currentScreen === 'test' && activeDictionary && (
          <TestPage
            words={activeDictionary.words}
            onBack={this.go_back_to_words}
            voiceAnswer={this.state.lastVoiceAnswer}
          />
        )}

      </div>
    );
  }
}