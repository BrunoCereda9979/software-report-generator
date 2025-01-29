"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useGlobalContext } from '@/context/GlobalContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from "sonner"
import { AlertCircle, CheckCircle } from 'lucide-react'
import Spinner from '@/components/Spinner'

interface PasswordValidation {
    isValid: boolean;
    errors: string[];
}

// Password validation hook
export const usePasswordValidation = () => {
    const validatePassword = (password: string, confirmPassword?: string): PasswordValidation => {
        const errors: string[] = [];

        // Minimum length check
        if (password.length < 12) {
            errors.push('Password must be at least 12 characters long');
        }

        // Uppercase letter check
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }

        // Lowercase letter check
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }

        // Number check
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }

        // Special character check
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }

        // Confirm password check (if provided)
        if (confirmPassword && password !== confirmPassword) {
            errors.push('Passwords do not match');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    return { validatePassword };
};

export default function Authentication() {
    const router = useRouter()
    const { validatePassword } = usePasswordValidation();
    const { setCurrentUser } = useGlobalContext()
    const [activeTab, setActiveTab] = useState("login")
    const [isLoading, setIsLoading] = useState(false)
    const [passwordValidationErrors, setPasswordValidationErrors] = useState([])
    const [formData, setFormData] = useState({
        emailOrUsername: "",
        password: "",
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        confirmPassword: ""
    })
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleAuth = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        const emailPattern = /^[a-zA-Z]+\.[a-zA-Z]+@rockymountnc\.gov$/

        if (activeTab === "register") {
            if (!emailPattern.test(formData.email)) {
                toast('Error', {
                    description: "Please enter a valid email address.",
                    icon: <AlertCircle className="mr-2 h-4 w-4" />
                })
                setIsLoading(false)
                return
            }

            const passwordValidation = validatePassword(
                formData.password,
                formData.confirmPassword
            );

            if (!passwordValidation.isValid) {
                setPasswordValidationErrors(passwordValidation.errors)
                setIsLoading(false)
                return
            }
        }

        const url = activeTab === "login"
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`
            : `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`

        const payload = activeTab === "login"
            ? {
                login_identifier: formData.emailOrUsername,
                password: formData.password
            }
            : {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                confirm_password: formData.confirmPassword
            }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.json()

                if (response.status === 500) {
                    throw new Error("Internal Server Error. Please try again later.")
                }
                else if (errorData.code === "USERNAME_OR_EMAIL_NOT_FOUND") {
                    throw new Error(`Invalid credentials. ${errorData.message}.`)
                }
                else if (errorData.code === "INCORRECT_PASSWORD") {
                    throw new Error(`Invalid credentials. ${errorData.message}.`)
                }
                else if (errorData.code === "USERNAME_TAKEN") {
                    throw new Error(`Invalid credentials. ${errorData.message}.`)
                }
                else if (errorData.code === "EMAIL_TAKEN") {
                    throw new Error(`Invalid credentials. ${errorData.message}.`)
                }
                else if (errorData.code === "INVALID_EMAIL") {
                    throw new Error(`Invalid credentials. ${errorData.message} (name.lastname@rockymountnc.gov).`)
                }
                else if (errorData.code === "PASSWORD_MISMATCH") {
                    throw new Error(`Invalid credentials. ${errorData.message}.`)
                }
                else {
                    throw new Error("An error occurred. Please try again.")
                }
            }

            const data = await response.json()

            localStorage.setItem("access_token", data.access_token)

            const token = localStorage.getItem('access_token');

            if (token) {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setCurrentUser(decodedToken);
            }

            if (activeTab === "login") {
                toast("Logged In", {
                    icon: <CheckCircle className="mr-2 h-4 w-4" />,
                })
            }
            else {
                toast("Registered", {
                    icon: <CheckCircle className="mr-2 h-4 w-4" />,
                })
            }

            setIsLoading(false)
            router.push('/')
        }
        catch (error: any) {
            toast('Error', {
                description: `${error.message}`,
                icon: <AlertCircle className="mr-2 h-4 w-4" />
            })
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Toaster />
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Log In</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <form onSubmit={handleAuth}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="emailOrUsername">Email or Username</Label>
                                        <Input id="emailOrUsername" value={formData.emailOrUsername} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? <><Spinner /> Loading...</> : 'Log In'}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                        <TabsContent value="register">
                            <form onSubmit={handleAuth}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" placeholder='First Name' value={formData.firstName} onChange={handleChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" placeholder='Last Name' value={formData.lastName} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" placeholder='Username' value={formData.username} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder='Email (name.lastname@rockymountnc.gov)' value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" placeholder='Your Password' value={formData.password} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input id="confirmPassword" type="password" placeholder='Repeat Your Password' value={formData.confirmPassword} onChange={handleChange} required />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        {isLoading ? <><Spinner /> Loading...</> : 'Register'}
                                    </Button>
                                    <div>
                                        <ul>
                                            {passwordValidationErrors.map(err => (
                                                <li className="flex items-center text-[13px] text-red-500">
                                                    <AlertCircle className="w-3 h-3 mr-2" />
                                                    {err}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
