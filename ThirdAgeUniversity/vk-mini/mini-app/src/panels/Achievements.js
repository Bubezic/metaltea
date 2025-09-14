import React from 'react';
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  Div,
  Title,
  Text,
  CardGrid,
  Card,
  SimpleCell
} from '@vkontakte/vkui';
import PropTypes from 'prop-types';

const Achievements = ({ id, goToPanel }) => {
  const achievements = [
    { id: 1, title: "Первый шаг", earned: true, icon: "👣" },
    { id: 2, title: "Неделя обучения", earned: true, icon: "📅" },
    { id: 3, title: "Компьютерный гений", earned: false, icon: "🧠" },
    { id: 4, title: "Здоровье прежде всего", earned: false, icon: "💪" }
  ];

  return (
    <Panel id={id}>
      <PanelHeader >
        Мои достижения
      </PanelHeader>

      
      <SimpleCell onClick={() => goToPanel('home')} style={{ fontSize: '18px' }}>
          Назад
        </SimpleCell>

      <Group>
        <Div style={{ textAlign: 'center', padding: '20px' }}>
          <Title level="2">Ваши награды</Title>
          <Text style={{ fontSize: '18px', lineHeight: '1.6' }}>
            Продолжайте в том же духе!
          </Text>
        </Div>

        <CardGrid size="m" style={{ justifyContent: 'center', padding: '15px' }}>
          {achievements.map(achievement => (
            <Card
              key={achievement.id}
              style={{
                margin: '10px',
                opacity: achievement.earned ? 1 : 0.5,
                textAlign: 'center'
              }}
            >
              <Div style={{ padding: '15px' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>
                  {achievement.icon}
                </div>
                <Text style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {achievement.title}
                </Text>
              </Div>
            </Card>
          ))}
        </CardGrid>
      </Group>
    </Panel>
  );
};

Achievements.propTypes = {
  id: PropTypes.string.isRequired,
  goToPanel: PropTypes.func,
};

export default Achievements;