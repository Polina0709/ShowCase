import { useForm } from "react-hook-form";
import { loginSchema } from "../../utils/validators/auth";
import type { LoginSchema } from "../../utils/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginWithEmail, loginWithGoogle } from "../../services/auth";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import bg from "../../assets/bg.jpg";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginSchema) => {
        await loginWithEmail(data.email, data.password);
        navigate("/dashboard");
    };

    return (
        <div className="auth-root" style={{ backgroundImage: `url(${bg})` }}>
            <div className="auth-card" >

                {/* Back button */}
                <div className="auth-back" onClick={() => navigate(-1)}>←</div>

                {/* Title */}
                <h2 className="auth-title">SHOWCASE</h2>
                <div className="auth-top-row">
                    <h3 className="auth-subtitle">LOG IN</h3>

                    <div className="auth-google" onClick={loginWithGoogle}>
                        <FcGoogle size={20} /> Google
                    </div>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">

                    <input
                        {...register("email")}
                        placeholder="e-mail..."
                        className="auth-input"
                    />
                    {errors.email && <p className="auth-error">{errors.email.message}</p>}

                    <div className="auth-row">
                        <input
                            type="password"
                            placeholder="password..."
                            {...register("password")}
                            className="auth-input"
                        />
                        <button type="button" className="auth-forgot">
                            I forgot
                        </button>
                    </div>
                    {errors.password && <p className="auth-error">{errors.password.message}</p>}

                    {/* Submit arrow */}
                    <button type="submit" className="auth-submit">→</button>
                </form>

                {/* Bottom link */}
                <div className="auth-footer">
                    Don’t have an account?
                    <Link to="/signup"> Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

