import React from 'react'
import { styled } from 'styled-components'
import { IoEye } from "react-icons/io5";
import StaticData from '../../Utils/StaticInfo';
import { useAuth } from '../../hooks/useAuth';

function DashboardListTable({data, option, tableFields, setSeePostPopup, setSeeOrderPopup, archiveOrder, renderPopup, deleteProduct, deleteUser, updateUserRole, deleteArticle, popup, message, pages, setPaginationOffset}) {

    const { user } = useAuth()

    const renderTableData = option => {
        if(option == 'products') {
            return (
                data?.length ? data.map(product => (
                    <tr key={product.id} className='item'>
                        <th scope="row">{product.id}</th>
                        <td>{product.objectId}</td>
                        <td>{product.title}</td>
                        <td>{product.price}</td>
                        <td> <span className='btn item-action-btn delete' onClick={()=>deleteProduct(product.id)}> Delete </span> </td>
                    </tr>
                ))
                :  ''
                
            )
        }else if(option == 'articles'){
            return (
                data?.length ? data.map(d => (
                    <tr key={d.id} className='list-item'>
                        <th scope="row">{d.id}</th>
                        <td>{d.title?.length > 20 ? d.title?.substring(0, 20) + '...' : d.title }</td>
                        <td>{d.content?.length > 100 ? d.content?.substring(0, 100) + '...' : d.content }</td>
                        <td>{d.author || '-'}</td>
                        <td>{ new Date(d.createdAt).toLocaleDateString() }</td>
                        <td className='cursor-pointer'> <IoEye onClick={()=>setSeePostPopup(d.id)} /> </td>
                        <td> <span className='btn item-action-btn update' onClick={()=>renderPopup(d.id)}> Update </span> </td>
                        <td> <span className='btn item-action-btn delete' onClick={()=>deleteArticle(d.id)}> Delete </span> </td>
                    </tr>
                ))
                : ''
            )
        
        }else if(option == 'users'){
            return (
                data?.length ? data.map(usr => (
                    <tr key={usr.id} className='item'>
                        <th scope="row">{usr.name}</th>
                        <td>{usr.email}</td>
                        <td>{usr.roles?.join(', ')}</td>
                        <td>{usr.activateEmailToken != '' ? 'Not Active' : 'Active'}</td>
                        <td> 
                            {
                                user?.user?.id === usr.id
                                ? '-'
                                : <span className='btn item-action-btn delete' onClick={()=>deleteUser(usr.id)}> Delete </span> 
                            }    
                        </td>
                        <td>
                            {
                                !usr?.roles?.includes('ADMIN')
                                ? <span className='btn item-action-btn text-success' onClick={()=>updateUserRole(usr.id)}> Set as admin </span>
                                : '-'
                            }
                        </td>
                    </tr>
                ))
                : ''
                
            )
        }else if(option == 'orders'){
            return (
                data?.length ? data.map(order => (
                    <tr key={order.id} className='list-item'>
                        <th scope="row">{order.id}</th>
                        <td>{order.paymentRef}</td>
                        <td>{order.user?.name} - {order.user?.email}</td>
                        <td>{order.status}</td>
                        <td>
                            {
                                order.status === "Payed" 
                                ? <> {order.amountPayed} {order.currency} </>
                                : '-'
                            }
                        </td>
                        <td>
                            {
                                order.status === "Payed" 
                                ? <> {parseFloat(order.amountToCompletePay).toPrecision(3)} {order.currency} </>
                                : '-'
                            }    
                            
                        </td>
                        <td className='cursor-pointer'> <IoEye onClick={()=>setSeeOrderPopup(order.id)} /> </td>
                        {
                            !order.archived && <td> <span className='btn item-action-btn' onClick={()=>archiveOrder(order.id)}> Archive </span> </td>
                        }
                    </tr>
                ))
                : ''
            )
        
        }

    }

    const handlePaginate = page => {
        setPaginationOffset( page * StaticData.pagination.dashboardListLimit)
        window.scrollTo(0,document.querySelector('.main-dash-content').offsetTop) 
    }


    return (
        <DashboardListTableStyle >
            {
                popup === '' && message.status !=='' ? <p className={message?.status == 200 ? 'msg msg-success' : 'msg msg-fail'}>{message.message}</p> : null
            }
            {
                data?.length 
                ? <>
                    <div className='table-responsive'>
                    <table className="table">
                        <thead>
                            <tr>
                                {
                                    tableFields?.length && data?.length ? tableFields?.map((field,i) => (
                                        <th key={i} scope="col">{field}</th>
                                    ))
                                    : null
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                renderTableData(option)
                            }
                        </tbody>
                    </table>
                    </div>
                    <div className='pagination'>
                        {
                            pages.length ? pages.map((page,i) => (
                                    <span key={i} className='pagination-item' onClick={()=>handlePaginate(page)} >
                                        {page + 1}
                                    </span>
                                )
                            )
                            : null
                        }
                    </div>
                </>
                : <p className='my-4'>List of {option} is empty!</p>
            }
        </DashboardListTableStyle>

    )
}

const DashboardListTableStyle = styled.div`


        .item-action-btn {
            border: 1px solid var(--text-color);
            &.delete {
                color: var(--error-color);
                &:hover {
                    background-color: var(--error-color);
                    color: var(--main-color);
                }
            }
            &.update {
                color: var(--second-color);
                &:hover {
                    background-color: var(--second-color);
                    color: var(--main-color);
                }
            }
        }
        .pagination {
                margin-top: 1.5rem;
                display: flex;
                gap: 0.7rem;
                .pagination-item {
                    border: 1px solid var(--second-color);
                    border-radius: 100%;
                    padding: 0px 7px;
                    cursor: pointer;
                }
            }
   

`

export default DashboardListTable