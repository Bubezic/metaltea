import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Div,
  Title,
  Text,
  SimpleCell,
  Header,
  Avatar,
  Progress,
  Button,
  ScreenSpinner
} from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import { getUserStatistics, getCompletedCourses } from '../storage';
import { coursesData } from '../data';
import bridge from '@vkontakte/vk-bridge';

const Profile = ({ id, goToPanel, fetchedUser }) => {
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    inProgress: 0,
    completionPercentage: 0
  });
  const [completedCourses, setCompletedCourses] = useState([]);
  const [popout, setPopout] = useState(null);

  useEffect(() => {
    const statistics = getUserStatistics();
    setStats(statistics);
    
    const completedIds = getCompletedCourses();
    const completed = coursesData.filter(course => 
      completedIds.includes(course.id.toString())
    );
    setCompletedCourses(completed);
  }, []);

  const shareWithFriends = async () => {
    setPopout(<ScreenSpinner />);
    
    try {
      // Получаем список друзей
      const friends = await bridge.send('VKWebAppGetFriends', {
        multi: false,
        count: 50,
        fields: 'photo_100,first_name,last_name'
      });
      
      // Показываем список друзей для выбора
      const selectedFriend = await bridge.send('VKWebAppShowFriendsPicker', {
        multi: false,
        friends: friends.items.map(friend => friend.id)
      });
      
      if (selectedFriend.result && selectedFriend.users.length > 0) {
        const friend = selectedFriend.users[0];
        const message = createShareMessage(stats, completedCourses, fetchedUser);
        
        // Отправляем сообщение
        await bridge.send('VKWebAppSendMessage', {
          peer_id: friend.id,
          message: message
        });
        
        // Показываем уведомление об успехе
        await bridge.send('VKWebAppShowNotification', {
          message: `Статистика отправлена ${friend.first_name} ${friend.last_name}!`
        });
      }
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      await bridge.send('VKWebAppShowNotification', {
        message: 'Не удалось отправить статистику'
      });
    } finally {
      setPopout(null);
    }
  };

  const createShareMessage = (stats, courses, user) => {
    const completedList = courses.map(course => `• ${course.title}`).join('\n');
    
    return `🎓 Моя статистика обучения в "Университете третьего возраста":
    
📊 Прогресс: ${stats.completed}/${stats.total} курсов (${stats.completionPercentage}%)
✅ Завершено: ${stats.completed} курсов
📚 В процессе: ${stats.inProgress} курсов

🏆 Завершенные курсы:
${completedList || 'Пока нет завершенных курсов'}

Присоединяйся тоже! 🎉`;
  };

  const quickShare = async () => {
    setPopout(<ScreenSpinner />);
    
    try {
      const message = createShareMessage(stats, completedCourses, fetchedUser);
      
      // Предлагаем поделиться в ленту или сообщения
      const result = await bridge.send('VKWebAppShowWallPostBox', {
        message: message,
        attachments: 'https://vk.com/app54141031'
      });
      
      if (result.post_id) {
        await bridge.send('VKWebAppShowNotification', {
          message: 'Статистика опубликована на вашей стене!'
        });
      }
    } catch (error) {
      console.error('Ошибка быстрой публикации:', error);
    } finally {
      setPopout(null);
    }
  };

  return (
    <Panel id={id}>
      <PanelHeader>Мой профиль</PanelHeader>

      {popout}

      <SimpleCell onClick={() => goToPanel('home')} style={{ fontSize: '18px' }}>
        ← Назад на главную
      </SimpleCell>

      <Group>
        <Div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            {fetchedUser && fetchedUser.photo_200 ? (
              <Avatar 
                src={fetchedUser.photo_200} 
                size={96}
                style={{ 
                  border: '4px solid #fff',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              />
            ) : (
              <div style={{ 
                fontSize: '60px', 
                color: '#99a2ad'
              }}>
                👴
              </div>
            )}
          </div>
          
          <Title level="2">
            {fetchedUser ? `${fetchedUser.first_name} ${fetchedUser.last_name}` : 'Загрузка...'}
          </Title>
          
          <Text style={{ fontSize: '18px', lineHeight: '1.6', color: '#6d7885' }}>
            Учится с {new Date().getFullYear()}
          </Text>
        </Div>
        
        <Header>Статистика обучения</Header>
        <Div>
          <Progress 
            value={stats.completionPercentage} 
            style={{ marginBottom: 15 }}
          />
          <Text style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: 5 }}>
            🎓 Пройдено курсов: {stats.completed}/{stats.total}
          </Text>
          <Text style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: 5 }}>
            📚 В процессе: {stats.inProgress}
          </Text>
          <Text style={{ fontSize: '18px', lineHeight: '1.6' }}>
            ✅ Общий прогресс: {stats.completionPercentage}%
          </Text>


          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button 
              size="l" 
              mode="outline"
              onClick={shareWithFriends}
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
            >
              📤 Поделиться с другом
            </Button>
            
            <Button 
              size="m" 
              mode="tertiary"
              onClick={quickShare}
            >
              📢 Поделиться в ленте
            </Button>
          </div>
        </Div>
        
        {completedCourses.length > 0 && (
          <>
            <Header>Завершенные курсы</Header>
            {completedCourses.map(course => (
              <SimpleCell
                key={course.id}
                before={<div style={{ fontSize: '24px' }}>{course.icon}</div>}
                subtitle={course.category}
                style={{ fontSize: '18px' }}
              >
                {course.title}
              </SimpleCell>
            ))}
          </>
        )}

        <Header>Настройки</Header>
        <SimpleCell style={{ fontSize: '18px' }}>
          🔍 Увеличить шрифт
        </SimpleCell>
        <SimpleCell style={{ fontSize: '18px' }}>
          🔊 Звуковые уведомления
        </SimpleCell>
        <SimpleCell style={{ fontSize: '18px' }}>
          ❓ Помощь и поддержка
        </SimpleCell>
      </Group>
    </Panel>
  );
};

Profile.propTypes = {
  id: PropTypes.string.isRequired,
  goToPanel: PropTypes.func,
  fetchedUser: PropTypes.object
};

export default Profile;