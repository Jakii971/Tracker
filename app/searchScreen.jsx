import {
	View,
	Text,
	SafeAreaView,
	ScrollView,
	RefreshControl,
	ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SearchInput, ListFriend } from "../components";
import { ENDPOINTS } from "../constants/endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const SearchScreen = () => {
	const [refreshing, setRefreshing] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [users, setUsers] = useState([]);
	const searchInputRef = useRef(null);
	const [onDispatch, setOnDispatch] = useState(false);
	const [searchKeywords, setSearchKeywords] = useState("");

	const fetchingData = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			const response = await axios.get(`${ENDPOINTS.GET_ALL_USERS}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log("data users= ", JSON.stringify(response.data, null, 2));
			setUsers(response.data);
		} catch (error) {
			console.error("Get All users:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const followUser = async (userId) => {
		try {
			const token = await AsyncStorage.getItem("token");
			await axios.post(
				`${ENDPOINTS.FOLLOW}/${userId}`,

				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setOnDispatch(!onDispatch);
			console.log(`Followed user with ID: ${userId}`);
		} catch (error) {
			console.error("Error following user:", error);
		}
	};

	useEffect(() => {
		fetchingData();
		if (searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [onDispatch]);

	const filterKeyword = users.filter(
		(user) =>
			user.userName &&
			user.userName.toLowerCase().includes(searchKeywords.toLowerCase())
	);
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		console.log("Refreshing...");
		setRefreshing(false);
	});

	return (
		<SafeAreaView className="flex-1 bg-white">
			<ScrollView
				className="px-5 space-y-6"
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={["#fcd12a"]}
						progressBackgroundColor="white"
					/>
				}
			>
				<SearchInput
					ref={searchInputRef}
					otherStyles={"bg-input border-input mt-6"}
					editable={true}
					placeholder={"Search"}
					searchKeyword={searchKeywords}
					setSearchKeyword={setSearchKeywords}
				/>
				{isLoading ? (
					<ActivityIndicator size="large" color="#fcd12a" />
				) : (
					<View>
						{filterKeyword.length > 0 ? (
							filterKeyword.map((user, index) => (
								<ListFriend
									key={index}
									nama={user.nama}
									username={user.userName}
									title={"Follow"}
									handleOnPress={() => followUser(user.id)}
								/>
							))
						) : (
							<Text style={{ textAlign: "center", marginTop: 20 }}>
								User not found
							</Text>
						)}
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

export default SearchScreen;
