import { useEffect, useState } from "react";
import {
	SafeAreaView,
	Image,
	Pressable,
	ActivityIndicator,
	Alert
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { images } from "../constants";
import { useAuth } from "../Context/useAuth";
import { requestUserPermission } from "../utils/notification";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
	const { isLoggedIn } = useAuth();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		requestUserPermission();

		//Check wheter an initial notification is available
		messaging()
			.getInitialNotification()
			.then((remoteMessage) => {
				if (remoteMessage) {
					console.log(
						"Notification caused app to oprn from quit state: ",
						remoteMessage
					);
					const { navigationId } = remoteMessage.data;
					if (navigationId === "home") {
						router.push("/home");
					} else if (navigationId === "home") {
						router.push("/home");
					}
				}
			});

		// Assume a message-notification contains a "type" property in the data payload of the screen to open
		messaging().onNotificationOpenedApp((remoteMessage) => {
			console.log(
				"Notification caused app to open from background state: ",
				remoteMessage.notification
			);
			const { navigationId } = remoteMessage.data;
			if (navigationId === "home") {
				router.push("/home");
			} else if (navigationId === "settings") {
				router.push("/settings");
			}
		});

		// Register background handler
		messaging().setBackgroundMessageHandler(async (remoteMessage) => {
			console.log("Message handled in the background!", remoteMessage);
		});

		const unsubscribe = messaging().onMessage(async (remoteMessage) => {
			console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
			const date = new Date

			const newNotification = {
				title: remoteMessage.notification.title,
				body: remoteMessage.notification.body,
				timestamp: `${date.getHours()}:${date.getMinutes()}`
			};

			try{
				const existingNotifications = await AsyncStorage.getItem("notifications");
				let notification = existingNotifications ? JSON.parse(existingNotifications) : [];
				notification.push(newNotification);
				await AsyncStorage.setItem("notifications", JSON.stringify(notification));
			}catch(err){
				console.error('Failed to save notification:', err);
			}

		});

		const timer = setTimeout(() => {
			setIsLoading(false);
			return isLoggedIn() ? router.push("/home") : router.push("/sign-in");
		}, 500);

		return () => {
			clearTimeout(timer);
			unsubscribe();
		};
	}, []);

	//ini sementara
	const handlePress = () => {
		setIsLoading(false);
		router.push("/sign-in");
	};

	return (
		<Pressable onPress={handlePress} className="flex-1">
			<SafeAreaView className="items-center justify-center flex-1 relative">
				<Image source={images.first} resizeMode="contain" className="h-full" />
				<ActivityIndicator
					size="20"
					color="#fff"
					className="absolute bottom-14 justify-center"
				/>
				<StatusBar style="dark" />
			</SafeAreaView>
		</Pressable>
	);
}
