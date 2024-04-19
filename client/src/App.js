import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Layout from './Components/Layout';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Contact from './Components/Contact';
import Latest from './Components/Latest';
import AboutUs from './Components/AboutUs';
import Products from './Components/Products';
import Dashboard from './Components/Dashboard/Dashboard';
import { useCustomTheme } from './hooks/useCustomTheme';
import PrivateRoutes from './Utils/PrivateRoutes';
import NotAuthRoutes from './Utils/NotAuthRoutes';
import PageNotFound from './Components/PageNotFound';
import PersistLogin from './Utils/PersistLogin';



function App() {

    useCustomTheme()

    return (

        <Routes>
            <Route path='/' element={<Layout />}>


                {/* If User is Loged in and try to visit Login or Register page */}
                <Route element={<NotAuthRoutes />} >
                    <Route path='login' element={ <Login /> } />
                    <Route path='register' element={ <Register /> } />
                </Route>


                {/* Persist user login / no lose data when refresh browser or visit another page */}
                <Route path='/' element={<PersistLogin />}>

                    {/* Private routes */}
                    <Route element={<PrivateRoutes/>} >
                        <Route path='dashboard' element={ <Dashboard /> } />
                    </Route>


                    {/* Public Routes */}
                    <Route path='/' element={ <Home /> } />
                    <Route path='contact' element={ <Contact /> } />
                    <Route path='latest' element={ <Latest /> } />
                    <Route path='about-us' element={ <AboutUs /> } />
                    <Route path='products' element={ <Products /> } />
                    
                    {/* Page Not Found & if user try to add no existant route */}
                    <Route path='404' element={ <PageNotFound /> } />
                    <Route path='*' element={ <Navigate to='/404' /> } />
                </Route>
            </Route>

        </Routes>
                


    );
}



export default App;
