import React from 'react'
import { styled } from 'styled-components'

function DashboardTopMenu({option, listItems, navItem, setMessage, archived, setArchived, setXMLFile, setArticleData, setPaginationOffset, setOption}) {

    const optionBlock = option => {
        if(navItem === 'products'){
            setXMLFile({oldFile:'', uploadedFile:''})
        
        }else if (navItem === 'articles') {
            setArticleData({title:'', content:'', author:''})
        }else if (navItem === 'orders'){
            if(archived === 1) {
                setArchived(0)
            }else {
                setArchived(1)
            }
        }
        setMessage( {status:'', message:''})
        setPaginationOffset(0)
        setOption(option);   
            
    }



    return (
        <DashboardTopMenuStyle>
            {
                listItems?.length ? 
                    listItems?.map((item,i) => (
                        <span key={i} className={option === item ? 'active menu-item' : 'menu-item'} onClick={()=>optionBlock(item) }>{ item }</span>
                    ))
                : null
            }
        </DashboardTopMenuStyle>
    )
}

const DashboardTopMenuStyle = styled.div`
    background-color: var(--light-color);
    padding: 6px 10px;
    margin-bottom: 1rem;
    .menu-item {
        margin-right: 1rem;
        cursor: pointer;
        &:hover {
            color: var(--second-color);
        }
        &.active {
            color: var(--second-color);
            font-weight: 600;
        }
    }
`
export default DashboardTopMenu