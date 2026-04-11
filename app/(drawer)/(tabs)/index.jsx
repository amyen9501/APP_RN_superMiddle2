import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AddTaskModal from "../../../components/AddTaskModal";
import Button from "../../../components/Button";
import useTaskStore from "../../../store/useTaskStore";


export default function Index() {
  const { tasks, filterStatus, setFilterStatus, toggleTaskStatus,setModalVisible } = useTaskStore();
  const [editTaskData, setEditTaskData] = useState(null);
  const filterTask = tasks.filter(task => {
    if (filterStatus === '全部') return true;
    return task.status === filterStatus;
  })

  const allCount = tasks.length;
  const activeCount = tasks.filter(task => task.status === '進行中').length;
  const finishCount = tasks.filter(task => task.status === '已完成').length;

  return (
    <View style={styles.container}>
      <View style={styles.missionBox}>
        <LinearGradient
          colors={['#FFD1DC', '#D1C4E9', '#a28fff']}
          style={styles.missionBox}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <Text style={styles.missionText}>我的任務</Text>
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
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.listContainer} showsHorizontalScrollIndicator={false}>
        {filterTask.map((item) => (
          <View key={item.id} style={styles.taskCard}>
            <TouchableOpacity
              onPress={() => toggleTaskStatus(item.id)}>
              <Ionicons
                name={item.status === '已完成' ? "checkmark-circle" : "ellipse-outline"}
                size={28}
                color={item.status === '已完成' ? "#a28fffdc" : "#f3acc1"}
              />
            </TouchableOpacity>
            <View style={styles.taskText}>
              <Text style={[styles.taskTitle, item.status === '已完成' && styles.finishTask]}>{item.title}</Text>
              {item.content ? <Text style={styles.taskContent}>{item.content}</Text> : null}
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={styles.taskDetailTag}>#{item.category}</Text>
                <Text style={styles.taskDetailDate}> 截止日期：{item.date} </Text>
              </View>

            </View>
            <TouchableOpacity 
            style={styles.editbutton}
            onPress={() => {
              setEditTaskData(item);
              setModalVisible(true);
            }}>
              <Ionicons name="create-outline" size={24} color="#f3acc1" style={{ marginRight: 10 }} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <AddTaskModal
        editTaskData={editTaskData}
        setEditTaskData={setEditTaskData} />
      <Button setEditTaskData={setEditTaskData}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    //alignItems: "center",
    justifyContent: "center",
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 20,
  },
  missionBox: {
    backgroundColor: "#ffffff00",
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  missionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  missionState: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 20,
  },
  missionStateBox: {
    width: "28%",
    height: "90%",
    backgroundColor: "#ffffff58",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  missionStateNum:{
    color:'white',
    fontWeight:'bold',
    fontSize:30,
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
    paddingHorizontal: 10,
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
    padding: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
  },
  taskText:{
    marginLeft: 10,
    width:'80%',
    //backgroundColor:'#c0c0c0',
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  taskContent:{
    marginVertical:5,
    color: '#666',
    fontSize: 16,
  },
  taskDetailTag: {
    color:'#2c2a39',
    backgroundColor:'#ffe1e8',
    paddingVertical:4,
    paddingHorizontal:8,
    borderRadius:20,
    marginTop: 5,
    fontWeight:'bold',
  },
  taskDetailDate: {
    marginLeft:5,
    color:'#2c2a39',
    backgroundColor:'#d6cffc',
    paddingVertical:4,
    paddingHorizontal:8,
    borderRadius:20,
    marginTop: 5,
    fontWeight:'bold',
  },
  editbutton:{

  },

});
