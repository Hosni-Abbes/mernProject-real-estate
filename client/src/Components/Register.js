import { styled } from "styled-components"
import { useAuth } from "../hooks/useAuth"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { useDocTitle } from "../hooks/useDocTitle"


const Register = () => {
    const { register, message, setMessage, error, setError } = useAuth()
    const [userData, setUserData] = useState({
        name:'',
        email:'',
        password:'',
        confirmpassword:'',
        address:'',
        phone:'',
        mobile:'',
        website:'',
        company:''
    })


    // set page title
    useDocTitle('Register')

    useEffect(()=>{
        let isMounted = true
        if(isMounted){
            setMessage('')
            setError('')
        } 
        return () => isMounted = false
    },[])

    // handle input change
    const handleInputChange = e => {
        setUserData({...userData, [e.target.name]: e.target.value })
    }

    // submit form
    const handleFormSubmit = async e => {
        e.preventDefault()
        setMessage('')
        setError('')
        if(userData.password !== userData.confirmpassword) return setError('Password not match!')
        await register(userData)
    }

    // close popup
    const closePopup = () => {
        setMessage('')
        setUserData({ name:'', email:'', password:'', confirmpassword:'', address:'', phone:'', mobile:'', website:'', company:'' })
    }

    // render registration success popup
    const renderRegisterSuccess = () => (
        <>
            <div className="position-absolute top-0 start-0 end-0 bottom-0 opacity-25 bg-dark overlay" onClick={()=>closePopup()} />
            <div className="position-absolute top-50 start-50 translate-middle p-5 w-50 bg-white popup">
                <span className="close" onClick={()=>closePopup()} >x</span>
                <p>{ message }</p>
                <button className="btn btn-success">
                    <NavLink className='text-white' to='/login'>Login</NavLink> now
                </button>
            </div>
        </>
    )

    return (
        <RegisterStyle className="container">
            <h3 className="mb-4">Register</h3>
            {
                error && <p className="error-msg">{ error }</p>
            }
            {
                 message && renderRegisterSuccess()
            }
            <form onSubmit={e => handleFormSubmit(e)} className="d-flex flex-column">
                <label>Full Name *</label>
                <input type="text" required name="name" value={userData.name} onChange={e=>handleInputChange(e)} />
                <label>Email *</label>
                <input type="email" required name="email" value={userData.email} onChange={e=>handleInputChange(e)} />
                <label>Password *</label>
                <input type="password" required name="password" value={userData.password} onChange={e=>handleInputChange(e)} />
                <label>Confirm Password *</label>
                <input type="password" required name="confirmpassword" value={userData.confirmpassword} onChange={e=>handleInputChange(e)} />
                <label>Company</label>
                <input type="text" name="company" value={userData.company} onChange={e=>handleInputChange(e)} />
                <label>Address *</label>
                <input type="text" required name="address" value={userData.address} onChange={e=>handleInputChange(e)} />
                <label>Phone *</label>
                <input type="text" required name="phone" value={userData.phone} onChange={e=>handleInputChange(e)} />
                <label>Mobile</label>
                <input type="text" name="mobile" value={userData.mobile} onChange={e=>handleInputChange(e)} />
                <label>Website</label>
                <input type="text" name="website" value={userData.website} onChange={e=>handleInputChange(e)} />
                <div>
                    <input type="submit" value="Register" />
                </div>
            </form>

            <br/>
            <p className="auth-bottom-msg">Already have an account? <NavLink to='/login'>Login</NavLink> now! </p>
        </RegisterStyle>
    )
}

const RegisterStyle = styled.div`
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

export default Register