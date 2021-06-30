import * as React from 'react'
import { useCallback, useState } from 'react'
import * as Antd from 'antd'

const AdminOptions = () => {

    const addEmployee = () => {
        //TODO: admin employee funcs
    }

    const resetEmployeeCred = () => {

    }

    return(
        <div className="p-3 bg-gold border border-danger rounded d-flex flex-column align-items-center">
            <Antd.Button className='mb-3' onClick={addEmployee} type='default'>Add New Employee</Antd.Button>
            <Antd.Button onClick={resetEmployeeCred} type='default'>Reset Employee Credentials</Antd.Button>
        </div>
    )
}

const EmpLogin = () => {
    const [adminOptionsOpen, setAdminOptionsOpen] = useState<boolean>(false)
    const [waiting, setWaiting] = useState<boolean>(false)
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const submitLogin = () => {
        setWaiting(true)
        //TODO: login functions
        
    }

    const openAdminOptions = useCallback(() => {
        setAdminOptionsOpen(!adminOptionsOpen)
    }, [adminOptionsOpen])

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
                    <Antd.Input />
                </Antd.Form.Item>

                <Antd.Form.Item
                    label='Password'
                    name='password'
                    rules={[{required: true, message: 'Please enter valid password'}]}
                >
                    <Antd.Input.Password />
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
                
                <Antd.Button onClick={openAdminOptions} type='link'>Admin Options</Antd.Button>

            </Antd.Form>
            
            {adminOptionsOpen && <AdminOptions />}

        </div>
    )
}

export default EmpLogin;