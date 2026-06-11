// src/components/layout/Navbar.jsx

import {

    Link,

    useNavigate

} from "react-router-dom";

import {

    useDispatch,

    useSelector,
    

} from "react-redux";

import {logout} from "../../features/auth/authSlice";
import {clearDashboard} from "../../features/dashboard/dashboardSlice";
export default function Navbar() {

    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();

    const user =
        useSelector(

            state => state.auth.user

        );

    function handleLogout() {

        dispatch(
            logout()
        );
        dispatch(
            clearDashboard()
        );
        navigate(
            "/",
            { replace: true }
        );

    }

    return (

        <nav className="navbar">

            <div className="container navbar-content">

                <div className="logo">

                    StoryHub

                </div>

                <div className="nav-links">

                    <Link to="/dashboard">

                        Dashboard

                    </Link>

                    <Link to="/books">

                        Biblioteca

                    </Link>

                    <Link to="/create-book">

                        Escribir Libro

                    </Link>
                    <Link to="/manage-categories">
                         Categorías
                    </Link>

                </div>

                <div className="nav-user">

                    <button

                        className="btn btn-danger"

                        onClick={handleLogout}

                    >

                        Logout

                    </button>

                </div>

            </div>

        </nav>

    );

}