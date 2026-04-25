import React from 'react';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';

import './App.css';
import { TaskList } from './pages/TaskList';
import { DictionariesList } from './pages/DictionariesList'; // Подключаем наш новый экран

const initializeAssistant = (getState /*: any*/, getRecoveryState) => {
  if (process.env.NODE_ENV === 'development') {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? '',
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
      nativePanel: {
        defaultText: 'ччччччч',
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
      // --- НАВИГАЦИЯ И ДАННЫЕ ---
      currentScreen: 'home', // 'home' (словари), 'words' (список слов), 'test' (тест)
      activeDictId: null,    // ID словаря, в который мы сейчас зашли

      dictionaries:[
        {
          id: 'dict-1',
          name: 'Английский язык',
          words:[
            { id: 'w-1', ru: 'яблоко', en: 'apple' },
            { id: 'w-2', ru: 'кошка', en: 'cat' },
          ],
        },
      ],
    };

    this.assistant = initializeAssistant(() => this.getStateForAssistant());

    this.assistant.on('data', (event /*: any*/) => {
      console.log(`assistant.on(data)`, event);
      if (event.type === 'character') {
        console.log(`assistant.on(data): character: "${event?.character?.id}"`);
      } else if (event.type === 'insets') {
        console.log(`assistant.on(data): insets`);
      } else {
        const { action } = event;
        this.dispatchAssistantAction(action);
      }
    });

    this.assistant.on('start', (event) => {
      let initialData = this.assistant.getInitialData();
      console.log(`assistant.on(start)`, event, initialData);
    });

    this.assistant.on('command', (event) => { console.log(`assistant.on(command)`, event); });
    this.assistant.on('error', (event) => { console.log(`assistant.on(error)`, event); });
    this.assistant.on('tts', (event) => { console.log(`assistant.on(tts)`, event); });
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  // Передача стейта ассистенту (пока оставляем базовой)
  getStateForAssistant() {
    const state = {
      item_selector: {
        items: [],
        ignored_words:['добавить', 'удалить', 'очисти', 'всё', 'все', 'список'],
      },
    };
    return state;
  }

  // --- МЕТОДЫ НАВИГАЦИИ ---
  open_dictionary = (dictId) => {
    this.setState({ currentScreen: 'words', activeDictId: dictId });
  };

  go_home = () => {
    this.setState({ currentScreen: 'home', activeDictId: null });
  };

  // --- МЕТОДЫ ДЛЯ СЛОВАРЕЙ ---
  add_dictionary = () => {
    // Временно используем браузерный prompt для быстрого создания
    const name = prompt('Введите название нового словаря:', 'Мой новый словарь');
    if (!name) return;

    const newDict = {
      id: Math.random().toString(36).substring(7),
      name: name,
      words:[],
    };

    this.setState({
      dictionaries: [...this.state.dictionaries, newDict],
    });
  };

  delete_dictionary = (dictId) => {
    this.setState({
      dictionaries: this.state.dictionaries.filter((dict) => dict.id !== dictId),
    });
  };


  // --- ОБРАБОТКА КОМАНД АССИСТЕНТА ---
  dispatchAssistantAction(action) {
    if (action) {
      switch (action.type) {
        case 'add_note':
          return this.add_note(action);
        case 'delete_note':
          return this.delete_note(action);
        case 'clear_all_notes':
          return this.clear_all_notes();
        default:
          return;
      }
    }
  }

  // Временные заглушки для старых методов, чтобы код не падал,
  // пока мы не переделаем TaskList в WordList
  add_note(action) { console.log('Слова добавляются пока через интерфейс'); }
  done_note(action) { console.log('Слова выучены'); }
  delete_note(action) { console.log('Удаление слова'); }
  clear_all_notes() { console.log('Очистка слов'); }
  _send_action_value(action_id, value) { /* ... */ }
  play_done_note(id) { /* ... */ }


  // --- ГЛАВНЫЙ РЕНДЕР ---
  render() {
    console.log('render');
    const { currentScreen, dictionaries, activeDictId } = this.state;

    // Находим словарь, который сейчас открыт
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

        {/* ЭКРАН 2: ВНУТРИ СЛОВАРЯ (пока используем старый TaskList) */}
        {currentScreen === 'words' && activeDictionary && (
          <div>
            {/* Кнопка "Назад" к словарям */}
            <div className="container" style={{ paddingBottom: '0' }}>
              <button
                onClick={this.go_home}
                style={{ backgroundColor: 'transparent', color: '#00d2d3', border: '1px solid #00d2d3', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', marginBottom: '-20px' }}>
                ← Назад к словарям
              </button>
            </div>

            <TaskList
              // Адаптируем наши слова под старый формат TaskList (title, completed)
              items={activeDictionary.words.map(w => ({
                id: w.id,
                title: `${w.ru} — ${w.en}`,
                completed: false
              }))}
              onAdd={(note) => {}}
              onDone={(note) => {}}
              onClearAll={() => {}}
            />
          </div>
        )}

      </div>
    );
  }
}