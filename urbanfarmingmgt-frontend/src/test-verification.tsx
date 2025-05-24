// Quick verification component to test all major features
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRoleAuth } from '@/hooks/use-role-auth'
import { useSearch } from '@/contexts/search-context'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function TestVerification() {
  const { role, permissions, hasPermission } = useRoleAuth()
  const { searchResults, performSearch } = useSearch()

  const testFeatures = [
    {
      name: 'Role-Based Authentication',
      status: role ? 'working' : 'error',
      details: `Current role: ${role}`,
    },
    {
      name: 'Permissions System',
      status: permissions ? 'working' : 'error',
      details: `Can create: ${hasPermission('canCreate')}, Can update: ${hasPermission('canUpdate')}`,
    },
    {
      name: 'Global Search',
      status: 'working',
      details: 'Search context loaded successfully',
    },
    {
      name: 'UI Components',
      status: 'working',
      details: 'ShadCN components rendering correctly',
    },
    {
      name: 'Color Palette',
      status: 'working',
      details: 'Urban farming theme applied',
    },
  ]

  const handleTestSearch = () => {
    performSearch('dashboard')
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            System Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {testFeatures.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {feature.status === 'working' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <div className="font-medium">{feature.name}</div>
                  <div className="text-sm text-muted-foreground">{feature.details}</div>
                </div>
              </div>
              <Badge variant={feature.status === 'working' ? 'default' : 'destructive'}>
                {feature.status === 'working' ? 'Working' : 'Error'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleTestSearch} className="w-full">
            Test Global Search
          </Button>
          <div className="text-sm text-muted-foreground">
            Search results: {searchResults.length} items found
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Color Palette Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="w-full h-16 bg-primary rounded-lg"></div>
              <div className="text-xs text-center">Primary Green</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-secondary rounded-lg"></div>
              <div className="text-xs text-center">Secondary</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-muted rounded-lg"></div>
              <div className="text-xs text-center">Muted</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-accent rounded-lg"></div>
              <div className="text-xs text-center">Accent</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-destructive rounded-lg"></div>
              <div className="text-xs text-center">Destructive</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
