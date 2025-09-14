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

const Catalog = ({ id, goToPanel }) => {
  const categories = [
    'Компьютерная грамотность',
    'Здоровье',
    'Финансовая грамотность',
    'Психология',
    'Искусствоведение',
    'Юридическая грамотность',
    'Краеведение'
  ];

  return (
    <Panel id={id}>
      <PanelHeader>
        <Header>Каталог курсов</Header>
      </PanelHeader>

        <SimpleCell onClick={() => goToPanel('home')} style={{ fontSize: '18px' }} >
          Назад
        </SimpleCell>

      <Group>
         <div style={{ 
    textAlign: 'center', 
    padding: '16px 12px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#e4e4e4ff',
    borderBottom: '3px solid #555555ff'
  }}>
    Все категории
  </div>
  
        {categories.map(category => (
          <SimpleCell
            key={category}
            style={{ fontSize: '18px' }}
            onClick={() => goToPanel('category_' + category)} 
          >
            {category}
          </SimpleCell>
        ))}
        <div style={{ 
    textAlign: 'center', 
    padding: '16px 12px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#e4e4e4ff',
    borderBottom: '3px solid #555555ff'
  }}>
    Все курсы
  </div>
        {coursesData.map(course => (
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

Catalog.propTypes = {
  id: PropTypes.string.isRequired,
  goToPanel: PropTypes.func.isRequired,
};

export default Catalog;