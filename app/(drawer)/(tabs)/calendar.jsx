import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import useTaskStore from "../../../store/useTaskStore";


LocaleConfig.locales['zh'] = {
  monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
  dayNamesShort: ['日','一','二','三','四','五','六'],
  today: "今日"
};
LocaleConfig.defaultLocale = 'zh';

export default function CalendarScreen() {
 


const {tasks}= useTaskStore();
 
  const today = new Date().toISOString().split('T')[0]; 
  const [selected, setSelected] = useState(today);

    const taskData = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const date = task.date;
      if (date && date !== '無') {
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(task); 
      }
      return acc;
    }, {});
  }, [tasks]);



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
          <Calendar
            onDayPress={day => setSelected(day.dateString)}
            markedDates={{
              ...Object.keys(taskData).reduce((acc, date) => {
                acc[date] = { marked: true, dotColor: '#f3acc1' };
                return acc;
              }, {}),
              [selected]: { 
                selected: true, 
                selectedColor: '#f3acc1', 
                selectedTextColor: 'white' 
              }
            }}
            theme={{
              todayTextColor: '#f3acc1',
              arrowColor: '#f3acc1',
              textMonthFontWeight: 'bold',
            }}
          />
        </View>

        <View style={styles.taskCard}>
          <Text style={styles.listTitle}>{selected} 的任務</Text>

         {taskData[selected] ? (
            taskData[selected].map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Text style={[
                    styles.listTitleText, 
                    task.status === '已完成' && styles.completedText
                  ]}>
                    • {task.title}
                  </Text>
                  <Text style={styles.categoryTag}>#{task.category}</Text>
                </View>
                <Text style={[
                   styles.statusTag, 
                   { backgroundColor: task.status === '已完成' ? '#d1c4e9' : '#ffd1dc' }
                ]}>
                  {task.status}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.noTaskText}>這天目前沒有安排任務 ☕</Text>
            </View>
          )}
        </View>
         
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { padding: 20 },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    minHeight: 120,
    elevation: 4,
  },
  listTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    color: '#f3acc1' 
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
  },
  taskInfo: { flex: 1 },
  taskTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#bbb',
  },
  categoryTag: {
    fontSize: 12,
    color: '#a28fff',
    marginTop: 4,
  },
  statusTag: {
    fontSize: 11,
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
    fontWeight: 'bold',
  },
  emptyBox: { alignItems: 'center', marginTop: 20 },
  noTaskText: { color: '#999', fontSize: 16 },
});
