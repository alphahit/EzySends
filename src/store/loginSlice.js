import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  userId: null,
  userEmail: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
      state.userEmail = action.payload.userEmail;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.userId = null;
      state.userEmail = null;
    },
  },
});

export const { loginSuccess, logout } = loginSlice.actions;
export default loginSlice.reducer;