import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StatusBar, StyleSheet, Switch, Text, View } from "react-native";
; 

export default function Setting() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    return (
        <View style={styles.container}>
            <View style={styles.Card}>
                <LinearGradient
                colors={['#FFD1DC', '#D1C4E9', '#a28fff']}
                 style={styles.Card}
                 start={{ x: 0, y: 0.5 }}
                 end={{ x: 1, y: 0.5 }}>
            <View style={styles.Cardtext}>
                <Text style={styles.title}>設定</Text>
                <Text style={styles.tt}>個人化你的應用程式</Text>
            </View>
                </LinearGradient>
            </View>
    <View style={styles.tcard}>
        <View tyle={styles.tinfo}> 
              <Ionicons 
            name={isDarkMode ? "moon" : "sunny"} 
            size={40}
            color={isDarkMode ? "#a28fff" : "#f3acc1"} 
            top={14}
          />
            <Text style={styles.t2}>深色模式</Text>
            
        </View>
            <Switch
                trackColor={{ false: "#767577", true: "#a28fff" }}
                thumbColor={isDarkMode ? "#f3acc1" : "#f4f3f4"}
                onValueChange={setIsDarkMode}
                value={isDarkMode}
                top={35}
            />
    </View>
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text style={{fontSize:18,color:"#666"}}>敬請期待更多功能！</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff", 
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start", 
        paddingTop: StatusBar.currentHeight || 30, // 確保頂部有留白
        paddingHorizontal: 20,
    },
    Card: {
        width: "100%",
        height: 150,
        borderRadius: 15,
        overflow: 'hidden',
        alignItems: "flex-start", 
        justifyContent: "center",

    },
    tcard: {
        width: "100%",
        height: 100,
        backgroundColor: "#fff",
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: 20,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    tinfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    t2: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#81777a",
        marginLeft: 15,
        left: 40,
        justifyContent: "center",
        bottom:20
    },

    Cardtext: {
        paddingLeft: 20, 
        color: "#fff",
        fontSize: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        bottom: 5,
},
    tt: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
        top: 5,
    }
});
