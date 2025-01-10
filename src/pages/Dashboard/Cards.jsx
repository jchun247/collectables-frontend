import { useAuth0 } from "@auth0/auth0-react";

const Cards = () => {
    
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const fetchCardData = async () => {
        if (isAuthenticated) {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`${apiBaseUrl}/cards/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("fetch user data failed")
                }

                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div>
            <h1>Cards</h1>
            <button onClick={fetchCardData}>Fetch Card Data</button>
        </div>
    )
}

export default Cards;