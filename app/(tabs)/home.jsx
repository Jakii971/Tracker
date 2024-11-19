import {
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
	ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { icons, images } from "../../constants";
import { SearchInput, CorouselImages, MyLineChart } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../redux/slice/profileSlice";
import { ENDPOINTS } from "../../constants/endpoint";

const Home = () => {
	const [refreshing, setRefreshing] = React.useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [recap, setRecap] = useState();
	const user = useSelector((state) => state.profile.user);
	const dispatch = useDispatch();

	const fetchingData = async () => {
		const FCMTOken = await AsyncStorage.getItem("fcmToken");
		console.log("FCM Token: ", JSON.stringify(FCMTOken));

		try {
			const token = await AsyncStorage.getItem("token");
			const response = await axios.get(`${ENDPOINTS.USER_RECAP}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setRecap(response.data);
		} catch (error) {
			console.error("Error fetching monthly recap:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		dispatch(fetchProfile());
		fetchingData();
	}, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		dispatch(fetchProfile());
		fetchingData();
		console.log("Refreshing...");
		console.log("User: ",user)

		setRefreshing(false);
	});

	const pinterest = [
		"https://i.pinimg.com/564x/b0/01/bd/b001bd62485e326a3d5a9b299dd803c4.jpg",
		"https://i.pinimg.com/564x/28/c1/df/28c1df0b7ee4d2cf5142369a0c1e0f64.jpg",
		"https://i.pinimg.com/564x/46/c3/60/46c3603f35aa1dbe7624037d35d427e3.jpg",
	];

	return (
		<SafeAreaView className="flex-1 bg-white">
			{isLoading ? (
				<ActivityIndicator size="large" color="#fcd12a" />
			) : (
				<ScrollView
					className="mt-6 px-5 space-y-6"
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							colors={["#fcd12a"]}
							progressBackgroundColor="white"
						/>
					}
				>
					<View className="justify-between items-start flex-row mb-6">
						<View>
							<Text className="text-2xl font-pbold text-black">
								Hi {user.loading ? "..." : user.nama ?? user.userName}
							</Text>
							<Text className="text-sm font-psemibold text-slate-400">
								Welcome to Tracking App
							</Text>
						</View>

						<TouchableOpacity
							className="mt-1.5"
							onPress={() => {
								router.push("/notificationScreen");
							}}
						>
							<Image
								source={icons.notification}
								className="w-9 h-10"
								resizeMode="contain"
							/>
						</TouchableOpacity>
					</View>
					<SearchInput
						placeholder={"Search"}
						handlePress={() => {
							router.push("/searchScreen");
						}}
						otherStyles={"bg-input border-input"}
						editable={false}
					/>
					<CorouselImages images={pinterest} />

					<View className="rounded-lg bg-[#efefef]">
						<MyLineChart monthlyData={recap} />
					</View>

					<View className="w-full flex-row justify-end items-center relative h-72 my-5">
						<Image
							source={images.walkRecap}
							resizeMode="contain"
							className=" z-10 w-80 h-5/6 absolute right-14"
						/>
						<View className="bg-[#ff735c] shadow-xl shadow-[#ff735c] -z-20 h-[90%] rounded-xl p-3">
							<Text className="text-white font-psemibold text-3xl">
								{`Your \n`}
								<Text>Recap</Text>
							</Text>
							<Text className="font-psemibold pb-5">This month:</Text>
							{recap && recap.length > 0 ? (
								<View className="space-y-3">
									<Text className="text-white font-psemibold text-4xl pt-4">
										{recap[0].totalDistance.toFixed(0) ?? 0}
										<Text className="text-black font-psemibold text-xl">
											KM
										</Text>
									</Text>
									<Text className="text-white font-psemibold text-4xl pt-4">
										{recap[0].totalDuration.toFixed(0) ?? 0}
										<Text className="text-black font-psemibold text-xl">
											hours
										</Text>
									</Text>
								</View>
							) : (
								<Text className="text-white text-sm">
									No activity data available
								</Text>
							)}
						</View>
					</View>
				</ScrollView>
			)}
			<StatusBar style="dark" />
		</SafeAreaView>
	);
};

export default Home;
