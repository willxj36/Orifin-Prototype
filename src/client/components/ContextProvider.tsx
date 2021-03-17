import * as React from 'react';
import { useEffect, useState, createContext } from 'react';

import { IUserLocal } from '../../utils/models';
import { User } from '../../utils/apiService';

export type IContextUser = [IUserLocal, React.Dispatch<React.SetStateAction<IUserLocal>>]

export const UserContext = createContext<IContextUser>([{}, () => {}]);

export const ContextProvider: React.FC = (props) => {

    const [user, setUser] = useState<IUserLocal>({
        userid: undefined,
        role: ''
    });

    useEffect(() => {
        let user = User;
        user ? setUser(user) : setUser(null);
    }, [])

    return(
        <UserContext.Provider value={[user, setUser]}>
            {props.children}
        </UserContext.Provider>
    )
}