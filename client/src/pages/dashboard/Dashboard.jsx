import Sidebar from '../../components/sidebar/Sidebar';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './dashboard.scss';
import { useEffect, useState, useCallback } from 'react';
import { getAllTasks } from '../../redux/taskSlice';

//
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

//

const Dashboard = () => {
	const tasklist = useSelector((state) => state.task);
	const { AllTasks } = tasklist;
	const user = useSelector((state) => state.auth);
	const { currentUser } = user;

	let backlogTask = [];
	let pendingTask = [];
	let completedTask = [];
	let doingTask = [];

	for (let i = 0; i < AllTasks.length; i++) {
		if (AllTasks[i].status === 'todo') {
			pendingTask.push(AllTasks[i]);
		} else if (AllTasks[i].status === 'done') {
			completedTask.push(AllTasks[i]);
		}
		else if (AllTasks[i].status === 'backlog') {
			backlogTask.push(AllTasks[i]);
		}
		else if (AllTasks[i].status === 'doing') {
			doingTask.push(AllTasks[i]);
		}
	}

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getAllTasks(currentUser.token, currentUser.id));
	}, [dispatch, currentUser.token, currentUser.id]);


	// Data for the PieChart
	const data = [
		{ name: 'Lưu trữ', value: backlogTask.length },
		{ name: 'Chờ', value: pendingTask.length },
		{ name: 'Đang thực hiện', value: doingTask.length },
		{ name: 'Hoàn thành', value: completedTask.length }
	];

	const COLORS = ['#d3d3d3', '#ff9999', '#9999ff', '#99ff99'];

	// Data for BarChart

	const dataBar = [
		{ name: 'Lưu trữ', value: backlogTask.length, color: '#d3d3d3' },
		{ name: 'Chờ', value: pendingTask.length, color: '#ff9999' },
		{ name: 'Đang thực hiện', value: doingTask.length, color: '#9999ff' },
		{ name: 'Hoàn thành', value: completedTask.length, color: '#99ff99' }
	];

	// State to track active index for highlighting
	const [activeIndex, setActiveIndex] = useState(null);

	const debounce = (fn, delay) => {
		let timer;
		return (...args) => {
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				fn(...args);
			}, delay);
		};
	};

	const onPieEnter = useCallback(debounce((_, index) => {
		setActiveIndex(index);
	}, 10), []);

	const onPieLeave = useCallback(debounce(() => {
		setActiveIndex(null);
	}, 10), []);

	return (
		<div>
			<div className='dashboard'>
				<div className='dashboard__left'>
					<Sidebar />
				</div>
				<div className='dashboard__right'>
					<div className='dashboard__rightContent'>
						<h2>Tổng hợp trạng thái công việc</h2>
						<div className="taskcount">
							<div className="card">
								<div className="card-title">Lưu trữ</div>
								<div className="card-value">{backlogTask.length}</div>
							</div>
							<div className="card">
								<div className="card-title">Chờ</div>
								<div className="card-value">{pendingTask.length}</div>
							</div>
							<div className="card">
								<div className="card-title">Đang thực hiện</div>
								<div className="card-value">{doingTask.length}</div>
							</div>
							<div className="card">
								<div className="card-title">Hoàn thành</div>
								<div className="card-value">{completedTask.length}</div>
							</div>
						</div>

						<div className='charts'>
							<div className='chart'>
								<ResponsiveContainer width="100%" height={400}>
									<PieChart>
										<Pie data={data} cx="50%" cy="50%" labelLine={false}
											label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(2)}%)`}
											outerRadius={150} fill="#8884d8" dataKey="value" stroke="#fff" strokeWidth={3}
											onMouseEnter={onPieEnter}
											onMouseLeave={onPieLeave}
										>
											{data.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
													opacity={activeIndex === index || activeIndex === null ? 1 : 0.3}
												/>
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>

							<div className='chart'>
								<ResponsiveContainer width="100%" height={400}>
									<BarChart data={dataBar}>
										<XAxis dataKey="name" />
										<YAxis allowDecimals={false} />
										<Tooltip />
										<Legend />
										<Bar dataKey="value" name="Công việc" barSize={30}>
											{data.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>

	);
};

export default Dashboard;