import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Home, Settings, HelpCircle } from 'lucide-react';
import { useGlobalContext } from '@/context/GlobalContext';

interface SidebarProps {
    isMenuOpen: boolean;
    toggleMenu: () => void;
    mockUser: {
        avatar: string;
        name: string;
        position: string;
    };
}

const Sidebar: React.FC<SidebarProps> = ({ isMenuOpen, toggleMenu, mockUser }) => {
    const { currentUser } = useGlobalContext()
    
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
                        <p className="text-sm text-muted-foreground">{mockUser.position}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                    {isMenuOpen ? <ChevronLeft /> : <ChevronRight />}
                </Button>
            </div>
            <Separator />
            <ScrollArea className="h-[calc(100vh-80px)]">
                <div className="p-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                        <Home className="mr-2 h-4 w-4" />
                        {isMenuOpen && <span>Dashboard</span>}
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        {isMenuOpen && <span>Settings</span>}
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        {isMenuOpen && <span>Help</span>}
                    </Button>
                </div>
            </ScrollArea>
        </div>
    );
};

export default Sidebar;
