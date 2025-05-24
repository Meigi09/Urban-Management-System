"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  ArrowRight, 
  Leaf, 
  Sprout, 
  Users, 
  BarChart3, 
  Shield, 
  Zap,
  CheckCircle,
  Star,
  Play,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

const features = [
  {
    icon: <Sprout className="h-8 w-8" />,
    title: "Smart Crop Management",
    description: "Track your crops from seed to harvest with AI-powered insights and predictions."
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Team Coordination",
    description: "Manage staff, volunteers, and tasks efficiently across multiple farm locations."
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Analytics & Reports",
    description: "Get detailed insights into your farm's performance and sustainability metrics."
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with role-based access control and data protection."
  }
]

const stats = [
  { number: "500+", label: "Urban Farms" },
  { number: "10K+", label: "Crops Tracked" },
  { number: "95%", label: "Efficiency Gain" },
  { number: "24/7", label: "Support" }
]

const testimonials = [
  {
    name: "Marie Uwimana",
    role: "Farm Manager, Kigali Urban Farms",
    content: "This system transformed how we manage our urban farming operations. The AI predictions helped us increase our yield by 40%!",
    rating: 5
  },
  {
    name: "Jean Baptiste",
    role: "Agricultural Coordinator",
    content: "The staff management and task coordination features are incredible. We can now manage 5 farms with the same team size.",
    rating: 5
  },
  {
    name: "Grace Mukamana",
    role: "Sustainability Officer",
    content: "The environmental tracking and sustainability metrics help us maintain our green certification and reduce waste.",
    rating: 5
  }
]

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Urban Farm Pro
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge variant="secondary" className="mb-6 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered Urban Farming
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent leading-tight">
            Grow Smarter,
            <br />
            Farm Better
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your urban farming operations with our comprehensive management system. 
            Track crops, manage teams, and optimize yields with AI-powered insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={scrollToFeatures}>
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          <div className="animate-bounce">
            <ChevronDown className="h-6 w-6 mx-auto text-gray-400" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools you need to manage and grow your urban farming business.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Loved by Farmers Across Rwanda
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              See what our users have to say about transforming their farming operations.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-xl text-white mb-6 italic">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div className="text-green-100">
                    <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-white' : 'bg-white/30'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of farmers who are already using Urban Farm Pro to increase their yields and streamline operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg px-8 py-6">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Sign In to Your Account
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">Urban Farm Pro</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © 2024 Urban Farm Pro. Built with ❤️ for sustainable agriculture in Rwanda.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
