import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import useTaskStore from "../../../store/useTaskStore";
import { Ionicons } from "@expo/vector-icons";

export default function Class() {
    const { categories, addCategory, tasks } = useTaskStore();
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
        <View style={styles.container}>
            <View style={styles.missionBox}>
                <LinearGradient
                    colors={['#FFD1DC', '#D1C4E9', '#a28fff']}
                    style={styles.missionBox}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <Text style={styles.missionText}>分類管理</Text>
                    <Text style={styles.missionclasscount}>共{allCount}個分類</Text>
                </LinearGradient>
            </View>

            <View>
                {!isAdding ?
                    (
                        <View>
                            <TouchableOpacity style={styles.button} onPress={() => setIsAdding(true)}>
                                <Text style={styles.addclass}>新增分類</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.addclasswin}>
                            <TextInput
                                style={styles.addclass}
                                placeholder="請輸入分類名稱..."
                                value={newCate}
                                onChangeText={setNewCate}

                            />
                            <View style={styles.twobutton}>
                                <LinearGradient
                                    colors={['#FFD1DC', '#D1C4E9', '#a28fff']}
                                    style={styles.submitbutton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }} ><TouchableOpacity onPress={saveAdd}>

                                        <Text style={styles.submit}>送出</Text>
                                    </TouchableOpacity></LinearGradient>

                                <TouchableOpacity style={styles.cancelbutton} onPress={() => setIsAdding(false)}>
                                    <Text style={styles.cancel}>取消</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    )
                }
            </View>


            {/*這裡是能列出現在有的分類的表單*/}
            <FlatList
                data={categories}
                extraData={tasks}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                    const categoryTasks = tasks.filter(t => t.category === item);
                    const totalCount = categoryTasks.length;
                    const completedCount = categoryTasks.filter(t => t.status === '已完成').length;
                    const ongoingCount = totalCount - completedCount;
                    return (
                        <View style={styles.classcard}>
                            <View style={styles.block}>
                                <Ionicons name='folder-outline' size={20} color={'white'} />
                            </View>
                            <View>
                                <Text style={styles.classview}>{item}</Text>
                                <View style={styles.statusContainer}>
                                    <Text style={styles.classtext}>
                                        <Text>總任務 {totalCount} </Text>
                                        <Text style={styles.classtag1}> 進行中 {ongoingCount} </Text>
                                        <Text style={{ color: '#a28fffdc' }}> 已完成 {completedCount}</Text>
                                    </Text>
                                </View>
                            </View>
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
        marginRight: "40",
        paddingHorizontal: 20,
    },
    twobutton: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
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
        color: "#9393DD",
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
        paddingHorizontal: 20,
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
        borderColor: '#ababab00',
        borderWidth: 1.5,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 80,
        borderColor: '#ababab',
        borderWidth: 1.5,
        borderRadius: 10,
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
        color: "#f3acc1",


        overflow: 'hidden',



    },
})



