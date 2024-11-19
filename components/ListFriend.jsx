import { View, Text, Image, TouchableOpacity } from "react-native";
import { images } from "../constants";
import React from "react";

const ListFriend = ({ nama, username, title, handleOnPress }) => {
	return (
		<View className="justify-between items-center flex-row p-2  border-b-[1px] border-slate-200">
			<View className="flex-row items-center gap-4">
				<Image source={images.ppBlank} className="w-[50px] h-[50px] px-5" />
				<Text>
					{`${nama ?? username}\n`}
					<Text>@{username ?? "johndoe"}</Text>
				</Text>
			</View>
			<View>
				<TouchableOpacity className="border-2 border-primary rounded-lg px-3 py-1" onPress={handleOnPress} >
					<Text className="text-primary">{title}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ListFriend;
