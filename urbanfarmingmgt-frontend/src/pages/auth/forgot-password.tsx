import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Leaf, Mail, CheckCircle, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { emailService } from "@/services/email-service"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { forgotPassword } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // First, call the backend to initiate password reset
      const success = await forgotPassword(email)

      if (success) {
        setIsSubmitted(true)
        toast({
          title: "Reset link sent successfully",
          description: "Check your email for the password reset link. It will expire in 1 hour.",
        })
      } else {
        toast({
          title: "Email not found",
          description: "No account found with this email address",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Password reset error:", error)
      toast({
        title: "Failed to send reset link",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <Leaf className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a password reset link</CardDescription>
        </CardHeader>
        {isSubmitted ? (
          <CardContent className="space-y-4 pt-4">
            <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-green-800 mb-2">Reset Link Sent!</h3>
              <p className="text-sm text-green-700 mb-4">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <div className="bg-white rounded-md p-3 mb-4">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Link expires in 1 hour</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-green-600">
                  Check your spam folder if you don't see the email
                </p>
                <div className="flex gap-2 justify-center">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail("")
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Try Different Email
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
