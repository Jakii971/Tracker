import {
	View,
	Text,
	Dimensions,
	Image,
	FlatList,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { images } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import {  ENDPOINTS } from "../../constants/endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useSelector } from "react-redux";

const windowWidth = Dimensions.get("window").width;

const ListRank = ({ item }) => {
	const user = useSelector((state) => state.profile.user);
	const currentUser = user.userName;

	return (
		<>
			{item.username === currentUser ? (
				<LinearGradient
					className="flex-row w-[90vw] items-center justify-between space-x-4 p-3"
					colors={["#fff6d6", "#FCD12A"]}
					start={{ x: 1, y: 1 }}
					end={{ x: 0, y: 1 }}
				>
					<View className="flex-row items-center gap-2">
						<Text className="text-white font-pbold text-base px-3">
							{item.rankGlobal}
						</Text>
						<Image source={images.ppBlank} className="w-[60px] h-[60px] p-5" />
						<View className="px-3">
							<Text className="font-pbold">{item.nama ?? item.username}</Text>
							<Text className="font-preguler">@{item.username}</Text>
						</View>
					</View>
					<Text className="font-pbold">
						{item.totalPoints?.toFixed(0)} Point
					</Text>
				</LinearGradient>
			) : (
				<View className="flex-row w-[90vw] items-center justify-between space-x-4 p-3">
					<View className="flex-row items-center gap-2">
						<Text className="font-pbold text-base px-3">{item.rankGlobal}</Text>
						<Image source={images.ppBlank} className="w-[60px] h-[60px] p-5" />
						<View className="px-3">
							<Text className="font-pbold">{item.nama ?? item.username}</Text>
							<Text className="font-preguler">@{item.username}</Text>
						</View>
					</View>
					<Text className="text-primary">
						{item.totalPoints?.toFixed(0)} Point
					</Text>
				</View>
			)}
		</>
	);
};

const TabRank = () => {
	const [ranks, setRanks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const user = useSelector((state) => state.profile.user);

	const fetchingData = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			const response = await axios.get(`${ENDPOINTS.USER_LEADERBOARDS}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setRanks(response.data);
		} catch (error) {
			console.error("Error fetching rank:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchingData();
		}, [])
	);

	const firstRank = ranks[0];
	const secondRank = ranks[1];
	const thirdRank = ranks[2];

	return (
		<>
			{isLoading ? (
				<ActivityIndicator size="large" color="#ffffff" />
			) : (
				<View
					className="bg-white items-center pt-24 pb-14"
					style={{ width: windowWidth }}
				>
					<View className="justify-center items-center p-3">
						<View
							className="w-[90vw] flex-row bg-white justify-between items-center p-3 rounded-3xl"
							style={style.boxShadow}
						>
							<View className="items-center justify-center w-28">
								<Text className="font-pregular">
									#<Text className="font-pbold text-base">2</Text>
								</Text>
								<Image
									source={images.ppBlank}
									className="w-[60px] h-[60px] p-5"
								/>
								<Text className="font-pbold text-sm flex-wrap text-center">
									{secondRank.nama ?? secondRank.username}
								</Text>
								<Text className="font-pbold text-xs">
									{secondRank.totalPoints?.toFixed(0)} Point
								</Text>
								<Text className="font-pmedium text-xs">
									@{secondRank.username}
								</Text>
							</View>

							<LinearGradient
								className="items-center absolute left-[50%] -translate-x-12 bottom-0 h-56 w-[30vw] rounded-t-full p-3 pt-10"
								colors={["#fff", "#FCD12A"]}
								start={{ x: 0, y: 0.2 }}
								end={{ x: 0, y: 1 }}
								style={style.boxShadow}
							>
								<Image
									source={images.crown}
									className="w-[60px] h-[60px] absolute z-10"
								/>
								<Image
									source={images.ppBlank}
									className="w-[60px] h-[60px] p-5"
								/>
								<Text className="font-pbold text-sm flex-wrap text-center">
									{firstRank.nama ?? firstRank.username}
								</Text>
								<Text className="font-pbold text-xs">
									{firstRank.totalPoints.toFixed(0)} Point
								</Text>
								<Text className="font-pmedium text-xs">
									@{firstRank.username}
								</Text>
							</LinearGradient>

							<View className="items-center justify-center w-28">
								<Text className="font-pregular">
									#<Text className="font-pbold text-base">3</Text>
								</Text>
								<Image
									source={images.ppBlank}
									className="w-[60px] h-[60px] p-5"
								/>
								<Text className="font-pbold text-sm flex-wrap text-center">
									{thirdRank.nama ?? thirdRank.username}
								</Text>
								<Text className="font-pbold text-xs">
									{thirdRank.totalPoints.toFixed(0)} Point
								</Text>
								<Text className="font-pmedium text-xs">
									@{thirdRank.username}
								</Text>
							</View>
						</View>
					</View>

					<View
						className="p-2 rounded-3xl bg-white mb-4 pb-5"
						style={style.boxShadow}
					>
						<FlatList
							data={ranks.slice(3)}
							keyExtractor={(item, index) => index.toString()}
							renderItem={({ item }) => <ListRank item={item} />}
						/>
					</View>
				</View>
			)}
		</>
	);
};

const style = StyleSheet.create({
	boxShadow: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 5,
	},
});

export default TabRank;
