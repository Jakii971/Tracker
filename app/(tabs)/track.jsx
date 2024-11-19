import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Modal,
	Image,
} from "react-native";
import {
	CircleCollapse,
	MyMaps,
	ButtonTrack,
	ButtonActionTrack,
} from "../../components";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { images } from "../../constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS } from "../../constants/endpoint";

const Track = () => {
	const [isStart, setIsStart] = useState(false);
	const [isPause, setIsPause] = useState(false);
	const [seconds, setSeconds] = useState(0);
	const [distance, setDistance] = useState(0);
	const [selectedActivity, setSelectedActivity] = useState("walk");
	const [modalVisible, setModalVisible] = useState(false);
	const [modalCompleteVisible, setModalCompleteVisible] = useState(false);

	const intervalRef = useRef(null);
	const mapRef = useRef(null);

	useEffect(() => {
		console.log("Distance track: ", distance);
	}, [distance]);

	//* Post Activity
	const postActivity = async () => {
		const durationInHours = seconds / 3600;
		try {
			const token = await AsyncStorage.getItem("token");
			const response = await axios.post(
				`${ENDPOINTS.USER_POST_ACTIVITY}`,
				{
					activityType: selectedActivity,
					distance: distance,
					duration: durationInHours,
					date: new Date().toISOString(),
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			console.log("Activity posted:", response);
		} catch (error) {
			console.error("Error posting activity:", error);
		}
	};

	//* TRACKING FUNCTION
	const startTracking = () => {
		if (mapRef.current) {
			mapRef.current.startTracking();
		}
	};
	const stopTracking = () => {
		if (mapRef.current) {
			mapRef.current.stopTracking();
			clearInterval(intervalRef.current);
		}
	};
	const handleDistanceUpdate = (newDistance) => {
		setDistance(newDistance);
	};
	const startTimer = () => {
		intervalRef.current = setInterval(() => {
			setSeconds((prevSeconds) => prevSeconds + 1);
		}, 1000);
	};
	const stopTimer = () => {
		clearInterval(intervalRef.current);
	};

	//* Format menit:detik
	const formatTime = (totalSeconds) => {
		const minutes = Math.floor(totalSeconds / 60);
		const remainingSeconds = totalSeconds % 60;

		const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
		const formattedSeconds =
			remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

		return `${formattedMinutes}:${formattedSeconds}`;
	};

	//* HANDLE FUNCTION
	const handlePause = () => {
		if (isPause) {
			console.log("Resume Tracking");
			startTimer();
			startTracking();
		} else {
			stopTimer();
			mapRef.current.pauseTracking();
		}
		setIsPause(!isPause);
	};
	const handleStart = () => {
		setDistance(0);
		startTracking();
		startTimer();
		setIsStart(true);
		setIsPause(false);
		console.log("Start");
	};
	const handleFinish = () => {
		stopTimer();
		stopTracking();
		setIsStart(false);
		setModalVisible(true);
		console.log("Finish");
	};
	const handleSave = async () => {
		await postActivity();
		setModalVisible(false);
		setModalCompleteVisible(true);
		setSeconds(0);
		setTimeout(() => {
			setModalCompleteVisible(false);
		}, 1500);
	};

	const handleActivitySelect = (activityType) => {
		setSelectedActivity(activityType);
	};

	return (
		<SafeAreaView className="flex-1 relative">
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View
					className="flex-1 justify-center items-center"
					style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
				>
					<View className="w-80 bg-white shadow-lg p-5 items-center rounded-3xl">
						<Text className="text-2xl font-pbold">Your Track 🎉</Text>
						<View className="flex-row justify-center items-center space-x-5 mb-9 mt-5">
							<View className="items-center justify-center">
								<Text className="font-preguler text-lg mb-3">Distance</Text>
								<Text className="text-secondary font-pbold text-2xl">
									{distance.toFixed(2)}
								</Text>
								<Text className="font-pbold text-2xl">KM</Text>
							</View>
							<View className="w-[2px] h-24 bg-input" />
							<View className="items-center justify-center">
								<Text className="font-preguler text-lg mb-3">Duration</Text>
								<Text className="text-secondary font-pbold text-2xl">
									{formatTime(seconds)}
								</Text>
								<Text className="font-pbold text-2xl">Minute</Text>
							</View>
						</View>
						<TouchableOpacity
							className="bg-primary items-center p-2 rounded-xl w-2/3 mb-2"
							onPress={() => handleSave()}
						>
							<Text className="text-white font-pbold text-lg">Save</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="bg-red-100 border-4 border-red-600 items-center p-2 rounded-xl w-2/3"
							onPress={() => {
								setModalVisible(false);
								setSeconds(0);
							}}
						>
							<Text className="text-red-600 font-pbold text-lg">Discard</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalCompleteVisible}
				onRequestClose={() => setModalCompleteVisible(false)}
			>
				<View
					className="flex-1 justify-center items-center"
					style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
				>
					<View className="w-80 bg-white shadow-lg p-5 items-center rounded-3xl">
						<Text className="text-2xl font-pbold">Saved</Text>
						<View className="flex-row justify-center items-center space-x-5 mb-9 mt-5">
							<Image
								source={images.complete}
								className="w-32 h-32"
								resizeMode="contain"
							/>
						</View>
					</View>
				</View>
			</Modal>

			{isStart ? (
				<LinearGradient
					colors={["rgba(0,0,0,9)", "transparent"]}
					className="absolute top-0 w-full h-64 z-10 flex-row items-center justify-center space-x-5"
				>
					<View
						style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
						className="rounded-2xl px-6 py-3 items-center"
					>
						<Text className="font-psemibold text-lg">Distance</Text>
						<Text className="font-pbold text-xl text-secondary">
							{distance.toFixed(2)} KM
						</Text>
					</View>
					<View className="rounded-2xl bg-white px-6 py-3 items-center">
						<Text className="font-psemibold text-lg">Duration</Text>
						<Text className="font-pbold text-xl text-primary">
							{formatTime(seconds)}
						</Text>
					</View>
				</LinearGradient>
			) : null}

			<MyMaps ref={mapRef} onDistanceUpdate={handleDistanceUpdate} />

			<View className="py-5 mb-8 w-full absolute bottom-0 flex-row items-center justify-center space-x-8">
				{isStart && (
					<ButtonActionTrack
						selectedIcon={isPause ? "play" : "pause"}
						onPress={handlePause}
					/>
				)}
				<ButtonTrack
					title={isStart ? "Finish" : "Start"}
					onPress={isStart ? handleFinish : handleStart}
				/>

				<View>
					<CircleCollapse onActivitySelect={handleActivitySelect} />
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Track;
