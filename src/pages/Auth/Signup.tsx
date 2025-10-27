import { useNavigate } from "react-router-dom";
import "./Auth.css";
import bg from "../../assets/bg.jpg";
import { useForm } from "react-hook-form";
import { signupSchema } from "../../utils/validators/auth";
import type { SignupSchema } from "../../utils/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupWithEmail, updateUserProfile} from "../../services/auth";
import { ref, set } from "firebase/database";
import { db } from "../../services/firebase";

export default function Signup() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupSchema) => {
        try {
            const userCred = await signupWithEmail(data.email, data.password);

            await updateUserProfile(`${data.name} ${data.lastName}`);

            await set(ref(db, `users/${userCred.user.uid}`), {
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                createdAt: Date.now(),
            });

            navigate("/onboarding");
        } catch (err) {
            console.error(err);
            alert("Signup failed!");
        }
    };

    return (
        <div className="auth-root" style={{ backgroundImage: `url(${bg})` }}>
            <div className="auth-card">

                <div className="auth-back" onClick={() => navigate(-1)}>←</div>

                <h2 className="auth-title">SHOWCASE</h2>
                <h3 className="auth-subtitle">SIGN UP</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">

                    <div className="auth-row">
                        <div className="flex flex-col w-full">
                            <input {...register("name")} placeholder="Name..." className="auth-input" />
                            {errors.name && <small className="text-red-500">{errors.name.message}</small>}
                        </div>

                        <div className="flex flex-col w-full">
                            <input {...register("lastName")} placeholder="Last Name..." className="auth-input" />
                            {errors.lastName && <small className="text-red-500">{errors.lastName.message}</small>}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <input {...register("email")} placeholder="e-mail address..." className="auth-input" />
                        {errors.email && <small className="text-red-500">{errors.email.message}</small>}
                    </div>

                    <div className="flex flex-col">
                        <input type="password" {...register("password")} placeholder="password..." className="auth-input" />
                        {errors.password && <small className="text-red-500">{errors.password.message}</small>}
                    </div>

                    <button type="submit" className="auth-submit">→</button>
                </form>
            </div>
        </div>
    );
}

