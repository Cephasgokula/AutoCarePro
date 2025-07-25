"use client"

import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Edit, Plus, Trash2, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getVehicles } from "@/lib/mock-vehicles-api"
import { useToast } from "@/hooks/use-toast"
import type { Vehicle } from "@/lib/mock-vehicles-api"

const VehiclesPage = () => {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      loadVehicles()
    }
  }, [user])

  const loadVehicles = async () => {
    if (!user) return

    setIsLoadingVehicles(true)
    const { vehicles: vehicleData, error } = await getVehicles(user.id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load vehicles",
        variant: "destructive",
      })
    } else {
      setVehicles(vehicleData)
    }

    setIsLoadingVehicles(false)
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-4">My Vehicles</h1>
          <p className="text-xl text-blue-100">Manage your vehicles and book services for them.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Registered Vehicles</h2>
          <Button asChild>
            <Link href="/vehicles/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Link>
          </Button>
        </div>

        {isLoadingVehicles ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading vehicles...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Car className="h-6 w-6 text-blue-600" />
                      <CardTitle className="text-lg">
                        {vehicle.make} {vehicle.model}
                      </CardTitle>
                    </div>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {vehicle.year}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">License Plate:</p>
                    <p className="font-medium">{vehicle.license_plate}</p>
                  </div>

                  {vehicle.color && (
                    <div>
                      <p className="text-sm text-gray-600">Color:</p>
                      <p className="font-medium">{vehicle.color}</p>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/bookings/new?vehicle=${vehicle.id}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Service
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {vehicles.length === 0 && !isLoadingVehicles && (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles registered</h3>
            <p className="text-gray-600 mb-4">Add your first vehicle to start booking services.</p>
            <Button asChild>
              <Link href="/vehicles/add">Add Your First Vehicle</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">AutoCare Pro</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for all automotive service needs. Quality service guaranteed.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/services">Services</Link>
                </li>
                <li>
                  <Link href="/bookings">Book Appointment</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Basic Maintenance</li>
                <li>Advanced Repairs</li>
                <li>Accident Repairs</li>
                <li>Diagnostics</li>
                <li>Detailing</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  📍 123 Auto Service Lane
                  <br />
                  Cartown, CT 12345
                </li>
                <li>📞 (555) 123-4567</li>
                <li>✉️ info@autocarepro.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AutoCare Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default VehiclesPage
