import { useEffect, useState } from "react"
import { useDocTitle } from "../hooks/useDocTitle"
import Configs from "../Utils/Configs"
import Slider from 'react-slick'
import StaticData from "../Utils/StaticInfo"
import { styled } from "styled-components"

import { FaBuildingColumns } from "react-icons/fa6";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import CountUp from 'react-countup'
import axios from "../api/axios"




const Home = () => {
    const sliderSettings = Configs.sliderSettings
    const sliderSettingsArticles = Configs.sliderSettingsArticles
    const [startCount, setStartCount ] = useState(false)
    const [articles, setArticles] = useState([])
    const [openNewsPopup, setOpenNewsPopup] = useState('')

    // set page title
    useDocTitle('Home')

    useEffect(()=>{
        let isMounted = true
        const controller = new AbortController()
        if(isMounted){
            fetchArticles(controller)
            window.addEventListener('scroll', ()=>{
                const counterSection = document.querySelector('.info-section .info-items')?.getBoundingClientRect().y
                window.pageYOffset >= counterSection ? setStartCount(true) : setStartCount(false)
            })
        }
        return () => {
            isMounted = false
            setStartCount(false)
            controller.abort()
        }
    },[])


    const fetchArticles = async controller => {
        try {
            const res = await axios.get(`/api/v1/articles`, {
                signal: controller.signal
            })
            setArticles(res.data?.articleList)
        }catch(error){
            if (error.name != 'CanceledError') {
                console.log(error)
            }
        }
    }


    // render news content in popup
    const renderOpenedArticle = id => {
        const article = articles?.filter(n => n.id == id)[0]
        return (
            <>
                <div className="position-absolute top-0 start-0 end-0 bottom-0 opacity-25 bg-dark overlay" onClick={()=>setOpenNewsPopup('')} />
                <div className="position-fixed top-50 start-50 translate-middle py-3 px-5 w-50 bg-white popup">
                    <span className="close" onClick={()=>setOpenNewsPopup('')} >x</span>
                    
                    {
                        <div>
                            <h3 className='mb-3'>{article?.title}{}</h3>
                            <p>{article?.content}</p>
                            <hr className='mb-1'/>
                            <small>By: {article?.author ? article?.author : 'Annonymous,' } at: {new Date(article?.createdAt).toLocaleDateString() }</small>

                        </div>

                    }
                    
                </div>
            </>
        )
    }


    return (
        <HomeStyle>
                { openNewsPopup !== '' && renderOpenedArticle(openNewsPopup) }
            <section className="slick-sec">
                <Slider {...sliderSettings} >
                    {
                        StaticData.homePageSliderImages?.length ?
                            StaticData.homePageSliderImages.map(img => (
                                <div key={img.id} className="img-container p-0 position-relative">
                                    <img src={StaticData.baseServerUrl + img.path} alt="Slider Image" />
                                    <div className="desc">
                                        <p> {img.descLine1} </p>
                                        <p> {img.descLine2} </p>
                                    </div>
                                </div>
                            ))
                        : null
                    }

                </Slider>
            </section>

            <div className="container">
                <section className="row home-sections sec-about">
                    <h3 className="section-heading">About Us</h3>
                    <div className="col-md-6">
                        <p> {StaticData.aboutUs.homeIntro} </p>
                    </div>
                    <div className="col-md-6">
                        <div>
                            <img className="w-100" src={StaticData.baseServerUrl + StaticData.aboutUs.img} alt="Image" />
                        </div>
                    </div>
                </section>
            </div>
                
            <div className={articles?.length ? "home-sections info-section" : "home-sections info-section mb-0"}>
                <h3 className="section-heading">Our Stats</h3>
                <section className="container">
                    <div className="row text-center info-items">
                        <div className="col-sm-4 info-item">
                            <FaBuildingColumns className="info-item-icon" />
                            <span className="info-item-count">
                                {
                                    startCount ? <CountUp start={0} end={StaticData.aboutUs.onlineProjects} duration={2} delay={0} useGrouping={false} /> : 0
                                }
                            </span>
                            <span>Online Projects</span>
                        </div>
                        <div className="col-sm-4 info-item">
                            <FaUser className="info-item-icon" />
                            <span className="info-item-count">
                                {
                                    startCount ? <CountUp start={0} end={StaticData.aboutUs.connectedUsers} duration={2} delay={0} useGrouping={false} /> : 0
                                }
                            </span>
                            <span>Connected Users</span>
                        </div>
                        <div className="col-sm-4 info-item">
                            <FaMoneyBillTrendUp className="info-item-icon" />
                            <span className="info-item-count">
                                {
                                    startCount ? <CountUp start={0} end={StaticData.aboutUs.investments} duration={2} delay={0} useGrouping={false} /> : 0
                                }
                            </span>
                            <span>Investments</span>
                        </div>
                    </div>
                </section>
            </div>

            {
                articles.length ? 
                    <div className="container">
                        <section className="row home-sections articles-sec latests">
                            <h3 className="section-heading">Latest</h3>
                                <Slider {...sliderSettingsArticles}>
                                    {
                                        articles.map(item => (
                                            <div key={item.id} className="col-md-6 col-lg-4 col-xl-3 mb-4 latest-item" >
                                                <div className="latest-item-content">
                                                    <h4>{item.title}</h4>
                                                    <p className="mb-2">{item.content.length > 200 ? item.content.substring(0,200) + '...' : item.content }</p>
                                                    <span className="cursor-pointer " onClick={()=>setOpenNewsPopup(item.id)} > &gt; See Post</span>
                                                    
                                                </div>
                                            </div>
                                        ))
                                    }
                            </Slider>
                        </section>
                    </div>
                : null
            }

        </HomeStyle>
    )
}

const HomeStyle = styled.div`
    .home-sections {
        margin: 5rem 0;
        .section-heading {
            margin-bottom: 3rem;
            text-align: center;
        }
    }
    .slick-sec {
        /* height: 600px;
        * {
            height: 100% !important;
        }
        ul { height: auto !important} */
        .img-container {
            position: relative;
            .desc {
                position: absolute;
                top: 20%;
                left: 50px;
                transform: translateY(-20%);
                background-color: var(--text-color);
                color: var(--main-color);
                font-size: 1.5rem;
                padding: 1rem 1.8rem;
                opacity: 0.8;
                max-width: 50%;
                @media screen and (max-width: 300px ) {
                    max-width: 160px;
                    font-size: 0.8rem;
                    left: 10px;
                    padding: 0.5rem 1rem
                }
                @media screen and (max-width: 576px ) {
                    max-width: 300px;
                    font-size: 1rem;
                    left: 15px;
                    padding: 0.8rem 1.3rem
                }
                @media screen and (max-width: 768px ) {
                    max-width: 300px;
                    font-size: 1rem;
                    left: 15px;
                    padding: 0.8rem 1.3rem
                }

            }
        }
    }

    .info-section {
        padding: 4rem 0;
        background-color: var(--light-color);
        .info-items {
            .info-item {
                margin-bottom: 2rem;
                font-size: 1rem;
                .info-item-icon{
                    display: block;
                    margin: auto;
                    margin-bottom: 10px;
                    font-size: 2rem;
                }
                .info-item-count {
                    display: block;
                    margin: auto;
                    font-size: 1.8rem;
                }
            }
        }
    }

    
    .latests {
        .latest-item {
            .latest-item-content {
                cursor: default;
                background-color: var(--main-color) !important;
                color: var(--text-color) !important;
            }

        }
    
        
    }
`


export default Home