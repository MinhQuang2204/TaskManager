import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAllTasks, getCreatedByTasks, getAssignedTasks, getFollowedTasks } from '../../redux/taskSlice';
import ListCard from './ListCard';
import './tasklist.scss';

const TaskList = () => {
	const auth = useSelector((state) => state.auth);
	const tasks = useSelector((state) => state.task);
	const dispatch = useDispatch();

	const { currentUser } = auth;
	const { AllTasks, CreatedByTasks, AssignedTasks, FollowedTasks } = tasks;

	const [activeTab, setActiveTab] = useState(0);

	const tabs = [
		{ title: 'Tất cả công việc', fetchAction: getAllTasks, data: AllTasks },
		{ title: 'Công việc bạn giao', fetchAction: getCreatedByTasks, data: CreatedByTasks },
		{ title: 'Công việc bạn được giao thực hiện', fetchAction: getAssignedTasks, data: AssignedTasks },
		{ title: 'Công việc bạn theo dõi', fetchAction: getFollowedTasks, data: FollowedTasks },
	];

	useEffect(() => {
		const fetchData = async () => {
			await dispatch(tabs[activeTab].fetchAction(currentUser.token, currentUser.id));
		};

		console.log('Fetching data for tab:', tabs[activeTab].title);
		fetchData();
	}, [dispatch, activeTab, currentUser.token, currentUser.id]);


	const handleTabClick = (index) => {
		setActiveTab(index);
	};

	return (
		<div>
			<div className="tab-header">
				{tabs.map((tab, index) => (
					<button
						key={index}
						className={`tab-btn ${activeTab === index ? 'active' : ''}`}
						onClick={() => handleTabClick(index)}
					>
						{tab.title}
					</button>
				))}
			</div>
			<div className="tab-content">
				{tabs.map((tab, index) => (
					<div
						key={index}
						className={`tab-pane ${activeTab === index ? 'active' : ''}`}
						style={{ display: activeTab === index ? 'block' : 'none' }}
					>
						<h2>{tab.title}</h2>
						<ul className='list-header'>
							<li><h5>Tên công việc</h5></li>
							<li><h5>Giao việc</h5></li>
							<li><h5>Trạng thái</h5></li>
							<li><h5>Bắt đầu</h5></li>
							<li><h5>Kết thúc</h5></li>
							<li><h5>Thực hiện</h5></li>
							<li><h5>Hành động</h5></li>
						</ul>
						{tab.data && Object.values(tab.data).map((item) => (
							<ListCard key={item._id} item={item} />
						))}

					</div>
				))}
			</div>
		</div>
	);
};

export default TaskList;
