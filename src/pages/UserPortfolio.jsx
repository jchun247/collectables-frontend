import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const UserPortfolio = () => {
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const fetchPortfolioData = async () => {
        if (isAuthenticated) {
            const token = await getAccessTokenSilently();
            try {
                const response = await fetch(`${apiBaseUrl}/portfolio/history`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPortfolioData(data);
                setError(null);
            } catch (error) {
                setError(error.message);
                setPortfolioData(null);
            } finally {
                setLoading(false);
            }
        } else {
            setError("You are not authenticated. Please login to view your portfolio.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolioData();
    }, [isAuthenticated]);

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
                        fetchPortfolioData();
                    }}
                >
                    Try Again
                </Button>
            </div>
        );
    }

    if (!portfolioData) {
        return <div className="container mx-auto mt-8">No portfolio data found</div>;
    }

    // Calculate portfolio stats
    const currentValue = portfolioData.history[portfolioData.history.length - 1]?.value || 0;
    const initialValue = portfolioData.history[0]?.value || 0;
    const valueChange = currentValue - initialValue;
    const percentageChange = initialValue === 0 ? 0 : (valueChange / initialValue) * 100;

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mx-auto bg-white shadow-lg">
                <CardContent className="p-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h1 className="text-3xl font-bold mb-4">Your Portfolio</h1>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Current Value</div>
                                    <div className="text-2xl font-bold">${currentValue.toFixed(2)}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Total Change</div>
                                    <div className={`text-2xl font-bold ${valueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {valueChange >= 0 ? '+' : ''}{valueChange.toFixed(2)}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Percentage Change</div>
                                    <div className={`text-2xl font-bold ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Portfolio Value Chart */}
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
                            Portfolio Value History
                        </h2>
                        <div className="bg-white p-4 rounded-lg">
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={portfolioData.history}
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
                                            formatter={(value) => [`$${value}`, 'Portfolio Value']}
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px'
                                            }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="value" 
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
                </CardContent>
            </Card>
        </div>
    );
};

export default UserPortfolio;
