import { styled } from "styled-components"
import StaticData from "../Utils/StaticInfo"
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";





function Footer() {
  return (
    <FooterStyle>
        <div className="container">
            <div className="row">
                <div className="col-md-8 mb-4">
                    <h4 className="mb-3">Our Site</h4>
                    <div className="d-flex align-items-baseline">
                        <FaLocationDot />
                        <span className="ms-2"> { StaticData.aboutUs.address } </span>
                    </div>
                    <div className="d-flex align-items-baseline">
                        <FaPhoneAlt />
                        <span className="ms-2"> { StaticData.aboutUs.phone } </span>
                    </div>
                    <div className="d-flex align-items-baseline">
                        < MdEmail/>
                        <span className="ms-2"> { StaticData.aboutUs.email } </span>
                    </div>
                </div>
                <div className="col-md-4">
                    <h4 className="mb-3">Join US</h4>
                    <div className="social-icons">
                        <a href={StaticData.aboutUs.linkedinUrl}> <FaLinkedinIn /> </a>
                        <a href={StaticData.aboutUs.twitterUrl}> <FaTwitter /> </a>
                        <a href={StaticData.aboutUs.facebookUrl}> <FaFacebookF /> </a>
                    </div>
                </div>
            </div>
        </div>
    </FooterStyle>
  )
}

const FooterStyle = styled.footer`
    height: var(--footer-height);
    background-color: var(--second-color);
    color: var(--main-color);
    padding: 3rem 0;
    @media screen and (max-width: 768px) {
        padding: 1.5rem 0;        
    }
    .social-icons {
        display: flex;
        a {
            font-size: 20px;
            color: var(--main-color);
            margin-right: 10px;
            padding: 0 !important;
            padding: 6px;
            @media screen and (max-width: 576px) {
                font-size: 16px;      
            }
        }
    }
`

export default Footer