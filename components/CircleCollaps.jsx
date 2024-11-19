import React, { useState, useRef } from "react";
import { View, Animated, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CircleCollapse = ({ onActivitySelect }) => {
	const [expanded, setExpanded] = useState(false);
	const [selectedIcon, setSelectedIcon] = useState("walk");
	const animationValue = useRef(new Animated.Value(0)).current;

	const toggleExpand = () => {
		// Animasi untuk memanjangkan atau mengecilkan lingkaran
		Animated.timing(animationValue, {
			toValue: expanded ? 0 : 1,
			useNativeDriver: false,
			duration: 300,
		}).start();
		setExpanded(!expanded);
	};

	const handleIconSelect = (icon) => {
		setSelectedIcon(icon);
		toggleExpand();

		let activityType;
		if (icon === "bike") {
			activityType = "bicycle";
		} else if (icon === "walk") {
			activityType = "walk";
		} else if (icon === "run-fast") {
			activityType = "run";
		}

		// Kirimkan tipe aktivitas yang sudah dipetakan ke parent
		if (onActivitySelect) {
			onActivitySelect(activityType);
		}
	};

	//* Animated translateY untuk menggerakkan opsi ikon ke atas
	const translateY = animationValue.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -180],
	});

	return (
		<View className="items-center">
			<Animated.View
				style={{ transform: [{ translateY }] }}
				className="absolute bg-secondary items-center p-2 rounded-full"
			>
				{expanded && (
					<View className="items-center justify-center">
						<TouchableOpacity
							className="w-12 h-12 rounded-full bg-white items-center justify-center mb-2"
							onPress={() => handleIconSelect("bike")}
						>
							<MaterialCommunityIcons name="bike" size={24} color="black" />
						</TouchableOpacity>

						<TouchableOpacity
							className="w-12 h-12 rounded-full bg-white items-center justify-center mb-2"
							onPress={() => handleIconSelect("walk")}
						>
							<MaterialCommunityIcons name="walk" size={24} color="black" />
						</TouchableOpacity>

						<TouchableOpacity
							className="w-12 h-12 rounded-full bg-white items-center justify-center"
							onPress={() => handleIconSelect("run-fast")}
						>
							<MaterialCommunityIcons name="run-fast" size={24} color="black" />
						</TouchableOpacity>
					</View>
				)}
			</Animated.View>

			<TouchableOpacity
				className="w-16 h-16 rounded-full bg-white border-2 border-secondary items-center justify-center"
				onPress={toggleExpand}
			>
				<MaterialCommunityIcons name={selectedIcon} size={30} color="black" />
			</TouchableOpacity>
		</View>
	);
};

export default CircleCollapse;
