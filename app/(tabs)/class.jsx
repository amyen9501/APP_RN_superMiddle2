import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import useTaskStore from "../../store/useTaskStore";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeContext.js";

export default function Class() {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const { categories, addCategory, tasks, deleteCategory } = useTaskStore();
    const [newCate, setNewCate] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const saveAdd = () => {
        if (newCate.trim()) {
            addCategory(newCate.trim());
            setNewCate('');
            setIsAdding(false);
        }


    }


    const allCount = categories.length;

    return (
        <View style={[styles.container,{ backgroundColor: theme.bg}]}>
            <View style={styles.missionBox}>
                <LinearGradient
                    colors={theme.gradient}
                    style={styles.missionBox}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <Text style={[styles.missionText,{ color: theme.textl }]}>分類管理</Text>
                    <Text style={[styles.missionclasscount,{ color: theme.textl }]}>共{allCount}個分類</Text>
                </LinearGradient>
            </View>

            <View>
                {!isAdding ?
                    (
                        <View>
                            <TouchableOpacity style={[styles.button,{backgroundColor: theme.bgl}]} onPress={() => setIsAdding(true)}>
                                <Text style={[styles.addclass,{color: theme.text}]}>新增分類</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={[styles.addclasswin,{ backgroundColor: theme.bgl}]}>
                            <TextInput
                                style={[styles.addclass,{color: theme.second}]}
                                placeholder="請輸入分類名稱..."
                                 placeholderTextColor={isDarkMode ? theme.primary : theme.text}
                                value={newCate}
                                onChangeText={setNewCate}

                            />
                            <View style={styles.twobutton}>
                                <LinearGradient
                                    colors={theme.gradient}
                                    style={styles.submitbutton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }} ><TouchableOpacity onPress={saveAdd}>

                                        <Text style={[styles.submit,{color: theme.textl}]}>送出</Text>
                                    </TouchableOpacity></LinearGradient>

                                <TouchableOpacity style={[styles.cancelbutton,{ backgroundColor: theme.bg}]} onPress={() => setIsAdding(false)}>
                                    <Text style={[styles.cancel,{color: theme.second}]}>取消</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    )
                }
            </View>

            <FlatList
                data={categories}
                extraData={tasks}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                    const categoryTasks = tasks.filter(t => t.category === item);
                    const totalCount = categoryTasks.length;
                    const completedCount = categoryTasks.filter(t => t.status === '已完成').length;
                    const ongoingCount = totalCount - completedCount;
                    const handleDelete = () => {
                        if (totalCount > 0) {
                            Alert.alert("無法刪除","該分類中還有任務正在進行。");
                            return;
                        }
                        Alert.alert(
                            "刪除分類",
                            `確定要刪除「${item}」嗎？`,
                            [
                                { text: "取消", style: "cancel" },
                                {
                                    text: "確定",
                                    style: "destructive",
                                    onPress: () => deleteCategory(item)
                                }
                            ]
                        );
                    };
                    return (
                        <View style={[styles.classcard,{ backgroundColor: theme.bgl ,borderWidth: isDarkMode ? 0 : 1.5, borderColor: isDarkMode ? '#00000000' : '#2929294a'}]}>
                            <View style={styles.classcardLeft}>
                                <View style={[styles.block,{ backgroundColor: theme.primary }]}>
                                    <Ionicons name='folder-outline' size={20} color={theme.text} />
                                </View>
                                <View>
                                    <Text style={[styles.classview,{ color: theme.text }]}>{item}</Text>
                                    <View style={[styles.statusContainer]}>
                                        <Text style={[styles.classtext]}>
                                            <Text style={{ color: theme.primary }}>總任務 {totalCount} </Text>
                                            <Text style={[styles.classtag1,{ color: theme.primary }]}> 進行中 {ongoingCount} </Text>
                                            <Text style={{ color: theme.second }}> 已完成 {completedCount}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                                <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                            </TouchableOpacity>
                        </View>
                    )

                }}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: 'center',
        //alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
        paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight || 30,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#ffffff",

        borderRadius: 10,
        marginBottom: 20,
        elevation: 4,

    },
    cancelbutton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#ffffff",

        borderRadius: 10,
        marginBottom: 20,
        elevation: 4,
        marginLeft: "40",
        paddingHorizontal: 20,
    },
    submitbutton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#9393DD",
        borderRadius: 10,
        marginBottom: 20,
        elevation: 4,
       
        paddingHorizontal: 20,
    },
    twobutton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        justifyContent: 'space-between',
    },

    missionBox: {
        backgroundColor: "#ffffff00",
        width: '100%',
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',

    },
    missionText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        //textAlign: "center",
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    missionclasscount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
        //textAlign: "center",
        marginTop: -10,
        marginLeft: 20,
        marginBottom: 20,
    },
    addclass: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 15,

        width: '100%',
    },
    addclasswin: {
        alignItems: 'center',
        backgroundColor: "#ffffff",
        width: '100%',
        borderRadius: 10,
        marginBottom: 20,
        elevation: 4,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    submit: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",


        margin: 10,
    },
    cancel: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#9393DD",
        textAlign: "center",

        margin: 10,
    },
    classcard: {
        backgroundColor: "#fff",
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 80,
        borderWidth: 1.5,
        borderRadius: 10,
    },
    classcardLeft:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:5,
    },
    block: {
        borderRadius: 10,
        backgroundColor: "#f3acc1",
        margin: 5,
        marginHorizontal: 10,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: "#ffffff",
        padding: 10,
    },
    classview: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#312d2d",
        overflow: 'hidden',
    },
    classtext: {


        fontSize: 12,
        fontWeight: "bold",
        


        overflow: 'hidden',



    },
    deleteBtn: {
        padding: 10,
        marginRight:5,
    },
})



