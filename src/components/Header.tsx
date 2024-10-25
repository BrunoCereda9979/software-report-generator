// components/Header.tsx

import React from 'react';
import { Button } from "@/components/ui/button"
import { Bell, Mail } from 'lucide-react';

interface HeaderProps {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, setIsLoggedIn }) => {
    return (
        <header className="bg-card shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">City Of Rocky Mount Software Tracker</h1>
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Mail className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setIsLoggedIn(!isLoggedIn)}>
                        {isLoggedIn ? 'Logout' : 'Login'}
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
