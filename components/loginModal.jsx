import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext.js";

export default function LoginModal({ visible, onClose, onLogin }) {
   const { theme, isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

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
        <View style={[styles.modalContainer,{backgroundColor: theme.bgl}]}>
          <Text style={[styles.modalTitle,{color: theme.text}]}>登入帳號</Text>

          <TextInput
            style={styles.input}
             backgroundColor={theme.bg}
                color={theme.text}
                placeholderTextColor={theme.second} 
            placeholder="請輸入註冊的 Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.passwordContainer}
                        backgroundColor={theme.bgl}>
            <TextInput
              style={styles.passwordInput}
               backgroundColor={theme.bg}
                color={theme.text}
                placeholderTextColor={theme.second} 
              placeholder="請輸入密碼"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={isPasswordHidden}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsPasswordHidden(!isPasswordHidden)}
            >
              <Ionicons
                name={isPasswordHidden ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={theme.second}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.modalActionRow}>
            <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn,{backgroundColor:theme.light}]} onPress={onClose}>
              <Text style={[styles.cancelBtnText, { color: theme.text }]}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, styles.submitBtn,{backgroundColor:theme.primary}]} onPress={handleSubmit}>
              <Text style={[styles.submitBtnText, { color: theme.textl }]}>登入</Text>
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
    borderColor: '#ffffff00',
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
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff00',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa', 
    width: '100%',
    height: 48, 
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12, 
      borderRadius: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: 'transparent',
  },

   eyeButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});