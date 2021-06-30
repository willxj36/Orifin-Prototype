import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import PublicSide from './components/PublicSide';
import AdminRouter from './pages/employee/AdminRouter';
import { ContextProvider } from './components/ContextProvider';

const App = () => {

	return (
		<ContextProvider>
			<BrowserRouter>
				<Switch>
					<Route exact path='/' component={PublicSide} />
					<Route path='/admin' component={AdminRouter} />
				</Switch>
			</BrowserRouter>
		</ContextProvider>
	);
};

export default App;