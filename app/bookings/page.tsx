"use client"

import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Calendar, Clock, DollarSign, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getBookings } from "@/lib/bookings-api"
import type { Booking } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function BookingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState("all")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      loadBookings()
    }
  }, [user])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  const filteredBookings = bookings.filter((booking) => {
    if (activeFilter === "all") return true
    return booking.status === activeFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-purple-100 text-purple-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "in-progress":
        return "In Progress"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const loadBookings = async () => {
    if (!user) return

    setIsLoadingBookings(true)
    const { bookings: bookingData, error } = await getBookings(user.id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      })
    } else {
      setBookings(bookingData)
    }

    setIsLoadingBookings(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-4">My Bookings</h1>
          <p className="text-xl text-blue-100">View and manage your service appointments.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900">Your Bookings</h2>
            <Badge variant="secondary">{filteredBookings.length}</Badge>
          </div>
          <Button asChild>
            <Link href="/bookings/new">
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Link>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "confirmed", label: "Confirmed" },
            { key: "in-progress", label: "In Progress" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === filter.key ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {isLoadingBookings ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading bookings...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Car className="h-6 w-6 text-blue-600" />
                      <CardTitle className="text-lg">
                        {booking.vehicle
                          ? `${booking.vehicle.make} ${booking.vehicle.model} (${booking.vehicle.year})`
                          : "Vehicle"}
                      </CardTitle>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Appointment Date:</span>
                      </div>
                      <p className="font-medium">{booking.appointment_date}</p>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Appointment Time:</span>
                      </div>
                      <p className="font-medium">{booking.appointment_time}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="text-gray-600">
                        <span className="text-sm">Services:</span>
                      </div>
                      <div className="space-y-2">
                        {booking.booking_services?.map((bookingService, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{bookingService.service?.name}</span>
                            <span className="text-sm font-medium">${bookingService.price}</span>
                          </div>
                        ))}
                      </div>
                      {booking.notes && (
                        <>
                          <div className="text-gray-600">
                            <span className="text-sm">Notes:</span>
                          </div>
                          <p className="text-sm italic text-gray-600">{booking.notes}</p>
                        </>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm">Total Price:</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">${booking.total_price}</p>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          View Details →
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-4">
              {activeFilter === "all" ? "You haven't made any bookings yet." : `No ${activeFilter} bookings found.`}
            </p>
            <Button asChild>
              <Link href="/bookings/new">Book Your First Service</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
