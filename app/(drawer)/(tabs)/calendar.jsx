import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native'; 
import { Calendar, LocaleConfig } from 'react-native-calendars';
import useTaskStore from "../../../store/useTaskStore";
import QRCode from 'react-native-qrcode-svg'; // 確保這行有加上
899

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
  const [modalVisible, setModalVisible] = useState(false);
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

   // ✨ 修正：將變數作用域移入或正確宣告
  const generateIcsString = useMemo(() => {
    const currentTasks = taskData[selected] || [];
    if (currentTasks.length === 0) return "";

    // 格式化日期：將 2026-05-20 轉成 20260520
    const formattedDate = selected.replace(/-/g, '');

    let icsString = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//YourApp//Calendar//ZH\n";
    
    // 確保這裡正確讀取到外面的 formattedDate
    currentTasks.forEach((task) => {
      icsString += "BEGIN:VEVENT\n";
      icsString += `SUMMARY:${task.title} [${task.category}]\n`; 
      icsString += `DTSTART;VALUE=DATE:${formattedDate}\n`;     
      icsString += `DTEND;VALUE=DATE:${formattedDate}\n`;       
      icsString += `DESCRIPTION:狀態: ${task.status}\n`;         
      icsString += "END:VEVENT\n";
    });
    
    icsString += "END:VCALENDAR";
    return icsString;
  }, [selected, taskData]);

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
          {/* ✨ 新增：標題欄位加上「分享 QR」按鈕 */}
          <View style={styles.titleContainer}>
            <Text style={styles.listTitle}>{selected} 的任務</Text>
            {taskData[selected] && taskData[selected].length > 0 && (
              <TouchableOpacity 
                style={styles.shareButton} 
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.shareButtonText}>分享此日 QR</Text>
              </TouchableOpacity>
            )}
          </View>

         {taskData[selected] ? (
            taskData[selected].map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  {/* 修正：原本變數寫成 styles.listTitleText 但樣式表裡沒有，改用 styles.taskTitleText */}
                  <Text style={[
                    styles.taskTitleText, 
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

      {/* ✨ 新增：彈出視窗（Modal）用來顯示 QR Code */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>分享 {selected} 的行程</Text>
            <Text style={styles.modalSubtitle}>讓其他人用手機相機掃描，即可加入行事曆</Text>
            
            {/* 渲染 QR Code 元件 */}
            {generateIcsString ? (
              <View style={styles.qrContainer}>
                <QRCode
                  value={generateIcsString}
                  size={200}
                  color="black"
                  backgroundColor="white"
                />
              </View>
            ) : null}

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  // ✨ 新增：標題排列樣式
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#f3acc1',
    marginBottom: 0, // 覆蓋原本的 marginBottom 讓按鈕對齊
  },
  // ✨ 新增：分享按鈕樣式
  shareButton: {
    backgroundColor: '#f3acc1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  
  // ✨ 新增：彈窗樣式表
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
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