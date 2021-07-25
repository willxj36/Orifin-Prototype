import * as React from 'react';
import { BrowserRouter, Route, Switch, useRouteMatch } from 'react-router-dom';

import EmpLogin from './EmpLogin';
import EmpRegister, { Confirmation } from './EmpRegister';

const AdminRouter = () => {

    const { path, url } = useRouteMatch()

    return(
        <BrowserRouter>
            <Switch>
                <Route exact path={path} component={EmpLogin} />
                <Route exact path={`${path}/register-employee`} component={EmpRegister} />
                <Route exact path={`${path}/register-employee/confirm`} component={Confirmation} />
            </Switch>
        </BrowserRouter>
    )

}

export default AdminRouter;