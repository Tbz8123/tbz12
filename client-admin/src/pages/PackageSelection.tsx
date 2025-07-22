import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useScroll, useSpring } from 'framer-motion';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Logo from '@/components/layout/Logo';
import { 
  Sparkles, 
  Zap, 
  Crown, 
  Shield, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Users,
  Clock,
  DollarSign,
  Target,
  Brain,
  Rocket,
  Percent,
  ShoppingCart as CartIcon,
  Plus,
  Calendar,
  CreditCard
} from 'lucide-react';

// Interface for subscription packages
interface SubscriptionPackage {
  id: string;
  name: string;
  tier: string;
  description: string;
  features: string[];
  monthlyPrice: number;
  yearlyPrice: number;
  discountMonthlyPrice: number | null;
  discountYearlyPrice: number | null;
  discountValidFrom: string | null;
  discountValidUntil: string | null;
  discountDescription: string | null;
  maxResumes: number | null;
  maxDownloads: number | null;
  maxTemplates: number | null;
  hasAIFeatures: boolean;
  hasPrioritySupport: boolean;
  customBranding: boolean;
  teamCollaboration: boolean;
  analyticsAccess: boolean;
  exportFormats: string[];
  isActive: boolean;
  isPopular: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Billing interval type
type BillingInterval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

// Cart item interface
interface CartItem {
  id: string;
  packageId: string;
  packageName: string;
  tier: string;
  billingInterval: BillingInterval;
  price: number;
  originalPrice?: number;
  discountAmount?: number;
  discountDescription?: string;
}

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// 3D Floating Particles Component - Desktop only
const FloatingParticles = () => {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const particles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    let animationId: number;

    const animateParticles = () => {
      if (!particlesRef.current) return;

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
      });

      particlesRef.current.innerHTML = particles
        .map(p => `<div class="absolute rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse" 
                    style="left: ${p.x}px; top: ${p.y}px; width: ${p.size}px; height: ${p.size}px; opacity: ${p.opacity}; 
                    box-shadow: 0 0 ${p.size * 2}px rgba(147, 51, 234, 0.3); will-change: transform; transform: translateZ(0);"></div>`)
        .join('');

      animationId = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return <div ref={particlesRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// 3D Package Card Component
const PackageCard = ({ 
  title, 
  subtitle, 
  description, 
  features, 
  pricing, 
  buttonText, 
  buttonAction, 
  icon, 
  gradient, 
  delay,
  isPopular = false 
}: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          duration: 0.8, 
          delay: delay,
          type: 'spring',
          stiffness: 100,
          damping: 20
        }
      }}
      whileHover={!isMobile ? { 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      } : {}}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
          setIsHovered(false);
        setMousePosition({ x: 50, y: 50 });
      }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20, rotate: -5 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            rotate: 0,
            transition: { delay: delay + 0.5, type: 'spring' }
          }}
          whileHover={{ 
            rotate: [0, -2, 2, 0],
            scale: 1.1,
            transition: { duration: 0.5 }
          }}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg">
            ⭐ Most Popular
          </div>
        </motion.div>
      )}

      {/* Main Card */}
      <motion.div
        className={`relative h-full ${gradient} backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden`}
        style={{
          background: !isMobile ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 50%)` : undefined,
        }}
      >
        {/* Animated Background Orbs */}
        {!isMobile && (
          <>
            <motion.div
              className="absolute w-32 h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl"
              animate={{
                x: isHovered ? [0, 30, -20, 0] : [0, 20, -10, 0],
                y: isHovered ? [0, -20, 30, 0] : [0, -10, 20, 0],
                scale: isHovered ? [1, 1.2, 0.8, 1] : [1, 1.1, 0.9, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ top: '10%', left: '10%' }}
            />
            <motion.div
              className="absolute w-24 h-24 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-xl"
              animate={{
                x: isHovered ? [0, -25, 15, 0] : [0, -15, 10, 0],
                y: isHovered ? [0, 25, -15, 0] : [0, 15, -10, 0],
                scale: isHovered ? [1, 0.8, 1.3, 1] : [1, 0.9, 1.1, 1],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              style={{ bottom: '20%', right: '15%' }}
            />
          </>
        )}

        {/* Magnetic Border Effect */}
        {!isMobile && isHovered && (
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-purple-500/30"
            animate={{
              borderColor: [
                'rgba(147, 51, 234, 0.3)',
                'rgba(59, 130, 246, 0.3)',
                'rgba(147, 51, 234, 0.3)'
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        <div className="relative z-10 p-8">
          {/* Header with Floating Icon */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              className="h-16 w-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm border border-white/30 relative overflow-hidden"
              whileHover={!isMobile ? {
                scale: 1.1,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.6 }
              } : {}}
            >
              {/* Icon Glow Effect */}
              {!isMobile && isHovered && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-2xl"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              <motion.div
                animate={!isMobile && isHovered ? {
                  y: [-2, 2, -2],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
              }}
            >
              {icon}
              </motion.div>
            </motion.div>
            <div>
              <motion.h3 
                className="text-2xl font-bold text-white mb-1"
                animate={!isMobile && isHovered ? {
                  x: [0, 2, -2, 0],
                } : {}}
                transition={{ duration: 0.5 }}
              >
                {title}
              </motion.h3>
              <p className="text-white/80 font-medium">{subtitle}</p>
            </div>
          </div>

          {/* Description with Typewriter Effect */}
          <motion.p 
            className="text-white/90 text-lg mb-6 leading-relaxed"
            animate={!isMobile && isHovered ? {
              scale: [1, 1.02, 1],
            } : {}}
            transition={{ duration: 0.3 }}
          >
            {description}
          </motion.p>

          {/* Features with Staggered Animation */}
          <div className="space-y-3 mb-8">
            {features.map((feature: any, index: number) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 group/feature"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ 
                  opacity: 1,
                  x: 0,
                  transition: { delay: delay + (index * 0.1) }
                }}
                whileHover={!isMobile ? {
                  x: 5,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                } : {}}
              >
                <motion.div 
                  className="flex-shrink-0 mt-1"
                  whileHover={!isMobile ? {
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.5 }
                  } : {}}
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <span className="text-white font-medium">{feature.title}</span>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </div>

                {/* Feature Highlight Line */}
                {!isMobile && (
                  <motion.div
                    className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-400 to-blue-400 rounded-r-full opacity-0 group-hover/feature:opacity-100"
                    initial={{ scaleY: 0 }}
                    whileHover={{ scaleY: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Pricing with Pulse Effect */}
          <motion.div 
            className="mb-6"
            animate={!isMobile && isHovered ? {
              scale: [1, 1.05, 1],
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="text-white/80 text-sm mb-1">Best for: {pricing.bestFor}</div>
            <div className="text-white/80 text-sm mb-1">Time to build: {pricing.time}</div>
            <div className="text-white font-bold text-lg">Pricing: {pricing.cost}</div>
          </motion.div>

          {/* Enhanced Action Button */}
          <motion.button
            className="w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white font-bold py-4 px-6 rounded-2xl border border-white/30 backdrop-blur-sm transition-all duration-300 overflow-hidden relative group/button"
            whileHover={!isMobile ? { 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            } : {}}
            whileTap={{ scale: 0.95 }}
            onClick={buttonAction}
          >
            {/* Button Ripple Effect */}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20"
                animate={isHovered ? {
                  x: [-100, 100],
                  opacity: [0, 0.5, 0],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}

            <motion.span 
              className="relative flex items-center justify-center gap-2"
              animate={!isMobile && isHovered ? {
                x: [0, 2, -2, 0],
              } : {}}
              transition={{ duration: 0.5 }}
            >
              {buttonText}
              <motion.div
                animate={!isMobile && isHovered ? {
                  x: [0, 5, 0],
                  rotate: [0, 15, 0]
                } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
              <ArrowRight className="h-5 w-5" />
              </motion.div>
            </motion.span>
          </motion.button>
        </div>

        {/* Floating Particles */}
        {isHovered && !isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Billing Period Selection Modal
const BillingPeriodModal = ({ 
  isOpen, 
  onClose, 
  package: pkg, 
  onSelect 
}: {
  isOpen: boolean;
  onClose: () => void;
  package: SubscriptionPackage | null;
  onSelect: (interval: BillingInterval) => void;
}) => {
  if (!isOpen || !pkg) return null;

  const billingOptions = [
    { 
      interval: 'DAILY' as BillingInterval, 
      label: 'Daily', 
      icon: <Calendar className="h-5 w-5" />,
      description: 'Perfect for short-term projects'
    },
    { 
      interval: 'WEEKLY' as BillingInterval, 
      label: 'Weekly', 
      icon: <Calendar className="h-5 w-5" />,
      description: 'Great for job search campaigns'
    },
    { 
      interval: 'MONTHLY' as BillingInterval, 
      label: 'Monthly', 
      icon: <Calendar className="h-5 w-5" />,
      description: 'Most popular choice'
    },
    { 
      interval: 'YEARLY' as BillingInterval, 
      label: 'Yearly', 
      icon: <Calendar className="h-5 w-5" />,
      description: 'Best value - save up to 20%'
    }
  ];

  const getPriceForInterval = (interval: BillingInterval) => {
    const now = new Date();
    const hasValidDiscount = pkg.discountValidFrom && pkg.discountValidUntil &&
      new Date(pkg.discountValidFrom) <= now && 
      new Date(pkg.discountValidUntil) >= now;

    switch (interval) {
      case 'DAILY':
        const monthlyPrice = hasValidDiscount && pkg.discountMonthlyPrice ? pkg.discountMonthlyPrice : pkg.monthlyPrice;
        return Math.round(monthlyPrice / 30);
      case 'WEEKLY':
        const monthlyPriceWeekly = hasValidDiscount && pkg.discountMonthlyPrice ? pkg.discountMonthlyPrice : pkg.monthlyPrice;
        return Math.round(monthlyPriceWeekly / 4);
      case 'MONTHLY':
        return hasValidDiscount && pkg.discountMonthlyPrice ? pkg.discountMonthlyPrice : pkg.monthlyPrice;
      case 'YEARLY':
        return hasValidDiscount && pkg.discountYearlyPrice ? pkg.discountYearlyPrice : pkg.yearlyPrice;
      default:
        return pkg.monthlyPrice;
    }
  };

  const getOriginalPrice = (interval: BillingInterval) => {
    switch (interval) {
      case 'DAILY':
        return Math.round(pkg.monthlyPrice / 30);
      case 'WEEKLY':
        return Math.round(pkg.monthlyPrice / 4);
      case 'MONTHLY':
        return pkg.monthlyPrice;
      case 'YEARLY':
        return pkg.yearlyPrice;
      default:
        return pkg.monthlyPrice;
    }
  };

  const hasDiscount = (interval: BillingInterval) => {
    const now = new Date();
    const hasValidDiscount = pkg.discountValidFrom && pkg.discountValidUntil &&
      new Date(pkg.discountValidFrom) <= now && 
      new Date(pkg.discountValidUntil) >= now;

    return hasValidDiscount && (
      (interval === 'MONTHLY' && pkg.discountMonthlyPrice) ||
      (interval === 'YEARLY' && pkg.discountYearlyPrice) ||
      (interval === 'DAILY' && pkg.discountMonthlyPrice) ||
      (interval === 'WEEKLY' && pkg.discountMonthlyPrice)
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Select Billing Period</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">{pkg.name}</h3>
            <p className="text-gray-300">{pkg.description}</p>
          </div>

          <div className="grid gap-4">
            {billingOptions.map((option) => {
              const price = getPriceForInterval(option.interval);
              const originalPrice = getOriginalPrice(option.interval);
              const hasDiscountForInterval = hasDiscount(option.interval);

              return (
                <motion.button
                  key={option.interval}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-lg border border-white/20 hover:border-purple-500/50 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(option.interval)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
                      {option.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {hasDiscountForInterval ? (
                      <div>
                        <div className="text-sm text-gray-400 line-through">
                          ${(originalPrice / 100).toFixed(2)}
                        </div>
                        <div className="text-white font-bold">
                          ${(price / 100).toFixed(2)}
                        </div>
                        <div className="text-xs text-green-400">
                          Save ${((originalPrice - price) / 100).toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-white font-bold">
                        ${(price / 100).toFixed(2)}
                      </div>
                    )}
                    <div className="text-xs text-gray-400">
                      per {option.interval.toLowerCase()}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Shopping Cart Component
const CartModal = ({ 
  isOpen, 
  onClose, 
  cart, 
  onRemove, 
  onCheckout 
}: {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
}) => {
  if (!isOpen) return null;

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);
  const cartOriginalTotal = cart.reduce((total, item) => total + (item.originalPrice || item.price), 0);
  const totalSavings = cartOriginalTotal - cartTotal;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <CartIcon className="h-6 w-6" />
              Shopping Cart ({cart.length})
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <CartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Your cart is empty</p>
              <p className="text-gray-500 text-sm">Add some packages to get started</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-lg border border-white/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{item.packageName}</h3>
                      <p className="text-gray-400 text-sm">{item.tier} - {item.billingInterval.toLowerCase()}</p>
                      {item.discountDescription && (
                        <p className="text-green-400 text-xs">{item.discountDescription}</p>
                      )}
                    </div>
                    <div className="text-right mr-4">
                      {item.originalPrice && item.originalPrice > item.price ? (
                        <div>
                          <div className="text-sm text-gray-400 line-through">
                            ${(item.originalPrice / 100).toFixed(2)}
                          </div>
                          <div className="text-white font-bold">
                            ${(item.price / 100).toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-white font-bold">
                          ${(item.price / 100).toFixed(2)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-white/20 pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>${(cartOriginalTotal / 100).toFixed(2)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Savings:</span>
                      <span>-${(totalSavings / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total:</span>
                    <span>${(cartTotal / 100).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default function PackageSelection() {
  const [, setLocation] = useLocation();
  const { scrollYProgress } = useScroll();
  const springScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const isMobile = useIsMobile();

  // State for billing period selection and cart
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState<BillingInterval>('MONTHLY');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedPackageForBilling, setSelectedPackageForBilling] = useState<SubscriptionPackage | null>(null);

  // Fetch subscription packages from API
  const { data: packages = [], isLoading, error } = useQuery<SubscriptionPackage[]>({
    queryKey: ['/api/admin/subscription-packages'],
    queryFn: async () => {
      const response = await fetch('/api/admin/subscription-packages');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription packages');
      }
      return response.json();
    },
  });

  // Filter active packages and sort by display order
  const activePackages = packages
    .filter(pkg => pkg.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Parallax effects - Reduced on mobile
  const y1 = useTransform(springScrollY, [0, 1], [0, isMobile ? -25 : -100]);
  const y2 = useTransform(springScrollY, [0, 1], [0, isMobile ? -12 : -50]);

  // Helper function to format price
  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  // Helper function to get price based on billing interval
  const getPriceForInterval = (pkg: SubscriptionPackage, interval: BillingInterval) => {
    const now = new Date();
    const hasValidDiscount = pkg.discountValidFrom && pkg.discountValidUntil &&
      new Date(pkg.discountValidFrom) <= now && 
      new Date(pkg.discountValidUntil) >= now;

    switch (interval) {
      case 'DAILY':
        // Calculate daily price from monthly (assuming 30 days per month)
        const monthlyPrice = hasValidDiscount && pkg.discountMonthlyPrice ? pkg.discountMonthlyPrice : pkg.monthlyPrice;
        return Math.round(monthlyPrice / 30);
      case 'WEEKLY':
        // Calculate weekly price from monthly (assuming 4 weeks per month)
        const monthlyPriceWeekly = hasValidDiscount && pkg.discountMonthlyPrice ? pkg.discountMonthlyPrice : pkg.monthlyPrice;
        return Math.round(monthlyPriceWeekly / 4);
      case 'MONTHLY':
        return hasValidDiscount && pkg.discountMonthlyPrice ? pkg.discountMonthlyPrice : pkg.monthlyPrice;
      case 'YEARLY':
        return hasValidDiscount && pkg.discountYearlyPrice ? pkg.discountYearlyPrice : pkg.yearlyPrice;
      default:
        return pkg.monthlyPrice;
    }
  };

  // Helper function to get original price for discount display
  const getOriginalPriceForInterval = (pkg: SubscriptionPackage, interval: BillingInterval) => {
    switch (interval) {
      case 'DAILY':
        return Math.round(pkg.monthlyPrice / 30);
      case 'WEEKLY':
        return Math.round(pkg.monthlyPrice / 4);
      case 'MONTHLY':
        return pkg.monthlyPrice;
      case 'YEARLY':
        return pkg.yearlyPrice;
      default:
        return pkg.monthlyPrice;
    }
  };

  // Helper function to check if package has active discount
  const hasActiveDiscount = (pkg: SubscriptionPackage) => {
    const now = new Date();
    return pkg.discountValidFrom && pkg.discountValidUntil &&
      new Date(pkg.discountValidFrom) <= now && 
      new Date(pkg.discountValidUntil) >= now &&
      (pkg.discountMonthlyPrice || pkg.discountYearlyPrice);
  };

  // Add item to cart
  const addToCart = (pkg: SubscriptionPackage, billingInterval: BillingInterval) => {
    const price = getPriceForInterval(pkg, billingInterval);
    const originalPrice = getOriginalPriceForInterval(pkg, billingInterval);
    const hasDiscount = hasActiveDiscount(pkg);

    const cartItem: CartItem = {
      id: `${pkg.id}-${billingInterval}`,
      packageId: pkg.id,
      packageName: pkg.name,
      tier: pkg.tier,
      billingInterval,
      price,
      originalPrice: hasDiscount ? originalPrice : undefined,
      discountAmount: hasDiscount ? originalPrice - price : undefined,
      discountDescription: hasDiscount ? pkg.discountDescription || undefined : undefined,
    };

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === cartItem.id);
      if (existingItemIndex >= 0) {
        // Item already exists, don't add duplicate
        return prevCart;
      }
      return [...prevCart, cartItem];
    });

    setShowCart(true);
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.price, 0);
  const cartOriginalTotal = cart.reduce((total, item) => total + (item.originalPrice || item.price), 0);
  const totalSavings = cartOriginalTotal - cartTotal;

  // Handle package selection for billing period
  const handlePackageSelect = (pkg: SubscriptionPackage) => {
    if (pkg.tier === 'FREE') {
      // Free packages don't need billing period selection
      localStorage.setItem('selectedPackage', pkg.tier.toLowerCase());
      setLocation('/resume-builder?type=snap');
    } else {
      // Show billing period selection for paid packages
      setSelectedPackageForBilling(pkg);
    }
  };

  // Handle billing period selection and add to cart
  const handleBillingPeriodSelect = (interval: BillingInterval) => {
    if (selectedPackageForBilling) {
      addToCart(selectedPackageForBilling, interval);
      setSelectedPackageForBilling(null);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Store cart data in localStorage for checkout page
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    setLocation('/checkout');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading packages...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Failed to load packages</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Floating Particles Background - Desktop only */}
      {!isMobile && <FloatingParticles />}

      {/* Animated Grid Background - Simplified on mobile */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:50px_50px] ${isMobile ? '' : 'animate-pulse'}`} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <motion.section
          className="pt-32 pb-20 px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.6 : 0.8 }}
          style={{ y: isMobile ? 0 : y1 }}
        >
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0, rotate: isMobile ? 0 : -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: isMobile ? 150 : 200 }}
            >
              <Link href="/">
                <div className="relative cursor-pointer">
                  <Logo size="large" />
                  {!isMobile && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-xl"
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  )}
                </div>
              </Link>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-6xl font-extrabold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: isMobile ? 0.6 : 0.8 }}
              style={!isMobile ? {
                background: 'linear-gradient(-45deg, #ffffff, #a855f7, #3b82f6, #ffffff)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              } : {}}
            >
              Choose Your Resume Package
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: isMobile ? 0.6 : 0.8 }}
            >
              Select the option that best fits your needs. Experience a premium, seamless journey to your dream career.
            </motion.p>

            {/* Cart Button */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: isMobile ? 0.6 : 0.8 }}
            >
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-300 flex items-center gap-2"
              >
                <CartIcon className="h-5 w-5" />
                <span>Cart ({cart.length})</span>
                {cart.length > 0 && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {cart.length}
                  </motion.div>
                )}
              </button>
            </motion.div>
          </div>
        </motion.section>

        {/* Package Cards Section */}
        <motion.section
          className="py-20 px-4"
          style={{ y: y2 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activePackages.map((pkg, index) => {
                const hasDiscount = hasActiveDiscount(pkg);
                const monthlyPrice = getPriceForInterval(pkg, 'MONTHLY');
                const yearlyPrice = getPriceForInterval(pkg, 'YEARLY');
                const originalMonthlyPrice = getOriginalPriceForInterval(pkg, 'MONTHLY');
                const originalYearlyPrice = getOriginalPriceForInterval(pkg, 'YEARLY');

                // Create features array from package data
                const features = pkg.features.map((feature, idx) => ({
                  icon: <CheckCircle className="h-5 w-5 text-green-400" />,
                  title: feature,
                  description: ""
                }));

                // Add special features based on package capabilities
                if (pkg.hasAIFeatures) {
                  features.push({
                    icon: <Brain className="h-5 w-5 text-blue-400" />,
                    title: "AI-Powered Features",
                    description: "Smart content suggestions and optimization"
                  });
                }

                if (pkg.hasPrioritySupport) {
                  features.push({
                    icon: <Shield className="h-5 w-5 text-purple-400" />,
                    title: "Priority Support",
                    description: "Get help when you need it most"
                  });
                }

                if (pkg.customBranding) {
                  features.push({
                    icon: <Crown className="h-5 w-5 text-gold-400" />,
                    title: "Custom Branding",
                    description: "Personalize your resume experience"
                  });
                }

                // Determine pricing text
                let pricingText: any = "Free";
                if (monthlyPrice && monthlyPrice > 0) {
                  const monthlyDisplay = formatPrice(monthlyPrice);
                  const yearlyDisplay = formatPrice(yearlyPrice || 0);

                  if (hasDiscount) {
                    const originalMonthlyDisplay = formatPrice(originalMonthlyPrice);
                    const originalYearlyDisplay = formatPrice(originalYearlyPrice);
                    pricingText = (
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="line-through text-gray-400">${originalMonthlyDisplay}/month</span>
                          <span className="text-green-400 font-bold">${monthlyDisplay}/month</span>
                        </div>
                        {pkg.discountDescription && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Percent className="h-3 w-3 text-green-400" />
                            <span className="text-sm text-green-400">{pkg.discountDescription}</span>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    pricingText = `$${monthlyDisplay}/month${yearlyDisplay ? ` or $${yearlyDisplay}/year` : ''}`;
                  }
                }

                // Determine icon and gradient based on tier
                let icon = <Zap className="h-8 w-8 text-green-400" />;
                let gradient = "bg-gradient-to-br from-green-600/20 to-emerald-600/20";

                if (pkg.tier === 'BASIC') {
                  icon = <Target className="h-8 w-8 text-blue-400" />;
                  gradient = "bg-gradient-to-br from-blue-600/20 to-cyan-600/20";
                } else if (pkg.tier === 'PREMIUM') {
                  icon = <Crown className="h-8 w-8 text-purple-400" />;
                  gradient = "bg-gradient-to-br from-purple-600/20 to-pink-600/20";
                } else if (pkg.tier === 'ENTERPRISE') {
                  icon = <Shield className="h-8 w-8 text-gold-400" />;
                  gradient = "bg-gradient-to-br from-yellow-600/20 to-orange-600/20";
                }

                return (
                  <PackageCard
                    key={pkg.id}
                    title={pkg.name}
                    subtitle={pkg.tier === 'FREE' ? '(Free)' : ''}
                    description={pkg.description || ''}
                    features={features}
                    pricing={{
                      bestFor: pkg.tier === 'FREE' ? "Students, freelancers, entry-level" : 
                               pkg.tier === 'BASIC' ? "Job seekers, professionals" :
                               pkg.tier === 'PREMIUM' ? "Senior professionals, career switchers" :
                               "Teams and organizations",
                      time: pkg.tier === 'FREE' ? "Under 5 minutes" : "10-15 minutes",
                      cost: pricingText
                    }}
                    buttonText={pkg.tier === 'FREE' ? `Start with ${pkg.name} (Free)` : `Upgrade to ${pkg.name}`}
                    buttonAction={() => handlePackageSelect(pkg)}
                    icon={icon}
                    gradient={gradient}
                    delay={0.2 + (index * 0.2)}
                    isPopular={pkg.isPopular}
                  />
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Seamless footer bridge */}
        <div className="h-24 bg-gradient-to-b from-transparent via-slate-800/40 to-slate-800/80"></div>
      </div>

      {/* Modals */}
      <BillingPeriodModal
        isOpen={selectedPackageForBilling !== null}
        onClose={() => setSelectedPackageForBilling(null)}
        package={selectedPackageForBilling}
        onSelect={handleBillingPeriodSelect}
      />

      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
} 