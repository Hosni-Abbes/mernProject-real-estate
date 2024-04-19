import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
// import axios from '../../api/axios'
import { MdDone } from "react-icons/md";
import StaticData from '../../Utils/StaticInfo';
import DashboardTopMenu from './DashboardTopMenu';
import DashboardOptionBlock from './DashboardOptionBlock';
import { useAuth } from '../../hooks/useAuth';
import useAxiosInterceptors from '../../hooks/useAxiosInterceptors';




function ProductsDash() {
    const axios = useAxiosInterceptors()
    const { user } = useAuth()

    const [option, setOption] = useState('List')
    const [products, setProducts] = useState([])
    const [xmlFile, setXMLFile] = useState({oldFile:'', uploadedFile:''})
    const [message, setMessage] = useState({status:'', message:''})
    const [pages, setPages] = useState([])
    const [paginationOffset, setPaginationOffset] = useState(0)


    useEffect(()=>{
        let isMounted = true
        if(isMounted) {
            getProductsList()
        }
        return () => isMounted = false
    }, [paginationOffset, option])

    const getProductsList = async () => {
        try {
            const res = await axios.get(`/api/v1/dash-products?limit=${StaticData.pagination.dashboardListLimit}&offset=${paginationOffset}`)
            setProducts(res.data.buildingList)
            setPages( Array.from(Array( Math.ceil(res.data?.pages) ), (x,i)=>i ) )
        }catch(err){
            console.error(err)
        }
    }

    const uploadXmlFile = async e => {
        setMessage({status:'', message:''})
        setXMLFile({oldFile: '', uploadedFile: ''})
        if( e.target.files[0].type !== 'text/xml' ) return setMessage({status:400, message: 'Uploaded file should be a valid xml file.'})
        const formData = new FormData()
        formData.append('xmlfile', e.target.files[0])

        try{
            const res = await axios.post('api/v1/upload-xml', formData, {headers: {'Content-Type': 'multipart/form-data' }})
            setXMLFile({oldFile: e.target.files[0].name, uploadedFile: res.data?.file})
            setMessage({status:200, message:res.data?.message})
        }catch(err){
            setMessage({status:500, message:err.response?.data?.message})
            console.error(err)
        }
    }
    const importXmlData = async e => {
        e.preventDefault()
        setMessage({status:'', message:''})
        try {
            const res = await axios.post('api/v1/xml-import', {uploadedFile: xmlFile?.uploadedFile})
            setMessage({status:200, message:res.data?.message})
            setXMLFile({oldFile:'', uploadedFile:''})
        } catch (error) {
            setMessage({status:500, message:error.response?.data?.message})
            console.error(error)
        }

    }

    const deleteProduct = async id => {
        try {
            const res = await axios.delete(`api/v1/products/delete?product=${id}`)
            setMessage({status: 200, message: res.data?.message})
            const updProducts = products.filter(product => product.id != res.data?.productId)
            setProducts(updProducts)
        } catch (error) {
            setMessage({status: error.response?.status || 500, message: error.response?.data?.message || 'Internal server error!'})
            console.error(error)
        }
    }

    const renderImportXml = () => (
        <div className='xml-import-block'>
            <p>Choose XML file to import data.</p>
            { message.message && <p className={message.status === 200 ? 'msg msg-success' : 'msg msg-fail'} >{message.message}</p>  }
            <form encType='multipart/form-data' onSubmit={e=>importXmlData(e)} >
                <label className={xmlFile?.uploadedFile !== '' ? 'form-control border-success' : message.status !== 200 & message.status !== '' ? 'form-control border-danger' : 'form-control'} htmlFor='xml-file'>
                    {
                        xmlFile?.oldFile !== '' ? <>  <MdDone className='text-success fs-4'  />  {xmlFile?.oldFile}  </> : 'Upload Xml File..'
                    }
                </label>
                <input type='file' className='form-control d-none' id='xml-file' onChange={e=>uploadXmlFile(e) }  />

                {
                    xmlFile?.uploadedFile !== '' ? 
                        <div className='mt-5'>
                            <p>Click this button to run import process..</p>
                            <input type='submit' className='btn submit-btn' value='Import data' /> 
                        </div>
                    : <input type='submit' disabled className='btn submit-btn' value='Import data' /> 
                }
                
            </form>
        </div>
    )

    

    return (
        <ProductsDashStyle>
            <DashboardTopMenu option={option} listItems={ user?.user?.roles?.includes('ADMIN') ? ['List', 'Create', 'Import From XML'] : ['List', 'Create'] } navItem='products' 
                              setMessage={setMessage} setXMLFile={setXMLFile} setPaginationOffset={setPaginationOffset} setOption={setOption}/>

            <div className='dash-content'>
                <DashboardOptionBlock navItem='products' option={option} renderImportXml={renderImportXml} message={message} products={products} deleteProduct={deleteProduct} pages={pages} setPaginationOffset={setPaginationOffset} />
            </div>
            

        </ProductsDashStyle>
    )
}

const ProductsDashStyle = styled.div`

    .xml-import-block {
        label {
            color: var(--text-color);
            padding: 2rem 1rem;
            width: 45%;
            margin-bottom: 1rem;
            @media screen and (max-width: 767px) {
                width: 100%;
            }
            @media screen and (max-width: 992px) {
                width: 70%;
            }
        }


    }

    
`

export default ProductsDash