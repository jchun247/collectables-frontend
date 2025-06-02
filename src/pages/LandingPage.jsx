import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeatureCard from "@/components/FeatureCard";
// import StatCard from "@/components/StatCard"; // Removed unused import
import { ArrowRight, Sparkles, Search, TrendingUp, Folder, Share2, Bell, BarChart3 } from "lucide-react"; // Removed Package, Users, BarChartHorizontalBig

const LandingPage = () => {
    const { loginWithRedirect } = useAuth0();
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
        <main className="min-h-screen bg-background flex flex-col"> {/* Added flex flex-col */}
            <div className="flex-grow"> {/* Wrapper for content that pushes CTA down */}
                <div className="sr-only">
                    <h1>Pokemon Card Collection Platform - Track, Price, and Share Your Collection</h1>
                    <p>Track your Pokemon card collection, get real-time market prices, monitor portfolio value, and connect with fellow collectors.</p>
                </div>
                {/* Hero Section: Image fills container width, text overlaid on the right */}
                <section
                    aria-label="hero"
                className="relative container mx-auto rounded-lg shadow-xl overflow-hidden bg-cover bg-center bg-no-repeat my-6 md:my-10"
                style={{ 
                    backgroundImage: "url('https://collectables-app-frontend-staging.s3.us-east-2.amazonaws.com/cynthia_hero.jpg')",
                    minHeight: 'clamp(380px, 55vh, 550px)' // Responsive height: min, preferred, max
                }}
            >
                {/* Uniform semi-transparent overlay to darken the entire image */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Content Container */}
                <div className="relative h-full flex items-center p-6 sm:p-8 md:p-12"> {/* Padding for content within the section */}
                    <div className="w-full md:w-1/2 lg:w-3/5 xl:w-7/12 ml-auto space-y-6 text-center md:text-right"> {/* Text aligned right */}
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
                            The Ultimate Pokemon Card Collection Platform
                        </h1>
                        <p className="text-xl text-gray-100 sm:text-gray-200 max-w-2xl mx-auto md:ml-auto md:mr-0"> {/* Increased max-width, adjusted alignment handling */}
                            Discover, track, and manage your Pokemon card collection with real-time pricing, portfolio tracking, and a vibrant community of collectors.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-4"> {/* Buttons aligned right */}
                            <Button 
                                size="lg" 
                                className="bg-primary hover:bg-primary/90 text-lg text-primary-foreground"
                                onClick={() =>
                                    loginWithRedirect({
                                        authorizationParams: {
                                            screen_hint: "signup",
                                        }
                                    })
                                }
                            >
                                Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section aria-label="features" className="container mx-auto px-4 py-4">
                <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Pokemon Card Collectors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {appFeatures.map((feature) => (
                        <FeatureCard 
                            key={feature.title} // Assuming title is unique, otherwise use a unique id
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </section>
            </div> {/* End of flex-grow wrapper */}

            {/* CTA Section */}
            <section aria-label="call-to-action" className="container mx-auto px-4 py-12"> {/* Removed mt-auto */}
                <Card className="bg-primary text-primary-foreground">
                <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
                    <Sparkles className="h-12 w-12" />
                    <h2 className="text-3xl font-bold">Start Your Pokemon Card Journey Today</h2>
                    <p className="max-w-2xl text-lg">
                        Ready to take your Pokémon card collection to the next level? Effortlessly track your cards, get real-time price updates, and share your passion with others. Get started for free!
                    </p>
                    <Button 
                        size="lg" 
                        variant="secondary" 
                        className="text-lg px-8 py-6"
                        onClick={() =>
                            loginWithRedirect({
                                authorizationParams: {
                                    screen_hint: "signup",
                                }
                            })
                        }
                    >
                        Sign Up Now &ndash; Free Forever
                    </Button>
                </CardContent>
                </Card>
            </section>

        </main>
    )
}

export default LandingPage;
