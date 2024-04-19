import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    :root {
        --main-color: #fff;
        --second-color: #5cac32;
        --text-color: #787878;
        --light-color: #f1f1f1;
        --error-color: #f44336;

        /* spacing */
        --card-padding: 0.5rem;

        /* fonts */
        --small-font: 0.875rem;

        /* Dimensions */
        --header-height: 60px;
        --footer-height: 250px;
        @media screen and (min-width: 768px) {
            --footer-height: 210px !important;
        }
    }
    /* Dark theme */
    body.dark-theme {
        --main-color: #3b3b3b;
        --second-color: #0d1117;
        --text-color: #ffffff;
        --light-color: #5d5d5d;
        input, textarea, select {
            background-color: var(--second-color);
            color: var(--main-color) !important;
            &:focus{
                background-color: var(--second-color);
                color: var(--main-color) !important;
            }
        }
    }

    body {
        position: relative;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: var(--main-color);
        color: var(--text-color);
        min-height: 100vh;
        scroll-behavior: smooth;
    }
    a {
        text-decoration: none;
    }
    li {
        list-style: none;
    }
    .img-container {
        padding: 0 10px;
        outline: none;
        img {
            width: 100% 
        }
    }
    .overlay {
        z-index: 1000;
    }
    .popup {
        z-index: 10001;
    }
    .close {
        position: absolute;
        top: 0;
        right: 10px;
        cursor: pointer;
    }
    .cursor-pointer {
        cursor: pointer;
    }

    /* Articles style */
    .latests {
        .latest-item {
            cursor: pointer;
            .latest-item-content {
                padding: 8px 14px;
                background-color: var(--second-color);
                color: var(--main-color);
                max-height: 100%;
                height: 100%;
            }
        }
    }

    /* Success & fail message */
    .msg{
        color: var(--main-color) !important;
        padding: 0.5rem 1rem;
    } 
    .msg-success{
        background-color: var(--second-color);
    }
    .msg-fail {
        background-color: var(--error-color);
    }

    /* Slick */
    .slick-prev:before, .slick-next:before {
        color: var(--second-color) !important;
    }
    .slick-prev {left:0; z-index:1000}
    .slick-next {right:0; z-index:1000}
    .slick-dots {
        bottom: 50px;
        li {
            margin: 0 10px;
            button:before {
               color: var(--main-color);
               font-size: 25px;
               opacity: .5;
           }
           &.slick-active {
            button:before { 
                color: var(--main-color) !important;
                opacity: 1;
            }
           }
        }
    } 

    /* Hide arrows input */
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }
    /* Firefox */
    input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
    }


    /* Styling scrollbar */
    ::-webkit-scrollbar {
        width: 4px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: rgb(33, 37,41, .8);
        border-radius: 4px;
    }
    /* ::-webkit-scrollbar-track {
        background-color: rgb(33, 37,41, .8)
    } */
    
`


export default GlobalStyle