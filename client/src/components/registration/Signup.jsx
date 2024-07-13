import './registration.scss';
import '../../styles/components/_button.scss';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
	const dispatch = useDispatch();
	const { error, currentUser } = useSelector(state => state.auth);
	const [state, setState] = useState({
		firstname: '',
		lastname: '',
		username: '',
		email: '',
		phone: '',
		dob: '',
		password: '',
		confirmPassword: '', // Thêm trường confirm password
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (state.password !== state.confirmPassword) {
			toast.error('Xác nhận mật khẩu không khớp');
			return;
		}
		dispatch(
			register({
				firstname: state.firstname,
				lastname: state.lastname,
				username: state.username,
				email: state.email,
				phone: state.phone,
				dob: state.dob,
				password: state.password,
			})
		);
	};

	const handleChange = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className='signup-form'>
			<ToastContainer />
			<div className='signup-form__wrapper'>
				<form className='form' onSubmit={handleSubmit}>
					<h4>Sign up</h4>

					<div className='form-group'>
						<div>
							<input
								type='text'
								placeholder='First Name'
								name='firstname'
								value={state.firstname}
								onChange={handleChange}
							/>
							<input
								type='text'
								placeholder='Last Name'
								name='lastname'
								value={state.lastname}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className='form-group'>
						<input
							type='text' required
							name='username'
							value={state.username}
							placeholder='Enter Username'
							onChange={handleChange}
						/>
					</div>
					<div className='form-group'>
						<input
							type='email' required
							name='email'
							value={state.email}
							placeholder='Enter Email'
							onChange={handleChange}
						/>
					</div>

					<div className='form-group'>
						<input
							type='text'
							name='phone'
							value={state.phone}
							placeholder='Phone number'
							onChange={handleChange}
						/>
					</div>

					<div className='form-group'>
						<input
							type='date'
							name='dob'
							value={state.dob}
							placeholder='Date of Birth'
							onChange={handleChange}
						/>
					</div>

					<div className='form-group'>
						<input
							type='password' required
							name='password'
							value={state.password}
							placeholder='Enter Password'
							onChange={handleChange}
						/>
					</div>
					<div className='form-group'>
						<input
							type='password' required
							name='confirmPassword'
							value={state.confirmPassword}
							placeholder='Confirm Password'
							onChange={handleChange}
						/>
					</div>
					<div className='button-group'>
						<button className="button">
							Sign Up
							<svg fill="currentColor" viewBox="0 0 24 24" className="icon">
								<path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd"></path>
							</svg>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Signup;
