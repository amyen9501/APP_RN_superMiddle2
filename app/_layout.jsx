import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
import { Slot } from "expo-router";
import { ThemeProvider } from "../theme/ThemeContext";

export default function RootLayout() {
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth)
          .then(() => console.log("成功以匿名訪客身份進入"))
          .catch((error) => console.error("匿名登入失敗", error));
      } else {
        if (user.isAnonymous) {
          console.log("目前是：匿名訪客，UID 為:", user.uid);
        } else {
          console.log("目前是：正式會員，UID 為:", user.uid);
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}