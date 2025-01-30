import { createSlice } from '@reduxjs/toolkit';


interface UserState {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserAction {
  payload: {
    name: string;
    email: string;
    password: string;
  };
  type: string;
}

const initialState: UserState = {
  name: '',
  email: '',
  password: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerUser: (state: UserState, action: RegisterUserAction) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = action.payload.password;
    }
  },
});

export const { registerUser } = userSlice.actions;

export default userSlice.reducer;
