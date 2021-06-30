import * as React from 'react';
import { BrowserRouter, Route, Switch, useRouteMatch } from 'react-router-dom';

import EmpLogin from './EmpLogin';

const AdminRouter = () => {

    const { path, url } = useRouteMatch()

    return(
        <BrowserRouter>
            <Switch>
                <Route exact path={path} component={EmpLogin} />
            </Switch>
        </BrowserRouter>
    )

}

export default AdminRouter;