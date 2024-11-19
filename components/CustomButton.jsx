import { Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({
	title,
	handlePress,
	containerStyles,
	textStyle,
	disabled,
}) => {
	const dynamicContainerStyle = disabled
		? "opacity-70" 
		: "opacity-1";

	return (
		<TouchableOpacity
			onPress={handlePress}
			className={`min-h-[62px] justify-center items-center p-3 ${containerStyles} ${dynamicContainerStyle}`}
			activeOpacity={0.7}
			disabled={disabled}
		>
			<Text className={`text-white font-psemibold text-lg ${textStyle}`}>
				{title || "Default Title"}
			</Text>
		</TouchableOpacity>
	);
};

export default CustomButton;
