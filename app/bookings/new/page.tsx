"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Car, ArrowLeft, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { getVehicles } from "@/lib/mock-vehicles-api"
import { getServices } from "@/lib/mock-services-api"
import { createBooking } from "@/lib/mock-bookings-api"
import type { Vehicle, Service } from "@/lib/mock-data"

export default function NewBookingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const [formData, setFormData] = useState({
    vehicleId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user) {
      loadData()
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Pre-select vehicle or service from URL params
    const vehicleId = searchParams.get("vehicle")
    const serviceId = searchParams.get("service")

    if (vehicleId) {
      setFormData((prev) => ({ ...prev, vehicleId }))
    }

    if (serviceId) {
      setSelectedServices([serviceId])
    }
  }, [searchParams])

  const loadData = async () => {
    if (!user) return

    setIsLoadingData(true)

    try {
      const [vehiclesResult, servicesResult] = await Promise.all([getVehicles(user.id), getServices()])

      if (vehiclesResult.error) {
        toast({
          title: "Error",
          description: "Failed to load vehicles",
          variant: "destructive",
        })
      } else {
        setVehicles(vehiclesResult.vehicles)
      }

      if (servicesResult.error) {
        toast({
          title: "Error",
          description: "Failed to load services",
          variant: "destructive",
        })
      } else {
        setServices(servicesResult.services)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (selectedServices.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one service",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { booking, error } = await createBooking(
        user.id,
        formData.vehicleId,
        formData.appointmentDate,
        formData.appointmentTime,
        selectedServices,
        formData.notes || undefined,
      )

      if (booking) {
        toast({
          title: "Booking created",
          description: "Your service appointment has been scheduled successfully.",
        })
        router.push("/bookings")
      } else {
        toast({
          title: "Booking failed",
          description: error || "Failed to create booking",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push(time)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()
  const totalPrice = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/bookings" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Book New Service</h1>
          <p className="text-gray-600 mt-2">Schedule a service appointment for your vehicle</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Vehicle Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Car className="h-5 w-5" />
                    <span>Select Vehicle</span>
                  </CardTitle>
                  <CardDescription>Choose which vehicle needs service</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.vehicleId}
                    onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.license_plate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {vehicles.length === 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      No vehicles found.{" "}
                      <Link href="/vehicles/add" className="text-blue-600 hover:underline">
                        Add a vehicle
                      </Link>{" "}
                      first.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Date and Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Appointment Details</span>
                  </CardTitle>
                  <CardDescription>Choose your preferred date and time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={formData.appointmentDate}
                        onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time *</Label>
                      <Select
                        value={formData.appointmentTime}
                        onValueChange={(value) => setFormData({ ...formData, appointmentTime: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Services</CardTitle>
                  <CardDescription>Choose the services you need</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <Checkbox
                          id={service.id}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                        />
                        <div className="flex-1">
                          <label htmlFor={service.id} className="cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{service.name}</h4>
                              <span className="font-bold text-blue-600">${service.price}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{service.duration}</span>
                              </div>
                              <span className="capitalize">{service.category}</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                  <CardDescription>Any special instructions or requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="e.g., Please check tire pressure, vehicle makes unusual noise when braking..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Booking Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Selected Services:</h4>
                    {selectedServices.length === 0 ? (
                      <p className="text-sm text-gray-500">No services selected</p>
                    ) : (
                      <div className="space-y-1">
                        {selectedServices.map((serviceId) => {
                          const service = services.find((s) => s.id === serviceId)
                          return service ? (
                            <div key={serviceId} className="flex justify-between text-sm">
                              <span>{service.name}</span>
                              <span>${service.price}</span>
                            </div>
                          ) : null
                        })}
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      isSubmitting ||
                      selectedServices.length === 0 ||
                      !formData.vehicleId ||
                      !formData.appointmentDate ||
                      !formData.appointmentTime
                    }
                  >
                    {isSubmitting ? "Creating Booking..." : "Book Appointment"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
