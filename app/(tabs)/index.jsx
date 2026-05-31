import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, Modal } from "react-native";
import AddTaskModal from "../../components/AddTaskModal";
import Button from "../../components/Button";
import useTaskStore from "../../store/useTaskStore";
import { useFocusEffect } from "expo-router";
import { auth } from "../../firebaseConfig";
import ScannerScreen from './ScannerScreen';

export default function Index() {
 
  const { tasks, filterStatus, setFilterStatus, toggleTaskStatus, setModalVisible, listenToTasks } = useTaskStore();
  const [editTaskData, setEditTaskData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

 
  const filterTask = tasks.filter(task => {
    const currentStatus = task.status || '進行中';
    if (filterStatus === '全部') return true;
    return currentStatus === filterStatus;
  });

  
  useEffect(() => {
    let unsubscribeFromFirestore = () => {};
    const unsubscribeFromAuth = auth.onAuthStateChanged((user) => {
      if (unsubscribeFromFirestore) unsubscribeFromFirestore();

      if (user) {
        console.log("目前的 UID 為:", user.uid);
        unsubscribeFromFirestore = listenToTasks(user.uid);
      }
    });

    return () => {
      if (unsubscribeFromAuth) unsubscribeFromAuth();
      if (unsubscribeFromFirestore) unsubscribeFromFirestore();
    };
  }, [listenToTasks]);


  const allCount = tasks.length;
  const activeCount = tasks.filter(task => (task.status || '進行中') === '進行中').length;
  const finishCount = tasks.filter(task => task.status === '已完成').length;

 

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        
     
        <View style={styles.missionBox}>
          <LinearGradient
            colors={['#FFD1DC', '#D1C4E9', '#a28fff']}
            style={styles.missionBox}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
   
            <View style={styles.headerRow}>
              <Text style={styles.missionText}>我的任務</Text>
              <TouchableOpacity 
                style={styles.cameraButton} 
                onPress={() => setShowScanner(true)}
              >
                <Ionicons name="camera-outline" size={26} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.missionState}>
              <View style={styles.missionStateBox}>
                <Text style={styles.missionStateNum}>{allCount}</Text>
                <Text style={styles.missionStateBoxText}>全部</Text>
              </View>
              <View style={styles.missionStateBox}>
                <Text style={styles.missionStateNum}>{activeCount}</Text>
                <Text style={styles.missionStateBoxText}>進行中</Text>
              </View>
              <View style={styles.missionStateBox}>
                <Text style={styles.missionStateNum}>{finishCount}</Text>
                <Text style={styles.missionStateBoxText}>已完成</Text>
              </View>
            </View>
          </LinearGradient>
        </View>


        <View style={styles.tabContainer}>
          {['全部', '進行中', '已完成'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.tabButton, filterStatus === status && styles.activeTab]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[styles.tabText, filterStatus === status && styles.activeTabText]}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={styles.listContainer} 
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filterTask.map((item) => (
            <View key={item.id} style={styles.taskCard}>
              <TouchableOpacity
                onPress={() => toggleTaskStatus(item.id)}
                style={styles.taskcheck}
              >
                <Ionicons
                  name={item.status === '已完成' ? "checkmark-circle" : "ellipse-outline"}
                  size={28}
                  color={item.status === '已完成' ? "#a28fffdc" : "#f3acc1"}
                />
              </TouchableOpacity>
              
              <View style={styles.taskText}>
                <Text style={[styles.taskTitle, item.status === '已完成' && styles.finishTask]}>{item.title}</Text>
                {item.content ? <Text style={styles.taskContent}>{item.content}</Text> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.taskDetailTag}>#{item.category}</Text>
                  <Text style={styles.taskDetailDate}> 截止日期：{item.date} </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editbutton}
                onPress={() => {
                  setEditTaskData(item);
                  setModalVisible(true);
                }}
              >
                <Ionicons name="create-outline" size={24} color="#f3acc1" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <AddTaskModal editTaskData={editTaskData} setEditTaskData={setEditTaskData} />
        <Button setEditTaskData={setEditTaskData} />

      
        <Modal
          visible={showScanner}
          animationType="slide"
          onRequestClose={() => setShowScanner(false)}
        >
          <ScannerScreen onClose={() => setShowScanner(false)} />
        </Modal>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 30,
  },
  missionBox: {
    backgroundColor: "#ffffff00",
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  missionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  cameraButton: {
    position: 'absolute',
    right: 15,
  },
  missionState: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 15,
  },
  missionStateBox: {
    width: "28%",
    height: 80,
    backgroundColor: "#ffffff58",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  missionStateNum: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  missionStateBoxText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#ffd1dc',
  },
  activeTab: {
    backgroundColor: '#a28fffdc',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 50,
  },
  taskCard: {
    backgroundColor: "#fff",
    borderColor: '#ababab',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 15,
    paddingRight: 15,
    paddingLeft: 10,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskText: {
    marginLeft: 10,
    width: '80%',
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  finishTask: {
    textDecorationLine: 'line-through',
    color: '#bbb',
  },
  taskContent: {
    marginVertical: 5,
    color: '#666',
    fontSize: 16,
  },
  taskDetailTag: {
    color: '#2c2a39',
    backgroundColor: '#ffe1e8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginTop: 5,
    fontWeight: 'bold',
  },
  taskDetailDate: {
    marginLeft: 5,
    color: '#2c2a39',
    backgroundColor: '#d6cffc',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginTop: 5,
    fontWeight: 'bold',
  },
  taskcheck: {
    justifyContent: 'center'
  },
  editbutton: {
    justifyContent: 'center'
  }
});
