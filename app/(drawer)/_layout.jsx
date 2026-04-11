import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const CustomDrawerContent = (props) => {

    const pathname = usePathname();

    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.drawerHeader}>
                <Text style={styles.title}>選單</Text>
                <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
                    <Ionicons name="close" size={24} color="#a0a0a0" />
                </TouchableOpacity>
            </View>
            <DrawerItem
                label={"首頁"}
                labelStyle={{ fontSize: 20, padding: 5, color: pathname == '/' ? "#fff" : "#f3acc1" }}
                icon={({ size }) => (
                    <Ionicons name="home-outline" size={size} color={pathname == "/" ? "#fff" : "#f3acc1"} />
                )}
                style={{ backgroundColor: pathname == "/" ? "#f3acc1" : "#fff" }}
                onPress={() => {
                    router.push('/');
                }}
            />
            <DrawerItem
                label={"日曆"}
                labelStyle={{ fontSize: 20, padding: 5, color: pathname == '/calendar' ? "#fff" : "#f3acc1" }}
                icon={({ size }) => (
                    <Ionicons name="calendar-outline" size={size} color={pathname == "/calendar" ? "#fff" : "#f3acc1"} />
                )}
                style={{ backgroundColor: pathname == "/calendar" ? "#f3acc1" : "#fff" }}
                onPress={() => {
                    router.push('/(tabs)/calendar');
                }}
            />
            <DrawerItem
                label={"分類"}
                labelStyle={{ fontSize: 20, padding: 5, color: pathname == '/class' ? "#fff" : "#f3acc1" }}
                icon={({ size }) => (
                    <Ionicons name="folder-outline" size={size} color={pathname == "/class" ? "#fff" : "#f3acc1"} />
                )}
                style={{ backgroundColor: pathname == "/class" ? "#f3acc1" : "#fff" }}
                onPress={() => {
                    router.push('/(tabs)/class');
                }}
            />
            <DrawerItem
                label={"設定"}
                labelStyle={{ fontSize: 20, padding: 5, color: pathname == '/setting' ? "#fff" : "#f3acc1" }}
                icon={({ size }) => (
                    <Ionicons name="settings-outline" size={size} color={pathname == "/setting" ? "#fff" : "#f3acc1"} />
                )}
                style={{ backgroundColor: pathname == "/setting" ? "#f3acc1" : "#fff" }}
                onPress={() => {
                    router.push('/(tabs)/setting');
                }}
            />
        </DrawerContentScrollView>
    );
}


export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
                <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
            </Drawer>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        marginVertical:0,
        fontWeight: "bold",
        color: "#f3acc1",
    },
});