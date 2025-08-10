import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/services/AuthContext';
import { Avatar, AvatarFallback } from '../shared/ui/avatar';
import { User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../shared/ui/dropdown-menu';

function getInitials(name?: string, email?: string): string {
  const source = name?.trim() || email || 'U';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0][0]?.toUpperCase() || 'U';
}

const UserProfileMenu: React.FC<{ className?: string }> = ({ className }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  const initials = getInitials(fullName, user?.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center justify-center h-9 w-9 bg-white/90 backdrop-blur-sm rounded-full border shadow-sm hover:shadow transition ${className || ''}`}
          aria-label="Open profile menu"
        >
          <UserIcon className="h-5 w-5 text-gray-800" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{fullName || 'User'}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>Dashboard</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/')}>Home</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;

