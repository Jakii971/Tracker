import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    token: null
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
    },
    clearUser: (state) => {
      state.userInfo = null;
      state.token = null;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
