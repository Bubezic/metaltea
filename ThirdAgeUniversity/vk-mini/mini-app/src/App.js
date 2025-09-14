import React,{ useState, useEffect } from 'react';
import { View, SplitLayout, SplitCol, ScreenSpinner } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';


import { Persik, Home } from './panels';
import Catalog from './panels/Catalog';
import Achievements from './panels/Achievements';
import Profile from './panels/Profile';
import CoursePanel from './panels/CoursePanel';
import CourseFilter from './panels/CourseFilter'; 

export const App = () => {
  const [activePanel, setActivePanel] = useState('home');
  const [fetchedUser, setUser] = useState();
  const [popout, setPopout] = useState(<ScreenSpinner />);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); 
  

  useEffect(() => {
     async function init() {
      try {
        await bridge.send('VKWebAppInit');
        const userData = await bridge.send('VKWebAppGetUserInfo');
        setUser(userData);
        setPopout(null); 
      } catch (error) {
        console.error('Ошибка инициализации:', error);
        setPopout(null);
      }
    }
    init();
  }, []);

   const goToPanel = (panelId, courseId = null) => {
     console.log('Navigating to:', panelId);
    if (panelId.startsWith('course_')) {
      setSelectedCourse(panelId.replace('course_', ''));
      setActivePanel('course');
    } else if (panelId.startsWith('category_')) {
      const category = panelId.replace('category_', '');
      setSelectedCategory(category);
      setActivePanel('category');

    } else {
      setActivePanel(panelId);
    }
  };


  return (
    <SplitLayout>
      <SplitCol>
        
        
        <View activePanel={activePanel}>

          <Home id="home" fetchedUser={fetchedUser} goToPanel={goToPanel} />
          
          <Catalog id="catalog"  goToPanel={goToPanel} />
          <Achievements id="achievements" goToPanel={goToPanel} />
          <Profile id="profile" fetchedUser={fetchedUser} goToPanel={goToPanel} />
           <CoursePanel 
            id="course" 
            goToPanel={goToPanel} 
            courseId={selectedCourse} 
          />
          <CourseFilter id="category" goToPanel={goToPanel} category={selectedCategory} />
          
          <Persik id="persik" />
        </View>
      </SplitCol>
      {popout}
    </SplitLayout>
    
  );
};
