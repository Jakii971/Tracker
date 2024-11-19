import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, ENDPOINTS } from "../../constants/endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchProfile = createAsyncThunk(
	"profile/fetchProfile",
	async () => {
		const token = await AsyncStorage.getItem("token");
		const response = await axios
			.get(`${ENDPOINTS.USER_PROFILE}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => res.data);
		return response;
	}
);

const profileSlice = createSlice({
	name: "profile",
	initialState: {
		loading: false,
		user: [],
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProfile.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(fetchProfile.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default profileSlice.reducer;
