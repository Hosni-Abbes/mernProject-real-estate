import { useEffect, useState } from "react"
import { styled } from "styled-components"
import { useAuth } from "../hooks/useAuth"
import { NavLink } from "react-router-dom"
import { useDocTitle } from "../hooks/useDocTitle"


const Login = ({mustLoginMessage}) => {
    const { login, error, setError } = useAuth()
    const [userData, setUserData] = useState({
        email:'',
        password:''
    })

    // set page title
    useDocTitle('Login')


    useEffect(()=>{
        let isMounted = true
        if(isMounted) setError('')
        return () => isMounted = false
    },[])

    // handle input change
    const handleInputChange = e => {
        setUserData({...userData, [e.target.name]: e.target.value })
    }

    // submit form
    const handleFormSubmit = async e => {
        e.preventDefault()
        await login(userData)
    }

    return (
        <LoginStyle className="container" style={mustLoginMessage && {width:'100% !important'}  } >
            
            <h3 className="mb-4"> { mustLoginMessage ? mustLoginMessage : 'Login' }</h3>
            {
                error && <p className="error-msg">{ error }</p>
            }
            <form onSubmit={e => handleFormSubmit(e)} className="d-flex flex-column">
                <label htmlFor="login-email" className="form-label">Email</label>
                <input type="email" id="login-email" name="email" onChange={e=>handleInputChange(e)} />
                <label htmlFor="login-password" className="form-label">Password</label>
                <input type="password" id="login-password" name="password" onChange={e=>handleInputChange(e)} />
                <div>
                    <input type="submit" value="Login" />
                </div>
            </form>

            <br/>
            <p className="auth-bottom-msg">Don't have an account? <NavLink to='/register'>Register</NavLink> now! </p>
        </LoginStyle>
    )
}

const LoginStyle = styled.div`
    margin: auto;
    padding: 30px 0;
    width: 90%;
    @media screen and (min-width: 768px ) {
        width: 70% !important;
    }
    @media screen and (min-width: 1200px ) {
        width: 50% !important;
    }
    @media screen and (min-width: 1400px ) {
        width: 40% !important;
    }
    .error-msg{
        color: var(--error-color);
    }
    form {
        width: 100%;
        input {
            border: 1px solid #eee;
            outline: none;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 4px;
        }
    }
    .auth-bottom-msg {
        a { color: var(--second-color) }
    }
`

export default Login