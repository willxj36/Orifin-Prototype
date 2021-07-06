import * as React from 'react'
import { useCallback, useState, useContext } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import * as Antd from 'antd'

import apiService, { SetAccessToken } from '../../../utils/apiService'
import { UserContext } from '../../components/ContextProvider'

const addEmployee = () => {
    //TODO: admin employee funcs
}

const resetEmployeeCred = () => {

}

const EmpLogin = () => {
    const [waiting, setWaiting] = useState<boolean>(false)
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const [user, setUser] = useContext(UserContext);

    const { path } = useRouteMatch()

    const submitLogin = useCallback(() => {
        setWaiting(true)
        apiService('/auth/login/employee', 'POST', {
            email: `${username}@ludusemp.com`,
            password
        }).then(res => {
            SetAccessToken(res.token, {userid: res.userid, role: res.roleid})
            setUser({userid: res.userid, role: res.roleid})
        }).catch(error => Antd.message.error('There was a problem logging you in. Please check username and password')
        ).finally(() => setWaiting(false))
    }, [password, username])

    const AdminOptions = () => {
        return(
            <div className='p-3 d-flex flex-column'>
                <Link to={`${path}/register-employee`}>
                    <Antd.Button className='mb-3' onClick={addEmployee} type='primary'>Add New Employee</Antd.Button>
                </Link>
                <Antd.Button onClick={resetEmployeeCred} type='ghost'>Reset Employee Credentials</Antd.Button>
            </div>
        )
    }

    return(
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-deepred">

            <Antd.Form
                className='p-4 border border-danger rounded bg-gold'
                colon={false}
                name='employeeLogin'
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
            >
                <Antd.Typography.Title className='mb-5' level={3}>Welcome Ludus Team Member!</Antd.Typography.Title>

                <Antd.Form.Item
                    label='User Name'
                    name='username'
                    rules={[{required: true, message: 'Please enter valid user name'}]}
                >
                    <Antd.Input onChange={(e) => setUsername(e.currentTarget.value)} />
                </Antd.Form.Item>

                <Antd.Form.Item
                    label='Password'
                    name='password'
                    rules={[{required: true, message: 'Please enter valid password'}]}
                >
                    <Antd.Input.Password onChange={(e) => setPassword(e.currentTarget.value)} />
                </Antd.Form.Item>

                <Antd.Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Antd.Button 
                        onClick={submitLogin}
                        type='primary'
                        htmlType='submit'
                        loading={waiting}
                    >
                        Submit
                    </Antd.Button>
                </Antd.Form.Item>
                
                <Antd.Popover content={AdminOptions} placement="bottomLeft">
                    <Antd.Typography.Link onClick={(e) => e.preventDefault()} href='#' target='_blank'>Admin Options</Antd.Typography.Link>
                </Antd.Popover>

            </Antd.Form>

        </div>
    )
}

export default EmpLogin;