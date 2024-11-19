import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";

import { icons } from "../constants";

const FormField = ({
	value,
	placeholder,
	handleChange,
	otherStyles,
	inputStyle,
	...props
}) => {
	const [showPass, setShowPass] = useState(false);

	return (
		<View className={`space-y-2 ${otherStyles}`}>
			<View className={`bg-input w-full px-4 focus:border-secondary focus:border-2 items-center flex-row ${inputStyle}`}>
				<TextInput
					className="w-full flex-1 text-black font-psemibold text-base"
					value={value}
					placeholder={placeholder}
					placeholderTextColor="#7b7b8b"
					onChangeText={handleChange}
					secureTextEntry={placeholder === "Password" && !showPass}
				/>

				{placeholder === "Password" && (
					<TouchableOpacity
						className="text-secondary-200 font-pmedium"
						onPress={() => setShowPass(!showPass)}
					>
						<Image
							source={!showPass ? icons.eye : icons.eyeHide}
							className="w-6 h-6"
							resizeMode="contain"
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default FormField;
