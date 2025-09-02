import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Menu, User, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Header = () => {
    const { loginWithRedirect, isAuthenticated, user } = useAuth0();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const headerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;

            if (currentScrollY > lastScrollY && currentScrollY > headerHeight) {
                // Scrolling down and header is out of view
                setShowHeader(false);
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up
                setShowHeader(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    return (
        <header 
            ref={headerRef}
            className={`border-b z-50 bg-background fixed top-0 left-0 right-0 transition-transform duration-300 ease-in-out ${
                showHeader ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        {/* <Cards className="h-6 w-6 text-primary" /> */}
                        <span className="font-bold text-xl">
                            <Link
                                to="/"
                                className="relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
                            >
                                Collectables
                            </Link>
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center">
                        <ul className="flex items-center space-x-8">
                            <li>
                                <Link to="/explore" className="text-md font-medium text-primary transition-colors duration-200 hover:text-gray-600">
                                    Explore
                                </Link>
                            </li>
                            <li>
                                <Link to="/sets" className="text-md font-medium text-primary transition-colors duration-200 hover:text-gray-600">
                                    Sets
                                </Link>
                            </li>
                            <li>
                                <Link to="/collections" className="text-md font-medium text-primary transition-colors duration-200 hover:text-gray-600">
                                    Collection
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
                                    className="text-md font-medium text-primary transition-colors duration-200 hover:text-gray-600 flex items-center gap-2"
                                >
                                    <User className="h-4 w-4" />
                                    {user?.nickname || user?.email}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Button 
                                    variant="ghost"
                                    className="transition-transform duration-200 hover:scale-105 active:scale-95"
                                    onClick={() =>
                                        loginWithRedirect()
                                    }>
                                        Log in
                                </Button>
                                <Button
                                    className="transition-transform duration-200 hover:scale-105 active:scale-95"
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
                        variant="ghost" size="icon" className="md:hidden transition-transform duration-200 hover:scale-110 active:scale-95"
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
            <div className={`absolute top-16 left-0 right-0 bg-background border-b md:hidden transform transition-all duration-300 z-50 ${
                isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-10px] opacity-0 pointer-events-none'
            }`}>
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                to="/explore"
                                className="text-sm font-medium text-primary transition-colors duration-200 hover:text-gray-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Explore
                            </Link>
                            <Link
                                to="/sets"
                                className="text-sm font-medium text-primary transition-colors duration-200 hover:text-gray-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sets
                            </Link>
                            <Link
                                to="/collections"
                                className="text-sm font-medium text-primary transition-colors duration-200 hover:text-gray-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Collections
                            </Link>
                        </nav>

                        {/* Auth */}
                        <div className="flex flex-col space-y-4 mt-4">
                            {isAuthenticated ? (
                                <Link
                                    to="/profile"
                                    className="text-sm font-medium text-primary transition-colors duration-200 hover:text-gray-600"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                            ) : (
                                 <>
                                     <Link
                                         to="#"
                                         className="text-sm font-medium text-primary transition-colors duration-200 hover:text-gray-600"
                                         onClick={() => {
                                             loginWithRedirect();
                                             setIsMobileMenuOpen(false);
                                         }}
                                     >
                                         Log in
                                     </Link>
                                     <Link
                                         to="#"
                                         className="text-sm font-medium text-primary transition-colors duration-200 hover:text-gray-600"
                                         onClick={() => {
                                             loginWithRedirect({
                                                 authorizationParams: {
                                                     screen_hint: "signup",
                                                 },
                                             });
                                             setIsMobileMenuOpen(false);
                                         }}
                                     >
                                         Sign up
                                     </Link>
                                 </>
                             )}
                        </div>
                    </div>
                </div>
        </header>
    )
}

export default Header;
