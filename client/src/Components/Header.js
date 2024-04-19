import { useState } from 'react';
import { styled } from 'styled-components'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";







const Header = () => {
    const { user, logout } = useAuth()
    const [ userNavPopup, setUserNavPopup ] = useState(false)
    const [ mode, setMode ] = useState(()=>localStorage.getItem('theme') ? 'light' : 'dark')

    const setThemeColor = () => {
        if(localStorage.getItem('theme')) {
            localStorage.removeItem('theme')
            document.body.classList.remove('dark-theme')
            setMode('dark')
        } else {
            localStorage.setItem('theme', 'dark-theme')
            document.body.classList.add('dark-theme')
            setMode('light')
        }
    }

    const renderUserNavPopup = user => {
        return (
            <>
                <div className="position-fixed top-0 start-0 end-0 bottom-0 opacity-25 bg-dark overlay" onClick={()=>setUserNavPopup(false)} />
                <div className='user-nav-popup'>
                    <NavLink to='/dashboard' onClick={()=>setUserNavPopup(!userNavPopup)}>
                        <MdDashboard /> Dashboard
                    </NavLink>
                    <NavLink to='/login' onClick={()=>handlelogout()}>
                        <IoLogOut /> Logout
                    </NavLink>
                </div>
            </>
        )
    }


    const handlelogout = async () => {
        await logout()
        setUserNavPopup(false)
    }

    return (
        <HeaderStyle>
            <nav className="navbar navbar-expand-lg navigation">
                <div className="container">
                        <NavLink to='/' className="navbar-brand">Home</NavLink>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <NavLink to='/about-us' className="nav-link">About us</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/products' className="nav-link">Products</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/latest' className="nav-link">Latest</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/contact' className="nav-link">Contact</NavLink>
                                </li>

                            </ul>
                            <div className='navbar-nav right-nav'>
                                {
                                    user ? (
                                        <>
                                        <li className="nav-item position-relative">
                                            <span className='d-flex align-items-center'>
                                                <FaUser className='me-3'/>
                                                <span className='cursor-pointer' onClick={()=>setUserNavPopup(!userNavPopup)}>
                                                    { user?.user?.name }
                                                </span>
                                            </span>
                                            {
                                                userNavPopup && renderUserNavPopup()
                                            }
                                        </li>
                                        </>
                                    )
                                    : (
                                        <>
                                            <li className="nav-item">
                                                <NavLink to='/login' className="nav-link">Login</NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink to='/register' className="nav-link">Register</NavLink>
                                            </li>
                                        </>
                                    )
                                }
                                <li className='mode' onClick={()=>setThemeColor()}>
                                    {
                                        mode === 'light' ? <MdLightMode /> : <MdDarkMode />
                                    }
                                </li>
                            </div>
                        </div>
                    </div>
                </nav>
        </HeaderStyle>
    )
}
const HeaderStyle = styled.header`
    height: var(--header-height);
    background-color: var(--second-color);
    nav {
        z-index: 1;
        background-color: var(--second-color);
        .right-nav {
            display: flex;
            align-items: center;
            .mode {
                color: var(--main-color);
                margin-left: 10px;

            }
            @media screen and (max-width: 991px) {
                align-items: flex-start;
                .mode {
                    margin-left: 0;
                }
            }
            
            .nav-item {
                span {
                    color: var(--main-color);
                }
            }
        }
        a {
            color: var(--main-color);
            &.active {
                border-bottom: 4px solid var(--main-color);
                color: var(--main-color) !important;
            }
            &:hover {
                color: var(--main-color) !important;
            }
        }
        .user-nav-popup {
            position: absolute;
            background: white;
            padding: 1rem;
            top: 30px;
            border: 1px solid var(--light-color);
            left: -50%;
            border-radius: 5px;
            width: 150px;
            a {
                color: var(--text-color);
                display: block;
                margin-bottom: 8px;
                &:hover {
                    color: var(--second-color) !important;
                }
                &.active {
                    color: var(--second-color) !important;
                }
            }
            z-index: 100 !important;
        }
        .overlay {
            z-index: 99 !important;
            opacity: 0 !important;
        }
    }
`


export default Header