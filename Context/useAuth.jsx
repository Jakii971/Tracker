import { createContext, useEffect, useState, useContext } from "react";
import { router } from "expo-router";
import { loginAPI, registerAPI } from "../Services/AuthService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slice/userSlice";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [token, setToken] = useState(null);
	const [isReady, setIsReady] = useState(false);
	const dispatch = useDispatch();

	//* Di load pertama kali saat app di buka
	useEffect(() => {
		const loadUserData = async () => {
			const token = await AsyncStorage.getItem("token");
			
			if (token) {
				setToken(token);
				axios.defaults.headers.common["Authorization"] = "Bearer " + token;
			}
			setIsReady(true);
		};
		loadUserData();
	}, []);

	const registerUser = async (username, email, password) => {
		try {
			const res = await registerAPI(username, email, password);
			if (res) {
				const userObj = {
					userName: res.userName,
					email: res.email,
				};
				await AsyncStorage.setItem("token", res.token);
				await AsyncStorage.setItem("user", JSON.stringify(userObj));
				setToken(res.token);

				dispatch(setUser({
          userInfo: userObj,
          token: res.token,
        }));
				
				router.push("/home");
			}
		} catch (err) {
			throw err;
		}
	};

	const loginUser = async (email, password) => {
		try {
			const res = await loginAPI(email, password);
			if (res) {
				const userObj = {
					userName: res.userName,
					email: res.email,
				};
				await AsyncStorage.setItem("token", res.token);
			await AsyncStorage.setItem("user", JSON.stringify(userObj));
				setToken(res.token);

				dispatch(setUser({
          userInfo: userObj,
          token: res.token,
        }));

				console.log("login");
				router.push("/home");
			}
		} catch (err) {
			throw err;
		}
	};

	const isLoggedIn = () => {
		return !!token;
	};

	const logout = async () => {
		await AsyncStorage.removeItem("token");
		await AsyncStorage.removeItem("user");
		await AsyncStorage.removeItem("fcmToken");
		setToken("");
		router.push("/sign-in");
	};

	return (
		<UserContext.Provider
			value={{ loginUser, token, logout, isLoggedIn, registerUser }}
		>
			{isReady ? children : null}
		</UserContext.Provider>
	);
};

export const useAuth = () => useContext(UserContext);
