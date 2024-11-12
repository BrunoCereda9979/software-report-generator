"use client"

import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Home, CheckCircle, ChartNoAxesCombinedIcon, LogOut, AlertCircle } from 'lucide-react';
import { useGlobalContext } from '@/context/GlobalContext';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from 'sonner';

interface SidebarProps {
    isMenuOpen: boolean;
    toggleMenu: () => void;
    mockUser: {
        avatar: string;
        name: string;
        position: string;
    };
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isMenuOpen, toggleMenu, mockUser, isLoggedIn, setIsLoggedIn }) => {
    const { currentUser } = useGlobalContext()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.ok) {
                localStorage.removeItem('access_token');
                setIsLoggedIn(false);
                router.push('/authentication');
                toast('Logged Out', {
                    icon: <CheckCircle className="mr-2 h-4 w-4"/>,
                })
            }
            else {
                console.error('Logout failed');
                throw new Error('Logout failed')
            }
        }
        catch (error: any) {
            console.error('Error logging out:', error);
            toast.error(error.message)
        }
    };

    return (
        <div
            className={`fixed left-0 top-0 h-full bg-card shadow-md transition-all duration-300 z-50 ${isMenuOpen ? 'w-64' : 'w-20'
                }`}
        >
            <div className="p-4 flex items-center justify-between">
                <div className={`flex items-center space-x-4 ${isMenuOpen ? '' : 'hidden'}`}>
                    <Avatar>
                        <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                        <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">{currentUser?.first_name + ' ' + currentUser?.last_name}</h3>
                        <p className="text-sm text-muted-foreground">@{currentUser?.username}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                    {isMenuOpen ? <ChevronLeft /> : <ChevronRight />}
                </Button>
            </div>
            <Separator />
            <ScrollArea className="h-[calc(100vh-80px)]">
                <div className="p-4 space-y-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/')}>
                                    <Home className="mr-2 h-4 w-4" />
                                    {isMenuOpen && <span>Dashboard</span>}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Dashboard
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('analytics')}>
                                    <ChartNoAxesCombinedIcon className="mr-2 h-4 w-4" />
                                    {isMenuOpen && <span>Analytics</span>}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Analytics
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {isMenuOpen && <span>Log Out</span>}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Log Out
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </ScrollArea>
        </div>
    );
};

export default Sidebar;
