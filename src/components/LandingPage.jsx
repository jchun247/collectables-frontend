import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, Search, TrendingUp, Folder, Share2, Bell, BarChart3 } from "lucide-react";

const LandingPage = () => {

    const appFeatures = [
        {
            title: "Pokemon Card Explorer",
            description: "Browse and search through an extensive database of Pokemon cards with detailed information and high-quality images",
            icon: <Search className="h-8 w-8 text-primary" />
        },
        {
            title: "Real-Time Price Tracking",
            description: "Stay updated with current market prices and historical price trends for every Pokemon card",
            icon: <TrendingUp className="h-8 w-8 text-primary" />
        },
        {
            title: "Collection Manager",
            description: "Track and organize your Pokemon card collection with powerful portfolio management tools",
            icon: <Folder className="h-8 w-8 text-primary" />
        },
        {
            title: "Social Sharing",
            description: "Share your collection with friends and connect with other Pokemon card enthusiasts worldwide",
            icon: <Share2 className="h-8 w-8 text-primary" />
        },
        {
            title: "Price Alerts",
            description: "Set up custom alerts for price changes on specific cards you're interested in",
            icon: <Bell className="h-8 w-8 text-primary" />
        },
        {
            title: "Collection Value Insights",
            description: "Get detailed analytics and estimated value of your entire Pokemon card portfolio",
            icon: <BarChart3 className="h-8 w-8 text-primary" />
        }
    ];

    return (
        <main className="min-h-screen bg-background" role="main">
            <div className="sr-only">
                <h1>Pokemon Card Collection Platform - Track, Price, and Share Your Collection</h1>
                <p>Track your Pokemon card collection, get real-time market prices, monitor portfolio value, and connect with fellow collectors.</p>
            </div>
            {/* Hero Section with SEO-optimized content */}
            <section aria-label="hero" className="container mx-auto px-4 py-16">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                        The Ultimate Pokemon Card Collection Platform
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Discover, track, and manage your Pokemon card collection with real-time pricing, portfolio tracking, and a vibrant community of collectors.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg">
                            Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section aria-label="features" className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Pokemon Card Collectors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {appFeatures.map((feature, index) => (
                        <Card key={index} className="border-2">
                            <CardHeader>
                                <div className="mb-4">{feature.icon}</div>
                                <CardTitle>{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section aria-label="statistics" className="bg-muted py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-2">
                            <h3 className="text-4xl font-bold">500K+</h3>
                            <p className="text-muted-foreground">Cards Tracked</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-bold">50K+</h3>
                            <p className="text-muted-foreground">Active Collectors</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-bold">$2M+</h3>
                            <p className="text-muted-foreground">Cards Traded</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section aria-label="call-to-action" className="container mx-auto px-4 py-16">
                <Card className="bg-primary text-primary-foreground">
                <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
                    <Sparkles className="h-12 w-12" />
                    <h2 className="text-3xl font-bold">Start Your Pokemon Card Journey Today</h2>
                    <p className="max-w-2xl text-lg">
                        Join thousands of Pokemon card collectors who are using our platform to track their collections, discover new cards, and connect with other enthusiasts. Get started for free!
                    </p>
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                        Sign Up Now &ndash; Free Forever
                    </Button>
                </CardContent>
                </Card>
            </section>

        </main>
    )
}

export default LandingPage;
