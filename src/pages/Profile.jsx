import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Profile = () => {
    const { isAuthenticated, user, logout, getAccessTokenSilently } = useAuth0();
    const initialData = {
        email: user?.email || "",
        username: user?.nickname || "",
        password: "",
        newPassword: ""
    };
    
    const [formData, setFormData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = await getAccessTokenSilently();
            
            const response = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${user.sub}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: formData.email,
                    nickname: formData.username,
                    ...(formData.newPassword && { password: formData.newPassword })
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            // Clear password fields after successful update
            setFormData(prev => ({
                ...prev,
                password: "",
                newPassword: ""
            }));

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated || !user) {
        return (
            <Card className="max-w-md mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Please log in to view your profile.</p>
            </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Leave blank to keep current password"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <Button 
                        type="submit"
                        className="w-full"
                        disabled={isLoading || (
                            formData.email === initialData.email &&
                            formData.username === initialData.username &&
                            !formData.newPassword
                        )}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>

                <div className="pt-4 border-t">
                    <Button 
                        variant="destructive"
                        className="w-full transition-transform duration-200 hover:scale-105 active:scale-95"
                        onClick={() => 
                            logout({ logoutParams: { returnTo: window.location.origin }})
                        }
                    >
                        Sign out
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Profile;
