"use client"

import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Car, Clock, Plus, User, Wrench } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getVehicles } from "@/lib/vehicles-api"
import { getBookings } from "@/lib/bookings-api"
import type { Vehicle, Booking } from "@/lib/supabase"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user) {
      loadDashboardData()
    }
  }, [user, isLoading, router])

  const loadDashboardData = async () => {
    if (!user) return

    setIsLoadingData(true)
    try {
      const [vehiclesResult, bookingsResult] = await Promise.all([getVehicles(user.id), getBookings(user.id)])

      if (!vehiclesResult.error) {
        setVehicles(vehiclesResult.vehicles)
      }

      if (!bookingsResult.error) {
        setBookings(bookingsResult.bookings)
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  if (isLoading || isLoadingData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  const activeBookings = bookings.filter((b) => ["pending", "confirmed", "in-progress"].includes(b.status))
  const completedServices = bookings.filter((b) => b.status === "completed").length
  const upcomingBookings = bookings.filter((b) => b.status === "confirmed" && new Date(b.appointment_date) > new Date())

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-2">Manage your vehicles and service appointments</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.length}</div>
              <p className="text-xs text-muted-foreground">Registered vehicles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBookings.length}</div>
              <p className="text-xs text-muted-foreground">Upcoming appointments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services Used</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedServices}</div>
              <p className="text-xs text-muted-foreground">Total services</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Service</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length > 0 ? "Soon" : "None"}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingBookings.length > 0 ? "Upcoming appointment" : "No scheduled services"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <Button asChild className="h-auto p-4 flex-col">
                  <Link href="/bookings/new">
                    <Plus className="h-6 w-6 mb-2" />
                    Book New Service
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4 flex-col bg-transparent">
                  <Link href="/vehicles/add">
                    <Car className="h-6 w-6 mb-2" />
                    Add Vehicle
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4 flex-col bg-transparent">
                  <Link href="/bookings">
                    <Calendar className="h-6 w-6 mb-2" />
                    View Bookings
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4 flex-col bg-transparent">
                  <Link href="/profile">
                    <User className="h-6 w-6 mb-2" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest service history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center space-x-4">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          booking.status === "completed"
                            ? "bg-green-500"
                            : booking.status === "in-progress"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {booking.booking_services?.[0]?.service?.name || "Service"} - {booking.vehicle?.make}{" "}
                          {booking.vehicle?.model}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.status === "completed" ? "Completed" : "Scheduled"} on {booking.appointment_date}
                        </p>
                      </div>
                      <span className="text-sm text-green-600">${booking.total_price}</span>
                    </div>
                  ))}
                  {bookings.length === 0 && <p className="text-sm text-gray-500">No recent activity</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-gray-600">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-gray-600">{user.phone}</p>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full mt-4 bg-transparent">
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingBookings.slice(0, 2).map((booking) => (
                    <div key={booking.id} className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">{booking.booking_services?.[0]?.service?.name || "Service"}</p>
                      <p className="text-xs text-gray-600">
                        {booking.vehicle?.make} {booking.vehicle?.model} - {booking.appointment_date}{" "}
                        {booking.appointment_time}
                      </p>
                    </div>
                  ))}
                  {upcomingBookings.length === 0 && <p className="text-sm text-gray-500">No upcoming appointments</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
