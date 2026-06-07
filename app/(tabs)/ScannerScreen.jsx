import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; 
import { Ionicons } from '@expo/vector-icons';
import useTaskStore from '../../store/useTaskStore'; 
import { auth, db } from '../../firebaseConfig';  
import { collection, doc, setDoc } from 'firebase/firestore';
import { useTheme } from "../../theme/ThemeContext.js";


export default function ScannerScreen({ onClose }) {
  
const { theme, isDarkMode, toggleTheme } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { addTask } = useTaskStore(); 

  
  if (!permission) {
    return <View style={styles.centerContainer}><Text>正在啟動相機...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.centerContainer,{backgroundColor:theme.bgl}]}>
        <Text style={[styles.permissionText,{color:theme.text}]}>APP 需要相機權限才能掃描任務 QR Code 喔！</Text>
        <TouchableOpacity style={[styles.permissionButton,{backgroundColor:theme.primary}]} onPress={requestPermission}>
          <Text style={[styles.permissionButtonText,{color:theme.textl}]}>授權相機權限</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }) => {
    if (scanned) return; 
    setScanned(true);

    try {
      const parsedTask = JSON.parse(data);

      if (!parsedTask.title || !parsedTask.date || !parsedTask.isSharedTask) {
        throw new Error("格式不符");
      }

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("提示", "請先登入您的帳號，行程才能儲存喔！");
        setScanned(false);
        return;
      }

     
      const newTaskId = Date.now().toString();

      const clonedTask = {
        id: newTaskId,
        title: parsedTask.title,
        content: parsedTask.content || "",
        category: parsedTask.category || "工作",
        date: parsedTask.date,
        status: "進行中", 
      };

      
      const taskRef = doc(db, 'users', user.uid, 'tasks', newTaskId);
      await setDoc(taskRef, clonedTask);

     
      addTask(clonedTask);

      Alert.alert(
        "🎉 複製成功", 
        `已成功將任務「${parsedTask.title}」存入您的行事曆！`,
        [{ text: "太棒了", onPress: () => {
          setScanned(false);
          if (onClose) onClose(); 
        }}]
      );

    } catch (error) {
      Alert.alert(
        "掃描失敗", 
        "這不是本 APP 有效的任務 QR Code，或者行程已損毀！",
        [{ text: "重試", onPress: () => setScanned(false) }]
      );
    }
  };

  return (
    <View style={styles.container}>

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      
    
      <View style={styles.overlayContainer}>
        <View style={[styles.scanTargetBox,{borderColor:theme.primary}]} />
        <Text style={styles.scanHintText}>將對焦框準對他人的任務 QR Code</Text>
      </View>

  
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  permissionText: { marginBottom: 20, textAlign: 'center', fontSize: 16,  },
  permissionButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  permissionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  scanTargetBox: {
    width: 240,
    height: 240,
    borderWidth: 3,
    borderColor: '#f3acc1', 
    backgroundColor: 'transparent',
    borderRadius: 25,
    marginBottom: 20
  },
  scanHintText: { color: 'white', fontSize: 14, fontWeight: '600' },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 25
  }
});
