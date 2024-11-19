import axios from "axios";
import { ENDPOINTS } from "../constants/endpoint";

export const loginAPI = async (email, password) => {
	console.log(email, password + " loginAPI");
	try {
		console.log("Login...");
		const response = await axios.post(`${ENDPOINTS.LOGIN}`, {
			email: email,
			password: password,
		});
		console.log("data= ", response.data);
		return response.data;
	} catch (error) {
		if (error.response) {
			throw new Error(
				error.response.data
			);
		} else if (error.request) {
			throw new Error(
				`No response from server. Please check your network connection or server status. API = ${ENDPOINTS.LOGIN}`
			);
		} else {
			console.error("Error Message: ", error);
			throw new Error(`Request Error: ${error}`);
		}
	}
};

export const registerAPI = async (username, email, password) => {
	try {
		console.log("Register...");
		const response = await axios.post(`${ENDPOINTS.REGISTER}`, {
			username: username,
			email: email,
			password: password,
		});
		console.log("data= " + response.data);
		return response.data;
	} catch (error) {
		if (error.response) {
			throw new Error(
				JSON.stringify(error.response.data)
			);
		} else if (error.request) {	
			console.error("No Response Received: ", error.request);
			throw new Error(
				"No response from server. Please check your network connection or server status."
			);
		} else {
			console.error("Error Message: ", error.message);
			throw new Error(`Request Error: ${error.message}`);
		}
	}
};
