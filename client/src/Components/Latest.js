import { styled } from "styled-components"
import StaticData from "../Utils/StaticInfo"
import { useEffect, useState } from "react"
import useOverflowHidden from "../hooks/useOverflowHidden"
import { useDocTitle } from "../hooks/useDocTitle"
import axios from "../api/axios"


function Latest() {
    const [openNewsPopup, setOpenNewsPopup] = useState('')
    const [articles, setArticles] = useState([])
    const [loadMore, setLoadMore] = useState(StaticData.pagination.pageListLimit)
    const [searchYear, setSearchYear] = useState('')

    
    useEffect(()=>{
        let isMounted = true
        if(isMounted){
            fetchArticles()
        }
        return () => isMounted = false
        
    },[loadMore, searchYear])
    
    const fetchArticles = async () => {
        try {
            const res = await axios.get(`/api/v1/articles?limit=${loadMore}&offset=0&year=${searchYear}`)
            setArticles(res.data?.articleList)
        }catch(error){
            console.error(error)
        }
    }



    // set page title
    useDocTitle('Latest')



    const handleChangeFilterYear = e => {
        setSearchYear(e.target.value)
        setLoadMore(StaticData.pagination.pageListLimit)
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
    <LatestStyle className="container">
        {
            useOverflowHidden(openNewsPopup)
        }
        { openNewsPopup !== '' && renderOpenedArticle(openNewsPopup) }

        <div className="top pt-5 pb-2">
            <h3 className="mb-3">Latest</h3>
            <p>We would be happy to inform you about latest from our company.<br/>
            Here you can find out more about and from us.</p>
        </div>
        <div className="my-4 content">
            
            {/* Filter */}
            <div className="filter">
                <select className="w-100" onChange={e=>handleChangeFilterYear(e)}>
                    <option value=''>Year</option>
                    {
                        StaticData.latestYears.map(year => (
                            <option key={year.id} value={year.value}>{year.value}</option>
                        ))
                    }
                </select>
            </div>

            {/* Articles List */}
            <div className="row mt-5 latests">
                    {
                        articles?.length ? articles.map(news => (
                            <div key={news.id} className="col-md-6 col-lg-4 col-xl-3 mb-4 latest-item" onClick={()=>setOpenNewsPopup(news.id)}>
                                <div className="latest-item-content">
                                    <h4>{news.title}</h4>
                                    <p>{news.content.length > 200 ? news.content.substring(0,200) + '...' : news.content }</p>
                                    <hr className='mb-1'/>
                                    <small>By: {news?.author ? news?.author : 'Annonymous,' } at: {new Date(news?.createdAt).toLocaleDateString() }</small>
                                </div>
                            </div>
                        ))
                        : <p>Empty..</p>
                    }
            </div>

            {/* Load More */}
            <button className={articles?.length >= loadMore ? "btn border-success" : 'd-none'} onClick={()=>setLoadMore( prev => prev + StaticData.pagination.pageListLimit )}> Load More..</button>
        </div>

        

    </LatestStyle>
  )
}

const LatestStyle = styled.div`
    .top {
        border-bottom: 1px solid #eee;
        h3 {
            color: var(--second-color);
        }
    }
    .content {
        .filter {
            width: 400px;
            margin: auto;
            @media screen and (max-width: 576px) {
                width: 100% !important;
            }
            select {
                border: 1px solid var(--second-color);
                padding: 10px;
                color: var(--second-color);
                outline: none;
            }
        }

    }
`

export default Latest