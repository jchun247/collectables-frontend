import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCardText } from "@/utils/textFormatters";
import { Plus, Minus } from 'lucide-react';

const CardDetails = () => {
    const { id } = useParams();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInCollection, setIsInCollection] = useState(false);
    const [isUpdatingCollection, setIsUpdatingCollection] = useState(false);

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const checkCollectionStatus = async (token) => {
        try {
            const response = await fetch(`${apiBaseUrl}/collections/check/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setIsInCollection(data.isInCollection);
            }
        } catch (error) {
            console.error("Error checking collection status:", error);
        }
    };

    const handleCollectionUpdate = async (action) => {
        if (!isAuthenticated) {
            setError("Please login to manage your collection");
            return;
        }

        setIsUpdatingCollection(true);
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${apiBaseUrl}/collections/${action}/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setIsInCollection(action === 'add');
            } else {
                throw new Error(`Failed to ${action} card to collection`);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsUpdatingCollection(false);
        }
    };

    const fetchCard = async () => {
        if (isAuthenticated) {
            const token = await getAccessTokenSilently();
            try {
                const response = await fetch(`${apiBaseUrl}/cards/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setCard(data);
                setError(null);
            } catch (error) {
                setError(error.message);
                setCard(null);
            } finally {
                setLoading(false);
                if (isAuthenticated) {
                    await checkCollectionStatus(token);
                }
            }
        } else {
            setError("You are not authenticated. Please login to view card details.");
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCard();
    }, [id]);

    if (loading) {
        return <div className="container mx-auto mt-8">Loading...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto mt-8 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button
                    variant="outline"
                    onClick={() => {
                        setLoading(true);
                        fetchCard();
                    }}
                >
                    Try Again
                </Button>
            </div>
        );
    }

    if (!card) {
        return <div className="container mx-auto mt-8">Card not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mx-auto bg-white shadow-lg">
                <CardContent className="p-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{card.name} - {card.setNumber} - {card.set.name} ({card.set.code})</h1>
                                <div className="space-x-2 text-gray-600">
                                    <span>{card.set.name}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end ml-4">
                                <Button
                                    onClick={() => handleCollectionUpdate(isInCollection ? 'remove' : 'add')}
                                    disabled={isUpdatingCollection || !isAuthenticated}
                                    variant={isInCollection ? "destructive" : "default"}
                                    className="min-w-[160px]"
                                >
                                    {isUpdatingCollection ? "Updating..." : 
                                        isInCollection ? (
                                            <>
                                                <Minus /> Remove from Collection
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                <Plus /> Add to Collection
                                            </>
                                        )}
                                </Button>
                                {!isAuthenticated && (
                                    <span className="text-sm text-gray-500">Login to manage collection</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left column - Image */}
                        <div className="flex justify-center items-start">
                            <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-gray-100 shadow-inner w-full p-4">
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img 
                                        src={card.imageUrl}
                                        alt={card.name}
                                        className="object-contain max-w-full max-h-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Middle column - Card Details */}
                        <div className="space-y-8">

                            {/* Card Information Section */}
                            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">Card Details</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white p-4 rounded-lg">
                                        <label className="text-sm text-gray-500">Rarity</label>
                                        <p className="font-medium">{formatCardText(card.rarity)}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <label className="text-sm text-gray-500">Type</label>
                                        <p className="font-medium">{card.type}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <label className="text-sm text-gray-500">Artist</label>
                                        <p className="font-medium">{card.artist}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <label className="text-sm text-gray-500">Release Date</label>
                                        <p className="font-medium">{card.releaseDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column - Market Price */}
                        <div className="space-y-8">
                            {/* Market Prices Section */}
                            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">Market Prices</h2>
                                <div className="space-y-3">
                                    {card.prices.map((price, index) => (
                                        <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg">
                                            <span className="text-gray-600">{formatCardText(price.condition)}</span>
                                            <span className="font-bold text-lg">${price.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Price History Section */}
                            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">Price History</h2>
                                <div className="bg-white p-4 rounded-lg">
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={[
                                                    { date: '2023-09', price: 280.50 },
                                                    { date: '2023-10', price: 285.75 },
                                                    { date: '2023-11', price: 292.25 },
                                                    { date: '2023-12', price: 299.99 },
                                                    { date: '2024-01', price: 305.50 },
                                                    { date: '2024-02', price: 299.99 }
                                                ]}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis 
                                                    dataKey="date" 
                                                    stroke="#888888"
                                                    fontSize={12}
                                                />
                                                <YAxis 
                                                    stroke="#888888"
                                                    fontSize={12}
                                                    tickFormatter={(value) => `$${value}`}
                                                />
                                                <Tooltip 
                                                    formatter={(value) => [`$${value}`, 'Price']}
                                                    contentStyle={{
                                                        backgroundColor: 'white',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="price" 
                                                    stroke="#2563eb" 
                                                    strokeWidth={2}
                                                    dot={{
                                                        stroke: '#2563eb',
                                                        strokeWidth: 2,
                                                        r: 4,
                                                        fill: 'white'
                                                    }}
                                                    activeDot={{
                                                        stroke: '#2563eb',
                                                        strokeWidth: 2,
                                                        r: 6,
                                                        fill: '#2563eb'
                                                    }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CardDetails;
