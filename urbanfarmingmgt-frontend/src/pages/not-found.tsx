"use client"

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <Leaf className="h-16 w-16 text-primary" />
      <h1 className="mt-6 text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link to="/app/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
