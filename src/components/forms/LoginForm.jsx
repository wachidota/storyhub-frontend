import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";

import { loginUsuarioSchema } from "../../validators/usuario.validator";

const loginSchema = loginUsuarioSchema;

import {
    Link,
    useNavigate
} from "react-router-dom";

import { toast } from "react-toastify";

import { useDispatch } from "react-redux";

import api from "../../api/api";

import {
    loginStart,
    loginSuccess,
    loginFailure
} from "../../features/auth/authSlice";

const LoginForm = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm({
        resolver: joiResolver(loginSchema),
        mode: "onChange" // ✅ validación en tiempo real
    });

    const procesarForm = async (data) => {
        try {
            dispatch(loginStart());

            const response = await api.post(
                "/auth/login",
                data
            );

            const { usuario, token } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("usuario", JSON.stringify(usuario));

            dispatch(
                loginSuccess({
                    user: usuario,
                    token
                })
            );

            toast.success("¡Bienvenido de nuevo!");

            navigate("/dashboard");

        } catch (error) {
    console.error(error);

    const mensaje =
        error.response?.data?.error || // ✅ ESTE es el importante
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        "Error al iniciar sesión";

    dispatch(loginFailure(mensaje));

    toast.error(mensaje);
    } 
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(procesarForm)}
            >

                <div className="form-group">
                    <label htmlFor="username">
                        Usuario:
                    </label>

                    <input
                        type="text"
                        id="username"
                        {...register("email")}
                    />

                    {
                        errors.email &&
                        <span className="error">
                            {errors.email.message}
                        </span>
                    }
                </div>

                <div className="form-group">
                    <label htmlFor="password">
                        Contraseña:
                    </label>

                    <input
                        type="password"
                        id="password"
                        {...register("password")}
                    />

                    {
                        errors.password &&
                        <span className="error">
                            {errors.password.message}
                        </span>
                    }
                </div>

                <button
                    type="submit"
                    disabled={!isValid} 
                >
                    Ingresar
                </button>

            </form>

            <p className="register-link">
                ¿No tienes cuenta?{" "}
                <Link to="/registro">
                    Regístrate aquí
                </Link>
            </p>
        </>
    );
};

export default LoginForm;
