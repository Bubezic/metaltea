import React, { useState } from 'react';
import {
  Card,
  Button,
  Title,
  Text,
  Div,
  Progress
} from '@vkontakte/vkui';
import PropTypes from 'prop-types';

const Simulator = ({ lesson, onComplete, onProgressUpdate, onRestart }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [stepHistory, setStepHistory] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  

  const canGoBack = stepHistory.length > 0;

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
    setStepHistory(prev => [...prev, stepIndex]);
    onProgressUpdate && onProgressUpdate(stepIndex);
    setErrorMessage(''); 
  };

  const goBack = () => {
  if (stepHistory.length <= 1) {
    
    setCurrentStep(0);
    setStepHistory([0]);
  } else {
    const newHistory = [...stepHistory];
    newHistory.pop();
    const previousStep = newHistory[newHistory.length - 1];
    
    setCurrentStep(previousStep);
    setStepHistory(newHistory);
    onProgressUpdate && onProgressUpdate(previousStep);
  }
  
  
  setErrorMessage('');
  setSelectedContact(null);
  setSelectedItem(null);
  setCorrectAnswers([]); 
};

  const handleStepComplete = () => {
    if (currentStep < lesson.steps.length - 1) {
      goToStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleContactSelect = (contact, isCorrect) => {
    if (isCorrect) {
      setSelectedContact(contact);
      setErrorMessage('');
      handleStepComplete();
    } else {
      setSelectedContact(contact);
      setErrorMessage('Попробуйте ещё раз! Нужно выбрать контакт "Внук"');
    }
  };

  const handleSafetySelect = (shoe, isCorrect) => {
  if (isCorrect) {
    // Добавляем правильный ответ в массив
    const newCorrectAnswers = [...correctAnswers, shoe.type];
    setCorrectAnswers(newCorrectAnswers);
    setErrorMessage('');
    
    // Проверяем, все ли правильные ответы выбраны
    const allCorrectShoes = lesson.shoes.filter(s => s.safe).map(s => s.type);
    const allCorrectSelected = allCorrectShoes.every(shoeType => 
      newCorrectAnswers.includes(shoeType)
    );
    
    if (allCorrectSelected) {
      setTimeout(() => {
        handleStepComplete();
      }, 1000);
    }
  } else {
    setErrorMessage(shoe.reason || 'Эта обувь не подходит для зимней прогулки');
  }
};

  const renderNavigation = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: currentStep > 0 ? 'space-between' : 'flex-end',
    marginBottom: 15,
    alignItems: 'center'
  }}>
    {currentStep > 0 && (
      <Button
        size="s"
        mode="tertiary"
        onClick={goBack}
      >
        ← Назад
      </Button>
    )}
    
    <Button
      size="s"
      mode="tertiary"
      onClick={() => {
        onRestart();
        setErrorMessage('');
        setSelectedContact(null);
        setSelectedItem(null);
        setCorrectAnswers([]);
      }}
    >
      🔄 Заново
    </Button>
  </div>
);

  const renderStepContent = () => {
    const simulatorType = lesson.type || 'default';
    
    switch (simulatorType) {
      case 'phishing':
case 'security':
  return (
    <div>
      <Text style={{ marginBottom: 20 }}>{lesson.task}</Text>
      {lesson.examples.map((example, index) => {
        const isSelected = selectedContact === example.url;
        const showResult = isSelected;
        const isCorrect = example.suspicious;
        
        return (
          <Card 
            key={index}
            style={{ 
              margin: '10px 0', 
              padding: '15px',
              border: `2px solid ${
                showResult ? 
                  (isCorrect ? '#4caf50' : '#ff5252') : 
                  '#524f4fff'
              }`,
              cursor: 'pointer',
              background: showResult ? 
                (isCorrect ? '#233123ff' : '#362c2dff') : 
                '#3a3a3aff',
              transition: 'all 0.2s ease'
            }}
            onClick={() => {
              setSelectedContact(example.url);
              
              if (example.suspicious) {
                setErrorMessage('');
                // Автопереход на следующий шаг после правильного выбора
                setTimeout(() => {
                  handleStepComplete();
                }, 500);
              } else {
                setErrorMessage('Это безопасный сайт. Ищите подозрительные элементы в адресе!');
              }
            }}
          >
            <Text style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {example.url}
            </Text>
            
            {showResult && (
              <div>
                <Text style={{ 
                  color: isCorrect ? '#4caf50' : '#ff5252',
                  fontWeight: 'bold',
                  marginTop: '8px'
                }}>
                  {isCorrect ? '✅ Подозрительный сайт' : '❌ Безопасный сайт'}
                </Text>
                {example.reason && (
                  <Text style={{ 
                    fontSize: '14px', 
                    color: isCorrect ? '#388e3c' : '#d32f2f',
                    marginTop: '5px'
                  }}>
                    {example.reason}
                  </Text>
                )}
              </div>
            )}
            
            {!showResult && (
              <Text style={{ 
                fontSize: '14px', 
                color: '#6d7885',
                fontStyle: 'italic'
              }}>
              </Text>
            )}
          </Card>
          
        );
        
      })}
      
      
      {errorMessage && (
        <Text style={{ 
          color: '#ff5252', 
          fontWeight: 'bold', 
          marginTop: '10px',
          padding: '10px',
          border: '1px solid #ff5252',
          borderRadius: '8px',
          background: '#362c2dff'
        }}>
          ❌ {errorMessage}
        </Text>
      )}
      
      {selectedContact && lesson.examples.find(e => e.url === selectedContact)?.suspicious && (
        <Text style={{ 
          color: '#4caf50', 
          fontWeight: 'bold', 
          marginTop: '10px',
          padding: '10px',
          border: '1px solid #4caf50',
          borderRadius: '8px',
          background: '#233123ff'
        }}>
          ✅ Правильно! Это фишинговый сайт
        </Text>
      )}
    </div>
  );

      case 'payment':
        return (
          <div style={{ 
            border: '1px solid #5e5d5dff', 
            padding: '20px', 
            borderRadius: '10px',
            background: '#313030ff'
          }}>
            <Title level="4">Симулятор оплаты</Title>
            <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>
              Шаг {currentStep + 1}: {lesson.steps[currentStep]}
            </Text>
            
            {currentStep === 2 && (
              <div>
                <input 
                  type="text" 
                  placeholder="Введите номер счета"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  style={{ 
                    padding: '10px', 
                    margin: '10px 0',
                    width: '100%',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                  }}
                />
              </div>
            )}
            
            {currentStep === 3 && (
              <div>
                <input 
                  type="text" 
                  placeholder="Введите код из SMS"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  style={{ 
                    padding: '10px', 
                    margin: '10px 0',
                    width: '100%',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                  }}
                />
              </div>
            )}
            
            <Button 
              onClick={handleStepComplete}
              disabled={(currentStep === 2 || currentStep === 3) && !userInput}
              style={{ marginTop: 10 }}
            >
              {currentStep < lesson.steps.length - 1 ? 'Далее' : 'Завершить'}
            </Button>
          </div>
        );

      case 'phone_call':
        return (
          <div style={{ 
            border: '1px solid #5e5e5eff', 
            padding: '20px', 
            borderRadius: '10px',
            background: '#383838ff'
          }}>
            <Title level="4">📞 Тренажер звонков</Title>
            <Text style={{ marginBottom: 15 }}>
              {lesson.steps[currentStep]}
            </Text>
            
            {currentStep === 1 && lesson.contacts && (
              <div>
                <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Выберите контакт:</Text>
                {lesson.contacts.map((contact, index) => {
                  const isCorrectContact = contact.name === 'Внук' || contact.name === 'Алексей';
                  const isSelected = selectedContact?.name === contact.name;
                  const isWrongSelection = isSelected && !isCorrectContact;
                  
                  return (
                    <Card
                      key={index}
                      style={{
                        padding: '15px',
                        margin: '10px 0',
                        cursor: 'pointer',
                        border: `2px solid ${
                          isWrongSelection ? '#ff5252' : 
                          isSelected && isCorrectContact ? '#4caf50' : 
                          '#707070ff'
                        }`,
                        background: isWrongSelection ? '#463b3cff' : 
                                   isSelected && isCorrectContact ? '#223022ff' : 
                                   '#363636ff',
                        transition: 'all 0.2s ease',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                      }}
                      onClick={() => handleContactSelect(contact, isCorrectContact)}
                    >
                      <Text weight="semibold" >{contact.name}</Text>
                      <Text style={{ color: '#b2bac4ff' }}>{contact.number}</Text>
                      <Text style={{ fontSize: '12px', color: '#c2c2c2ff', marginTop: '5px' }}>
                        {contact.relation}
                      </Text>
                      
                      {isSelected && isCorrectContact && (
                        <Text style={{ color: '#4caf50', fontWeight: 'bold', marginTop: '5px' }}>
                          ✅ Правильный выбор!
                        </Text>
                      )}
                    </Card>
                  );
                })}
                
                {errorMessage && (
                  <Text style={{ 
                    color: '#f7a7a7ff', 
                    fontWeight: 'bold', 
                    marginTop: '10px',
                    padding: '10px',
                    border: '1px solid #ff5252',
                    borderRadius: '8px',
                    background: '#3a3132ff'
                  }}>
                    ❌ {errorMessage}
                  </Text>
                )}
              </div>
            )}
            
            {currentStep !== 1 && (
              <Button 
                onClick={handleStepComplete}
                style={{ marginTop: 10 }}
              >
                {currentStep < lesson.steps.length - 1 ? 'Далее' : 'Завершить звонок'}
              </Button>
            )}
          </div>
        );

      case 'safety':
  return (
    <div style={{ 
      border: '1px solid #575757ff', 
      padding: '20px', 
      borderRadius: '10px',
      background: '#3a3a3aff'
    }}>
      <Title level="4">👟 Выбор зимней обуви</Title>
      <Text style={{ marginBottom: 15 }}>
        {lesson.steps[currentStep]}
      </Text>
      
      {currentStep === 0 && lesson.shoes && (
        <div>
          <Text style={{ 
            marginBottom: 15, 
            fontWeight: 'bold',
            color: '#dfdfdfff'
          }}>
            Выберите ВСЕ подходящие варианты обуви для зимней прогулки:
          </Text>
          
          {lesson.shoes.map((shoe, index) => {
            const isSelected = correctAnswers.includes(shoe.type);
            const showResult = isSelected;
            const isCorrect = shoe.safe;
            
            return (
              <Card
                key={index}
                style={{
                  padding: '15px',
                  margin: '12px 0',
                  cursor: isSelected ? 'default' : 'pointer',
                  border: `2px solid ${
                    showResult ? 
                      (isCorrect ? '#4caf50' : '#ff5252') : 
                      '#555555ff'
                  }`,
                  background: showResult ? 
                    (isCorrect ? '#2c3b2cff' : '#301f21ff') : 
                   '#313131ff' ,
                  transition: 'all 0.3s ease',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  opacity: isSelected && !isCorrect ? 0.6 : 1
                }}
                onClick={() => {
                  if (!isSelected) {
                    handleSafetySelect(shoe, shoe.safe);
                  }
                }}
              >
                <Text weight="semibold" style={{ fontSize: '16px' }}>
                  {shoe.type}
                </Text>
                
                {showResult && (
                  <div style={{ marginTop: '10px' }}>
                    <Text style={{ 
                      color: isCorrect ? '#4caf50' : '#ff5252',
                      fontWeight: 'bold',
                      fontSize: '15px'
                    }}>
                      {isCorrect ? '✅ БЕЗОПАСНО' : '❌ ОПАСНО'}
                    </Text>
                    
                    {shoe.reason && (
                      <Text style={{ 
                        fontSize: '14px', 
                        color: isCorrect ? '#388e3c' : '#d32f2f',
                        marginTop: '8px',
                        lineHeight: '1.4'
                      }}>
                        {isCorrect ? '✓ ' : '✗ '}{shoe.reason}
                      </Text>
                    )}
                  </div>
                )}
                
                {!showResult && (
                  <Text style={{ 
                    fontSize: '13px', 
                    color: '#9ea1a3ff',
                    fontStyle: 'italic',
                    marginTop: '5px'
                  }}>
                    Нажмите для проверки безопасности
                  </Text>
                )}
              </Card>
            );
          })}
          
          {errorMessage && (
            <Text style={{ 
              color: '#ff7c7cff', 
              fontWeight: 'bold', 
              marginTop: '15px',
              padding: '12px',
              border: '1px solid #ff5252',
              borderRadius: '8px',
              background: '#422d30ff',
              textAlign: 'center'
            }}>
              ❌ {errorMessage}
            </Text>
          )}
          
          {correctAnswers.length > 0 && (
            <Text style={{ 
              color: '#4caf50', 
              fontWeight: 'bold', 
              marginTop: '15px',
              padding: '12px',
              border: '1px solid #4caf50',
              borderRadius: '8px',
              background: '#264426ff',
              textAlign: 'center'
            }}>
              ✅ Выбрано правильных ответов: {correctAnswers.length} из {
                lesson.shoes.filter(s => s.safe).length
              }
            </Text>
          )}
        </div>
      )}
    </div>
  );

      default:
        return (
          <div>
            <Text style={{ marginBottom: 15 }}>{lesson.task}</Text>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
              Шаг {currentStep + 1}: {lesson.steps[currentStep]}
            </Text>
            <Button onClick={handleStepComplete}>
              {currentStep < lesson.steps.length - 1 ? 'Следующий шаг' : 'Завершить'}
            </Button>
          </div>
        );
    }
  };

  return (
    <Div>
      <Title level="3">{lesson.task}</Title>
      
      {renderNavigation()}
      
      {renderStepContent()}
      
      <div style={{ marginTop: 20 }}>
        <Progress value={(currentStep / lesson.steps.length) * 100} />
        <Text style={{ textAlign: 'center', color: '#6d7885', marginTop: 5 }}>
          Шаг {currentStep + 1} из {lesson.steps.length}
        </Text>
      </div>
    </Div>
  );
};

Simulator.propTypes = {
  lesson: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
  onProgressUpdate: PropTypes.func,
  onRestart: PropTypes.func
};

export default Simulator;