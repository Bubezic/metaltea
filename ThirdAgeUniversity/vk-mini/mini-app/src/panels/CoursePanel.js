import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Div,
  Title,
  Text,
  Button,
  Progress,
  Card,
  Snackbar,
  ScreenSpinner
} from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import { coursesData, lessonTypes } from '../data';
import { saveProgress, getCourseProgress, saveAchievement } from '../storage';
import bridge from '@vkontakte/vk-bridge';
import Simulator from '../components/Simulator';

const CoursePanel = ({ id, goToPanel, courseId }) => {
  const course = coursesData.find(c => c.id === parseInt(courseId));
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [simulatorProgress, setSimulatorProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [popout, setPopout] = useState(null);
  const [lessonHistory, setLessonHistory] = useState([]);

  // Загрузка прогресса при монтировании
  useEffect(() => {
    const progress = getCourseProgress(courseId);
    setCurrentLessonIndex(progress.lessonIndex || 0);
    setUserAnswers(progress.results || {});
    setLessonHistory([progress.lessonIndex || 0]);
  }, [courseId]);

  if (!course) {
    return (
      <Panel id={id}>
        <PanelHeader>Курс не найден</PanelHeader>
        <Button onClick={() => goToPanel('catalog')}>Вернуться в каталог</Button>
      </Panel>
    );
  }

  const currentLesson = course.lessons[currentLessonIndex];
  const progressPercentage = ((currentLessonIndex + 1) / course.lessons.length) * 100;
  const isCourseCompleted = currentLessonIndex >= course.lessons.length;

  const handleLessonComplete = () => {
    const newLessonIndex = currentLessonIndex + 1;
    saveProgress(courseId, newLessonIndex, userAnswers);
    setLessonHistory(prev => [...prev, newLessonIndex]);
    
    if (newLessonIndex >= course.lessons.length) {
      saveAchievement(`course_completed_${courseId}`);
      setShowSuccess(true);
    }
    
    setCurrentLessonIndex(newLessonIndex);
    setSimulatorProgress(0);
  };

  const handleTestAnswer = (answerIndex, isCorrect) => {
    const newAnswers = {
      ...userAnswers,
      [currentLesson.id]: {
        answer: answerIndex,
        correct: isCorrect,
        timestamp: new Date().toISOString()
      }
    };
    setUserAnswers(newAnswers);
    saveProgress(courseId, currentLessonIndex, newAnswers);

    if (isCorrect) {
      handleLessonComplete();
    }
  };

  const resetCourseProgress = () => {
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    delete progress[courseId];
    localStorage.setItem('userProgress', JSON.stringify(progress));
    
    setCurrentLessonIndex(0);
    setUserAnswers({});
    setSimulatorProgress(0);
    setLessonHistory([0]);
    setShowSuccess(false);
  };

  const shareCourseSuccess = async () => {
    setPopout(<ScreenSpinner />);
    
    try {
      const message = `🎉 Я завершил(а) курс "${course.title}" в Университете третьего возраста!

📚 Пройдено уроков: ${course.lessons.length}
⭐ Сложность: ${course.difficulty}
🏆 Категория: ${course.category}

${course.description}

Присоединяйтесь к обучению! 🎓`;

      // Публикация на стене
      const result = await bridge.send('VKWebAppShowWallPostBox', {
        message: message
      });
      
      if (result.post_id) {
        bridge.send('VKWebAppShowNotification', {
          message: 'Ваш успех опубликован!'
        });
      }
    } catch (error) {
      console.error('Ошибка публикации:', error);
      bridge.send('VKWebAppShowNotification', {
        message: 'Не удалось опубликовать'
      });
    } finally {
      setPopout(null);
    }
  };

  const shareWithFriend = async () => {
    setPopout(<ScreenSpinner />);
    
    try {
      const friends = await bridge.send('VKWebAppGetFriends', {
        multi: false,
        count: 30,
        fields: 'first_name,last_name'
      });
      
      const selected = await bridge.send('VKWebAppShowFriendsPicker', {
        multi: false,
        friends: friends.items.map(friend => friend.id)
      });
      
      if (selected.result && selected.users.length > 0) {
        const friend = selected.users[0];
        const message = `🎉 Я завершил(а) курс "${course.title}"!

${course.description}

Может быть, тебе тоже будет интересно? 😊`;

        await bridge.send('VKWebAppSendMessage', {
          peer_id: friend.id,
          message: message
        });
        
        bridge.send('VKWebAppShowNotification', {
          message: `Сообщение отправлено ${friend.first_name}!`
        });
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      bridge.send('VKWebAppShowNotification', {
        message: 'Не удалось отправить сообщение'
      });
    } finally {
      setPopout(null);
    }
  };

  const renderCompletionScreen = () => (
    <Div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <Title level="1" style={{ color: '#4bb34b', marginBottom: 20 }}>🎉 Поздравляем!</Title>
      <Text style={{ fontSize: '18px', marginBottom: 30 }}>
        Вы успешно завершили курс "{course.title}"!
      </Text>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px',
        maxWidth: '300px',
        margin: '0 auto'
      }}>
        <Button 
          size="l" 
          mode="commerce"
          onClick={() => goToPanel('catalog')}
        >
          📚 К другим курсам
        </Button>
        
        <Button 
          size="m" 
          mode="outline"
          onClick={shareCourseSuccess}
        >
          📢 Поделиться в ленте
        </Button>
        
        <Button 
          size="m" 
          mode="tertiary"
          onClick={shareWithFriend}
        >
          📤 Отправить другу
        </Button>
        
        <Button 
          size="m" 
          mode="secondary"
          onClick={resetCourseProgress}
        >
          🔄 Пройти еще раз
        </Button>
        
        <Button 
          size="m" 
          mode="tertiary"
          onClick={() => goToPanel('achievements')}
        >
          🏆 Мои достижения
        </Button>
      </div>
      
      <Div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: 'linear-gradient(135deg, #667eea 0%, #633a8bff 100%)', 
        borderRadius: '10px',
        textAlign: 'left',
        color: 'white'
      }}>
        <Title level="3" style={{ color: 'white' }}>📊 Статистика курса:</Title>
        <Text style={{ display: 'block', margin: '5px 0', color: 'white' }}>
          • Уроков: {course.lessons.length}
        </Text>
        <Text style={{ display: 'block', margin: '5px 0', color: 'white' }}>
          • Сложность: {course.difficulty}
        </Text>
        <Text style={{ display: 'block', margin: '5px 0', color: 'white' }}>
          • Категория: {course.category}
        </Text>
        <Text style={{ display: 'block', margin: '5px 0', color: 'white' }}>
          • Примерное время: {Math.round(course.lessons.length * 0.5)} часов
        </Text>
      </Div>
    </Div>
  );

  const renderLessonContent = () => {
    if (isCourseCompleted) {
      return renderCompletionScreen();
    }

    if (!currentLesson) {
      return <Text>Урок не найден</Text>;
    }

    switch (currentLesson.type) {
      case lessonTypes.LECTURE:
        return (
          <Div>
            <div 
              style={{ 
                fontSize: '18px', 
                lineHeight: '1.6',
                marginBottom: 20 
              }}
              dangerouslySetInnerHTML={{ __html: currentLesson.content }} 
            />
            <Button 
              size="l" 
              style={{ marginTop: 20 }}
              onClick={handleLessonComplete}
            >
              {currentLessonIndex === course.lessons.length - 1 ? 'Завершить курс' : 'Следующий урок'}
            </Button>
          </Div>
        );

      case lessonTypes.TEST:
        return (
          <Div>
            <Title level="2" style={{ marginBottom: 20 }}>
              {currentLesson.content.question}
            </Title>
            {currentLesson.content.options.map((option, index) => (
              <Button
                key={index}
                size="l"
                mode="outline"
                style={{ 
                  margin: '10px 0', 
                  display: 'block',
                  width: '100%',
                  textAlign: 'left'
                }}
                onClick={() => {
                  const isCorrect = index === currentLesson.content.correctAnswer;
                  handleTestAnswer(index, isCorrect);
                }}
              >
                {option}
              </Button>
            ))}
          </Div>
        );

      case lessonTypes.SIMULATOR:
  return (
    <Simulator
      lesson={currentLesson.content}
      onComplete={handleLessonComplete}
      onProgressUpdate={setSimulatorProgress}
      onRestart={() => {
        setSimulatorProgress(0);
        setUserAnswers(prev => ({
          ...prev,
          [currentLesson.id]: null
        }));
      }}
    />
  );

      default:
        return <Text>Тип урока не поддерживается</Text>;
    }
  };

  return (
    <Panel id={id}>
      <PanelHeader>
        {course.title} {!isCourseCompleted && `- Урок ${currentLessonIndex + 1}`}
      </PanelHeader>

      {popout}

      <Button 
        onClick={() => goToPanel('catalog')} 
        style={{ margin: 10 }}
        mode="tertiary"
      >
        ← Назад к каталогу
      </Button>

      <Group>
        {!isCourseCompleted && (
          <Progress 
            value={progressPercentage} 
            style={{ margin: 10 }} 
          />
        )}
        
        <Card style={{ margin: 10, padding: 15 }}>
          {!isCourseCompleted && currentLesson && (
            <Title level="2" style={{ marginBottom: 15 }}>
              {currentLesson.title}
            </Title>
          )}
          {renderLessonContent()}
        </Card>

        {!isCourseCompleted && (
          <Text style={{ textAlign: 'center', padding: 10, color: '#6d7885' }}>
            Урок {currentLessonIndex + 1} из {course.lessons.length}
          </Text>
        )}
      </Group>

      <Snackbar
        onClose={() => setShowSuccess(false)}
        before={<div style={{ fontSize: '24px' }}>🎓</div>}
      >
        Курс успешно завершен! Достижение разблокировано!
      </Snackbar>
    </Panel>
  );
};

CoursePanel.propTypes = {
  id: PropTypes.string.isRequired,
  goToPanel: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired
};

export default CoursePanel;