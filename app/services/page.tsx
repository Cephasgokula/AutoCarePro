"use client"

import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Clock, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getServices } from "@/lib/mock-services-api"
import type { Service } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function ServicesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast() // Move this inside the component
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [services, setServices] = useState<Service[]>([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    loadServices()
  }, [])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === "all" || service.category === activeFilter
    return matchesSearch && matchesFilter
  })

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "basic":
        return "Basic"
      case "advanced":
        return "Advanced"
      case "accident":
        return "Accident Repairs"
      default:
        return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basic":
        return "bg-blue-100 text-blue-800"
      case "advanced":
        return "bg-purple-100 text-purple-800"
      case "accident":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const loadServices = async () => {
    setIsLoadingServices(true)
    const { services: serviceData, error } = await getServices()

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      })
    } else {
      setServices(serviceData)
    }

    setIsLoadingServices(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-blue-100">
            Browse our comprehensive range of automotive services designed to keep your vehicle in optimal condition.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">Filter by:</span>
            <div className="flex space-x-1">
              {[
                { key: "all", label: "All" },
                { key: "basic", label: "Basic Services" },
                { key: "advanced", label: "Advanced Services" },
                { key: "accident", label: "Accident Repairs" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter.key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {isLoadingServices ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setActiveFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge className={getCategoryColor(service.category)}>{getCategoryLabel(service.category)}</Badge>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Estimated time:</span>
                    </div>
                    <span className="font-medium">{service.duration}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Price:</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">${service.price}</span>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/bookings/new?service=${service.id}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book This Service →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
