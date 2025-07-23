import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X, Sparkles, Zap, Star, ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NAV_ITEMS } from "@/lib/constants";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

// 3D Navigation Link Component
const NavLink = ({ href, children, isActive, onClick, dropdownItems, onDropdownStateChange }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (dropdownItems) {
      setActiveDropdown(true);
      onDropdownStateChange?.(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveDropdown(false);
    onDropdownStateChange?.(false);
  };

  const handleDropdownMouseEnter = () => {
    setActiveDropdown(true);
    onDropdownStateChange?.(true);
  };

  const handleDropdownMouseLeave = () => {
    setIsHovered(false);
    setActiveDropdown(false);
    onDropdownStateChange?.(false);
  };

  if (dropdownItems) {
    return (
      <DropdownMenu open={activeDropdown} onOpenChange={setActiveDropdown}>
        <DropdownMenuTrigger asChild>
          <motion.button
            className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive 
                ? 'text-purple-400 bg-purple-400/10' 
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {children}
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-slate-900/95 backdrop-blur-md border-purple-500/20"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          {dropdownItems.map((item: any, index: number) => (
            <DropdownMenuItem key={index} asChild>
              <Link href={item.href}>
                <motion.div
                  className="w-full text-gray-300 hover:text-white cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  {item.name}
                </motion.div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link href={href}>
      <motion.button
        className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          isActive 
            ? 'text-purple-400 bg-purple-400/10' 
            : 'text-gray-300 hover:text-white hover:bg-white/10'
        }`}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.button>
    </Link>
  );
};

// Floating Particles Component
const HeaderParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-purple-400/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default function Header() {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownStateChange = (isActive: boolean) => {
    setIsDropdownActive(isActive);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      setLocation('/');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <HeaderParticles />
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
              >
                <Logo />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  isActive={location === item.href}
                  onClick={() => setLocation(item.href)}
                  dropdownItems={item.dropdownItems}
                  onDropdownStateChange={handleDropdownStateChange}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setLocation('/admin/pro')}
                    className="bg-white/10 border-white/20 text-purple-600 hover:bg-white/20 hover:border-white/30"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={currentUser.photoURL || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-sm font-bold">
                            {getInitials(currentUser.displayName || currentUser.email || 'User')}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex flex-col space-y-1 p-2">
                        <p className="text-sm font-medium leading-none">
                          {currentUser.displayName || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser.email}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setLocation('/admin/pro')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocation('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setLocation('/login')}
                    className="bg-white/10 border-white/20 text-purple-600 hover:bg-white/20 hover:border-white/30"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button
                    onClick={() => setLocation('/login')}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4 mt-8">
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-medium hover:text-purple-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}

                    <div className="pt-4 border-t">
                      {currentUser ? (
                        <>
                          <div className="flex items-center space-x-3 mb-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={currentUser.photoURL || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-sm font-bold">
                                {getInitials(currentUser.displayName || currentUser.email || 'User')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{currentUser.displayName || 'User'}</p>
                              <p className="text-sm text-gray-500">{currentUser.email}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setLocation('/admin/pro');
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full mb-2"
                          >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setLocation('/login');
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full mb-2"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Sign In
                          </Button>
                          <Button
                            onClick={() => {
                              setLocation('/login');
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                          >
                            Get Started
                          </Button>
                        </>
                      )}
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}