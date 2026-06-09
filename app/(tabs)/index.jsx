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
import { useTheme } from "../../theme/ThemeContext.js";
import AnimatedCheckButton from "../../components/AnimationButton.jsx";

export default function Index() {

  const { tasks, filterStatus, setFilterStatus, toggleTaskStatus, setModalVisible, listenToTasks } = useTaskStore();
  const [editTaskData, setEditTaskData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const filterTask = tasks.filter(task => {
    const currentStatus = task.status || '進行中';
    if (filterStatus === '全部') return true;
    return currentStatus === filterStatus;
  });


  useEffect(() => {
    let unsubscribeFromFirestore = () => { };
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
      <View style={[{ flex: 1, backgroundColor: theme.bg }, styles.container]}>


        <View style={styles.missionBox}>
          <LinearGradient
            colors={theme.gradient}
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
              style={[styles.tabButton, { backgroundColor: theme.primary }, filterStatus === status && { backgroundColor: theme.second }]}
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
            <View key={item.id} style={[styles.taskCard, { backgroundColor: theme.bgl }]}>
              <AnimatedCheckButton
                isCompleted={item.status === '已完成'}
                onPress={() => toggleTaskStatus(item.id)}
              />
              <View style={[styles.taskText]}>
                <Text style={[styles.taskTitle, { color: theme.text }, item.status === '已完成' && styles.finishTask]}>{item.title}</Text>
                {item.content ? <Text style={[styles.taskContent, { color: theme.text }]}>{item.content}</Text> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.taskDetailTag, { backgroundColor: theme.primary, color: theme.text }]}>#{item.category}</Text>
                  <Text style={[styles.taskDetailDate, { backgroundColor: theme.second, color: theme.textl }]}> 截止日期：{item.date} </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.editbutton]}
                onPress={() => {
                  setEditTaskData(item);
                  setModalVisible(true);
                }}
              >
                <Ionicons name="create-outline" size={24} color="theme.primary" style={[{ marginRight: 10 }, { color: theme.primary }]} />
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

  },
  activeTab: {

  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 50,
  },
  taskCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    backgroundColor: "#fff",
    borderColor: '#ababab00',
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
    color: '#a0a0a0',
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
