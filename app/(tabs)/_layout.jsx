import { Ionicons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs } from "expo-router";
import { useTheme } from "../../theme/ThemeContext.js";

export default function Layout() {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    return (
        <Tabs
  key={theme.primary}
  screenOptions={{
    headerStyle: {
  backgroundColor: theme.bgl,
},
    headerTitleAlign: "center",

    headerTitleStyle: {
        
      color: theme.primary,
      fontSize: 24,
      
    },

    tabBarStyle: {
      height: 120,
      paddingTop: 10,
      backgroundColor: theme.bgl, 
    },

    tabBarLabelStyle: {
      marginTop: 6,
      fontSize: 12,
    },

    tabBarActiveTintColor: theme.text,
    tabBarInactiveTintColor: theme.second,

    tabBarActiveBackgroundColor: theme.primary,

    tabBarItemStyle: {
      borderRadius: 10,
      marginHorizontal: 5,
      marginVertical: 0,
      overflow: "hidden",
    },

    tabBarAndroidRipple: {
      borderless: false,
      color: theme.primary,
    },
  }}
>
            <Tabs.Screen
                name="index"
                options={{
                    title: "首頁",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="home-outline" size={30} color={focused ? theme.text : theme.second} />
                    )
                }} />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: "日曆",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="calendar-outline" size={30} color={focused ? theme.text : theme.second} />
                    )
                }} />
            <Tabs.Screen
                name="class"
                options={{
                    title: "分類",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="folder-outline" size={30} color={focused ? theme.text : theme.second} />
                    )
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    title: "設定",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="settings-outline" size={30} color={focused ? theme.text : theme.second} />
                    )
                }} />
                 <Tabs.Screen
                 
                 name="ScannerScreen"
                 options={{
                 href: null, 
    }}
  />
        </Tabs>
    );
}