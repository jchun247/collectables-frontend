import { useState, useEffect } from 'react'
import { useParams, useLocation, Navigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, /*CardDescription*/ } from "@/components/ui/card"
import { Settings, Trash2, Star, CalendarDays, ListOrdered, /*LineChartIcon,*/ Info, Globe } from "lucide-react"
import RenderCard from "@/components/RenderCard"
// import { ChartContainer } from "@/components/ui/chart"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export default function UserPortfolioDetails() {
  const { portfolioId } = useParams()
  const location = useLocation()
  const collection = location.state?.collection

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [portfolioItems, setPortfolioItems] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`${apiBaseUrl}/collections/${portfolioId}/cards`)
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio items')
        }
        const data = await response.json()
        setPortfolioItems(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolioItems()
  }, [portfolioId, apiBaseUrl])

  if (!collection) {
    return <Navigate to="/collections" replace />
  }

    // Mock data for the chart
  // const chartData = [
  //   { date: '2025-01', value: 1000 },
  //   { date: '2025-02', value: 1200 },
  //   { date: '2025-03', value: 1100 },
  //   { date: '2025-04', value: 1400 },
  //   { date: '2025-05', value: 1600 }
  // ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // const chartConfig = {
  //   value: {
  //     label: "Portfolio Value",
  //     theme: {
  //       light: "#8884d8",
  //       dark: "#8884d8"
  //     }
  //   }
  // }

  // return (
  //     {/* Portfolio Chart Section */}
  //     <Card className="p-6">
  //       <h2 className="text-xl font-semibold mb-4">Portfolio Value History</h2>
  //       <div className="h-[300px]">
  //         <ChartContainer config={chartConfig}>
  //           <LineChart data={chartData}>
  //             <CartesianGrid strokeDasharray="3 3" />
  //             <XAxis dataKey="date" />
  //             <YAxis />
  //             <Tooltip />
  //             <Line 
  //               type="monotone" 
  //               dataKey="value" 
  //               strokeWidth={2}
  //               dot={false}
  //             />
  //           </LineChart>
  //         </ChartContainer>
  //       </div>
  //     </Card>

  return (
  <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">
      {/* Portfolio Header Section */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">{collection.name}</h1>
              {collection.favourite && (
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" aria-label="Favorite" />
              )}
            </div>
            {collection.description && (
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                {collection.description}
              </p>
            )}
          </div>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Portfolio Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Portfolio Settings</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" defaultValue={collection.name} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input id="description" defaultValue={collection.description} className="col-span-3" />
                </div>
                <div className="flex items-center space-x-2 justify-end col-span-4">
                  <input type="checkbox" id="visibility" defaultChecked={collection.public} className="form-checkbox h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"/>
                  <Label htmlFor="visibility" className="text-sm font-medium">Public Portfolio</Label>
                </div>
                 <div className="flex items-center space-x-2 justify-end col-span-4">
                  <input type="checkbox" id="favourite" defaultChecked={collection.favourite} className="form-checkbox h-4 w-4 text-yellow-500 border-slate-300 rounded focus:ring-yellow-400"/>
                  <Label htmlFor="favourite" className="text-sm font-medium">Mark as Favorite</Label>
                </div>
                <Button variant="destructive" className="w-full mt-4" onClick={() => { /* Implement delete logic */ console.log("Delete portfolio clicked") }}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Portfolio
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Portfolio Details Section */}
      <section aria-labelledby="portfolio-details-heading">
        <h2 id="portfolio-details-heading" className="sr-only">Portfolio Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">Current Value</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {formatCurrency(collection.currentValue)}
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    Total estimated market value
                </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">Number of Cards</CardTitle>
              <ListOrdered className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {isLoading ? (
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                ) : portfolioItems?.totalItems ?? 0}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">Created On</CardTitle>
              <CalendarDays className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{formatDate(collection.createdAt)}</div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Last updated on: {formatDate(collection.updatedAt)}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">Visibility</CardTitle>
              <Globe className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{collection.public ? 'Public' : 'Private'}</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Portfolio Cards Section */}
      <section aria-labelledby="portfolio-items-heading">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <h2 id="portfolio-items-heading" className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                    Cards in Portfolio ({isLoading ? "..." : portfolioItems?.totalItems ?? 0})
                </h2>
            </div>
          {/* Potentially add a button here to "Add New Item" to this portfolio if needed */}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="w-full h-96 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
            <Info className="mx-auto h-12 w-12 text-red-400 dark:text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Error Loading Portfolio Items
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {error}
            </p>
          </div>
        ) : portfolioItems?.items?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {portfolioItems.items.map((item) => (
              <RenderCard
                key={item.id}
                card={item.card}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
            <Info className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              No Items in Portfolio
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              This portfolio is currently empty. Add some items to get started!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
