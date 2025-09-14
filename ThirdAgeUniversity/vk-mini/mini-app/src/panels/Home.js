import React from 'react';
import { 
  Panel,
  PanelHeader,
  Group,
  Div,
  Title,
  Text,
  Progress,
  Card,
  Header,
  Button,
  Separator,
  SimpleCell } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { coursesData } from '../data';
import { getUserStatistics } from '../storage';



const getRecommendedCourses = (user, courses) => {
  // Простая рекомендация по сезону
  const currentSeason = new Date().getMonth() < 6 ? 'summer' : 'winter';
  return courses.filter(course => 
    course.seasonality === null || course.seasonality === currentSeason
  ).slice(0, 3);
};




export const Home = ({ id, fetchedUser, goToPanel }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const recommendedCourses = getRecommendedCourses(fetchedUser, coursesData);
  const routeNavigator = useRouteNavigator();
  
  
  
  const [userProgress, setUserProgress] = React.useState({
  completedCourses: 0,
  totalCourses: coursesData.length,
  weeklyProgress: 4,
  dailyStreak: 1,
  
});




  
React.useEffect(() => {
  const stats = getUserStatistics();
  setUserProgress(prev => ({
    ...prev,
    completedCourses: stats.completed,
    totalCourses: stats.total
  }));
}, []);


  return (
    <Panel id={id}>
      <Group>
        <Div style={{ 
          padding: '20px', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #633a8bff 100%)',
          color: 'white',
          borderRadius: '12px',
          margin: '10px'
        }}>
          <Title level="1" style={{ color: 'white', marginBottom: '10px' }}>
            Добро пожаловать!
          </Title>
          <Text style={{ color: 'white', fontSize: '18px' }}>
            Рады видеть вас снова!
          </Text>
        </Div>

        <Card style={{ margin: '10px' }}>
          <Div style={{ padding: '20px' }}>
            <Title level="2" style={{ marginBottom: '15px' }}>Ваш прогресс</Title>
            <Progress 
            value={userProgress.completionPercentage} 
            style={{ marginBottom: '15px' }} 
            />


            <Text style={{ fontSize: '18px', lineHeight: '1.6' }}>
              Пройдено курсов: {userProgress.completedCourses}/{userProgress.totalCourses}
            </Text>
            <Text style={{ fontSize: '18px', lineHeight: '1.6' }}>
              Активных дней подряд: {userProgress.dailyStreak}
            </Text>
          </Div>

          
        </Card>

        
        {/* Блок навигации */}
        <SimpleCell onClick={() => goToPanel('catalog')} style={{ fontSize: '18px' }}>
          📚 Все курсы
        </SimpleCell>
        <SimpleCell onClick={() => goToPanel('achievements')} style={{ fontSize: '18px' }}>
          🏆 Мои достижения
        </SimpleCell>
        <SimpleCell onClick={() => goToPanel('profile')} style={{ fontSize: '18px' }}>
          👤 Мой профиль
        </SimpleCell>

        <Header>Рекомендуем вам</Header>
        
    {coursesData.sort(() => Math.random() - 0.5).slice(0, 3).map(course => (
      <Card key={course.id} style={{ padding: '16px', margin: '10px' }}>
        <SimpleCell
          before={<div style={{ fontSize: '24px' }}>{course.icon}</div>}
          subtitle={course.description}
          extraSubtitle={course.seasonality ? `Сезонный курс (${course.seasonality})` : 'Круглогодичный курс'}
          after={<Button onClick={() => goToPanel('course_' + course.id)}>Начать</Button>}
        >
          {course.title}
        </SimpleCell>
      </Card>
    ))}
      </Group>
    </Panel>
  );
};

export default Home;

Home.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};
