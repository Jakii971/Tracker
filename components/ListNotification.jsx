import { View, Text, Image, TouchableOpacity } from "react-native";
import { images } from "../constants";
import React from "react";

const ListNotification = ({ title, body, timestamp }) => {
	return (
		<View className="flex-1 justify-between items-center flex-row h-24 border-b-[1px] border-slate-200">
			<View className="flex-row items-center gap-4">
				<Image source={images.ppBlank} className="w-[50px] h-[50px] px-5" />
			</View>

			<View className="flex-row flex-1 pl-4">
				<Text className="text-lg font-psemibold leading-9">
					{`${title}\n`}
					<Text className="text-xs font-pregular">
						{body}
					</Text>
				</Text>
			</View>
			<View className="flex-2">
				<Text className="text-slate-400 text-xs">{timestamp}</Text>
			</View>
		</View>
	);
};

export default ListNotification;
