import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ButtonActionTrack = ({ selectedIcon, onPress }) => {
	return (
		<TouchableOpacity
			className="w-16 h-16 rounded-full bg-white items-center justify-center"
			onPress={onPress}
		>
			<MaterialCommunityIcons name={selectedIcon} size={30} color="black" />
		</TouchableOpacity>
	);
};

export default ButtonActionTrack;
