import {
    Link,
    useNavigate
} from "react-router-dom";
import LoginForm from "../components/forms/LoginForm"


const LoginPage = () => {   
    const navigate = useNavigate();

    return (
        <div className="container auth-container">
            <header>
                <h1> Login</h1>
            </header>
            <LoginForm />
        </div>

    )
}

export default LoginPage