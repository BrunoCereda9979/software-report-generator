'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginRegisterForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isLogin) {
            console.log('Logging in', { email, password })
        } else {
            console.log('Registering', { firstName, lastName, email, password })
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl">{isLogin ? 'Login' : 'Register'}</CardTitle>
                <CardDescription>
                    {isLogin
                        ? 'Enter your credentials to access your account'
                        : 'Create a new account to get started'}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {!isLogin && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="first-name">First Name</Label>
                                <Input
                                    id="first-name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last-name">Last Name</Label>
                                <Input
                                    id="last-name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button className="w-full" type="submit">
                        {isLogin ? 'Login' : 'Register'}
                    </Button>
                    <div className="text-sm text-center">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <Button
                            variant="link"
                            className="pl-1"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Register' : 'Login'}
                        </Button>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}