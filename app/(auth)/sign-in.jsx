import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { CustomButton, FormField } from "../../components";
import { Link } from "expo-router";
import { images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../Context/useAuth";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { loginUser } = useAuth();

	const handleLogin = async () => {
		setIsLoading(true);
		try {
			await loginUser(email, password);
			console.log("Button login pressed!");
		} catch (err) {
			alert(err);
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SafeAreaView className="flex-1 justify-center items-center bg-primary relative">
			<Image
				source={images.signIn}
				className="w-[100%] absolute -top-[110px] left-0 right-0"
				resizeMode="contain"
			/>

			<View className="bg-white justify-center items-center h-2/4 w-full rounded-t-[50px] absolute bottom-0 left-0 right-0">
				<View className="w-full px-10">
					<FormField
						placeholder={"Email"}
						inputStyle={"h-16 rounded-full mb-4"}
						handleChange={(text) => setEmail(text)}
						value={email}
					/>
					<FormField
						placeholder={"Password"}
						inputStyle={"h-16 rounded-full mb-5"}
						handleChange={(text) => setPassword(text)}
						value={password}
					/>
					<CustomButton
						containerStyles={"bg-black rounded-full mb-4"}
						textStyle={"text-white"}
						title={isLoading ? "Logging in..." : "Sign In"}
						handlePress={handleLogin}
						disabled={email && password ? false : true}
					/>
				</View>
				<View className="bg-input w-[80%] h-0.5" />
				<View className="flex-row items-center pt-5 justify-center gap-2">
					<Text className="text-md text-gray-500 font-pregular">
						Don't have an account?
					</Text>
					<Link
						href={"/sign-up"}
						className="text-md text-secondary font-psemibold"
					>
						Sign Up
					</Link>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default SignIn;
