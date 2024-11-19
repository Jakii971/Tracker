import { View, Text, Image, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { images } from "../constants";
import { ListNotification } from "../components";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Notification = () => {
	const [notifications, setNotifications] = useState([]);
	const [onDispatch, setOnDispatch] = useState(false);

	const getNotifications = async () => {
		try{
			const notifications = await AsyncStorage.getItem("notifications");
			if (notifications !== null) {
				setNotifications(JSON.parse(notifications));
			}
			setOnDispatch(!onDispatch);
		} catch(err){
			console.error('Failed to get notifications: ', err);
			return [];
		}
	};

	useEffect(() => {
		getNotifications();
	}, [onDispatch]);

	return (
		<SafeAreaView className="flex-1 bg-white">
			{notifications.length > 0 ? (
				<ScrollView className="px-5 space-y-6">
					{notifications.map((notif, index) => (
						<ListNotification
							key={index}
							title={notif.title}
							body={notif.body}
							timestamp={notif.timestamp}
						/>
					))}
				</ScrollView>
			) : (
				<View className="flex-1 items-center justify-center">
					<Image
						source={images.blank}
						resizeMode="contain"
						className="w-96 h-96"
					/>
					<Text className="text-lg font-pbold text-black">
						There is no Notification
					</Text>
				</View>
			)}
		</SafeAreaView>
	);
};

export default Notification;
