import bridge from '@vkontakte/vk-bridge';

export const shareStatistics = async (stats, completedCourses, user) => {
  try {
    
    const message = `🎓 Моя статистика обучения в "Университете третьего возраста":
    
📊 Прогресс: ${stats.completed}/${stats.total} курсов (${stats.completionPercentage}%)
✅ Завершено: ${stats.completed} курсов
📚 В процессе: ${stats.inProgress} курсов

${completedCourses.length > 0 ? `🏆 Завершенные курсы:\n${completedCourses.map(c => `• ${c.title}`).join('\n')}` : '🎯 Только начинаю обучение!'}

Присоединяйся тоже! 🎉`;


    const friends = await bridge.send('VKWebAppGetFriends', {
      multi: false,
      count: 20,
      fields: 'first_name,last_name'
    });

    const result = await bridge.send('VKWebAppShowFriendsPicker', {
      multi: false,
      friends: friends.items.map(f => f.id)
    });

    if (result.result && result.users.length > 0) {
      await bridge.send('VKWebAppSendMessage', {
        peer_id: result.users[0].id,
        message: message
      });
      
      return { success: true, friend: result.users[0] };
    }
    
    return { success: false, error: 'Друг не выбран' };
  } catch (error) {
    console.error('Share error:', error);
    return { success: false, error: error.message };
  }
};