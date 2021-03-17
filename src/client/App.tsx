import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MemberHome from './pages/MemberHome';
import Memberships from './pages/Memberships';
import Calendar from './pages/Calendar';
import Reservation from './pages/Reservation';
import ContactRequest from './pages/ContactRequest';
import Payment from './pages/Payment';
import { ContextProvider } from './components/ContextProvider';

const App = () => {

	return (
		<ContextProvider>
			<BrowserRouter>
				<Navbar />
				<Switch>
					<Route exact path='/' component={Home} />
					<Route path='/login' component={Login} />
					<Route path='/register' component={Register} />
					<Route path='/member-home' component={MemberHome} />
					<Route path='/memberships' component={Memberships} />
					<Route path='/calender' component={Calendar} />
					<Route path='/reservation' component={Reservation} />
					<Route path='/contact-request' component={ContactRequest} />
					<Route path='/payment' component={Payment} />
				</Switch>
			</BrowserRouter>
		</ContextProvider>
	);
};

export default App;