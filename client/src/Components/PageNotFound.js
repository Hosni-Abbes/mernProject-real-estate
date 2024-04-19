import React from 'react'
import { styled } from 'styled-components'
import { useDocTitle } from '../hooks/useDocTitle'

function PageNotFound() {

    useDocTitle('404 - Page not found!')

    return (
        <PageNotFoundStyle>
            <div>
                <p>404!</p>
                <span className='woops'>
                    Woops!
                </span>
                <span> This page is not available</span>
            </div>
        </PageNotFoundStyle>
    )
}

const PageNotFoundStyle = styled.div`
    text-align: center;
    font-size: 1.5rem;
    padding: 7rem 0;
    p {
        font-size: 3rem;
    }
    .woops {
        color: var(--error-color);
        font-weight: 700;
    }

`

export default PageNotFound