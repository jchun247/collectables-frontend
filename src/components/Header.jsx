import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Menu, User, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
    const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        {/* <Cards className="h-6 w-6 text-primary" /> */}
                        <span className="font-bold text-xl">
                            <Link
                                to="/"
                            >
                                Collectables
                            </Link>
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center">
                        <ul className="flex items-center space-x-8">
                            <li>
                                <Link to="/explore" className="text-sm font-medium hover:text-primary">
                                    Explore
                                </Link>
                            </li>
                            <li>
                                <Link to="/portfolio" className="text-sm font-medium hover:text-primary">
                                    Portfolio
                                </Link>
                            </li>
                            <li>
                                <Link to="/community" className="text-sm font-medium hover:text-primary">
                                    Community
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Auth */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="text-sm font-medium hover:text-primary flex items-center gap-2"
                                >
                                    <User className="h-4 w-4" />
                                    {user?.name}
                                </Link>
                                <Button onClick={() => 
                                    logout({ logoutParams: { returnTo: window.location.origin }})
                                }>
                                    Log out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    variant="ghost"
                                    onClick={() =>
                                        loginWithRedirect()
                                    }>
                                        Log in
                                </Button>
                                <Button
                                    onClick={() =>
                                        loginWithRedirect({
                                            authorizationParams: {
                                                screen_hint: "signup",
                                            }
                                        })
                                    }
                                >
                                    Sign up
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button*/}
                    <Button 
                        variant="ghost" size="icon" className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ): (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                to="/profile"
                                className="text-sm font-medium hover:text-primary"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            <Link
                                to="/explore"
                                className="text-sm font-medium hover:text-primary"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Explore
                            </Link>
                            <Link
                                to="/portfolio"
                                className="text-sm font-medium hover:text-primary"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Portfolio
                            </Link>
                            <Link
                                to="/community"
                                className="text-sm font-medium hover:text-primary"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Community
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header;