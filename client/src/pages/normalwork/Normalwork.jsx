import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import TaskList from '../../components/normalworklist/TaskList';
import './normalwork.scss';

const handleClick = () => {
	window.location.href = 'http://localhost:5173/normalwork/add';
};

const Normalwork = () => {
	return (
		<div>
			<div className='normalwork'>
				<div className='normalwork__left'>
					<Sidebar />
				</div>
				<div className='normalwork__right'>
					<div className='normalwork__addtask'>
						<div className='buttonaddtask'>
							<button title="Thêm công việc mới" class="custom-button" onClick={handleClick}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="50px"
									height="50px"
									viewBox="0 0 24 24"
									class="custom-svg">
									<path
										d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
										stroke-width="1.5"
									></path>
									<path d="M8 12H16" stroke-width="1.5"></path>
									<path d="M12 16V8" stroke-width="1.5"></path>
								</svg>
							</button>
						</div>
						<h5>Danh sách Công việc thường</h5>
						<div class="search-container">
							<input type="text" name="text" class="input" placeholder="search..." />
							<span class="icon">
								<svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="1" d="M14 5H20" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="1" d="M14 8H17" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="1" d="M22 22L20 20" stroke="#000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
							</span>
						</div>
					</div>
					<hr class="divider"></hr>
					<div className='normalwork__tasklist'>
						<TaskList />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Normalwork;
