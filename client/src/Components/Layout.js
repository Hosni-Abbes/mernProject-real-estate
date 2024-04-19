import { Outlet } from "react-router-dom";
import { styled } from "styled-components";
import GlobalStyle from '../Styles/GlobalStyle';
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {

    return (
        <>
            <Header />
                <MainStyle>
                    <GlobalStyle />
                    <Outlet />
                </MainStyle>
            <Footer />
        </>
    )
}

const MainStyle = styled.main`
    min-height: calc(100vh - var(--footer-height) - var(--header-height));
`

export default Layout