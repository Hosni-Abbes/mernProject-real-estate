import React, {useEffect, useState} from 'react'
import { styled } from 'styled-components'
// import axios from '../../api/axios'
import DashboardTopMenu from './DashboardTopMenu'
import StaticData from '../../Utils/StaticInfo'
import DashboardOptionBlock from './DashboardOptionBlock'
import NotAuthorized from './NotAuthorized'
import { useAuth } from '../../hooks/useAuth'
import useAxiosInterceptors from '../../hooks/useAxiosInterceptors'


function ArticlesDash() {
    const { user } = useAuth()
    const axios = useAxiosInterceptors()

    const [option, setOption] = useState('List')
    const [articles, setArticles] = useState([])
    const [articleData, setArticleData] = useState({title:'', content:'', author:''})
    const [message, setMessage] = useState({status:'', message:''})
    const [pages, setPages] = useState([])
    const [paginationOffset, setPaginationOffset] = useState(0)
    const [popup, setPopup] = useState('')
    const [seePostPopup, setSeePostPopup] = useState('')




    useEffect(()=>{
        let isMounted = true
        if (isMounted) {
            fetchArticles()
        }
        return () => isMounted = false
    }, [paginationOffset, option])


    const fetchArticles = async () => {
        try {
            const res = await axios.get(`/api/v1/dash-articles?limit=${StaticData.pagination.dashboardListLimit}&offset=${paginationOffset}`)
            setArticles(res.data.articleList)
            setPages( Array.from(Array( Math.ceil(res.data?.pages) ), (x,i)=>i ) )

        }catch(error){
            setMessage({status: error.response?.status || 500 ,message: error.response?.data?.message || 'Internal server Error'})
            console.error(error)
        }
    }
    const deleteArticle = async id => {
        try {
            const res = await axios.delete(`api/v1/articles/delete?article=${id}`)
            setMessage({status: 200, message: res.data?.message})
            const updArticles = articles.filter(article => article.id != res.data?.articleId)
            setArticles(updArticles)
        } catch (error) {
            setMessage({status: error.response?.status || 500, message: error.response?.data?.message || 'Internal server error!'})
            console.error(error)
        }
    }

    const renderCreateArticleForm = action => (
        
        <form className={message?.status != 200  && message?.status != '' ? "row g-3 needs-validation was-validated" : "row g-3 needs-validation" }  noValidate encType='multipart/form-data' 
        onSubmit={e => handleSubmitArticleForm(e, action)}>
            {
                action && message.status !== '' ? <p className={message?.status == 200 ? 'msg msg-success' : 'msg msg-fail'}>{message.message}</p> : null
            }
            <div className={action === 'Update' ? 'form-block' : 'col-md-6 form-block' }>
                <div className="">
                    <label htmlFor="article-title" className="form-label">Article Title *</label>
                    <input type="text" name='title' className="form-control" required id="article-title" value={articleData.title} onChange={e=>handleInputChange(e)} />
                </div>
                <div className="">
                    <label htmlFor="article-content" className="form-label">Content *</label>
                    <textarea name='content' className="form-control" required id="article-content" style={{resize:'none'}} cols={3} rows={8} value={articleData.content} onChange={e=>handleInputChange(e)} />
                </div>
                <div className="">
                    <label htmlFor="article-author" className="form-label">Author</label>
                    <input type="text" name='author' className="form-control" id="article-author" value={articleData.author} onChange={e=>handleInputChange(e)} />
                </div>
            </div>
            <div className="">
                <input type="submit" className="btn mb-3 submit-btn" value={action} />
            </div>
    </form>
    )

    const renderUpdateArticleForm = () => (
        <>
            <div className="position-absolute top-0 start-0 end-0 bottom-0 opacity-25 bg-dark overlay" onClick={()=>closePopup()} />
            <div className="position-fixed top-50 start-50 translate-middle py-3 px-5 w-50 bg-white popup">
                <span className="close" onClick={()=>closePopup()} >x</span>
                {
                    renderCreateArticleForm('Update')
                }
            </div>
        </>
    )
    
    const renderPopup = id => {
        const article = articles.filter(article => article.id == id)[0]
        setArticleData({
            title: article.title,
            content: article.content,
            author: article.author
        })
        setMessage({status:'', message:''})
        setPopup(id)
    }
    const closePopup = () => {
        setMessage({status:'', message:''})
        setPopup('')
        setSeePostPopup('')
    }

    // See Post
    const renderSeePostPopup = () => {
        const article = articles.filter(article => article.id == seePostPopup)[0]
        return (
            <>
                <div className="position-absolute top-0 start-0 end-0 bottom-0 opacity-25 bg-dark overlay" onClick={()=>closePopup()} />
                <div className="position-fixed top-50 start-50 translate-middle py-3 px-5 bg-white popup">
                    <span className="close" onClick={()=>closePopup()} >x</span>
                    <div>
                        <h3 className='mb-3'>{article?.title}{}</h3>
                        <p>{article?.content}</p>
                        <hr className='mb-1'/>
                        <small>By: {article?.author ? article?.author : 'Annonymous,' } at: {new Date(article?.createdAt).toLocaleDateString() }</small>

                    </div>
                </div>
            </>
        )
    }


    

    const handleInputChange = e => {
        setArticleData({...articleData, [e.target.name]: e.target.value })
    }
    const handleSubmitArticleForm = async (e, action) => {
        e.preventDefault()
        try {
            if(action === 'Create') {
                const res = await axios.post('/api/v1/article/create', articleData)
                setMessage({status:200, message: 'Done! Post created.'})
                setArticles([...articles, res.data])
            }
            if(action === 'Update') {
                const res = await axios.post(`/api/v1/articles/update?article=${popup}`, articleData)
                setMessage({status:200, message: 'Done! Post Updated.'})
                const find = articles.findIndex(item => item.id == res.data.id)
                articles[find] = res.data
                setPopup('')
            }
            setArticleData({title:'', content:'', author:''})
        } catch (error) {
            setMessage({status:error.response?.status || 500, message: error.response?.data?.message || 'Internal server error!'})
            console.error(error)
        }
    }


    return (
        <ArticlesDashStyle>
            {
                message?.status === 401 || message?.status === 403
                ?
                    <NotAuthorized message={message} />
                : <>
                    <DashboardTopMenu option={option} listItems={ user?.user?.roles?.includes('ADMIN') ? ['List', 'Create'] : null } navItem='articles' setMessage={setMessage} setPaginationOffset={setPaginationOffset} setArticleData={setArticleData} setOption={setOption}/>
        
                    <div className='dash-content'>
                        <DashboardOptionBlock navItem='articles' option={option} renderCreateArticleForm={renderCreateArticleForm} articles={articles} deleteArticle={deleteArticle} message={message} pages={pages}
                                            popup={popup} renderPopup={renderPopup} setPaginationOffset={setPaginationOffset} setSeePostPopup={setSeePostPopup} />
                    </div>
        
                    {
                        popup && renderUpdateArticleForm()
                    }
                    {
                        seePostPopup && renderSeePostPopup()
                    }
                </>
            }

        </ArticlesDashStyle>
    )
}

const ArticlesDashStyle = styled.div`
    .submit-btn {
        border: 1px solid  var(--second-color) !important;
        &:hover {
            background-color: var(--second-color) !important;
            color: var(--main-color);
        }
    }

`

export default ArticlesDash