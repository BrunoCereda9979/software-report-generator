"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import {
    ArrowDown,
    ArrowUp,
    DollarSign,
    Download,
    FileDown,
    Package2,
    ThumbsDown,
    ThumbsUp,
    Smile,
    Meh,
    Frown,
    PartyPopper
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import jsPDF from "jspdf";

const mockUser = {
    name: `"cereda"`,
    position: "Technology Intern",
    avatar: "https://github.com/shadcn.png"
}

export default function Analytics() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [analyticsData, setAnalyticsData] = useState({
        totalSpending: 0.0,
        averageSatisfaction: 0.0,
        activeSoftware: 0,
        totalSoftware: 0,
        expiringSoon: 0,
        mostExpensive: {
            software_name: "",
            software_annual_amount: 0.0
        },
        cheapest: {
            software_name: "",
            software_annual_amount: 0.0
        },
        averageCost: 0.0,
        highestRated: {
            software__software_name: "",
            satisfaction_rate: 0
        },
        lowestRated: {
            software__software_name: "",
            satisfaction_rate: 0
        },
        vendors: [
            {
                name: "",
                products: 0
            },
        ],
        activeLicenses: 0,
        inactiveLicenses: 0
    });

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(14);
        doc.text("Software Analytics Report", 10, 10);

        // Add metrics
        const data = [
            ["Metric", "Value"],
            ["Total Software Spending", `$${analyticsData.totalSpending}`],
            ["Average Satisfaction Rate", `${analyticsData.averageSatisfaction}/5.0`],
            ["Active Software", `${analyticsData.activeSoftware}/${analyticsData.totalSoftware}`],
            ["Expiring Soon", `${analyticsData.expiringSoon}`],
            ["Most Expensive Software", `${analyticsData.mostExpensive.software_name} ($${analyticsData.mostExpensive.software_annual_amount})`],
            ["Cheapest Software", `${analyticsData.cheapest.software_name} ($${analyticsData.cheapest.software_annual_amount})`],
            ["Average Software Cost", `$${analyticsData.averageCost}`],
            ["Highest Rated Software", `${analyticsData.highestRated.software__software_name} (${analyticsData.highestRated.satisfaction_rate}/5.0)`],
            ["Lowest Rated Software", `${analyticsData.lowestRated.software__software_name} (${analyticsData.lowestRated.satisfaction_rate}/5.0)`],
            ["Active Licenses", `${analyticsData.activeLicenses}`],
            ["Inactive Licenses", `${analyticsData.inactiveLicenses}`],
        ];

        analyticsData.vendors.forEach((vendor, index) => {
            data.push([`Vendor ${index + 1}`, `${vendor.name} (${vendor.products} products)`]);
        });

        // Table styling
        const startX = 10;
        const startY = 20;
        const rowHeight = 10;

        // Add table to the PDF
        data.forEach((row, index) => {
            const y = startY + index * rowHeight;
            doc.text(row[0].toString(), startX, y); // Metric
            doc.text(row[1].toString(), startX + 70, y); // Value
        });

        // Save the PDF
        doc.save("software_portfolio_analytics.pdf");
    };


    const tokenIsExpired = (token: any) => {
        try {
            const { exp } = JSON.parse(atob(token.split(".")[1]));
            const isExpired = Date.now() >= exp * 1000;

            return isExpired;
        }
        catch (error) {
            console.error("Failed to decode token:", error);
        }
    }

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');

                if (!accessToken) {
                    throw new Error("No valid session found. Please log in again.")
                }

                if (tokenIsExpired(accessToken)) {
                    throw new Error('Your session is expired. Please log in again.')
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch analytics. Please try again later.');
                }

                const data = await response.json();
                setAnalyticsData(data);
            }
            catch (error: any) {
                router.push('/authentication')

                toast('Session Expired', {
                    description: `${error.message}`,
                    icon: <AlertCircle className="mr-2 h-4 w-4" />
                })
            }
        };
        fetchAnalytics();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="min-h-screen flex">
                <Sidebar mockUser={mockUser} toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <div className={`flex-1 overflow-auto transition-all duration-300 ${isMenuOpen ? 'ml-64' : 'ml-20'}`}>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between space-y-2 p-8">
                            <div className="flex items-center justify-between">
                                <Image src="/logo.jpg" alt="Logo" width={58} height={58} />
                                <div className="ml-4">
                                    <h2 className="text-3xl font-bold tracking-tight">Software Analytics</h2>
                                    <p className="text-muted-foreground">
                                        Overview of the software portfolio metrics and performance
                                    </p>
                                </div>
                            </div>
                            <Button onClick={downloadPDF}>
                                <FileDown className="mr-2 h-4 w-4" />
                                Download as PDF
                            </Button>
                        </div>
                        <div className="grid gap-4 p-8 pt-0">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total Software Spending
                                        </CardTitle>
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">${analyticsData.totalSpending}.00</div>
                                        <p className="text-xs text-muted-foreground">
                                            +2.5% from last month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Average Satisfaction Rate
                                        </CardTitle>
                                        {
                                            analyticsData.averageSatisfaction > 9 ? (
                                                <PartyPopper className="h-4 w-4 text-muted-foreground" />
                                            ) : analyticsData.averageSatisfaction > 7 ? (
                                                <Smile className="h-4 w-4 text-muted-foreground" />
                                            ) : analyticsData.averageSatisfaction >= 5 ? (
                                                <Meh className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Frown className="h-4 w-4 text-muted-foreground" />
                                            )
                                        }
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{analyticsData.averageSatisfaction}/10</div>
                                        <Progress value={Math.round(analyticsData.averageSatisfaction / 10 * 100)} className="mt-2" />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Active Software
                                        </CardTitle>
                                        <Package2 className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{analyticsData.activeSoftware}/{analyticsData.totalSoftware}</div>
                                        <p className="text-xs text-muted-foreground">
                                            {((analyticsData.activeSoftware / analyticsData.totalSoftware) * 100).toFixed(1)}% of total software
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Expiring Soon
                                        </CardTitle>
                                        <ArrowDown className="h-4 w-4 text-destructive" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{analyticsData.expiringSoon}</div>
                                        <p className="text-xs text-muted-foreground">
                                            Licenses expiring in 30 days
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                <Card className="col-span-4">
                                    <CardHeader>
                                        <CardTitle>Software Cost Analysis</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        Most Expensive: {analyticsData.mostExpensive.software_name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Annual cost: ${analyticsData.mostExpensive.software_annual_amount}
                                                    </p>
                                                </div>
                                                <DollarSign className="h-4 w-4 text-destructive" />
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        Cheapest: {analyticsData.cheapest.software_name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Annual cost: ${analyticsData.cheapest.software_annual_amount}
                                                    </p>
                                                </div>
                                                <DollarSign className="h-4 w-4 text-green-500" />
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        Average Software Cost
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Annual cost: ${analyticsData.averageCost}
                                                    </p>
                                                </div>
                                                <DollarSign className="h-4 w-4 text-blue-500" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="col-span-3">
                                    <CardHeader>
                                        <CardTitle>Satisfaction Insights</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        Highest Rated
                                                    </p>
                                                    <div className="flex items-center pt-1">
                                                        <span className="text-sm text-muted-foreground">
                                                            {analyticsData.highestRated.software__software_name} ({analyticsData.highestRated.satisfaction_rate}/10)
                                                        </span>
                                                        <ThumbsUp className="ml-2 h-4 w-4 text-green-500" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        Lowest Rated
                                                    </p>
                                                    <div className="flex items-center pt-1">
                                                        <span className="text-sm text-muted-foreground">
                                                            {analyticsData.lowestRated.software__software_name} ({analyticsData.lowestRated.satisfaction_rate}/10)
                                                        </span>
                                                        <ThumbsDown className="ml-2 h-4 w-4 text-destructive" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Vendor Distribution</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-[200px] w-full pr-4">
                                            <div className="space-y-4">
                                                {analyticsData.vendors.map((vendor, index) => (
                                                    vendor.name !== null && (
                                                        <div key={index} className="flex items-center justify-between">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium">{vendor.name}</span>
                                                                <span className="text-sm text-muted-foreground">{vendor.products} products</span>
                                                            </div>
                                                            <Progress value={vendor.products * 10} className="w-[30%]" />
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>License Status Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">All Licenses</span>
                                                    <span className="text-sm text-muted-foreground">{analyticsData.inactiveLicenses + analyticsData.activeLicenses} software products</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <ArrowDown className="mr-2 h-4 w-4 text-destructive" />
                                                    <span className="text-sm font-medium text-destructive">
                                                        {((analyticsData.inactiveLicenses / (analyticsData.activeLicenses + analyticsData.inactiveLicenses)) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">Active Licenses</span>
                                                    <span className="text-sm text-muted-foreground">{analyticsData.activeLicenses} software products</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <ArrowUp className="mr-2 h-4 w-4 text-green-500" />
                                                    <span className="text-sm font-medium text-green-500">
                                                        {((analyticsData.activeLicenses / (analyticsData.activeLicenses + analyticsData.inactiveLicenses)) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">Inactive Licenses</span>
                                                    <span className="text-sm text-muted-foreground">{analyticsData.inactiveLicenses} software products</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <ArrowDown className="mr-2 h-4 w-4 text-destructive" />
                                                    <span className="text-sm font-medium text-destructive">
                                                        {((analyticsData.inactiveLicenses / (analyticsData.activeLicenses + analyticsData.inactiveLicenses)) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
