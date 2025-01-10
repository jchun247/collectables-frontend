import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";

const LandingPage = () => {

    const appFeatures = [
        {
            title: "Track your Collection",
            description: "Easily manage your entire trading card collection in one place",

        },
        {
            title: "Market Insights",
            description: "Get real-time pricing data and market trends for your cards",
        },
        {
            title: "Interact with the Community",
            description: "Share your collection with the rest of the world to see"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section*/}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                        Your Digital Card Collection
                        <span className="text-primary"> Organized</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        The ultimate platform for trading card collectors. Track, trade, and discover cards like never before.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg">
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline">
                        Learn More
                        </Button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            </div>

            {/* Stats Section */}
            <div className="bg-muted py-16">
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
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 py-16">
                <Card className="bg-primary text-primary-foreground">
                <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
                    <Sparkles className="h-12 w-12" />
                    <h2 className="text-3xl font-bold">Start Your Collection Today</h2>
                    <p className="max-w-2xl">
                    Join thousands of collectors who are already managing their collections digitally. Get started for free!
                    </p>
                    <Button size="lg" variant="secondary">
                    Sign Up Now
                    </Button>
                </CardContent>
                </Card>
            </div>

        </div>
    )
}

export default LandingPage;