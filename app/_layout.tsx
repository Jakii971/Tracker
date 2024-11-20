import { SplashScreen, Stack } from "expo-router";
import 'expo-dev-client';
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { UserProvider } from "../Context/useAuth";
import { store, persistor } from "../redux/store";
import { Text } from "react-native";


SplashScreen.preventAutoHideAsync();


const RootLayout = () => {
	const [fontsLoaded, error] = useFonts({
		"Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
		"Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
		"Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
		"Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
		"Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
		"Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
		"Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
		"Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
		"Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
	});

	useEffect(() => {
		if (error) throw error;

		if (fontsLoaded) SplashScreen.hideAsync();
	}, [fontsLoaded, error]);

	if (!fontsLoaded && !error) return null;

	return (
		<Provider store={store}>
			<PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
				<UserProvider>
					<Stack>
						<Stack.Screen name="index" options={{ headerShown: false }} />
						<Stack.Screen
							name="notificationScreen"
							options={{ title: "Notification" }}
						/>
						<Stack.Screen name="searchScreen" options={{ title: "Search" }} />
						<Stack.Screen name="historyActivityScreen" options={{ title: "History" }} />
						<Stack.Screen
							name="updateProfileScreen"
							options={{ headerShown: false }}
						/>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="(auth)" options={{ headerShown: false }} />
					</Stack>
				</UserProvider>
			</PersistGate>
		</Provider>
	);
};

export default RootLayout;
