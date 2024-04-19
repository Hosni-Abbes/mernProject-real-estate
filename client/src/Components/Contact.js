import { useEffect, useState } from "react"
import { styled } from "styled-components"
import axios from "../api/axios"

import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { useDocTitle } from "../hooks/useDocTitle";
import StaticData from "../Utils/StaticInfo";





const Contact = () => {
    const [contactInfo, setContactInfo] = useState({
        name:'',
        email:'',
        phone:'',
        subject:'',
        message:''
    })
    const [message, setMessage] = useState(null)


    // set page title
    useDocTitle('Contact us')


    useEffect(()=>{
        let isMounted=true;
        if(isMounted) setMessage(null)
        return () => isMounted = false
    },[])


    // handle input change
    const handleInputChange = e => {
        setContactInfo({...contactInfo, [e.target.name]: e.target.value})
    }

    // handle form submission
    const handleFormSubmit = async e => {
        e.preventDefault()
        const controller = new AbortController()
        try {
            const res = await axios.post('/contact/send-email', contactInfo, {signal: controller.signal})
            setMessage(res.data.message);
            setContactInfo({name:'', email:'', phone:'', subject:'', message:''})
            return controller.abort()
        } catch (error) {
            setMessage(error.response.data.message);
            console.error(error.response.data.message)
        }
    }


  return (
    <ContactStyle className="container">
        <div className="row">
            <div className="col-md-6 contact-info">
                <h3 className="mb-3">Contact Info</h3>
                <div className="d-flex align-items-baseline">
                    < MdEmail/>
                    <p className="ms-2"> { StaticData.aboutUs.email } </p>
                </div>
                <div className="d-flex align-items-baseline">
                    <FaPhoneAlt />
                    <p className="ms-2"> { StaticData.aboutUs.phone } </p>
                </div>
                <div className="d-flex align-items-baseline">
                    <FaLocationDot />
                    <p className="ms-2"> { StaticData.aboutUs.address } </p>
                </div>
            </div>

            <div className="col-md-6 contact-form">
                <h3 className="mb-3">Get in touch</h3>
                {
                    message ?
                        message?.status == 200 ?
                            <p className="text-success">{message?.text}</p>
                            : <p className="text-danger">{message?.text}</p> 
                        
                    : null 
                }
                <form className="row" onSubmit={e=>handleFormSubmit(e)}>
                    <div className="col-md-6">
                        <input className="form-control" type="text" name="name" placeholder="Name" required value={contactInfo.name} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="col-md-6">
                        <input className="form-control" type="email" name="email" placeholder="Email" required value={contactInfo.email} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="col-12">
                        <input className="form-control" type="tel" name="phone" placeholder="Phone" required value={contactInfo.phone} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="col-12">
                        <input className="form-control" type="text" name="subject" placeholder="Subject" required value={contactInfo.subject} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="col-12">
                        <textarea className="form-control" name="message" placeholder="Message" cols='5' rows='8' required value={contactInfo.message} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="col-12">
                        <input className="form-control w-25 submit-btn" type="submit" value='Send' />
                    </div>
                </form>
            </div>
        </div>
        
    </ContactStyle>
  )
}

const ContactStyle = styled.div`
    padding: 3rem 1rem;
    .contact-form{
        input, textarea{
            margin-bottom: 10px;
            padding: 10px;
            outline: none;
            resize: none;
        }
        .submit-btn {
            background-color: var(--second-color);
            color: var(--main-color);
        }
        @media screen and (max-width: 767px) {
            margin-top: 2rem;
        }
    }
    h3 {
        color: var(--text-color);
    }
`

export default Contact