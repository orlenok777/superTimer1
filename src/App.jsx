// src/App.js
import React, { useState, useEffect } from "react";
import { AlertCircle, Sun, Moon, Edit, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

const VoiceTimerApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newCategory, setNewCategory] = useState("work");
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [russianVoice, setRussianVoice] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const voicesChanged = () => {
        const voices = window.speechSynthesis.getVoices();
        const russianVoice = voices.find((voice) => voice.lang === "ru-RU");
        setRussianVoice(russianVoice);
      };
      window.speechSynthesis.onvoiceschanged = voicesChanged;
      voicesChanged(); // Immediately populate voices
    }
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const enableSound = () => {
    if ("speechSynthesis" in window) {
      setSoundEnabled(true);
      // Проиграть короткий звук или сообщение, чтобы подтвердить активацию звука
      const utterance = new SpeechSynthesisUtterance("Звук включен");
      utterance.lang = "ru-RU";
      if (russianVoice) {
        utterance.voice = russianVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const addTask = () => {
    if (newTask && newDuration) {
      const task = {
        id: Date.now(),
        name: newTask,
        duration: parseInt(newDuration),
        category: newCategory,
        remainingTime: parseInt(newDuration),
      };
      setTasks([...tasks, task]);
      setNewTask("");
      setNewDuration("");
    }
  };

  const speak = (text) => {
    if (soundEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ru-RU";
      if (russianVoice) {
        utterance.voice = russianVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakTaskName = (task) => {
    speak(task.name);
  };

  const startTimers = () => {
    tasks.forEach((task) => {
      const timer = setInterval(() => {
        setTasks((prevTasks) =>
          prevTasks.map((t) => {
            if (t.id === task.id) {
              const updatedTask = {
                ...t,
                remainingTime: Math.max(0, t.remainingTime - 1),
              };
              if (
                updatedTask.remainingTime % 2 === 0 &&
                updatedTask.remainingTime > 0
              ) {
                speakTaskName(updatedTask);
              }
              return updatedTask;
            }
            return t;
          })
        );
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        speak(`Время для задания ${task.name} истекло`);
        setMessage(`Задание "${task.name}" завершено!`);
      }, task.duration * 1000);
    });
  };

  const editTask = (task) => {
    setEditingTask(task);
    setNewTask(task.name);
    setNewDuration(task.duration.toString());
    setNewCategory(task.category);
  };

  const updateTask = () => {
    if (editingTask && newTask && newDuration) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                name: newTask,
                duration: parseInt(newDuration),
                category: newCategory,
                remainingTime: parseInt(newDuration),
              }
            : task
        )
      );
      setEditingTask(null);
      setNewTask("");
      setNewDuration("");
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div
      className={`p-4 max-w-md mx-auto ${
        darkMode ? "dark:bg-gray-800 dark:text-white" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Голосовой таймер заданий</h1>
        <div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full"
          >
            {darkMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>
          <button
            onClick={enableSound}
            className="ml-2 p-2 rounded-full bg-red-500 text-white"
          >
            {soundEnabled ? "🔊 Звук включен" : "🔇 Включить звук"}
          </button>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="7Название задания"
          className="border p-2 mr-2 dark:bg-gray-700"
        />
        <input
          type="number"
          value={newDuration}
          onChange={(e) => setNewDuration(e.target.value)}
          placeholder="Длительность (сек)"
          className="border p-2 mr-2 dark:bg-gray-700"
        />
        <Select value={newCategory} onValueChange={setNewCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="work">Работа</SelectItem>
            <SelectItem value="personal">Личное</SelectItem>
            <SelectItem value="study">Учеба</SelectItem>
          </SelectContent>
        </Select>
        <button
          onClick={editingTask ? updateTask : addTask}
          className="bg-blue-500 text-white p-2 rounded mt-2"
        >
          {editingTask ? "Обновить" : "Добавить"}
        </button>
      </div>
      <ul className="mb-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="mb-2 p-2 border rounded flex justify-between items-center"
          >
            <div>
              <span
                className={`mr-2 px-2 py-1 rounded ${
                  task.category === "work"
                    ? "bg-blue-200"
                    : task.category === "personal"
                    ? "bg-green-200"
                    : "bg-yellow-200"
                }`}
              >
                {task.category}
              </span>
              {task.name} - {task.remainingTime} сек
            </div>
            <div>
              <button onClick={() => editTask(task)} className="mr-2">
                <Edit className="h-4 w-4" />
              </button>
              <button onClick={() => deleteTask(task.id)}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={startTimers}
        className="bg-green-500 text-white p-2 rounded"
      >
        Начать таймеры
      </button>
      {message && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Уведомление</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default VoiceTimerApp;
