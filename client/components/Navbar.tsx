'use client';

import Link from 'next/link';
import { Loader2, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useLogout } from '@/lib/auth';
import { toast } from 'sonner';

export function Navbar() {
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

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-moroccanRed">
              Fanpocket
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/map"
              className="text-gray-700 hover:text-moroccanRed transition"
            >
              Map
            </Link>
            <Link
              href="/matches"
              className="text-gray-700 hover:text-moroccanRed transition"
            >
              Matches
            </Link>
            <Link
              href="/stadiums"
              className="text-gray-700 hover:text-moroccanRed transition"
            >
              Stadiums
            </Link>
            <Link
              href="/teams"
              className="text-gray-700 hover:text-moroccanRed transition"
            >
              Teams
            </Link>
            <Link
              href="/favorites"
              className="text-gray-700 hover:text-moroccanRed transition"
            >
              Favorites
            </Link>
            
            {/* Auth Section */}
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-moroccanRed transition"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.displayName}</span>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will log you out of your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout} disabled={logout.isPending}>
                        {logout.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Logging out...
                          </>
                        ) : (
                          'Logout'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-moroccanRed transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-moroccanRed text-white px-4 py-2 rounded-md hover:bg-moroccanRed/90 transition"
                >
                  Sign up
                </Link>
              </div>
            )}
            
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
