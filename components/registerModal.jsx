import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Image } from 'react-native';

const DEFAULT_AVATARS = [
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEirQIqMrqy-o_GnGz9vhmRG3q8xLFR3fdHN0gmV0ST5Y8k0twPi5BCHwZ9YdbtXORLR6PpJJSiT18wWT91Jd6bNnEyJ80wK1NqvXRBKMbIOrH99uTp6RmvjDx5y5yRmPIy32g_V00epUQw/s170/boy_01.png',
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_ojo5kmjWa2Fyfjb4OwHqWrJuRRyTp-NQbfrAJHcxbSCqMKmdJ0wqcZAjswWdxU3gWCRjxUjBcV51JaxSw2PvlhLdR51P-un0o4g7ZXj2hANZJ5SI33TfQBBXiOHR3Qd5svw3F8eJtCY/s170/girl_13.png',
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_Jb2dSHvFPcUjxl753C-AkJDQdD71J9cwskYmrwpw2lcR7CoLEZU77s6ZWcgLsTJ_Rjsn2onNx1TkwlYv2_ziUm49HGN4fsMDccNN2HJBq3Wp-agn5U9Fc45FzDVKDJR81H4HYYF-zhE/s170/animal_inu.png',
];

export default function RegisterModal({ visible, onClose, onRegister }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0]);

    const handleSubmit = () => {

        onRegister({ email, password, displayName, selectedAvatar });

        setEmail('');
        setPassword('');
        setDisplayName('');
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>建立帳號</Text>
                    <Text style={styles.inputLabel}>選擇頭像：</Text>
                    <View style={styles.avatarPickerContainer}>
                        {DEFAULT_AVATARS.map((avatarUrl, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedAvatar(avatarUrl)}
                                style={[styles.avatarOptionWrapper, selectedAvatar === avatarUrl && styles.selectedAvatarWrapper]}
                            >
                                <Image source={{ uri: avatarUrl }} style={styles.avatarOption} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="請輸入暱稱（顯示名稱）"
                        value={displayName}
                        onChangeText={setDisplayName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="請輸入 Email"
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
                            <Text style={styles.submitBtnText}>確認註冊</Text>
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
  color: '#555',
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
  borderColor: '#a28fff'
},
avatarOption: {
  width: 46,
  height: 46,
  borderRadius: 23
},
input: {
  borderWidth: 1,
  borderColor: '#ffffff',
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
  color: '#fff',
  fontWeight: 'bold'
    }
});