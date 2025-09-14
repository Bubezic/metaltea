// src/storage.js
import { coursesData } from './data';

// Сохранить прогресс пользователя
export const saveProgress = (courseId, lessonIndex, results = {}) => {
  const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
  progress[courseId] = { 
    lessonIndex, 
    results,
    lastAccessed: new Date().toISOString()
  };
  localStorage.setItem('userProgress', JSON.stringify(progress));
};

// Загрузить весь прогресс
export const loadProgress = () => {
  return JSON.parse(localStorage.getItem('userProgress') || '{}');
};

// Получить прогресс по конкретному курсу
export const getCourseProgress = (courseId) => {
  const progress = loadProgress();
  return progress[courseId] || { lessonIndex: 0, results: {} };
};

// Получить список завершенных курсов
export const getCompletedCourses = () => {
  const progress = loadProgress();
  return Object.keys(progress).filter(courseId => {
    const course = coursesData.find(c => c.id === parseInt(courseId));
    return course && progress[courseId].lessonIndex >= course.lessons.length;
  });
};

// Получить общую статистику
export const getUserStatistics = () => {
  const progress = loadProgress();
  const completed = getCompletedCourses().length;
  const total = coursesData.length;
  const inProgress = Object.keys(progress).length - completed;
  
  return {
    completed,
    total,
    inProgress,
    completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
  };
};

// Сохранить достижения
export const saveAchievement = (achievementId) => {
  const achievements = JSON.parse(localStorage.getItem('userAchievements') || '[]');
  if (!achievements.includes(achievementId)) {
    achievements.push(achievementId);
    localStorage.setItem('userAchievements', JSON.stringify(achievements));
  }
};

// Получить все достижения
export const getAchievements = () => {
  return JSON.parse(localStorage.getItem('userAchievements') || '[]');
};