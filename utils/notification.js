import { PermissionsAndroid, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import axios from "axios";
import { API_BASE_URL, ENDPOINTS } from "../constants/endpoint";

export const requestUserPermission = async () => {
	if (Platform.OS === "android") {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
		);

		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log("Izin notifikasi diberikan");
			await messaging().registerDeviceForRemoteMessages();
			getFcmToken();
		} else {
			console.log("Izin notifikasi tidak diberikan");
		}
	} else {
		const authStatus = await messaging().requestPermission();
		const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL;

		if (enabled) {
			await messaging().registerDeviceForRemoteMessages();
			getFcmToken();
		} else {
			console.log("Izin notifikasi tidak diberikan");
		}
	}
};

const getFcmToken = async () => {
	try {
		const token = await messaging().getToken();
		if (token) {
			console.log("FCM Token:", token);
			await sendTokenToBackend(token);
		} else {
			console.log("Token tidak tersedia");
		}
	} catch (error) {
		console.log("Cannot get the Token:", error);
	}
};

const sendTokenToBackend = async (token) => {
	try {
		const response = await axios.post(`${ENDPOINTS.NOTIFICATIONS_REGISTER}`, {
			token,
		});

		console.log("Token sent to backend:", response.data);
	} catch (error) {
		console.error("Error sending token to backend", error);
	}
};
