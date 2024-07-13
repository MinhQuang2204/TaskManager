import './registration.scss';
import '../../styles/components/_button.scss';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signin } from '../../redux/authSlice';
import { ToastContainer } from 'react-toastify';


const Signin = () => {
	const dispatch = useDispatch();

	const [state, setState] = useState({
		email: '',
		password: '',
	});

	const handleChange = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(
			signin({
				email: state.email,
				password: state.password,
			})
		);
	};

	return (
		<div className='signup-form'>
			<ToastContainer />
			<div className='signup-form__wrapper'>
				<form className='form' onSubmit={handleSubmit}>
					<h4>Sign In</h4>
					<div className='form-group'>
						<input
							type='email'
							name='email'
							value={state.email}
							id=''
							placeholder='Enter Email'
							onChange={handleChange}
						/>
					</div>
					<div className='form-group'>
						<input
							type='password'
							name='password'
							value={state.password}
							id=''
							placeholder='Enter Password'
							onChange={handleChange}
						/>
					</div>
					<div className='button-group'>
						<button class="button">
							Let`s go!
							<svg fill="currentColor" viewBox="0 0 24 24" class="icon">
								<path clip-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fill-rule="evenodd"></path>
							</svg>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Signin;
