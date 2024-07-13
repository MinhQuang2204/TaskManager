import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '../history';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialUser = localStorage.getItem('auth')
	? JSON.parse(localStorage.getItem('auth'))
	: null;

const initialState = {
	isLoading: false,
	currentUser: initialUser,
	error: null,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState: initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.isLoading = false;
		},
		loginFailure: (state, action) => {
			state.error = action.payload;
			state.isLoading = false;
		},
		registerSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.isLoading = false;
		},
		registerFailure: (state, action) => {
			state.error = action.payload;
			state.isLoading = false;
		},
		logoutSuccess: (state) => {
			state.currentUser = null;
			localStorage.removeItem('auth');
		},
	},
});

export const {
	loginFailure,
	loginSuccess,
	registerFailure,
	registerSuccess,
	logoutSuccess,
} = authSlice.actions;

export default authSlice.reducer;

export const register = (user) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'content-type': 'application/json',
			},
		};

		const response = await axios.post(
			'http://localhost:4000/auth/register',
			user,
			config
		);

		dispatch(registerSuccess(response.data));
		history.push('/signin');
		toast.success('Đăng ký thành công!')
		setTimeout(() => {
			window.location.reload();
		}, 2000);

	} catch (error) {
		const errorMessage = error.response && error.response.data.message
			? error.response.data.message
			: 'Đăng ký thất bại. Vui lòng thử lại!';
		dispatch(registerFailure(errorMessage));
		toast.error(errorMessage);
	}
};

export const signin = (user) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'content-type': 'application/json',
			},
		};
		const userData = {
			email: user.email,
			password: user.password,
		};
		const response = await axios.post(
			'http://localhost:4000/auth/signin',
			userData, config
		);

		localStorage.setItem('auth', JSON.stringify(response.data));
		dispatch(loginSuccess(response.data));
		toast.success('Đăng nhập thành công!');
		history.push('/dashboard');
		setTimeout(() => {
			window.location.reload();
		}, 2000);

	} catch (error) {
		const errorMessage = error.response && error.response.data.message
			? error.response.data.message
			: 'Đăng nhập thất bại. Vui lòng thử lại!';
		dispatch(loginFailure(errorMessage));
		toast.error(errorMessage);
	}
};
