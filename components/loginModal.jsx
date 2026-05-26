import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function LoginModal({ visible, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert("錯誤", "請輸入 Email 和密碼");
      return;
    }

    onLogin({ email, password });
    

    setEmail('');
    setPassword('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>歡迎回來</Text>

          <TextInput
            style={styles.input}
            placeholder="請輸入註冊的 Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="請輸入密碼"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.modalActionRow}>
            <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={onClose}>
              <Text style={styles.cancelBtnText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, styles.submitBtn]} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>登入</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
},
  modalContainer: { 
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20 
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#443d40' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ffffff', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 15, 
    backgroundColor: '#fafafa', 
    fontSize: 15 
  },
  modalActionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
 },
  modalBtn: { 
    flex: 0.46, 
    paddingVertical: 12, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  cancelBtn: { 
    backgroundColor: '#eee' 
  },
  cancelBtnText: { 
    color: '#555', 
    fontWeight: 'bold' 
  },
  submitBtn: { 
    backgroundColor: '#a28fff' 
  },
  submitBtnText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  }
});