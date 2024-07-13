import './Sidebar.scss';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
	const { auth } = useSelector((state) => ({ ...state }));
	const { currentUser } = auth;

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};

	return (
		<div>
			<div className='sidebar'>
				<ul >
					<li className='list-item'>
						<h5 className='title'>Người dùng hiện tại:</h5>
						<div class="user-info">
							<img src='/src/images/user.png' alt='current user' />
							<h5 className='currentusername'>{currentUser.firstname} {currentUser.lastname}</h5>
						</div>
					</li>
					<li className='list-item'>
						<Link to='/dashboard'>
							Dashboard
						</Link>
					</li>
					<li className='list-item'>
						<Link to='/normalwork'>
							Công việc
						</Link>
					</li>
					<li className='list-item'>
						<Link to='/project'>
							Dự án
						</Link>
					</li>
					<li className='list-item'>
						<Link to='/repeatwork'>
							Việc lặp
						</Link>
					</li>
					<li className='list-item'>
						<Link to='/processwork'>
							Qui trình
						</Link>
					</li>
				</ul>
				<div class="sun">
					<div class="cloud front">
						<span class="left-front"></span>
						<span class="right-front"></span>
					</div>
					<span class="sun sunshine"></span>
					<span class="sun"></span>
					<div class="cloud back">
						<span class="left-back"></span>
						<span class="right-back"></span>
					</div>
				</div>
				<button class="backtotop" onClick={scrollToTop}>
					<svg class="svgIcon" viewBox="0 0 384 512">
						<path
							d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
						></path>
					</svg>
				</button>

			</div>
		</div>
	);
};

export default Sidebar;
