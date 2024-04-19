import React, { useState } from 'react'
import { CiImageOn } from "react-icons/ci";
import { useAuth } from '../../hooks/useAuth'
import { styled } from 'styled-components';
import StaticData from '../../Utils/StaticInfo';
import useAxiosInterceptors from '../../hooks/useAxiosInterceptors';
// import axios from '../../api/axios';

function CreateProductForm() {
    const { user } = useAuth()
    const axios = useAxiosInterceptors()

    const [productData, setProductData] = useState({
        objectId:'', title:'', description: '', buildingYear:'', condition:'', space:'', bedrooms:'', kitchens:'',
        bathrooms:'', price:'', currency:'', street:'', zip:'', city:'', country:'', userId:user?.user?.id || null, attachements:[]
    })
    const [message, setMessgae] = useState({status:'', message:''})


    const handleInputChange = e => {
        setProductData({...productData, [e.target.name]: e.target.value})
    }


    const handleSubmitForm = async e => {
        e.preventDefault()
        const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'application/pdf' ]
        let formData = new FormData()
        
        if(productData.attachements?.length) {
            for(let i=0; i<productData.attachements.length;i++){
                if(allowedFileTypes.includes(productData.attachements[i].type)){
                    formData.append('attachements', productData.attachements[i] )
                }else{
                    setMessgae({status:500, message:'Files should be an image (.png, .jpg, .jpeg) or a video (.mp4) or a PDF file (.pdf)'})
                    window.scrollTo(0,0)
                    return
                }
            } 
        }
        formData.append("objectId",productData.objectId)
        formData.append("title",productData.title)
        formData.append("description",productData.description)
        formData.append("price",productData.price)
        formData.append("currency",productData.currency)
        formData.append("street",productData.street)
        formData.append("zip",productData.zip)
        formData.append("city",productData.city)
        formData.append("country",productData.country)
        formData.append("bathrooms",productData.bathrooms)
        formData.append("kitchens",productData.kitchens)
        formData.append("bedrooms",productData.bedrooms)
        formData.append("space",productData.space)
        formData.append("condition",productData.condition)
        formData.append("buildingYear",productData.buildingYear)
        formData.append("userId",user?.user?.id || null)

        setMessgae({status:'', message:''})
        try {
            const res = await axios.post('/api/v1/create', formData, {headers: {'Content-Type': 'multipart/form-data' }})
            setMessgae({status:200, message: res.data.message})
            window.scrollTo(0,0)
            setProductData({objectId:'', title:'', description: '', buildingYear:'', condition:'', space:'', bedrooms:'', kitchens:'',
                bathrooms:'', price:'', currency:'', street:'', zip:'', city:'', country:'', userId:user?.user?.id || null, attachements:[]})
        } catch (error) {
            window.scrollTo(0,0)
            setMessgae({status:error.response.status, message: error.response.data.message})
            console.error(error)
        }
    }

    return (
        <CreateProductFormStyle>
            {
                message.status !=='' && <p className={message?.status == 200 ? 'msg msg-success' : 'msg msg-fail'}>{message.message}</p> 
            }
            <form className={message?.status != 200  && message?.status != '' ? "row g-3 needs-validation was-validated" : "row g-3 needs-validation" }  noValidate encType='multipart/form-data' onSubmit={e => handleSubmitForm(e)}>
                <div className='col-md-6 form-block'>
                    <div className="">
                        <label htmlFor="product-objectId" className="form-label">Object Id</label>
                        <input type="number" name='objectId' className="form-control" required id="product-objectId" value={productData.objectId} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-title" className="form-label">Title</label>
                        <input type="text" name='title' className="form-control" required id="product-title" value={productData.title} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-description" className="form-label">Description</label>
                        <textarea type="text" name='description' className="form-control" id="product-description" style={{resize:'none'}} cols={3} rows={8} value={productData.description} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-street" className="form-label">Street</label>
                        <input type="text" name='street' className="form-control" required id="product-street" value={productData.street} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-zip" className="form-label">ZIP Code</label>
                        <input type="number" name='zip' className="form-control" required id="product-zip" value={productData.zip} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-city" className="form-label">City</label>
                        <input type="text" name='city' className="form-control" required id="product-city" value={productData.city} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-country" className="form-label">Country</label>
                        <select className="form-select" name='country' required id="product-country"  value={productData.country} onChange={e=>handleInputChange(e)}>
                            <option value=''></option>
                            {
                                StaticData.createProduct.AllowedCountries.map(cn => (
                                    <option key={cn.id} value={cn.country}>{cn.country}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className='col-md-6 form-block'>
                    <div className="">
                        <label htmlFor="product-price" className="form-label">Price</label>
                        <input type="number" name='price' className="form-control" required id="product-price" value={productData.price} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-currency" className="form-label">Currency</label>
                        <input type="text" name='currency' className="form-control" required id="product-currency" value={productData.currency} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-buildingYear" className="form-label">Building Year</label>
                        <input type="number" name='buildingYear' className="form-control" id="product-buildingYear" value={productData.buildingYear} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-condition" className="form-label">Condition</label>
                        <input type="number" name='condition' className="form-control" id="product-condition" value={productData.condition} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-space" className="form-label">Space</label>
                        <input type="number" name='space' className="form-control" id="product-space" value={productData.space} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-bathrooms" className="form-label">Bathrooms</label>
                        <input type="number" name='bathrooms' className="form-control" id="product-bathrooms" value={productData.bathrooms} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-bedrooms" className="form-label">Bedrooms</label>
                        <input type="number" name='bedrooms' className="form-control" id="product-bedrooms" value={productData.bedrooms} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-kitchens" className="form-label">Kitchens</label>
                        <input type="number" name='kitchens' className="form-control" id="product-kitchens" value={productData.kitchens} onChange={e=>handleInputChange(e)} />
                    </div>
                    <div className="">
                        <label htmlFor="product-attachements" className="form-label w-100">
                            Attachements
                            <span className='attachment-input-label form-control' >
                                { [...productData.attachements]?.length ? [...productData.attachements]?.map((attach,i) => ( <span className='d-block' key={i}> <CiImageOn /> {attach.name}  </span>  )) : 'Upload files..' }
                            </span>
                        </label>
                        <input type="file" name='attachements' multiple className="form-control d-none" id="product-attachements"  onChange={e=>setProductData({...productData, attachements:e.target.files})} />
                    </div>
                </div>

                <div className="">
                    <input type="submit" className="btn mb-3" value='Create' />
                </div>
            </form>
        </CreateProductFormStyle>
    )
}

const CreateProductFormStyle = styled.div`
    .form-block {
        div {
            margin-bottom: 0.5rem;
            .attachment-input-label {
                color: var(--text-color);
                margin-top: 0.5rem;
                padding: 12px;
            }
            select {
                color: var(--text-color);
            }
        }
    }
    input[type=submit] {
        border: 1px solid var(--second-color) !important;
        &:hover {
            background-color: var(--second-color) !important;
            color: var(--main-color);
        }
    }

`

export default CreateProductForm