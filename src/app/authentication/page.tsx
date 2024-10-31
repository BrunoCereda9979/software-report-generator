"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from "sonner"

export default function AuthComponent() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("login")
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

        // Basic email validation regex
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (activeTab === "register" && !emailPattern.test(formData.email)) {
            toast.error("Please enter a valid email address.")
            return
        }

        const url = activeTab === "login"
            ? "http://127.0.0.1:8000/api/v1/login"
            : "http://127.0.0.1:8000/api/v1/register"

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
                    toast.error("Internal Server Error. Please try again later.")
                } 
                else if (errorData.message === "Invalid credentials") {
                    toast.error("Invalid credentials. Please check your email or password.")
                } 
                else {
                    toast.error("An error occurred. Please try again.")
                }

                return
            }

            const data = await response.json()
            
            // Store the access token in local storage upon successful login
            if (activeTab === "login") {
                localStorage.setItem("access_token", data.access_token)
                toast.success("Login successful!")
                router.push('/')
            } 
            else {
                toast.success("Registration successful!")
                // Optionally handle post-registration logic here
            }
        } 
        catch (error) {
            toast.error("An unexpected error occurred. Please check your network and try again.")
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
                                    <Button type="submit" className="w-full">Log In</Button>
                                </div>
                            </form>
                        </TabsContent>
                        <TabsContent value="register">
                            <form onSubmit={handleAuth}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" value={formData.firstName} onChange={handleChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" value={formData.lastName} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" value={formData.username} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                                    </div>
                                    <Button type="submit" className="w-full">Register</Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
