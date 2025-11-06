'use client';

import { Loader2, LogOut, User, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLogout } from '@/lib/auth';
import { toast } from 'sonner';

export function ProfileContent() {
  const { user, isLoading } = useAuth();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast.success('Logged out successfully');
      window.location.href = '/';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      toast.error(errorMessage);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
            <CardDescription>
              Your personal account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                Display Name
              </div>
              <p className="font-medium">{user.displayName}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                Email Address
              </div>
              <p className="font-medium">{user.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                User
              </div>
              <p className="font-medium">@{user.username}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                Member Since
              </div>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Language</div>
              <p className="font-medium capitalize">{user.locale}</p>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">Favorite Teams</div>
              <p className="font-medium">
                {user.favoriteTeams.length > 0 
                  ? `${user.favoriteTeams.length} teams` 
                  : 'No favorite teams yet'
                }
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">Favorite Stadiums</div>
              <p className="font-medium">
                {user.favoriteStadiums.length > 0 
                  ? `${user.favoriteStadiums.length} stadiums` 
                  : 'No favorite stadiums yet'
                }
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">Match Reminders</div>
              <p className="font-medium">
                {user.notificationPreferences.matchReminders ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Manage your account session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            disabled={logout.isPending}
            className="flex items-center gap-2"
          >
            {logout.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Logout
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}