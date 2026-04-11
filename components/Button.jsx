import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import useTaskStore from '../store/useTaskStore';

export default function Button({ setEditTaskData }) {
  const setModalVisible = useTaskStore((state) => state.setModalVisible);
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setEditTaskData(null);
          setModalVisible(true);
        }}
        style={styles.button}>
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
    backgroundColor: "#f3acc1",
    padding: 10,
    borderRadius: 999
  },
})
