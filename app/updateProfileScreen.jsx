import {
	View,
	Text,
	Image,
	Dimensions,
	TouchableOpacity,
	ScrollView,
	TextInput,
	Modal,
	KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons, images } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../redux/slice/profileSlice";
import { ENDPOINTS } from "../constants/endpoint";
import DropDownPicker from "react-native-dropdown-picker";

const windowWidth = Dimensions.get("window").width;

const aspectRatio = 780 / 597;
const height = windowWidth / aspectRatio;

const UpdateProfileScreen = () => {
	const user = useSelector((state) => state.profile.user);
	const dispatch = useDispatch();
	const [modalSaveVisible, setModalSaveVisible] = useState(false);
	const [value, setValue] = useState({
		nama: "",
		nrp: "",
		company: "",
		divisi: "",
		contact: "",
	});

	const [open, setOpen] = useState(false);
	const [items, setItems] = useState([
		{ label: "IT", value: "IT" },
		{ label: "Sales Force", value: "Sales Force" },
		{ label: "DAD", value: "DAD" },
	]);

	useEffect(() => {
		if (user) {
			setValue({
				nama: user.nama,
				nrp: user.nrp,
				company: user.company,
				divisi: user.divisi,
				contact: user.contact,
			});
		}
	}, []);

	const updateProfile = async () => {
		console.log(`${ENDPOINTS.USER_UPDATE_PROFILE}`);
		try {
			const token = await AsyncStorage.getItem("token");
			const response = await axios.patch(
				`${ENDPOINTS.USER_UPDATE_PROFILE}`,
				value,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log("Profile updated:", response.data);
			setModalSaveVisible(true);
			setTimeout(() => {
				router.back();
			}, 1500);
			return response.data;
		} catch (error) {
			if (error.response) {
				const { status, data } = error.response;
				if (status === 400 && data.errors) {
					const errorMessages = Object.values(data.errors).flat().join(", ");
					alert(`Gagal memperbarui profil: ${errorMessages}`);
				} else {
					alert(
						"Terjadi kesalahan saat memperbarui profil. Silakan coba lagi."
					);
				}
			} else if (error.request) {
				alert("Tidak dapat terhubung ke server. Silakan coba lagi.");
			}
		}
	};

	const handleSave = async () => {
		await updateProfile();
		dispatch(fetchProfile());
	};

	return (
		<SafeAreaView className="flex-1 bg-primary">
			<Image
				source={images.texture}
				resizeMode="contain"
				className="absolute"
				style={{ width: "100%", height }}
			/>
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalSaveVisible}
				onRequestClose={() => setModalSaveVisible(false)}
			>
				<View
					className="flex-1 justify-center items-center"
					style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
				>
					<View className="w-80 bg-white shadow-lg p-5 items-center rounded-3xl">
						<Text className="text-md font-pmedium">Update Profile Success</Text>
						<Text className="text-2xl font-pbold">Saved</Text>
						<View className="flex-row justify-center items-center space-x-5 mb-9 mt-5">
							<Image
								source={images.complete}
								className="w-32 h-32"
								resizeMode="contain"
							/>
						</View>
					</View>
				</View>
			</Modal>

			<KeyboardAvoidingView>
				<View className="bg-white rounded-t-[60px] mt-32 mb-16">
					<View className="p-2 items-center -top-16">
						<Image
							source={images.ppBlank}
							resizeMode="contain"
							className="w-28 h-28 left-28"
						/>
						<View className="w-[100vw] items-center bg-white">
							<View className="w-[85vw] m-6 h-[100%]">
								<View className="mt-3 ">
									<View>
										<Text className="text-base font-preguler">Nama</Text>
									</View>
									<View className="flex-row items-center border-2 border-yellow-200 p-2 mt-1 rounded-xl">
										<TextInput
											className="flex-1"
											placeholder="Masukkan disini..."
											onChange={(e) =>
												setValue((prev) => ({
													...prev,
													nama: e.nativeEvent.text,
												}))
											}
											value={value.nama}
										/>
										<Image source={icons.edit} className="w-6 h-6 ml-2" />
									</View>
								</View>
								<View className="mt-3 ">
									<View className="flex-row items-center gap-2">
										<Image
											source={icons.nrp}
											resizeMode="contain"
											className="w-7 h-7"
										/>
										<Text className="text-base font-preguler">NRP</Text>
									</View>
									<View className="flex-row items-center border-2 border-yellow-200 p-2 mt-1 rounded-xl">
										<TextInput
											className="flex-1"
											placeholder="Masukkan disini..."
											onChange={(e) =>
												setValue((value) => ({
													...value,
													nrp: e.nativeEvent.text,
												}))
											}
											value={value.nrp}
										/>
										<Image source={icons.edit} className="w-6 h-6 ml-2" />
									</View>
								</View>
								<View className="mt-3 ">
									<View className="flex-row items-center gap-2">
										<Image
											source={icons.company}
											resizeMode="contain"
											className="w-7 h-7"
										/>
										<Text className="text-base font-preguler">Company</Text>
									</View>
									<View className="flex-row items-center border-2 border-yellow-200 p-2 mt-1 rounded-xl">
										<TextInput
											className="flex-1"
											placeholder="Masukkan disini..."
											onChange={(e) =>
												setValue((value) => ({
													...value,
													company: e.nativeEvent.text,
												}))
											}
											value={value.company}
										/>
										<Image source={icons.edit} className="w-6 h-6 ml-2" />
									</View>
								</View>

								<View className="mt-3 ">
									<View className="flex-row items-center gap-2">
										<Image
											source={icons.divisi}
											resizeMode="contain"
											className="w-7 h-7"
										/>
										<Text className="text-base font-preguler">Divison</Text>
									</View>
									<DropDownPicker
										open={open}
										value={value.divisi}
										items={items}
										setOpen={setOpen}
										setValue={(callback) =>
											setValue((prev) => ({
												...prev,
												divisi:
													typeof callback === "function"
														? callback(prev.divisi)
														: callback,
											}))
										}
										setItems={setItems}
										style={{
											borderColor: "#fef08a",
											borderStyle: "solid",
											borderWidth: 2,
										}}
									/>
									{/* <View className="flex-row items-center border-2 border-yellow-200 p-2 mt-1 rounded-xl">
										<TextInput
											className="flex-1"
											placeholder="Masukkan disini..."
											onChange={(e) =>
												setValue((value) => ({
													...value,
													divisi: e.nativeEvent.text,
												}))
											}
											value={value.divisi}
										/>
										<Image source={icons.edit} className="w-6 h-6 ml-2" />
									</View> */}
								</View>

								<View className="my-3 ">
									<View className="flex-row items-center gap-2">
										<Image
											source={icons.contact}
											resizeMode="contain"
											className="w-7 h-7"
										/>
										<Text className="text-base font-preguler">Contact</Text>
									</View>
									<View className="flex-row items-center border-2 border-yellow-200 p-2 mt-1 rounded-xl">
										<TextInput
											className="flex-1"
											placeholder="Masukkan disini..."
											onChange={(e) =>
												setValue((value) => ({
													...value,
													contact: e.nativeEvent.text,
												}))
											}
											value={value.contact}
										/>
										<Image source={icons.edit} className="w-6 h-6 ml-2" />
									</View>
								</View>
								<TouchableOpacity
									className="bg-primary rounded-3xl px-3 py-2 mt-5 items-center"
									onPress={handleSave}
								>
									<Text className="text-white font-pbold">Save</Text>
								</TouchableOpacity>
								<TouchableOpacity
									className="border-2 border-red-500  bg-red-100 rounded-3xl px-3 py-2 mt-2 items-center"
									onPress={() => router.back()}
								>
									<Text className="text-red-500 border-red-500 font-pbold">
										Cancel
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default UpdateProfileScreen;
