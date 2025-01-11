import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input";

const ExplorePage = () => {

    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search bar */}
            <div className="mb-8 space-y-4">
                <h1 className="text-3xl font-bold">Explore Cards</h1>
            
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search any card..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {/* Filter options */}
        </div>
    )
}

export default ExplorePage;