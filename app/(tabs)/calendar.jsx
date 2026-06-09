import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native'; 
import { Calendar, LocaleConfig } from 'react-native-calendars';
import useTaskStore from '../../store/useTaskStore';
import QRCode from 'react-native-qrcode-svg'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeContext.js";

LocaleConfig.locales['zh'] = {
  monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
  dayNamesShort: ['日','一','二','三','四','五','六'],
  today: "今日"
};
LocaleConfig.defaultLocale = 'zh';

export default function CalendarScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { tasks } = useTaskStore();
  const today = new Date().toISOString().split('T')[0]; 
  const [selected, setSelected] = useState(today);
  const [modalVisible, setModalVisible] = useState(false);
  

  const [activeShareTask, setActiveShareTask] = useState(null);

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

  const generateTaskJsonString = useMemo(() => {
    if (!activeShareTask) return "";
    
   
    const sharedData = {
      title: activeShareTask.title,
      content: activeShareTask.content || "",
      category: activeShareTask.category || "工作",
      date: activeShareTask.date, 
      status: "進行中", 
      isSharedTask: true 
    };
    
    return JSON.stringify(sharedData);
  }, [activeShareTask]);

  return (
    <View style={[styles.container,{backgroundColor:theme.bg}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={[styles.card,{backgroundColor:theme.bgl,borderWidth: isDarkMode ? 0 : 1, borderColor: isDarkMode ? '#00000000' : '#2929292b'}]}>
          <Calendar style={{backgroundColor: theme.bgl}}
            onDayPress={day => setSelected(day.dateString)}
            markedDates={{
              ...Object.keys(taskData).reduce((acc, date) => {
                acc[date] = { marked: true, dotColor: theme.second};
                return acc;
              }, {}),
              [selected]: { 
                selected: true, 
                selectedColor: theme.primary, 
                selectedTextColor: theme.text
              }
            }}
            theme={{
              todayTextColor: theme.second,
              arrowColor: theme.primary,
               calendarBackground: theme.bgl,
  dayTextColor: theme.text,
  monthTextColor: theme.text,
  textSectionTitleColor: theme.text,
  arrowColor: theme.primary,
  selectedDayBackgroundColor: theme.primary,
  selectedDayTextColor: theme.text,
  textDisabledColor: "#a0a0a0",
            }}
          />
        </View>

        <View style={[styles.taskCard,{backgroundColor:theme.bgl,borderWidth: isDarkMode ? 0 : 1, borderColor: isDarkMode ? '#00000000' : '#2929292b'}]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.listTitle,{color:theme.primary}]}>{selected} 的任務</Text>
          
          </View>

         {taskData[selected] ? (
            taskData[selected].map((task) => (
              <View key={task.id} style={[styles.taskItem,{backgroundColor:theme.bg,borderWidth: isDarkMode ? 0 : 1,borderColor: isDarkMode ? '#00000000' : '#2929292b'}]}>
                <View style={[styles.taskInfo]}>
                  <Text style={[
                    styles.taskTitleText,{color:theme.text},
                    task.status === '已完成' && styles.completedText
                  ]}>
                    • {task.title}
                  </Text>
                  <Text style={[styles.categoryTag,{color:theme.second}]}>#{task.category}</Text>
                </View>

          
                <TouchableOpacity 
                  style={styles.qrItemButton}
                  onPress={() => {
                    setActiveShareTask(task); 
                    setModalVisible(true);   
                  }}
                >
                  <Ionicons name="qr-code-outline" size={24} color={theme.second} />
                </TouchableOpacity>

                <Text style={[
                   styles.statusTag, 
                   { backgroundColor: task.status === '已完成' ? theme.second:theme.primary }
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setActiveShareTask(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent,{backgroundColor:theme.bgl}]}>
            {activeShareTask && (
              <>
                <Text style={[styles.modalTitle,{color:theme.text}]}>分享任務：{activeShareTask.title}</Text>
                <Text style={[styles.modalSubtitle,{color:theme.text}]}>請使用我們 APP 內建的相機掃描，即可一鍵複製此行程</Text>
                
                {generateTaskJsonString ? (
                  <View style={styles.qrContainer}>
                    <QRCode
                      value={generateTaskJsonString} 
                      size={200}
                      color="black"
                      backgroundColor="white"
                    />
                  </View>
                ) : null}
              </>
            )}

            <TouchableOpacity 
              style={[styles.closeButton,{ backgroundColor: theme.bg}]} 
              onPress={() => {
                setModalVisible(false);
                setActiveShareTask(null);
              }}
            >
              <Text style={[styles.closeButtonText,{color:theme.text}]}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1},
  scrollContent: { padding: 20},
  card: {
   
    borderRadius: 15,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
    marginTop: 15,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    minHeight: 120,
    elevation: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginLeft:10,
    marginTop:10
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#eeeeee00',
    marginBottom: 10,
  },
  taskInfo: { flex: 1 },
  taskTitleText: {
    fontSize: 16,
    fontWeight: '600',
  
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#a0a0a0',
  },
  categoryTag: {
    fontSize: 12,
    marginTop: 4,
    left: 10,
  },
 
  qrItemButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  noTaskText: { color: '#999', fontSize: 16 },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  emptyBox: { 
    alignItems: 'center', 
    marginTop:5,
    marginBottom:15
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
 
  closeButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '600',
  },
});
