import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { StatusBar, StyleSheet, Switch, Text, View, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { auth } from '../../firebaseConfig';
import { onAuthStateChanged, signOut, linkWithCredential, EmailAuthProvider, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import RegisterModal from '../../components/registerModal';
import LoginModal from "../../components/loginModal";
import useTaskStore from "../../store/useTaskStore";
import { useTheme } from "../../theme/ThemeContext.js";

const DEFAULT_AVATARS = ['https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwG0xXIptaOP2F8qwAxGh3weCF0xugPbOgOFCwEIenI0j6FBGDjdxqYN4VgUDkgVWc8n3ef_jZ-1m6BAuhEync9TJoejgyIeHycpXiB1oZJ88u99yC0C3cnap7MUNNZ5WQQwqfV9gaTHA/s170/animal_buta.png'];


export default function Setting() {
    const { listenToTasks, migrateGuestTasks, updateCurrentProfile } = useTaskStore();
   const { theme, isDarkMode, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoginVisible, setIsLoginVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    const handleSignOut = async () => {
        try { await signOut(auth); Alert.alert("提示", "已成功登出！"); } catch (error) { Alert.alert("登出失敗", error.message); }
    };


    const handleLogin = async ({ email, password }) => {
        const guestUid = auth.currentUser?.uid;
        console.log("👉 登入前訪客 UID:", guestUid);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const memberUid = userCredential.user.uid;
            console.log("👉 登入成功，會員 UID:", memberUid);
            if (guestUid && memberUid) {
                await useTaskStore.getState().migrateGuestTasks(guestUid, memberUid);
            }

            Alert.alert("登入成功", "歡迎回來！任務已同步完成！");
            setIsLoginVisible(false);
        } catch (error) {
            Alert.alert("登入失敗", error.message);
        }
    };

    const handleRegister = async ({ email, password, displayName, selectedAvatar }) => {
        try {
            const credential = EmailAuthProvider.credential(email, password);
            const userCredential = await linkWithCredential(auth.currentUser, credential);
            await updateProfile(userCredential.user, { displayName, photoURL: selectedAvatar });

            setUser({
                ...auth.currentUser,
                isAnonymous: false,
                displayName: displayName,
                photoURL: selectedAvatar,
            });
            Alert.alert("恭喜", `註冊成功！`);

            setModalVisible(false);
        } catch (error) {
            Alert.alert("註冊失敗", error.message);
        }
    };

    const openEditModal = () => {
        setIsEditMode(true);
        setModalVisible(true);
    };

    const openRegisterModal = () => {
        setIsEditMode(false);
        setModalVisible(true);
    };

    const handleSaveEdit = async ({ displayName, selectedAvatar }) => {
        const res = await updateCurrentProfile(displayName, selectedAvatar);
        if (res.success) {
            setUser({
                ...auth.currentUser,
                displayName: displayName,
                photoURL: selectedAvatar
            });
            setModalVisible(false);
        } else {
            Alert.alert("編輯失敗", res.message);
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={[styles.container]}>
            <View  style={[styles.cardContainer]}>
                <LinearGradient colors={theme.gradient} style={styles.Card} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}>
                    <View  style={styles.Cardtext}>
                        <Text style={[styles.title , { color:theme.textl }]}>設定</Text>
                        <Text style={[styles.tt,{ color: theme.textl}]}>個人化你的應用程式</Text>
                    </View>
                </LinearGradient>
            </View>


            {user && user.isAnonymous ? (
                /*訪客模式*/
                <View style={[styles.personalCard,{backgroundColor: theme.bgl}]}>
                   <View style={[styles.profileHeader]}>
                        <Image source={{ uri: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgKdSrmtSstxIzLHTBocc0-gUtYruNXO9S5bRMpWeHR6VVKgDfMK956erZQ5p93vew6n9IrFPC7HNdVNa3djeqItGhwqPbJbyBCnRMSjhFP_IfV1umTcxjTborMMCS-effWgOaUJcdwAoI/s400/futon_derenai.png' }} style={styles.avatar} />
                        <View style={styles.userInfo}>
                            <Text style={[styles.nameText,{color: theme.text}]}>訪客模式</Text>
                            <Text style={styles.subText}>登入或註冊以同步雲端任務</Text>
                        </View>
                    </View>
                    <View style={styles.btnGroup}>
                        <TouchableOpacity style={[styles.actionBtn, styles.loginBtn,{ backgroundColor: isDarkMode ? theme.bg : theme.ldark }]} onPress={() => setIsLoginVisible(true)}>
                            <Text style={[styles.loginBtnText,{color: theme.text}]}>已有帳號登入</Text>
                        </TouchableOpacity>

                        <TouchableOpacity  style={[styles.actionBtn,styles.registerBtn,{ backgroundColor: theme.primary }]} onPress={openRegisterModal}>
                            <Text style={[styles.registerBtnText,{color: theme.textl}]}>新用戶註冊</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : user ? (
                /*會員*/
                <View style={[styles.personalCard, { backgroundColor: theme.bgl }]}>
                    <View style={styles.profileHeader}>
                        <Image source={{ uri: user.photoURL || DEFAULT_AVATARS[0] }} style={styles.avatar} />
                        <View style={styles.userInfo}>
                            <Text style={[styles.nameText, { color:theme.text}]}>{user.displayName || "無名氏"}</Text>
                            <Text style={[styles.subText, { color:theme.text}]}>{user.email}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={openEditModal}>
                            <Ionicons name="create-outline" size={24} color='theme.primary' style={[{ marginRight: 10 }, { color:theme.primary}]} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.divider, { backgroundColor: theme.primary }]} />
                    <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: isDarkMode ? theme.bg : theme.ldark ,borderColor:"#00000000"}]} onPress={handleSignOut}>
                        <Text style={[styles.logoutBtnText, { color: theme.text }]}>登出帳號</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={[styles.personalCard, { alignItems: 'center', padding: 20 }]}><Text style={{ color: '#999' }}>載入中...</Text></View>
            )}


            <View style={[styles.tcard,{backgroundColor: theme.bgl}]}>
  <View style={styles.tinfo}>
    <Ionicons
      name={isDarkMode ? "moon" : "sunny"}
      size={40}
      color={theme.primary}
    />

    <Text style={[styles.t2, { color: theme.text }]}>
      {isDarkMode ? "深色模式" : "亮色模式"}
    </Text>
  </View>

  <Switch
    trackColor={{true: theme.second ,false: theme.second }}
    thumbColor={theme.primary}
    onValueChange={toggleTheme}
    value={isDarkMode}
    style={{ alignSelf: "center" }}
  />
</View>

            <View style={styles.footer}><Text style={{ fontSize: 16, color: "#bbb", fontWeight: "600" }}>敬請期待更多功能！</Text></View>


            <RegisterModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                isEditMode={isEditMode}
                onRegister={handleRegister}
                onSaveEdit={handleSaveEdit}
            />
            <LoginModal visible={isLoginVisible} onClose={() => setIsLoginVisible(false)} onLogin={handleLogin} />

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: StatusBar.currentHeight || 30,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    cardContainer: {
        width: "100%",
    },
    Card: {
        width: "100%",
        height: 140,
        borderRadius: 15,
        overflow: 'hidden',
        alignItems: "flex-start",
        justifyContent: "center",
    },
    Cardtext: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        bottom: 5,
    },
    tt: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#fff",
        opacity: 0.9,
    },
    personalCard: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 15,
        marginTop: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        marginRight: 15,
        backgroundColor: '#f0f0f0'
    },
    userInfo: {
        flex: 1,
    },
    nameText: {
        fontSize: 18,
        fontWeight: "bold",

    },
    subText: {
        fontSize: 13,
        color: "#999",
        marginTop: 3,
    },
    loginBtn: {
        marginTop: 15,
    
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center"
    },
    loginBtnText: {
        color: "#81777a",
        fontSize: 15,
        fontWeight: "bold"
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15
    },
    logoutBtn: {
        borderWidth: 1,
        
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center"
    },
    logoutBtnText: {
    
        fontSize: 15,
        fontWeight: "bold"
    },
    tcard: {
        width: "100%",
        height: 85,
        backgroundColor: "#fff",
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    tinfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        height: "100%",
    },
    t2: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#81777a",
    },
    footer: {
        marginTop: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    btnGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    },
    actionBtn: {
        flex: 0.47,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginBtn: {
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: '#eeeeee00'
    },
    loginBtnText: {
        color: "#777",
        fontSize: 14,
        fontWeight: "bold"
    },
    registerBtn: {
        
    },
    registerBtnText: {
        color: "#81777a",
        fontSize: 14,
        fontWeight: "bold"
    },
});
