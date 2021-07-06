import * as React from 'react';
import { BrowserRouter, Route, Switch, useRouteMatch } from 'react-router-dom';

import EmpLogin from './EmpLogin';
import EmpRegister from './EmpRegister';

const AdminRouter = () => {

    const { path, url } = useRouteMatch()

    return(
        <BrowserRouter>
            <Switch>
                <Route exact path={path} component={EmpLogin} />
                <Route path={`${path}/register-employee`} component={EmpRegister} />
            </Switch>
        </BrowserRouter>
    )

}

export default AdminRouter;