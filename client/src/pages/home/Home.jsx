import './home.scss';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const Home = () => {
	const { auth } = useSelector((state) => ({ ...state }));
	const { currentUser } = auth;
	return (
		<div className='home'>
			<div className='home__container'>
				<h1>Organize it all!</h1>
				<p>With TaskManager</p>

				{currentUser && currentUser.token ? (
					<Link to='/dashboard' className='button'>
						<button class="button">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" class="svg-icon"><g stroke-width="2" stroke-linecap="round" stroke="#fff"><rect y="5" x="4" width="16" rx="2" height="16"></rect><path d="m8 3v4"></path><path d="m16 3v4"></path><path d="m4 11h16"></path></g></svg>
							<span class="lable">Get Started !</span>
						</button>
					</Link>
				) : (
					<Link to='/signin' className='button'>
						<button class="button">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" class="svg-icon"><g stroke-width="2" stroke-linecap="round" stroke="#fff"><rect y="5" x="4" width="16" rx="2" height="16"></rect><path d="m8 3v4"></path><path d="m16 3v4"></path><path d="m4 11h16"></path></g></svg>
							<span class="lable">Get Started !</span>
						</button>
					</Link>
				)}

			</div>

		</div>
	);
};

export default Home;
