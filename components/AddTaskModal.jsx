import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import useTaskStore from "../store/useTaskStore";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,   
    shouldPlaySound: true,   
    shouldSetBadge: false,
  }),
});

const scheduleTaskNotification = async (taskTitle, taskDate) => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    Alert.alert('提示', '請允許通知權限，以便接收任務提醒！');
    return null;
  }
  
  const triggerDate = new Date(`${taskDate}T09:00:00`);

  if (triggerDate <= new Date()) {
    return null;
  }
 

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "📌 任務截止提醒",
      body: `別忘了！您的任務「${taskTitle}」今天到期喔！`,
      sound: true,
    },

    trigger: {
      type: 'calendar',                
      year: triggerDate.getFullYear(),
      month: triggerDate.getMonth() + 1,
      day: triggerDate.getDate(),
      hour: 9,                          
      minute: 0,                       
    },
  });

  return notificationId; 
};



export default function AddTaskModal({ editTaskData, setEditTaskData }) {
    const { isModalVisible, setModalVisible, addTask, categories, updateTask, deleteTask } = useTaskStore();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCate, setSelectedCate] = useState(null);
    const [date, setDate] = useState(new Date());
    const dropdownData = categories.map(cat => ({ label: cat, value: cat }));

    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (isModalVisible) {
            if (editTaskData) {
                setTitle(editTaskData.title || '');
                setContent(editTaskData.content || '');
                setSelectedCate(editTaskData.category || null);
                setDate(editTaskData.date ? new Date(editTaskData.date) : new Date());
            } else {
                setTitle('');
                setContent('');
                setSelectedCate(null);
                setDate(new Date());
            }
        }
    }, [isModalVisible, editTaskData]);

    const handleDelete = () => {
        if (editTaskData) {
            deleteTask(editTaskData.id);
            setModalVisible(false);
            setEditTaskData(null);
        }
    };

    const saveButton = async () => {
        if (!title || !selectedCate) return Alert.alert('提示', '請填寫標題並選擇分類');
        
        const dateString = date.toISOString().split('T')[0];
        
        let notifId = null;
        if (!editTaskData) {
            notifId = await scheduleTaskNotification(title, dateString);
        }

        const taskPayload = {
            id: editTaskData ? editTaskData.id : Date.now().toString(), // 確保新增時有 ID
            title: title,
            content: content,
            category: selectedCate,
            date: dateString,
            status: editTaskData ? editTaskData.status : '進行中',
            notificationId: notifId 
        };

        if (editTaskData) {
            updateTask(editTaskData.id, taskPayload);
        } else {
            addTask(taskPayload);
        }

        setModalVisible(false);
        setEditTaskData(null);
        setSelectedCate(null);
        setTitle('');
        setContent('');
        setDate(new Date());
    }

    if (!isModalVisible) return null;

    return (
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
            <View style={styles.Card}>
                <View style={styles.modal}>
                    <View style={styles.top}>
                        <Text style={styles.newTaskText}>新增任務</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                setEditTaskData(null);
                            }}
                            style={styles.cancelButton}>
                            <Ionicons name="close" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={{ width: '100%' }}>
                            <Text style={styles.newTaskText2}>任務標題</Text>
                            <TextInput style={styles.TaskInput} placeholder="輸入任務標題..." value={title} onChangeText={setTitle} autoFocus={true} />
                            
                            <Text style={styles.newTaskText2}>任務描述</Text>
                            <TextInput style={styles.TaskInput} placeholder="輸入任務描述..." value={content} onChangeText={setContent} />
                            
                            <Text style={styles.newTaskText2}>截止日期</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={styles.datePickerBox}
                            >
                                <Ionicons name="calendar" size={20} color="#f3acc1" />
                                <Text style={styles.dateDisplay}>
                                    {date.toISOString().split('T')[0]}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback> 

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setDate(selectedDate);
                            }}
                        />
                    )}
                    
                    <Text style={styles.newTaskText2}>選擇分類</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={dropdownData}
                        maxHeight={300}
                        labelField='label'
                        valueField="value"
                        placeholder="請選擇分類..."
                        value={selectedCate}
                        onChange={item => setSelectedCate(item.value)}
                    />
                    
                    <View style={styles.buttonGroup}>
                        {editTaskData && (
                            <TouchableOpacity
                                onPress={handleDelete}
                                style={[styles.actionButton, styles.deleteButton]}
                            >
                                <Text style={styles.addbuttonText}>刪除任務</Text>
                            </TouchableOpacity>
                        )}

                        <Pressable onPress={saveButton} style={styles.addbutton}>
                            <Text style={styles.addbuttonText}>
                                {editTaskData ? "儲存修改" : "新增任務"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

// styles 保持您原有的設定即可...

const styles = StyleSheet.create({
    Card: {
        flex: 1,
        backgroundColor: '#6666667b',
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        width: '85%',
        height: 550,
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
    },
    newTaskText: {
        fontSize: 20,
        marginLeft: 20,
        fontWeight: 'bold',
    },
    newTaskText2: {
        fontSize: 16,
        marginHorizontal: 20,
        marginVertical: 10,
        fontWeight: 'bold',
    },
    TaskInput: {
        marginLeft: 30,
    },
    addbutton: {
        marginTop: 10,
        backgroundColor: '#f3acc1',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        marginHorizontal: 20,
        borderRadius: 10,
        flex: 1
    },
    addbuttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: '#fd4e4e',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        borderRadius: 10,
        flex: 1
    },
    cancelButton: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3acc1",
        padding: 10,
        borderRadius: 999,
        marginRight: 20,
    },
    dropdown: {
        marginHorizontal: 30,
        marginVertical:5,
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    buttonGroup: {
        marginTop: 20,
        flexDirection: 'row'
    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 30,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    datePickerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        marginHorizontal: 20,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    dateDisplay: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
});
