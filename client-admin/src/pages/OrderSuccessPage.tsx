import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'wouter';
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Receipt, 
  ArrowRight,
  Calendar,
  CreditCard,
  User,
  Package
} from 'lucide-react';
import Logo from '@/components/layout/Logo';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  customerName: string;
  customerEmail: string;
  billingInterval: string;
  subscriptionPackage: {
    name: string;
    tier: string;
  };
  payment: {
    status: string;
    receiptUrl?: string;
  };
  invoice: {
    invoiceNumber: string;
    issuedAt: string;
  };
  createdAt: string;
}

export default function OrderSuccessPage() {
  const [, setLocation] = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get order ID from URL
  const orderId = window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) {
          setError('Order ID not found');
          return;
        }

        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }

        const orderData = await response.json();
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <Link href="/package-selection">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300">
              Browse Packages
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Logo size="medium" />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="text-gray-300 hover:text-white transition-colors">
                  Go to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Thank you for your purchase. Your order has been successfully processed and you'll receive a confirmation email shortly.
          </p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Information */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Package className="h-6 w-6" />
                Order Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Order Number:</span>
                  <span className="text-white font-semibold">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Date:</span>
                  <span className="text-white">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'PROCESSING' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Package:</span>
                  <span className="text-white">{order.subscriptionPackage.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Billing:</span>
                  <span className="text-white capitalize">{order.billingInterval.toLowerCase()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300">Total:</span>
                  <span className="text-white font-bold text-lg">${formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="h-6 w-6" />
                Customer Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Name:</span>
                  <span className="text-white">{order.customerName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Email:</span>
                  <span className="text-white">{order.customerEmail}</span>
                </div>
                {order.invoice && (
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-300">Invoice:</span>
                    <span className="text-white">{order.invoice.invoiceNumber}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300">Payment:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.payment.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                    order.payment.status === 'PROCESSING' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {order.payment.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="grid md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {/* Download Receipt */}
          <motion.a
            href={`/api/orders/${order.id}/receipt`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 hover:text-blue-200 px-6 py-4 rounded-xl transition-all duration-300 hover:from-blue-600/30 hover:to-cyan-600/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Receipt className="h-5 w-5" />
            Download Receipt
          </motion.a>

          {/* Email Confirmation */}
          <motion.button
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 text-purple-300 hover:text-purple-200 px-6 py-4 rounded-xl transition-all duration-300 hover:from-purple-600/30 hover:to-pink-600/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // TODO: Implement resend email functionality
              alert('Confirmation email will be resent shortly');
            }}
          >
            <Mail className="h-5 w-5" />
            Resend Email
          </motion.button>

          {/* Start Building */}
          <motion.button
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-xl transition-all duration-300 font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // Store selected package and redirect to resume builder
              localStorage.setItem('selectedPackage', order.subscriptionPackage.tier.toLowerCase());
              if (order.subscriptionPackage.tier === 'FREE') {
                setLocation('/resume-builder?type=snap');
              } else {
                setLocation('/pro-suite');
              }
            }}
          >
            <ArrowRight className="h-5 w-5" />
            Start Building
          </motion.button>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">What's Next?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Access Activated</h4>
              <p className="text-gray-300 text-sm">
                Your subscription has been activated and you now have access to all features in your plan.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <Download className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Start Creating</h4>
              <p className="text-gray-300 text-sm">
                Begin building your professional resume with our advanced tools and templates.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Get Support</h4>
              <p className="text-gray-300 text-sm">
                Need help? Our support team is here to assist you with any questions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p>
            Questions about your order? Contact us at{' '}
            <a href="mailto:support@tbzresumebuilder.com" className="text-purple-400 hover:text-purple-300">
              support@tbzresumebuilder.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
} 