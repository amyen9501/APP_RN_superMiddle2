import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import useTaskStore from "../store/useTaskStore";

export default function AddTaskModal({ editTaskData, setEditTaskData }) {
    const { isModalVisible, setModalVisible, addTask, categories, updateTask, deleteTask } = useTaskStore();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('工作');
    const [date, setDate] = useState(new Date());
    const [selectedCate, setSelectedCate] = useState(null);
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
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };



    const saveButton = () => {
        if (!title || !selectedCate) return alert('請填寫標題並選擇分類');
        const dateString = date.toISOString().split('T')[0];
        const taskPayload = {
            title: title,
            content: content,
            category: selectedCate,
            date: dateString
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
                    <Text style={styles.newTaskText2}>任務標題</Text>
                    <TextInput style={styles.TaskInput} placeholder="輸入任務標題..." value={title} onChangeText={setTitle} autoFocus={true} />
                    <Text style={styles.newTaskText2}>任務描述</Text>
                    <TextInput style={styles.TaskInput} placeholder="輸入任務描述..." value={content} onChangeText={setContent} autoFocus={true}/>
<Text style={styles.newTaskText}>截止日期</Text>
<TouchableOpacity 
    onPress={() => setShowDatePicker(true)} 
    style={styles.datePickerBox}
>
    <Ionicons name="calendar" size={20} color="#f3acc1" />
    <Text style={styles.dateDisplay}>
        {date.toISOString().split('T')[0]} {}
    </Text>
</TouchableOpacity>

                    { }
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

const styles = StyleSheet.create({
    Card: {
        flex: 1,
        backgroundColor: '#6666667b',
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        width: '85%',
        height: '60%',
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
        fontSize: 24,
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
        flex:1
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
        flex:1
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
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    buttonGroup: {
        marginTop: 20,
        flexDirection:'row'
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
