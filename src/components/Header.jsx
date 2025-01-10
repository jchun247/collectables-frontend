import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
    const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Collectables</h1>
                <nav>
                <ul className="flex space-x-4">
                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link 
                                    to="/cards"
                                >
                                    Cards
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/profile"
                                >
                                    {user?.name}
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => 
                                        logout({ logoutParams: { returnTo: window.location.origin }})}
                                >
                                    Sign Out
                                </button>
                            </li>
                        </>
                    ): (
                        <>
                            <li>
                                <button onClick={() => loginWithRedirect()}>
                                    Sign In
                                </button>
                            </li>
                            <li>
                                <Link
                                    to="/signup"
                                    className="hover:text-blue-400 transition-colors duration-200"
                                >
                                    Sign Up for Free
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;