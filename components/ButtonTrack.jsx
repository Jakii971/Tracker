import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const ButtonTrack = ({ title, onPress }) => {
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			className="ml-8 p-3 w-28 h-28 bg-primary rounded-full justify-center items-center"
			onPress={onPress}
		>
			<Text className="text-black font-pbold text-2xl uppercase">{title}</Text>
		</TouchableOpacity>
	);
};

export default ButtonTrack;
