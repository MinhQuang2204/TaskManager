import './App.css';
import Header from './components/header/Header';
import Signin from './components/registration/Signin';
import Signup from './components/registration/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import './styles/main.scss';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Loading from './components/loading/Loading';
import Normalwork from './pages/normalwork/Normalwork';
import Addnormalwork from './pages/addnormalwork/Addnormalwork';
import Processwork from './pages/processwork/Processwork';
import Project from './pages/project/Project';
import Repeatwork from './pages/repeatwork/Repeatwork';
import RequireAuth from './utils/RequireAuth';
import Editnormalwork from './pages/editnormalwork/Editnormalwork';
import AssignedEditnomalwork from './pages/editnormalwork/AssignedEditnormalwork';
import FollowedEditnormalwork from './pages/editnormalwork/FollowedEditnormalwork';

function App() {
	const { auth } = useSelector((state) => ({ ...state }));
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 500);
	}, []);

	return (
		<div>
			{loading ? (
				<Loading />
			) : (
				<div>
					<Router>
						<Header />
						<Routes>
							<Route path='/' element={<Home />} />
							<Route
								path='/signin'
								element={!auth.currentUser ? <Signin /> : <Signin />}
							/>
							<Route
								path='/signup'
								element={!auth.currentUser ? <Signup /> : <Signup />}
							/>
							<Route
								path='/dashboard'
								element={
									<RequireAuth>
										<Dashboard />
									</RequireAuth>
								}
							/>
							<Route
								path='/normalwork'
								element={
									<RequireAuth>
										<Normalwork />
									</RequireAuth>
								}
							/>
							<Route
								path='/project'
								element={
									<RequireAuth>
										<Project />
									</RequireAuth>
								}
							/>
							<Route
								path='/repeatwork'
								element={
									<RequireAuth>
										<Repeatwork />
									</RequireAuth>
								}
							/>
							<Route
								path='/processwork'
								element={
									<RequireAuth>
										<Processwork />
									</RequireAuth>
								}
							/>
							<Route
								path='/normalwork/add'
								element={
									<RequireAuth>
										<Addnormalwork />
									</RequireAuth>
								}
							/>
							<Route
								path='/normalwork/edit'
								element={
									<RequireAuth>
										<Editnormalwork />
									</RequireAuth>
								}
							/>
							<Route
								path='/assigned_normalwork/edit'
								element={
									<RequireAuth>
										<AssignedEditnomalwork />
									</RequireAuth>
								}
							/>
							<Route
								path='/followed_normalwork/edit'
								element={
									<RequireAuth>
										<FollowedEditnormalwork />
									</RequireAuth>
								}
							/>
						</Routes>
					</Router>
				</div>
			)}
		</div>
	);
}

export default App;
