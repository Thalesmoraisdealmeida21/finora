import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wallet } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { toast } from "sonner"
import axios from "axios"

interface LoginFormData {
    email: string;
    password: string;
}

const Login = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>()

    const onSubmit = async (data: LoginFormData) => {
        setError(null)
        setIsLoading(true)

        try {
            const response = await api.post('/auth/login', {
                email: data.email,
                password: data.password,
            })

            // Salvar token se houver
            if (response.data.token) {
                localStorage.setItem('token', response.data.token)
            }

            toast.success("Login successful")
            navigate('/')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || "Failed to login")
                toast.error(err.response?.data?.error || "Failed to login")
            } else {
                setError("An unexpected error occurred")
                toast.error("An unexpected error occurred")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6 py-10">
            <div className="border border-gray-300 p-4 rounded-md w-full max-w-md gap-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-center mb-4">
                        <Wallet className="w-14 h-14 text-primary bg-green-400 rounded-full p-2"></Wallet>
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-4">
                        <label htmlFor="email">Email</label>
                        <Input 
                            id="email"
                            type="email" 
                            placeholder="Email" 
                            className="w-full" 
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                        <label htmlFor="password">Password</label>
                        <Input 
                            id="password"
                            type="password" 
                            placeholder="Password" 
                            className="w-full" 
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 mb-2">{error}</p>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full bg-green-400 text-white hover:cursor-pointer hover:bg-green-500"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </form>
                
                <p className="text-sm text-gray-500 mt-2 text-center">
                    Don't have an account? <Link to="/register" className="text-green-500">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default Login