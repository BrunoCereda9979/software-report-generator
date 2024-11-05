"use client"
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { ArrowDown, ArrowUp, DollarSign, Download, Package2, Smile, ThumbsDown, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header";

const mockUser = {
    name: `"cereda"`,
    position: "Technology Intern",
    avatar: "https://github.com/shadcn.png"
}

export default function Analytics () {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const analyticsData = {
        totalSpending: 24567,
        averageSatisfaction: 4.2,
        activeSoftware: 24,
        totalSoftware: 28,
        expiringSoon: 3,
        mostExpensive: { name: "Enterprise GIS", cost: 8500 },
        cheapest: { name: "Code Red", cost: 500 },
        averageCost: 2750,
        highestRated: { name: "CMS Dispatch", rating: 4.8 },
        lowestRated: { name: "Legacy System", rating: 2.1 },
        vendors: [
            { name: "Coulter Mapping Solutions", products: 5 },
            { name: "ActiveNet", products: 2 },
            { name: "ETIX", products: 1 },
        ],
        activeLicenses: 24,
        inactiveLicenses: 4,
    }

    const downloadCSV = () => {
        const headers = [
            "Metric",
            "Value",
        ]

        const data = [
            ["Total Software Spending", `$${analyticsData.totalSpending}`],
            ["Average Satisfaction Rate", `${analyticsData.averageSatisfaction}/5.0`],
            ["Active Software", `${analyticsData.activeSoftware}/${analyticsData.totalSoftware}`],
            ["Expiring Soon", analyticsData.expiringSoon],
            ["Most Expensive Software", `${analyticsData.mostExpensive.name} ($${analyticsData.mostExpensive.cost})`],
            ["Cheapest Software", `${analyticsData.cheapest.name} ($${analyticsData.cheapest.cost})`],
            ["Average Software Cost", `$${analyticsData.averageCost}`],
            ["Highest Rated Software", `${analyticsData.highestRated.name} (${analyticsData.highestRated.rating}/5.0)`],
            ["Lowest Rated Software", `${analyticsData.lowestRated.name} (${analyticsData.lowestRated.rating}/5.0)`],
            ["Active Licenses", analyticsData.activeLicenses],
            ["Inactive Licenses", analyticsData.inactiveLicenses],
        ]

        analyticsData.vendors.forEach((vendor, index) => {
            data.push([`Vendor ${index + 1}`, `${vendor.name} (${vendor.products} products)`])
        })

        const csvContent = [
            headers.join(','),
            ...data.map(row => row.join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', 'software_analytics.csv')
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    return (
        <div className="min-h-screen flex">
            <Sidebar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} mockUser={mockUser} />
            <div className="`flex flex-col h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`">
                <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
                <div className="flex items-center justify-between space-y-2 p-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Software Analytics</h2>
                        <p className="text-muted-foreground">
                            Overview of your software portfolio metrics and performance
                        </p>
                    </div>
                    <Button onClick={downloadCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        Download CSV
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
                                <div className="text-2xl font-bold">${analyticsData.totalSpending}</div>
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
                                <Smile className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analyticsData.averageSatisfaction}/5.0</div>
                                <Progress value={analyticsData.averageSatisfaction * 20} className="mt-2" />
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
                                                Most Expensive: {analyticsData.mostExpensive.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Annual cost: ${analyticsData.mostExpensive.cost}
                                            </p>
                                        </div>
                                        <DollarSign className="h-4 w-4 text-destructive" />
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                Cheapest: {analyticsData.cheapest.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Annual cost: ${analyticsData.cheapest.cost}
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
                                                    {analyticsData.highestRated.name} ({analyticsData.highestRated.rating}/5.0)
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
                                                    {analyticsData.lowestRated.name} ({analyticsData.lowestRated.rating}/5.0)
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
                                <div className="space-y-4">
                                    {analyticsData.vendors.map((vendor, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{vendor.name}</span>
                                                <span className="text-sm text-muted-foreground">{vendor.products} products</span>
                                            </div>
                                            <Progress value={vendor.products * 10} className="w-[30%]" />
                                        </div>
                                    ))}
                                </div>
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
    )
}
