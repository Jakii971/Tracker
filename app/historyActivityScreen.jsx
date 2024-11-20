import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../constants/endpoint";
import { icons } from "../constants";

const historyActivityScreen = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	const convertHoursToMinutesSeconds = (hours) => {
		const totalMinutes = hours * 60;

		const minutes = Math.floor(totalMinutes);
		const seconds = Math.round((totalMinutes - minutes) * 60);

		return `${minutes}:${seconds.toString().padStart(2, "0")}`; // Tambahkan nol di depan detik jika perlu
	};

	const fetchActivity = async () => {
		try {
			const response = await axios.get(`${ENDPOINTS.GET_ALL_USERS_ACTIVITY}`);
			console.log(response.data);
			setData(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchActivity();
	}, []);

	const loadMoreData = () => {
		if (!loading) {
			setLoading(true);
			fetchActivity().then((newData) => {
				setData([...data, ...newData]);
				setLoading(false);
			});
		}
	};

	const renderItem = ({ item }) => {
		const { activityType, distance, duration, date } = item;

		const formatActivityType =
			activityType.charAt(0).toUpperCase() + activityType.slice(1);
		// const formatDistance = distance.toFixed(1);
		// const formatTime = convertHoursToMinutesSeconds(duration);
		const formatedDate = new Date(date).toLocaleDateString("id-ID", {
			weekday: "long",
			year: "numeric",
			month: "short",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});

		const colorMap = {
			run: "bg-red-600",
			walk: "bg-blue-500",
			bicycle: "bg-green-500",
		};

		const activityColorClass = colorMap[activityType] || "bg-gray-300";

		return (
			<View className="mx-5 my-2 h-32 bg-white rounded-lg p-3">
				<View className="flex-row justify-between w-[85%]">
					<Text className="font-pbold text-base">{formatActivityType}</Text>
					<Text className="font-pregular text-xs">{formatedDate}</Text>
				</View>
				<View
					className={`absolute top-0 right-0 h-[123%] w-[15%] rounded-tr-lg rounded-br-lg ${activityColorClass}`}
				/>
				<View className="flex-row justify-around w-[85%]">
					<View className="flex-row items-center gap-2">
						<Image
							source={icons.time}
							className="w-12 h-w-12"
							resizeMode="contain"
						/>
						<Text className="font-psemibold">
							{`Duration \n`}
							<Text className="font-pregular">{duration.toFixed(1)} H</Text>
						</Text>
					</View>
					<View className="flex-row items-center gap-2">
						<Image
							source={icons.jarak}
							className="w-12 h-w-12"
							resizeMode="contain"
						/>
						<Text className="font-psemibold">
							{`Distance \n`}
							<Text className="font-pregular">{distance.toFixed(1)} Km</Text>
						</Text>
					</View>
				</View>
			</View>
		);
	};

	return (
		<View>
			<FlatList
				className="pt-3"
				data={data}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				onEndReached={loadMoreData}
				onEndReachedThreshold={0.5}
			/>
		</View>
	);
};

export default historyActivityScreen;
