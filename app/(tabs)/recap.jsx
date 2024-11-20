import { View, Text, SafeAreaView, Image } from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import { ENDPOINTS } from "../../constants/endpoint";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { images } from "../../constants";
import { Link, router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { icons } from "../../constants";

const getActivityImage = (activityType) => {
	switch (activityType) {
		case "run":
			return require("../../assets/images/run.png");
		case "walk":
			return require("../../assets/images/walk.png");
		case "bicycle":
			return require("../../assets/images/bicycle.png");
		default:
			return require("../../assets/images/walk.png");
	}
};

const Recap = () => {
	const [summary, setSummary] = useState([]);

	const fetchData = async () => {
		const token = await AsyncStorage.getItem("token");
		const response = await axios.get(`${ENDPOINTS.USER_ACTIVITY_SUMMARY}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const summary = await response.data;
		setSummary(summary);
	};

	useFocusEffect(
		useCallback(() => {
			fetchData();
		}, [])
	);

	const renderItem = ({ item }) => {
		return (
			<SafeAreaView className="flex-1">
				<View className="items-center justify-center px-5 pt-9">
					<Text className="text-2xl font-pbold capitalize">
						{item.activityType}
					</Text>
					<Image
						source={getActivityImage(item.activityType)}
						className="w-80 h-80"
						resizeMode="contain"
					/>
					<View className="w-full space-y-3">
						<View className="bg-primary p-5 rounded-lg">
							<Text className="text-lg font-pbold self-start">Distance</Text>
							<Text className="text-5xl font-pbold text-white self-end pt-2">
								{item.totalDistance.toFixed(1)}
								<Text className="text-black"> KM</Text>
							</Text>
						</View>
						<View className="bg-primary p-5 rounded-lg">
							<Text className="text-lg font-pbold self-start">Distance</Text>
							<Text className="text-5xl font-pbold text-white self-end pt-2">
								{item.totalDuration.toFixed(1)}
								<Text className="text-black"> Hours</Text>
							</Text>
						</View>
					</View>
				</View>
			</SafeAreaView>
		);
	};

	if (summary.length === 0) {
		return (
			<SafeAreaView className="flex-1 items-center justify-center px-3">
				<Image
					source={images.blank}
					resizeMode="contain"
					className="w-96 h-96"
				/>
				<Text className="text-2xl font-pbold text-center">
					Data olahraga kamu belum ada, Ayo Olahraga{" "}
					<Link href="/track" className="text-secondary font-pbold">
						sekarang!
					</Link>
				</Text>
			</SafeAreaView>
		);
	}

	return (
		<>
			<TouchableOpacity
				onPress={() => router.push("/historyActivityScreen")}
				className="absolute right-4 bottom-7 z-10 bg-white p-3 rounded-full"
			>
				<Image source={icons.history2} className="w-7 h-7" />
			</TouchableOpacity>
			<AppIntroSlider
				data={summary}
				renderItem={renderItem}
				activeDotStyle={{ backgroundColor: "#FBBA18", width: 30 }}
				showNextButton={false}
				showDoneButton={false}
			/>
		</>
	);
};

export default Recap;
