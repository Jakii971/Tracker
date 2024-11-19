import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import { ListFriend } from "../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL, ENDPOINTS } from "../../constants/endpoint";
import { useFocusEffect } from "@react-navigation/native";

const TabFriends = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [friends, setFriends] = useState([]);
	const [onDispatch, setOnDispatch] = useState(false);

	const fetchingData = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			const response = await axios.get(`${ENDPOINTS.USER_FOLLOWING}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setFriends(response.data);
			console.log("TabFriend= ", JSON.stringify(response.data, null, 2));
		} catch (error) {
			console.error("Error fetching following user:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const unfollowUser = async (followingId) => {
		console.log("Try to Unfollowing with id =  ", followingId);
		try {
			const token = await AsyncStorage.getItem("token");
			await axios.delete(`${ENDPOINTS.UNFOLLOW}/${followingId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setOnDispatch(!onDispatch);
			console.log(`Unfollowed user with ID: ${followingId}`);
		} catch (error) {
			console.error("Error unfollowing user:", error);
			console.error("Error Message unfollowing user:", error.message);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchingData();
			console.log("TabFriend= ", friends);
		}, [onDispatch])
	);

	const renderItem = ({ item }) => {
		return (
			<View className="w-[100vw] px-3 bg-white">
				<ListFriend
					nama={item.nama}
					username={item.username}
					title={"Unfollow"}
					handleOnPress={() => unfollowUser(item.followingId)}
				/>
			</View>
		);
	};

	return (
		<View className="">
			{isLoading ? (
				<ActivityIndicator size="large" color="#ffff" />
			) : (
				<FlatList
					renderItem={renderItem}
					data={friends}
					keyExtractor={(item) => item.followingId}
				/>
			)}
		</View>
	);
};

export default TabFriends;
