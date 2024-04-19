import { React, useEffect, useState } from "react"
import { styled } from "styled-components"
import axios from "../api/axios"
import { NavLink } from "react-router-dom"
import StaticData from "../Utils/StaticInfo"
import useOverflowHidden from "../hooks/useOverflowHidden"
import { useDocTitle } from "../hooks/useDocTitle"

import Slider from "react-slick";
import Configs from "../Utils/Configs"

import { useAuth } from "../hooks/useAuth"
import Login from "./Login"

function Products() {
    const { user } = useAuth()
    const [products, setProducts] = useState([])
    const [sort, setSort] = useState('')
    const [filterOptions, setFilterOptions] = useState({
        minPrice:'',
        maxPrice:'',
        numberRooms:'',
        space: ''
    })
    const [productPopup, setProductPopup] = useState('')
    const [loginPopup, setLoginPopup] = useState(false)
    const [messagePopup, setMessagePopup] = useState(false)
    const [messages, setMessages] = useState('')

    // Slider settings
    const sliderSettings = Configs.sliderSettings

    // Set Page title
    useDocTitle('Products')

    useEffect(()=> {
        let isMounted = true;
        if (isMounted) {
            fetAllProducts()
        }
        return () => isMounted = false
    }, [])
    
  

    // fetch all products
    const fetAllProducts = async () => {
        try {
            const res = await axios.get('/api/v1/products')
            setProducts(res.data.buildingList)
        } catch (error) {
            console.error(error.response.data.message)
        }
    }


    // handle filter change
    const handleFilterChange = e => {
        setFilterOptions({...filterOptions, [e.target.name]: e.target.value})
    }


    const handlePayment = async product => {
        const userId = user.user.id
        const productsIds = [product.id]
        try {
            const res = await axios.post('/api/v1/payment', {userId, productsIds})
            if (res.data?.redirectURL) window.location.href = res.data?.redirectURL
            setMessages('')
            setMessagePopup(false)
        }catch(err) {
            setMessages(err.response.data.message)
            setMessagePopup(true)
            console.error(err.response.data.message)
        }
    }


    // render product detail popup
    const renderProductPopup = id => {
        const product = products.filter(p => p.id == id)[0]
        return (
            <>
                <div className="position-absolute top-0 start-0 end-0 bottom-0 opacity-25 bg-dark overlay" onClick={()=>setProductPopup('')} />
                <div className="position-fixed top-50 start-50 translate-middle px-5 py-4 w-50 bg-white popup" >
                    <span className="close" onClick={()=>setProductPopup('')} >x</span>
                    {
                        <div className="product-data">
                            <h4>{product.title}</h4>
                            <div className="mb-5 slider">
                                {
                                    product.attachements.filter(pAttch => pAttch.category === 1).length > 1 ?
                                        <Slider {...sliderSettings} >
                                            {
                                            product.attachements.filter(pAttch => pAttch.category === 1).map((pr,i) => (
                                                <div className="img-container" key={pr.id}>
                                                    {
                                                        pr.type === "XML Upload"
                                                        ? <img className="" src={ StaticData.baseServerUrl + '/uploads/products/' + pr.file} alt="Product Attachment" />
                                                        : <img className="" src={ StaticData.baseServerUrl + '/products/' + pr.file} alt="Product Attachment" />
                                                    }
                                                </div>
                                            ))}
                                        </Slider>
                                    : <>
                                        {
                                        product.attachements.filter(pAttch => pAttch.category === 1).map((pr,i) => (
                                            <div className="img-container" key={pr.id}>
                                                {
                                                    pr.type === "XML Upload"
                                                    ? <img className="" src={ StaticData.baseServerUrl + '/uploads/products/' + pr.file} alt="Product Attachment" />
                                                    : <img className="" src={ StaticData.baseServerUrl + '/products/' + pr.file} alt="Product Attachment" />
                                                }
                                            </div>
                                        ))}
                                    </>
                                }
                            </div>
                            <p>{product.description}</p>
                            <div className="row product-info">
                                <div className="col-md-4 mb-4">
                                    <strong>Address: </strong> <br />
                                    <span>{product.country}</span> <br />
                                    <span>{product.street} {product.zip}, {product.city} </span>
                                    <br/><br/>
                                    <strong>Price: </strong> <br />
                                    <span>{product.price} {product.currency}</span>
                                </div>
                                <div className="col-md-4 mb-4">
                                    <strong>Space: </strong> <span>{product.space} m²</span> <br />
                                    <strong>Build year: </strong> <span>{product.buildingYear}</span> <br />
                                    <strong>Condition rate: </strong> <span>{product.condition}/7</span> <br />
                                    <strong>Bedrooms: </strong> <span>{product.bedrooms}</span> <br />
                                    <strong>Kitchens: </strong> <span>{product.kitchens}</span> <br />
                                    <strong>Baths: </strong> <span>{product.bathrooms}</span> <br />
                                </div>
                                <div className="col-md-4 mb-4 buy-btn">
                                    <strong>Seller info:</strong> <br />
                                    <strong>Name: </strong> <span>{product.user.name}</span> <br />
                                    <strong>Email: </strong> <span>{product.user.email}</span> <br />
                                    <strong>Phone: </strong> <span>{product.user.phone}</span> <br /><br />
                                    <button className="btn" onClick={()=> !user ? setLoginPopup(true) : handlePayment(product) }>Buy now</button>
                                </div>
                            </div>
                        </div>
                    }
                    
                </div>
            </>
        )
    }
  
    const renderLoginPopup = () => {
        return (
            <>
                <div className="position-absolute top-0 start-0 end-0 bottom-0 opacity-25 bg-dark overlay" onClick={()=>setLoginPopup(false)} />
                <div className="position-fixed top-50 start-50 translate-middle px-5 py-4 w-50 bg-white popup" >
                    <span className="close" onClick={()=>setLoginPopup(false)} >x</span>
                    <Login mustLoginMessage='First, You need to login.' />
                    { user && setLoginPopup(false)}
                </div>
            </>
        )
    }

    const renderMessagePopup = () => {
        return (
            <>
                <div className="position-absolute top-0 start-0 end-0 bottom-0 opacity-25 bg-dark overlay overlay-msg" onClick={()=>setMessagePopup(false)} />
                <div className="position-fixed top-50 start-50 translate-middle px-5 py-4 w-50 bg-white popup popup-msg" >
                    <span className="close" onClick={()=>setMessagePopup(false)} >x</span>
                    <span className="text-danger">{messages}</span>
                </div>
            </>
        )
    }
  
    return (
        <ProductStyle className="container">
            {
                useOverflowHidden(productPopup)
            }
            {
                productPopup !== '' && renderProductPopup(productPopup)
            }
            {
                loginPopup && renderLoginPopup()
            }
            {
                messagePopup && renderMessagePopup()
            }
            <div className="top pt-4 pb-2">
                <h3 className="mb-3">Checkout what we have for you!</h3>
                <p>Here you can check our offres.<br/>
                Also, You can be a partner and sell your products. <NavLink to='/register'>Join us</NavLink></p>
            </div>
            <div className="mt-4 content">
                {
                    products?.length && <p>We have <strong>{products.length}</strong> Elements</p>
                }

                <div className="row products-list">
                    <div className="col-md-4 col-lg-3 mb-4">
                    <div className="filter">
                            <span className="mt-4 mb-3">Filter your search:</span>
                            <div className="d-flex justify-content-between flex-wrap">
                                <div className="price-input">
                                    <label>Min price</label>
                                    <input className="w-100" placeholder="260.000" name="minPrice" type="number" onChange={e=>handleFilterChange(e)} />
                                </div>
                                <div className="price-input">
                                    <label>Max price</label>
                                    <input className="w-100" placeholder="456.000" name="maxPrice" type="number" onChange={e=>handleFilterChange(e)} />
                                </div>
                            </div>
                            <div>
                                <label>Number of rooms</label>
                                <input className="w-100" placeholder="4" name="numberRooms" type="number" onChange={e=>handleFilterChange(e)} />
                            </div>
                            <div>
                                <label>Space (&gt;)</label>
                                <input className="w-100" placeholder="200" name="space" type="number" onChange={e=>handleFilterChange(e)} />
                            </div>
                        </div>
                        <div className="sort mt-3">
                            <span>Sort By: </span>
                            <select className="p-2 w-100 sort-select" onChange={e => setSort(e.target.value)}>
                                <option value=''>Sorting</option>
                                <option value='price'>Price</option>
                                <option value='space'>Space</option>
                            </select>
                        </div>
                    </div>
                        {
                            products?.length ? products.filter(p => (filterOptions.minPrice !== '' ? p.price >= filterOptions.minPrice : true)  
                                    && (filterOptions.maxPrice !== '' ? p.price <= filterOptions.maxPrice : true) 
                                    && (filterOptions.numberRooms !== '' ? p.bedrooms == filterOptions.numberRooms : true)
                                    && (filterOptions.space !== '' ? p.space >= filterOptions.space : true)
                            )
                            .sort((a,b)=> sort !== '' ? sort == 'price' ? a.price - b.price : sort == 'space' ? a.space - b.space : 0 : 0 ).map(product => (
                                <div key={product.id} className="col-md-4 col-lg-3 mb-4"> 
                                    <div className="card rounded-0 card__style">
                                        <div className="card__top">
                                        {product.street} {product.zip}, {product.city} <br/>
                                                    {product.country}
                                        </div>
                                        <div className="card-body px-2 pb-2 pt-0" onClick={()=>setProductPopup(product.id)}>
                                            <div className="p-2 bg-white h-100 d-flex flex-column justify-content-between">
                                                <div>
                                                    <p className="card-title">
                                                        {product.bedrooms} rooms, {product.kitchens} kitchens <br/>
                                                        {product.space} m²

                                                    </p>
                                                    <div className="w-100">
                                                        {
                                                            product.attachements.length ?
                                                                product.attachements[0]?.type === "XML Upload"
                                                                ? <img className="w-100" src={StaticData.baseServerUrl + '/uploads/products/' + product.attachements.filter(pAtt => pAtt.category === 1)[0]?.file } alt="Product image" />
                                                                : <img className="w-100" src={StaticData.baseServerUrl + '/products/' + product.attachements.filter(pAtt => pAtt.category === 1)[0]?.file } alt="Product image" />
                                                            : null
                                                        }
                                                        
                                                    </div>
                                                </div>
                                                <div className="mt-3 fs-6">
                                                    <strong>{product.price} {product.currency}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))
                            :  <div className="col-md-8 col-lg-9 text-center my-4">
                                <span>No products found!</span>
                            </div>
                            
                        }

                </div>


            </div>
        </ProductStyle>
    )
}

const ProductStyle = styled.div`
    .top {
        border-bottom: 1px solid #eee;
        h3 {
            color: var(--second-color);
        }
        a {
            color: var(--second-color);
            font-weight: 600;
        }
    }
    .content {
        .products-list {
            .filter {
                .price-input {
                    width: 49%;
                    @media screen and (max-width: 576px) {
                        width: 100%;
                    }
                }
            }
            .sort-select, input {
                color: var(--second-color);
                outline: none;
                border: 1px solid var(--second-color);
            }
            label {
                font-size: var(--small-font);
            }
            .card__style {
                border: 1px solid var(--second-color);
                font-size:var(--small-font);
                max-height: 100%;
                height: 100%;
                .card__top { 
                    padding: 0.4rem var(--bs-card-spacer-y); 
                    background-color: var(--second-color);
                    color: var(--main-color);
                }
                .card-body {
                    cursor: pointer;
                    &:hover {
                        background-color: var(--second-color);
                    }
                }
                .card__bottom {
                    padding: var(--bs-card-spacer-y);
                }
            }
        }
    }

    .popup {
        width: 80% !important;
        height: 85% !important;
        overflow-y: scroll;
        @media screen and (max-width: 767px) {
            width: 90% !important;
        }
        .product-data {
            h4, p { 
                padding: 0 10px;
            }

            .product-info {
                font-size: var(--small-font);
                padding: 0 10px;
                margin-top: 25px;
                .buy-btn {
                    position: relative;
                    button {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        background-color: var(--second-color);
                        color: var(--main-color);
                        @media screen and (max-width: 767px) {
                            position: unset;                            
                        }
                    }
                }
            }
        }
    }

    .overlay-msg { z-index: 10001; }
    .popup-msg {
        z-index: 10002;
        width: 350px !important;
        height: auto !important;
        padding: 30px !important;
    }
`

export default Products