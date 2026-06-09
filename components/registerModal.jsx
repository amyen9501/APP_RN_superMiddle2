import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Image } from 'react-native';
import { auth } from '../firebaseConfig';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext.js";

const DEFAULT_AVATARS = [
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEirQIqMrqy-o_GnGz9vhmRG3q8xLFR3fdHN0gmV0ST5Y8k0twPi5BCHwZ9YdbtXORLR6PpJJSiT18wWT91Jd6bNnEyJ80wK1NqvXRBKMbIOrH99uTp6RmvjDx5y5yRmPIy32g_V00epUQw/s170/boy_01.png',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_ojo5kmjWa2Fyfjb4OwHqWrJuRRyTp-NQbfrAJHcxbSCqMKmdJ0wqcZAjswWdxU3gWCRjxUjBcV51JaxSw2PvlhLdR51P-un0o4g7ZXj2hANZJ5SI33TfQBBXiOHR3Qd5svw3F8eJtCY/s170/girl_13.png',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_Jb2dSHvFPcUjxl753C-AkJDQdD71J9cwskYmrwpw2lcR7CoLEZU77s6ZWcgLsTJ_Rjsn2onNx1TkwlYv2_ziUm49HGN4fsMDccNN2HJBq3Wp-agn5U9Fc45FzDVKDJR81H4HYYF-zhE/s170/animal_inu.png',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiwf_Xp6Betg2IhK6EqdWnfa4l6wV7rniHFbBE7rMTnqE28eaEmUP6ZgZZusF5TxH_R-8r9ENcekbLJGgNpy4XoZzeaV6nGNeQz5V0pKo105ReDxbyLnIxUyODtmqZvGaRZmWmESTGcDXM/s170/monster06.png'
];

export default function RegisterModal({ visible, onClose, onRegister, isEditMode = false, onSaveEdit }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0]);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const handleSubmit = () => {
    if (isEditMode) {
      onSaveEdit({ displayName, selectedAvatar });
    } else {
      onRegister({ email, password, displayName, selectedAvatar });
      setEmail('');
      setPassword('');
      setDisplayName('');
    }
  };

  useEffect(() => {
    if (visible && isEditMode) {
      const user = auth.currentUser;
      setDisplayName(user?.displayName || '');
      setSelectedAvatar(user?.photoURL || DEFAULT_AVATARS[0]);
    }
  }, [visible, isEditMode]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer,{backgroundColor: theme.bgl}]}>
          <Text style={[styles.modalTitle,{color: theme.text}]}>{isEditMode ? "編輯帳號" : "註冊帳號"}</Text>
          <Text style={[styles.inputLabel]}>選擇頭像：</Text>
          <View style={styles.avatarPickerContainer}>
            {DEFAULT_AVATARS.map((avatarUrl, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedAvatar(avatarUrl)}
                style={[styles.avatarOptionWrapper, selectedAvatar === avatarUrl && {borderColor: theme.second}]}
              >
                <Image source={{ uri: avatarUrl }} style={styles.avatarOption} />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            backgroundColor={isDarkMode ? theme.bg : theme.ldark}
                color={theme.text}
                placeholderTextColor={theme.pla} 
            placeholder="請輸入暱稱（顯示名稱）"
            value={displayName}
            onChangeText={setDisplayName}
          />
          {!isEditMode && (
            <>
              <TextInput
                style={styles.input}
                backgroundColor={isDarkMode ? theme.bg : theme.ldark}
                color={theme.text}
                placeholderTextColor={theme.pla} 
                placeholder="請輸入 Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.passwordContainer}
              backgroundColor={theme.bgl}>
                <TextInput
                  style={styles.passwordInput}
                  backgroundColor={isDarkMode ? theme.bg : theme.ldark}
                color={theme.text}
                placeholderTextColor={theme.pla} 
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
                    color={theme.pla}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={styles.modalActionRow}>
            <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn,{backgroundColor:theme.light}]} onPress={onClose}>
              <Text style={[styles.cancelBtnText, { color: theme.text }]}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, styles.submitBtn,{backgroundColor:theme.primary}]} onPress={handleSubmit}>
              <Text style={[styles.submitBtnText, { color: theme.textl }]}>{isEditMode ? "儲存修改" : "確認註冊"}</Text>
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
    textAlign: 'center'
  },
  inputLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8
  },
  avatarPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  avatarOptionWrapper: {
    padding: 4,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  selectedAvatarWrapper: {
  
  },
  avatarOption: {
    width: 46,
    height: 46,
    borderRadius: 23
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffffff00',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fafafa'
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
    backgroundColor: '#f3acc1'
  },
  submitBtnText: {
  
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
    borderRadius: 10,
    height: '100%',
    paddingHorizontal: 12, 
    fontSize: 14,
    color: '#555',
    backgroundColor: 'transparent',
  },

  eyeButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});