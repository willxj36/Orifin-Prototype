import * as React from 'react'
import { Route } from 'react-router'

export const PrivateRoute = (props: {exact?: boolean, path: string, component: React.ComponentType<any>}) => {
    const { exact, path, component} = props

    //TODO: logic here to redirect if no log in

    if(exact) {
        return(
            <Route exact path={path} component={component} />
        )
    } else {
        return(
            <Route path={path} component={component} />
        )
    }

}

export const PublicRoute = (props: {exact?: boolean, path: string, component: React.ComponentType<any>}) => {
    const { exact, path, component} = props

    //TODO: logic here to redirect if user logged in

    if(exact) {
        return(
            <Route exact path={path} component={component} />
        )
    } else {
        return(
            <Route path={path} component={component} />
        )
    }

}