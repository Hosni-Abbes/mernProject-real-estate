import { styled } from "styled-components"
import StaticData from "../Utils/StaticInfo"
import { useDocTitle } from "../hooks/useDocTitle"

function AboutUs() {

    // set page title
    useDocTitle('About us')


  return (
    <AboutUsStyle className="container">
        <div className="top pt-5 pb-2">
            <h3 className="mb-3">About Us</h3>
            <p>{StaticData.aboutUs.intro}<br/>
            {StaticData.aboutUs.history}</p>
        </div>
        <div className="mt-4 content">
            
        </div>


    </AboutUsStyle>
  )
}

const AboutUsStyle = styled.div`
    .top {
        h3 {
            color: var(--second-color);
        }
    }
`

export default AboutUs