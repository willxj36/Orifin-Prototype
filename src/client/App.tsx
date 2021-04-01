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
import Tournaments from './pages/Tournaments';
import { ContextProvider } from './components/ContextProvider';

const App = () => {

	return (
		<ContextProvider>
			<BrowserRouter>
				<Navbar />
				<Switch>
					<Route exact path='/' component={Home} />
					<Route path='/login/:resType?/:time?/:spots?' component={Login} />
					<Route path='/register/:id?/:period?' component={Register} />
					<Route path='/member-home/:id' component={MemberHome} />
					<Route path='/memberships' component={Memberships} />
					<Route path='/calendar' component={Calendar} />
					<Route path='/reservation/:type/:time/:spots' component={Reservation} />
					<Route path='/contact-request' component={ContactRequest} />
					<Route path='/payment/:product/:id/:period?' component={Payment} />
					<Route path='/tournaments' component={Tournaments} />
				</Switch>
			</BrowserRouter>
		</ContextProvider>
	);
};

export default App;