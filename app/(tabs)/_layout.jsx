import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router, Tabs } from "expo-router";
import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
	return (
		<View className="items-center justify-center gap-2">
			<Image
				source={icon}
				resizeMode="contain"
				tintColor={color}
				className="w-6 h-6"
			/>
			<Text
				className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
				style={{ color: color }}
			>
				{name}
			</Text>
		</View>
	);
};

const TabLayout = () => {
	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarActiveTintColor: "#fcc419",
				tabBarInactiveTintColor: "#000000",
				tabBarStyle: {
					backgroundColor: "#FFFFFF",
					height: 84,
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={icons.home}
							color={color}
							name="Home"
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="recap"
				options={{
					title: "Recap",
					headerShown: false,
					headerRight: () => (
						<TouchableOpacity onPress={() => router.push("/historyActivityScreen")} className="mr-4">
							<Image source={icons.history2} className="w-7 h-7"/>
						</TouchableOpacity>
					),
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={icons.recap}
							color={color}
							name="Recap"
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="track"
				options={{
					title: "Track",
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={icons.track}
							color={color}
							name="Track"
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={icons.profile}
							color={color}
							name="Profile"
							focused={focused}
						/>
					),
				}}
			/>
		</Tabs>
	);
};

export default TabLayout;
