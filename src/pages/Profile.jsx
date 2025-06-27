import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast"; 

const Profile = () => {
    const { isAuthenticated, user, logout, getAccessTokenSilently, loginWithRedirect } = useAuth0();
    const { toast } = useToast();

    const [profileData, setProfileData] = useState({ email: "", username: "" });
    const [initialProfileData, setInitialProfileData] = useState({ email: "", username: "" });
    
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState(null);

    const [isPasswordChangeLoading, setIsPasswordChangeLoading] = useState(false);

    useEffect(() => {
        if (user) {
            const initialData = {
                email: user.email || "",
                username: user.nickname || ""
            };
            setProfileData(initialData);
            setInitialProfileData(initialData);
        } else if (!isAuthenticated && typeof loginWithRedirect === 'function') {
            // If user object is not available and not authenticated,
            // and loginWithRedirect is available, trigger login.
            // This handles cases where the component loads without a user session.
            loginWithRedirect({ appState: { returnTo: window.location.pathname } });
        }
    }, [user, isAuthenticated, loginWithRedirect]);

    const handleInputChange = (e) => {
        setProfileData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsProfileLoading(true);
        setProfileError(null);

        try {
            const token = await getAccessTokenSilently();
            
            const updates = {};
            if (profileData.email !== initialProfileData.email) {
                updates.email = profileData.email;
            }
            // Auth0 uses 'nickname' for what is often displayed as 'username'
            if (profileData.username !== initialProfileData.username) {
                updates.nickname = profileData.username;
            }
            
            if (Object.keys(updates).length === 0) {
                toast({ title: "No changes to save.", variant: "default" });
                setIsProfileLoading(false);
                return;
            }
            
            const response = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(user.sub)}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }
            
            const updatedUserData = await response.json();
            setInitialProfileData({ // Update baseline to reflect saved changes
                email: updatedUserData.email,
                username: updatedUserData.nickname 
            });
            setProfileData({ // Also update current form data
                email: updatedUserData.email,
                username: updatedUserData.nickname
            });

            toast({ title: "Profile updated successfully!", variant: "success" });

        } catch (err) {
            setProfileError(err.message); // Display error near the form
            toast({ title: "Error updating profile", description: err.message, variant: "destructive" });
        } finally {
            setIsProfileLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!user || !user.email) {
            toast({ title: "Error", description: "User email not available.", variant: "destructive" });
            return;
        }
        setIsPasswordChangeLoading(true);

        try {
            const response = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/dbconnections/change_password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
                    email: user.email,
                    connection: 'Username-Password-Authentication' // As per your cURL
                })
            });

            if (!response.ok) {
                // Try to parse error from Auth0, which might be plain text or JSON
                let errorDetail = 'Failed to send password reset email.';
                try {
                    const errorText = await response.text();
                    // Auth0 sometimes returns plain text errors for this endpoint
                    if (errorText) errorDetail = errorText;
                    // eslint-disable-next-line no-unused-vars
                } catch (_parseErr) { 
                    // Ignore if can't parse, stick to default
                }
                throw new Error(errorDetail);
            }
            
            toast({ title: "Password Reset Email Sent", description: "Please check your inbox to complete the password reset.", variant: "success" });
        } catch (err) {
            toast({ title: "Password Reset Failed", description: err.message, variant: "destructive" });
        } finally {
            setIsPasswordChangeLoading(false);
        }
    };
    
    if (!isAuthenticated || !user) {
        // The useEffect above should handle redirection, 
        // but this is a fallback display while redirecting or if something unexpected happens.
        return (
            <Card className="max-w-md mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Loading profile or redirecting to login...</p>
                </CardContent>
            </Card>
        );
    }

    const hasProfileChanged = profileData.email !== initialProfileData.email || profileData.username !== initialProfileData.username;

    return (
        <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            required
                            disabled={isProfileLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            value={profileData.username}
                            onChange={handleInputChange}
                            required
                            disabled={isProfileLoading}
                        />
                    </div>

                    {profileError && (
                        <p className="text-sm text-red-500 mb-4">{profileError}</p>
                    )}

                    <Button 
                        type="submit"
                        className="w-full"
                        disabled={isProfileLoading || !hasProfileChanged}
                    >
                        {isProfileLoading ? "Saving..." : "Save Profile Changes"}
                    </Button>
                </form>

                <div className="mt-6 pt-6 border-t space-y-4">
                    <div>
                        <Button 
                            variant="outline"
                            className="w-full"
                            onClick={handleChangePassword}
                            disabled={isPasswordChangeLoading || !user?.email} // Disable if no email
                        >
                            {isPasswordChangeLoading ? "Sending Email..." : "Change Password"}
                        </Button>
                    </div>
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
