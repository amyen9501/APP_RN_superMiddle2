import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import useTaskStore from '../store/useTaskStore';
import { useTheme } from "../theme/ThemeContext.js";

export default function Button({ setEditTaskData }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const setModalVisible = useTaskStore((state) => state.setModalVisible);
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setEditTaskData(null);
          setModalVisible(true);
        }}
        style={[styles.button,{backgroundColor: theme.primary}]}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </>
  )
}


const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 999
  },
})
