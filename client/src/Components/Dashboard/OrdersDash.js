import React, {useEffect, useState} from 'react'
import { styled } from 'styled-components'
import DashboardTopMenu from './DashboardTopMenu'
import StaticData from '../../Utils/StaticInfo'
import DashboardOptionBlock from './DashboardOptionBlock'
import { useAuth } from '../../hooks/useAuth'
import useAxiosInterceptors from '../../hooks/useAxiosInterceptors'


function OrdersDash() {
    const { user } = useAuth()
    const axios = useAxiosInterceptors()

    const [option, setOption] = useState('List')
    const [orders, setOrders] = useState([])
    const [message, setMessage] = useState({status:'', message:''})
    const [pages, setPages] = useState([])
    const [paginationOffset, setPaginationOffset] = useState(0)
    const [popup, setPopup] = useState('')
    const [seeOrderPopup, setSeeOrderPopup] = useState('')
    const [archived, setArchived] = useState(0)




    useEffect(()=>{
        let isMounted = true
        if (isMounted) {
            fetchOrders()
        }
        return () => isMounted = false
    }, [paginationOffset, option])


    const fetchOrders = async () => {
        try {
            const res = await axios.get(`/api/v1/orders?limit=${StaticData.pagination.dashboardListLimit}&offset=${paginationOffset}&archived=${archived}`)
            setOrders(res.data?.ordersList)
            setPages( Array.from(Array( Math.ceil(res.data?.pages) ), (x,i)=>i ) )
        }catch(error){
            setMessage({status: error.response?.data?.message || 'Internal server Error'})
            console.error(error)
        }
    }

    const archiveOrder = async id => {
        try {
            const res = await axios.post(`api/v1/orders/archive?order=${id}`)
            setMessage({status: 200, message: res.data?.message})
            const updOrders = orders.filter(order => order.id != res.data?.id)
            setOrders(updOrders)
        } catch (error) {
            setMessage({status: error.response?.status || 500, message: error.response?.data?.message || 'Internal server error!'})
            console.error(error)
        }
    }




    // See Order popup
    const renderSeeOrderPopup = () => {
        const order = orders.filter(order => order.id == seeOrderPopup)[0]
        return (
            <>
                <div className="position-absolute top-0 start-0 end-0 bottom-0 opacity-25 bg-dark overlay" onClick={()=>closePopup()} />
                <div className="position-fixed top-50 start-50 translate-middle py-3 px-5 bg-white popup">
                    <span className="close" onClick={()=>closePopup()} >x</span>
                    <div>
                        <div className='d-flex justify-content-between flex-wrap'>
                            <p className='mb-2'> <strong>Order #</strong>{order?.id}</p>
                            <p className='mb-2'> <strong>Status: </strong>
                                <span className={order?.status === 'Payed' ? 'text-success' : order?.status === 'Waiting Payment' ? 'text-info' : 'text-red'}>{order?.status}</span>
                            </p>
                        </div>
                        <p className='mb-2'> <strong>Payment Ref: </strong> {order?.paymentRef}</p>
                        <hr className='mb-2'/>
                        <p className='mb-2'> <strong>Ordered by: </strong>{order?.user?.name} -- {order?.user?.email}</p>
                        {
                            order?.status === 'Payed' 
                            ? <>                            
                                <p className='mb-2'> <strong>Amount Payed: </strong>{order?.amountPayed} {order?.currency} </p>
                                <p className='mb-2'> <strong>Amount to complete pay: </strong>{parseFloat(order?.amountToCompletePay).toPrecision(3)} {order?.currency} </p>
                                <hr className='mb-2'/>
                            </>
                            : ''
                        }
                        <div className='mb-2'>
                            <strong>Products: ({order?.building?.length}) </strong>
                            {
                                order?.building?.map(item => (
                                    <div key={item.id}>
                                        <div className='mb-3' >
                                            <p className='row ms-3 mb-0'>
                                                <span><small className='fw-bold'>ID: </small>{item.id}</span>
                                                <span><small className='fw-bold'>Price: </small><span>{item.price} {item.currency}</span></span>
                                                <span><small className='fw-bold'>space: </small><span>{item.space} m²</span></span>
                                            </p>
                                            
                                        </div>

                                    </div>
                                ))
                            }
                        </div>

                    </div>




                </div>
            </>
        )
    }
    const closePopup = () => {
        setMessage({status:'', message:''})
        setPopup('')
        setSeeOrderPopup('')
    }

    // ORDERS ITEMS IN LIST (IF ADMIN SHOW ARCHIVED ITEM IN MENU)
    const menuItems = () => {
        if(user?.user.roles.includes('ADMIN')){
            return ['List', 'Archived']
        }else{
            return ['List']
        }
    }
    




    return (
        <OrdersDashStyle>
            <DashboardTopMenu option={option} listItems={menuItems()} navItem='orders' archived={archived} setArchived={setArchived} setMessage={setMessage} setPaginationOffset={setPaginationOffset} setOption={setOption}/>

            <div className='dash-content'>
                <DashboardOptionBlock navItem='orders' option={option}  orders={orders} archiveOrder={archiveOrder} message={message} pages={pages}
                                    popup={popup} setPaginationOffset={setPaginationOffset} setSeeOrderPopup={setSeeOrderPopup} />
            </div>

            {
                seeOrderPopup && renderSeeOrderPopup()
            }

        </OrdersDashStyle>
    )
}

const OrdersDashStyle = styled.div`



`

export default OrdersDash