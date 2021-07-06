import * as React from 'react'
import { useState, useMemo, useCallback } from 'react'
import * as Antd from 'antd'

import { EmployeeRoles } from '../../common/Common'
import apiService from '../../../utils/apiService'

export const generateNewHirePassword = (firstName: string, lastName: string): string => {
    const firstNameAbbr = firstName.split('', 3).join('')
    const lastNameAbbr = lastName.split('', 3).join('')
    const createDateMs = Date.now().toString().slice(-6)
    return firstNameAbbr + lastNameAbbr + createDateMs
}

export const generateNewHireEmail = (firstName: string, lastName: string): string => {
    const fullName = firstName + lastName
    const randomNumber = Math.floor(1000 + Math.random() * 9000)
    return `${fullName}${randomNumber}@ludusemp.com`
}

const EmpRegister = () => {

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [ssn, setSsn] = useState<number>();
    const [invalidSsn, setInvalidSsn] = useState<boolean>(false)
    const [waiting, setWaiting] = useState<boolean>(false)
    const [role, setRole] = useState<EmployeeRoles>(EmployeeRoles.Employee0)

    const submitNewEmployee = async () => {
        setWaiting(true)
        const email = generateNewHireEmail(firstName, lastName)
        const password = generateNewHirePassword(firstName, lastName)
        apiService('/auth/register', 'POST', {
            firstName,
            lastName,
            email,
            password,
            role
        }).then(res => //TODO: resume here, success logic and redirect to confirmation page)
    }

    const positions = useMemo(() => {
        return Object.values(EmployeeRoles).map((role, index) => {
            if(index <= 10) {
                return(
                    <Antd.Select.Option key={EmployeeRoles[role]} value={role}>{role}</Antd.Select.Option>
                )
            }
        })
    }, [])

    const ssnCheck = useCallback((typedSsn) => {
        const regex = /^\d*$/g
        if(!typedSsn.match(regex)) {
            setInvalidSsn(true)
        } else {
            setInvalidSsn(false)
            setSsn(typedSsn)
        }
    }, [])

    return(
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-deepred">

            <Antd.Form
                className='p-4 border border-danger rounded bg-gold'
                colon={false}
                name='employeeRegister'
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
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
                    label='SSN - ??'
                    name='ssn'
                    required
                >
                    <Antd.Input onChange={(e) => ssnCheck(e.currentTarget.value)} />
                    {invalidSsn && <Antd.Alert type='error' message='SSN must be numerical digits only' />}
                </Antd.Form.Item>

                <Antd.Form.Item
                    label='Position'
                    name='position'
                    required
                >
                    <Antd.Select placeholder='Select employee role' onChange={(e) => setRole(EmployeeRoles[e.toString()])}>
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

        </div>
    )

}

export default EmpRegister