import React, { useState } from 'react'
import { styled } from 'styled-components'
import { FaBuilding } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { SlBasket } from "react-icons/sl";
import { MdArticle } from "react-icons/md";
import ProductsDash from './ProductsDash';
import ArticlesDash from './ArticlesDash';
import UsersDash from './UsersDash';
import OrdersDash from './OrdersDash';
import { useDocTitle } from '../../hooks/useDocTitle';
import { useAuth } from '../../hooks/useAuth';



function Dashboard() {
    const { user } = useAuth()
    const [option, setOption] = useState('products')

    useDocTitle('Dashboard')



    return (
        <DashboardStyle>
            <div className='dashboard-container'>
                <div className='row'>
                    <div className='col-md-2 left-menu'>
                        <span className={option === 'products' ? 'active' : ''} onClick={()=>setOption('products')}> <FaBuilding/> Products</span>
                        {
                            user?.user?.roles?.includes('ADMIN') 
                            ? <>
                                <span className={option === 'articles' ? 'active' : ''} onClick={()=>setOption('articles')}> <MdArticle /> Articles</span>
                                <span className={option === 'users' ? 'active' : ''} onClick={()=>setOption('users')}> <FaUsers /> Users</span>
                            </>
                            : null
                        }
                        <span className={option === 'orders' ? 'active' : ''} onClick={()=>setOption('orders')}> <SlBasket /> Orders</span>
                    </div>
                    <div className='col-md-10 main-dash-content'>
                        {
                            option === 'products' ? <ProductsDash /> 
                            : option === 'articles' ? <ArticlesDash /> 
                            : option === 'users' ? <UsersDash /> 
                            : option === 'orders' ? <OrdersDash /> 
                            : null
                        }
                        
                    </div>
                </div>
            </div>
        </DashboardStyle>
    )
}

const DashboardStyle = styled.div`

    .dashboard-container {
        padding: 1rem;
        .left-menu {
            border-right: 1px solid var(--second-color);
            min-height: calc(100vh - var(--footer-height) - var(--header-height) - 2rem);
            padding-top: 1rem;
            span {
                display: block;
                margin-bottom: 10px;
                cursor: pointer;
                padding: 6px;
                &:last-child {
                    margin-bottom: 0;
                }
                &:hover {
                    background-color: var(--light-color);
                }
                &.active {
                    background-color: var(--light-color);
                }
            }
            @media screen and (max-width: 767px) {
                border-right: 0 !important;
                min-height: auto;
                display: flex;
                flex-wrap: wrap;
                width: 60%;
                margin-bottom: 1rem;
                span {
                margin-right: 10px;
                &:last-child {
                    margin-right: 0;
                }
            }
            }
            @media screen and (max-width: 576px) {
                width: 100%;
            }
        }
        .main-dash-content{
            padding: 1rem;
            .dash-content {
                .submit-btn {
                    border: 1px solid  var(--second-color) !important;
                    &:hover {
                        background-color: var(--second-color) !important;
                        color: var(--main-color);
                    }
                }
            }
        }


        .popup {
            overflow-y: scroll;
            max-height: 70vh;
            width: 75% !important;
            @media screen and (max-width: 767px) {
                width: 90% !important;
                padding: 1rem !important;
            }
        }
    }
`

export default Dashboard