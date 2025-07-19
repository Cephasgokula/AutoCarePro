"use client";

import { Car, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-blue-600 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8" />
            <span className="text-xl font-bold">AutoCare Pro</span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/services" className="hover:text-blue-200 font-medium">
                Services
              </Link>
              <Link href="/bookings" className="hover:text-blue-200 font-medium">
                My Bookings
              </Link>
              <Link href="/vehicles" className="hover:text-blue-200 font-medium">
                My Vehicles
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-blue-200">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Button variant="ghost" asChild className="text-white hover:text-blue-200">
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
