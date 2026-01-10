import NotificationInitializer from "@/component/NotificationInitializer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";


const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <NotificationInitializer>
        <RootLayoutNav />
      </NotificationInitializer>
      </QueryClientProvider>
    </>
  );
}

function RootLayoutNav() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(user)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(worker)" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
