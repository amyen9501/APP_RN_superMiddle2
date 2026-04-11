import { Ionicons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs } from "expo-router";

export default function Layout() {
    return (
        <Tabs screenOptions={{
            headerLeft:()=>
            <DrawerToggleButton tintColor="#a0a0a0"/>,
            headerTitleAlign:"center",
            headerTitleStyle:{
                color:"#f3acc1",
                fontSize:24,
            },
            tabBarStyle: { height: 120, paddingTop: 10 },
            tabBarLabelStyle: { marginTop: 6, fontSize: 12},
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#f3acc1',
            tabBarActiveBackgroundColor: '#f3acc1',
            tabBarItemStyle: {
                borderRadius: 10,
                marginHorizontal: 5,
                marginVertical: 0,
                overflow: 'hidden',
            },
            tabBarAndroidRipple: { borderless: false, color: '#f3acc1' },
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "首頁",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="home-outline" size={30} color={focused ? "white" : "#f3acc1"} />
                    )
                }} />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: "日曆",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="calendar-outline" size={30} color={focused ? "white" : "#f3acc1"} />
                    )
                }} />
            <Tabs.Screen
                name="class"
                options={{
                    title: "分類",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="folder-outline" size={30} color={focused ? "white" : "#f3acc1"} />
                    )
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    title: "設定",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="settings-outline" size={30} color={focused ? "white" : "#f3acc1"} />
                    )
                }} />
        </Tabs>
    );
}