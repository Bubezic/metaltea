import React from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Header,
  SimpleCell,
  Card,
  Button,
  Div,
  Title,
  Text
} from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import { coursesData } from '../data';

const CourseFilter = ({ id, goToPanel, category }) => {
  
  if (!category) {
    return (
      <Panel id={id}>
        <PanelHeader>
          <Header>Категория не выбрана</Header>
        </PanelHeader>
        <SimpleCell onClick={() => goToPanel('catalog')} style={{ fontSize: '18px' }}>
          ← Назад к каталогу
        </SimpleCell>
        <Group>
          <Div style={{ textAlign: 'center', padding: '40px' }}>
            <Text>Пожалуйста, выберите категорию из каталога</Text>
          </Div>
        </Group>
      </Panel>
    );
  }

  // Фильтруем курсы по выбранной категории
  const filteredCourses = coursesData.filter(course => 
    course.category === category
  );

  return (
    <Panel id={id}>
      <PanelHeader>
        <Header>Курсы: {category}</Header>
      </PanelHeader>

      <SimpleCell onClick={() => goToPanel('catalog')} style={{ fontSize: '18px' }}>
        ← Назад к каталогу
      </SimpleCell>

      <Group>
        <Header>Найдено курсов: {filteredCourses.length}</Header>
        
        {filteredCourses.length === 0 ? (
          <Div style={{ textAlign: 'center', padding: '40px' }}>
            <Title level="2">😔 Курсы не найдены</Title>
            <Text style={{ fontSize: '18px', color: '#6d7885' }}>
              В категории "{category}" пока нет доступных курсов
            </Text>
            <Button 
              style={{ marginTop: '20px' }}
              onClick={() => goToPanel('catalog')}
            >
              Вернуться к каталогу
            </Button>
          </Div>
        ) : (
          filteredCourses.map(course => (
            <Card key={course.id} style={{ padding: '16px', margin: '10px' }}>
              <SimpleCell
                before={<div style={{ fontSize: '24px' }}>{course.icon}</div>}
                subtitle={course.description}
                extraSubtitle={
                  <div>
                    <div>{course.seasonality ? `Сезонный курс (${course.seasonality})` : 'Круглогодичный курс'}</div>
                    <div>Сложность: {course.difficulty}</div>
                    <div>Уроков: {course.lessons?.length || 0}</div>
                  </div>
                }
                after={<Button onClick={() => goToPanel('course_' + course.id)}>Начать</Button>}
              >
                <Title level="3">{course.title}</Title>
              </SimpleCell>
            </Card>
          ))
        )}
      </Group>
    </Panel>
  );
};

CourseFilter.propTypes = {
  id: PropTypes.string.isRequired,
  goToPanel: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
};

export default CourseFilter;