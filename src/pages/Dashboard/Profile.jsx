import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    
    const fetchUserData = async () => {
        if (isAuthenticated) {
            try {
                const token = await getAccessTokenSilently();
                console.log(token);
                const response = await fetch(`${apiBaseUrl}/user`, {
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
        } else {
            console.log('not authenticated');
        }
    };

    return (
        <div>
            <h1>Profile</h1>
            <button onClick={fetchUserData}>Fetch User Data</button>
        </div>
    );
};

export default Profile;