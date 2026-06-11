import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import api from "../../api/api";

import {
    loginStart,
    loginSuccess,
    loginFailure
} from "../../features/auth/authSlice";

import {
    registroUsuarioSchema as registerSchema
} from "../../validators/usuario.validator";

export default function RegisterForm() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid // ✅ agregado
        }
    } = useForm({
        resolver: joiResolver(registerSchema),
        mode: "onChange" // ✅ validación en tiempo real
    });

    async function procesarForm(data) {

        try {

            dispatch(loginStart());

            await api.post("/auth/registro", {
                email: data.email,
                password: data.password,
                nombre: data.nombre
            });

            const loginResponse =
                await api.post("/auth/login", {
                    email: data.email,
                    password: data.password
                });

            const { usuario, token } = loginResponse.data;

            localStorage.setItem("token", token);
            localStorage.setItem("usuario", JSON.stringify(usuario));

            dispatch(
                loginSuccess({
                    user: usuario,
                    token
                })
            );

            toast.success("Usuario registrado correctamente");

            navigate("/dashboard");

        } catch (error) {
    console.error(error);

    const mensaje =
        error.response?.data?.error || // ✅ ESTE es el importante
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        "Error al registrarse";

    dispatch(loginFailure(mensaje));

    toast.error(mensaje);
}
    }

    return (
        <>
            <form onSubmit={handleSubmit(procesarForm)}>

                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        {...register("nombre")}
                    />
                    {errors.nombre && (
                        <span className="error">
                            {errors.nombre.message}
                        </span>
                    )}
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        {...register("email")}
                    />
                    {errors.email && (
                        <span className="error">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        {...register("password")}
                    />
                    {errors.password && (
                        <span className="error">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!isValid} // ✅ clave
                >
                    Registrarse
                </button>

            </form>

            <p>
                ¿Ya tienes cuenta?{" "}
                <Link to="/">
                    Inicia sesión
                </Link>
            </p>
        </>
    );
}
