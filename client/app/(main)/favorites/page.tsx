'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Heart, MapPin, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesContent />
    </ProtectedRoute>
  );
}

function FavoritesContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-moroccanRed" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
        <p className="text-gray-600">Your favorite teams and stadiums</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Favorite Teams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Favorite Teams
            </CardTitle>
            <CardDescription>
              Teams you&apos;re following
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user.favoriteTeams.length > 0 ? (
              <div className="space-y-2">
                {user.favoriteTeams.map((teamId, index) => (
                  <div key={teamId} className="p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">Team ID: {teamId}</p>
                    <p className="text-sm text-gray-600">More details coming soon...</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No favorite teams yet</p>
                <p className="text-sm">Browse teams and add them to your favorites</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorite Stadiums */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Favorite Stadiums
            </CardTitle>
            <CardDescription>
              Stadiums you want to visit
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user.favoriteStadiums.length > 0 ? (
              <div className="space-y-2">
                {user.favoriteStadiums.map((stadiumId, index) => (
                  <div key={stadiumId} className="p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">Stadium ID: {stadiumId}</p>
                    <p className="text-sm text-gray-600">More details coming soon...</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No favorite stadiums yet</p>
                <p className="text-sm">Explore stadiums and add them to your favorites</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}