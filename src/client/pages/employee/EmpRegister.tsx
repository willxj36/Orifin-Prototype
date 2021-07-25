import * as React from 'react'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import * as Antd from 'antd'

import { EmployeeRoles } from '../../common/Common'
import apiService from '../../../utils/apiService'

export const generateNewHirePassword = (firstName: string, lastName: string): string => {
    const firstNameAbbr = firstName.split('', 3).join('')
    const lastNameAbbr = lastName.split('', 3).join('')
    const createDateMs = Date.now().toString().slice(-6)
    return firstNameAbbr + lastNameAbbr + createDateMs
}

export const generateNewHireUsername = (firstName: string, lastName: string): string => {
    const fullName = firstName.slice(0, 4) + lastName.slice(0, 4)
    const randomNumber = Math.floor(1000 + Math.random() * 9000)
    //TODO: check for uniqueness before returning, rerun random number if not
    return fullName + randomNumber
}

export const Confirmation = (props) => {
    const { username, password, email } = props.location.state

    useEffect(() => {
        if(!email) return
        apiService('/api/contact/verify-employee', 'POST', {
            email,
            text: `Your employee username will be ${username}
            Temporary password: ${password}
            You will be required to change this password the first time you log in.
            
            Welcome to the team!`
        }).then(res => Antd.message.success(res.message))
        .catch(error => {
            console.log(error)
            Antd.message.error('Email failed to send to employee, save temporary password!')
        })
    }, [email])

    return(
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-deepred">
            <div className="p-4 border border-danger rounded bg-gold" style={{width: '30vw'}}>
                <Antd.Typography.Title className='mb-5' level={3}>Employee Registered</Antd.Typography.Title>
                <div className="border border-dark bg-light p-3">
                    <Antd.Space direction='vertical' size='middle'>
                        <Antd.Typography.Text>{`Username: ${username}`}</Antd.Typography.Text>
                        <Antd.Typography.Text>{`Temporary Password: ${password}`}</Antd.Typography.Text>
                        <Antd.Alert type='warning' message='Temporary password must be changed on first login' />
                        <Antd.Typography.Text>{`Log in information sent to ${email}`}</Antd.Typography.Text>
                    </Antd.Space>
                </div>
            </div>
        </div>
    )
}

const EmpRegister = () => {

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
    const [waiting, setWaiting] = useState<boolean>(false)
    const [roleId, setRoleId] = useState<EmployeeRoles>(EmployeeRoles.Employee0)
    const [confirm, setConfirm] = useState<boolean>(false)

    const history = useHistory()
    const { path } = useRouteMatch()

    const submitNewEmployee = useCallback(() => {
        if(!firstName || !lastName || !email || !roleId) {
            Antd.message.error('You must fill all fields before registering')
        } else {
            setWaiting(true)
            const username = generateNewHireUsername(firstName, lastName)
            const password = generateNewHirePassword(firstName, lastName)
            const reqObject = {
                firstName,
                lastName,
                username,
                email,
                password,
                roleId
            }
            apiService('/auth/register/employee', 'POST', reqObject)
            .then(res => {
                Antd.message.success(res.message)
                history.push(`${path}/confirm`, {...res, ...reqObject})
                setConfirm(true)
            }).catch(error => {
                Antd.message.error('Failed to register new employee. Please try again')
                console.log(error)
            }).finally(() => setWaiting(false))
        }
    }, [firstName, lastName, email, roleId])

    const positions = useMemo(() => {
        return Object.values(EmployeeRoles).map((role, index) => {
            if(index <= 10) {   //hard-coded at 10 because 10 employee levels will currently be reserved regardless of actual # of employee roles
                return(
                    <Antd.Select.Option key={EmployeeRoles[role]} value={role}>{role}</Antd.Select.Option>
                )
            }
        })
    }, [EmployeeRoles])

    const emailCheck = useCallback((typedEmail) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/ig
        if(!typedEmail.match(emailRegex)) {
            setInvalidEmail(true)
        } else {
            setInvalidEmail(false)
            setEmail(typedEmail)
        }
    }, [])

    return(
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-deepred">
            {!confirm ? (
                <Antd.Form
                className='p-4 border border-danger rounded bg-gold'
                colon={false}
                name='employeeRegister'
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{width: '30vw'}}
            >
                <Antd.Typography.Title className='mb-5' level={3}>Register New Employee</Antd.Typography.Title>

                <Antd.Form.Item
                    label='First Name'
                    name='firstName'
                    required
                >
                    <Antd.Input onChange={(e) => setFirstName(e.currentTarget.value)} />
                </Antd.Form.Item>

                <Antd.Form.Item
                    label='Last Name'
                    name='lastName'
                    required
                >
                    <Antd.Input onChange={(e) => setLastName(e.currentTarget.value)} />
                </Antd.Form.Item>

                <Antd.Form.Item
                    label='Email'
                    name='email'
                    required
                >
                    <Antd.Input onChange={(e) => emailCheck(e.currentTarget.value)} />
                    {invalidEmail && <Antd.Alert type='error' message='Please enter valid email address' />}
                </Antd.Form.Item>

                <Antd.Form.Item
                    label='Position'
                    name='position'
                    required
                >
                    <Antd.Select placeholder='Select employee role' onChange={(e) => setRoleId(EmployeeRoles[e.toString()])}>
                        {positions}
                    </Antd.Select>
                </Antd.Form.Item>

                <Antd.Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Antd.Button 
                        onClick={submitNewEmployee}
                        type='primary'
                        htmlType='submit'
                        loading={waiting}
                    >
                        Submit
                    </Antd.Button>
                </Antd.Form.Item>

            </Antd.Form>
            ) : (
                <Confirmation />
            )}

            

        </div>
    )

}

export default EmpRegister