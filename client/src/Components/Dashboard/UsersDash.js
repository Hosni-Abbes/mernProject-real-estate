import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import DashboardTopMenu from './DashboardTopMenu'
import DashboardOptionBlock from './DashboardOptionBlock'

import StaticData from '../../Utils/StaticInfo'
import useAxiosInterceptors from '../../hooks/useAxiosInterceptors'
import NotAuthorized from './NotAuthorized'


function ProductsDash() {
    const axios = useAxiosInterceptors()

    const [option, setOption] = useState('List')
    const [users, setUsers] = useState([])
    const [message, setMessage] = useState({status:'', message:''})
    const [pages, setPages] = useState([])
    const [paginationOffset, setPaginationOffset] = useState(0)





    useEffect(()=> {
        let isMounted = true
        if(isMounted) fetchUsers()
        return () => isMounted = false
    }, [paginationOffset, option])


    // Fetch users
    const fetchUsers = async () => {
        try {
            const res = await axios.post(`/api/v1/users/list?limit=${StaticData.pagination.dashboardListLimit}&offset=${paginationOffset}`)
            setUsers(res.data.usersList)
            setPages( Array.from(Array( Math.ceil(res.data?.pages) ), (x,i)=>i ) )
        } catch (error) {
            setMessage({status: error.response?.status || 500 ,message: error.response?.data?.message || 'Internal server Error'})
            console.error(error)
        }
    }

    const deleteUser = async id => {
        try {
            const res = await axios.delete(`api/v1/users/delete?user=${id}`)
            setMessage({status: 200, message: res.data?.message})
            const updUsers = users.filter(user => user.id != res.data?.userId)
            setUsers(updUsers)
        } catch (error) {
            setMessage({status: error.response?.status || 500, message: error.response?.data?.message || 'Internal server error!'})
            console.error(error)
        }
    }

    const updateUserRole = async id => {
        try {
            const res = await axios.post(`api/v1/users/update?user=${id}`)
            setMessage({status: 200, message: 'User Role Updated'})
            const find = users.findIndex(item => item.id == res.data.id)
            users[find] = res.data
        } catch (error) {
            setMessage({status: error.response?.status || 500, message: error.response?.data?.message || 'Internal server error!'})
            console.error(error)
        }
    }
    

    return (
        
        <ProductsDashStyle>

            {
                message?.status === 401 || message?.status === 403
                ?
                    <NotAuthorized message={message} />
                : <>

                    <DashboardTopMenu option={option} listItems={['List']} navItem='users' setMessage={setMessage} setPaginationOffset={setPaginationOffset} setOption={setOption} />

                    <div className='dash-content'>
                        <DashboardOptionBlock navItem='users' users={users} deleteUser={deleteUser} updateUserRole={updateUserRole} option={option} message={message} pages={pages} setPaginationOffset={setPaginationOffset} />
                    </div>
                </>
            }
            

        </ProductsDashStyle>
    )
}

const ProductsDashStyle = styled.div`

`

export default ProductsDash