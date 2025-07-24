import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'wouter';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  ArrowLeft, 
  ShoppingCart as CartIcon,
  User,
  Mail,
  MapPin,
  Phone,
  Building,
  Globe,
  Percent,
  AlertCircle
} from 'lucide-react';
import Logo from '@/components/layout/Logo';

// Cart item interface
interface CartItem {
  id: string;
  packageId: string;
  packageName: string;
  tier: string;
  billingInterval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  price: number;
  originalPrice?: number;
  discountAmount?: number;
  discountDescription?: string;
}

// Billing information interface
interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  company?: string;
}

// Payment method interface
interface PaymentMethod {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    company: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1); // 1: Billing, 2: Payment, 3: Review

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('checkoutCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing cart data:', error);
        setLocation('/package-selection');
      }
    } else {
      setLocation('/package-selection');
    }
  }, [setLocation]);

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + (item.originalPrice || item.price), 0);
  const totalDiscount = cart.reduce((total, item) => total + (item.discountAmount || 0), 0);
  const total = cart.reduce((total, item) => total + item.price, 0);

  // Format price
  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  // Validate billing information
  const validateBillingInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!billingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!billingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!billingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(billingInfo.email)) newErrors.email = 'Email is invalid';
    if (!billingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!billingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!billingInfo.city.trim()) newErrors.city = 'City is required';
    if (!billingInfo.state.trim()) newErrors.state = 'State is required';
    if (!billingInfo.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!billingInfo.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate payment method
  const validatePaymentMethod = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentMethod.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(paymentMethod.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits';

    if (!paymentMethod.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^\d{2}\/\d{2}$/.test(paymentMethod.expiryDate)) newErrors.expiryDate = 'Expiry date must be MM/YY format';

    if (!paymentMethod.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(paymentMethod.cvv)) newErrors.cvv = 'CVV must be 3-4 digits';

    if (!paymentMethod.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1 && validateBillingInfo()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validatePaymentMethod()) {
      setCurrentStep(3);
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle order submission
  const handleSubmitOrder = async () => {
    if (!validateBillingInfo() || !validatePaymentMethod()) {
      return;
    }

    setIsProcessing(true);
    try {
      // Create order data
      const orderData = {
        cart,
        billingInfo,
        paymentMethod,
        totals: {
          subtotal,
          discount: totalDiscount,
          total
        }
      };

      // TODO: Send to backend API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();
        // Clear cart
        localStorage.removeItem('checkoutCart');
        // Redirect to success page
        setLocation(`/order-success/${order.id}`);
      } else {
        throw new Error('Order submission failed');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      setErrors({ submit: 'Order submission failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <CartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some packages to get started</p>
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
              <button
                onClick={() => setLocation('/package-selection')}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Packages
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step <= currentStep 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                        : 'bg-gray-600 text-gray-400'
                    }`}>
                      {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                    </div>
                    <span className={`ml-2 text-sm ${
                      step <= currentStep ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step === 1 ? 'Billing' : step === 2 ? 'Payment' : 'Review'}
                    </span>
                    {step < 3 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        step < currentStep ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Billing Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <User className="h-4 w-4 inline mr-2" />
                        First Name
                      </label>
                      <input
                        type="text"
                        value={billingInfo.firstName}
                        onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="John"
                      />
                      {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <User className="h-4 w-4 inline mr-2" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={billingInfo.lastName}
                        onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={billingInfo.email}
                        onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={billingInfo.phone}
                        onChange={(e) => setBillingInfo({...billingInfo, phone: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Building className="h-4 w-4 inline mr-2" />
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={billingInfo.company}
                        onChange={(e) => setBillingInfo({...billingInfo, company: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your Company"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="h-4 w-4 inline mr-2" />
                        Address
                      </label>
                      <input
                        type="text"
                        value={billingInfo.address}
                        onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="123 Main St"
                      />
                      {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                      <input
                        type="text"
                        value={billingInfo.city}
                        onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="New York"
                      />
                      {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                      <input
                        type="text"
                        value={billingInfo.state}
                        onChange={(e) => setBillingInfo({...billingInfo, state: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="NY"
                      />
                      {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Zip Code</label>
                      <input
                        type="text"
                        value={billingInfo.zipCode}
                        onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="10001"
                      />
                      {errors.zipCode && <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Globe className="h-4 w-4 inline mr-2" />
                        Country
                      </label>
                      <select
                        value={billingInfo.country}
                        onChange={(e) => setBillingInfo({...billingInfo, country: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IT">Italy</option>
                        <option value="ES">Spain</option>
                        <option value="NL">Netherlands</option>
                        <option value="SE">Sweden</option>
                        <option value="NO">Norway</option>
                        <option value="DK">Denmark</option>
                        <option value="FI">Finland</option>
                        <option value="CH">Switzerland</option>
                        <option value="AT">Austria</option>
                        <option value="BE">Belgium</option>
                        <option value="IE">Ireland</option>
                        <option value="PT">Portugal</option>
                        <option value="PL">Poland</option>
                        <option value="CZ">Czech Republic</option>
                        <option value="HU">Hungary</option>
                        <option value="SK">Slovakia</option>
                        <option value="SI">Slovenia</option>
                        <option value="HR">Croatia</option>
                        <option value="BG">Bulgaria</option>
                        <option value="RO">Romania</option>
                        <option value="GR">Greece</option>
                        <option value="CY">Cyprus</option>
                        <option value="MT">Malta</option>
                        <option value="LU">Luxembourg</option>
                        <option value="LV">Latvia</option>
                        <option value="LT">Lithuania</option>
                        <option value="EE">Estonia</option>
                      </select>
                      {errors.country && <p className="text-red-400 text-sm mt-1">{errors.country}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Payment Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <CreditCard className="h-4 w-4 inline mr-2" />
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={paymentMethod.cardNumber}
                        onChange={(e) => setPaymentMethod({...paymentMethod, cardNumber: formatCardNumber(e.target.value)})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.cardNumber && <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={paymentMethod.expiryDate}
                          onChange={(e) => setPaymentMethod({...paymentMethod, expiryDate: formatExpiryDate(e.target.value)})}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiryDate && <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                        <input
                          type="text"
                          value={paymentMethod.cvv}
                          onChange={(e) => setPaymentMethod({...paymentMethod, cvv: e.target.value.replace(/\D/g, '')})}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cvv && <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={paymentMethod.cardholderName}
                        onChange={(e) => setPaymentMethod({...paymentMethod, cardholderName: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="John Doe"
                      />
                      {errors.cardholderName && <p className="text-red-400 text-sm mt-1">{errors.cardholderName}</p>}
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm font-medium">Secure Payment</span>
                    </div>
                    <p className="text-sm text-blue-300 mt-1">
                      Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Review Your Order</h2>

                  {/* Billing Information Review */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Billing Information</h3>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-gray-300">
                        {billingInfo.firstName} {billingInfo.lastName}
                        {billingInfo.company && <span className="block text-sm">{billingInfo.company}</span>}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {billingInfo.address}<br />
                        {billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}<br />
                        {billingInfo.country}
                      </p>
                      <p className="text-gray-300 text-sm mt-2">
                        {billingInfo.email}<br />
                        {billingInfo.phone}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method Review */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Payment Method</h3>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-300">
                          **** **** **** {paymentMethod.cardNumber.slice(-4)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">
                        Expires {paymentMethod.expiryDate}
                      </p>
                    </div>
                  </div>

                  {/* Order Items Review */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-white/5 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-white font-medium">{item.packageName}</h4>
                              <p className="text-gray-400 text-sm">{item.tier} - {item.billingInterval.toLowerCase()}</p>
                              {item.discountDescription && (
                                <p className="text-green-400 text-sm">{item.discountDescription}</p>
                              )}
                            </div>
                            <div className="text-right">
                              {item.originalPrice && item.originalPrice > item.price ? (
                                <div>
                                  <div className="text-sm text-gray-400 line-through">
                                    ${formatPrice(item.originalPrice)}
                                  </div>
                                  <div className="text-white font-semibold">
                                    ${formatPrice(item.price)}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-white font-semibold">
                                  ${formatPrice(item.price)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Error</span>
                      </div>
                      <p className="text-sm text-red-300 mt-1">{errors.submit}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={currentStep === 3 ? handleSubmitOrder : handleNextStep}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : currentStep === 3 ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Complete Order
                    </>
                  ) : (
                    'Next'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CartIcon className="h-5 w-5" />
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{item.packageName}</h4>
                      <p className="text-gray-400 text-xs">{item.tier} - {item.billingInterval.toLowerCase()}</p>
                      {item.discountDescription && (
                        <p className="text-green-400 text-xs">{item.discountDescription}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {item.originalPrice && item.originalPrice > item.price ? (
                        <div>
                          <div className="text-xs text-gray-400 line-through">
                            ${formatPrice(item.originalPrice)}
                          </div>
                          <div className="text-white font-semibold text-sm">
                            ${formatPrice(item.price)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-white font-semibold text-sm">
                          ${formatPrice(item.price)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/20 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>${formatPrice(subtotal)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span className="flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        Discount:
                      </span>
                      <span>-${formatPrice(totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold text-lg border-t border-white/20 pt-2">
                    <span>Total:</span>
                    <span>${formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">30-Day Money Back Guarantee</span>
                </div>
                <p className="text-sm text-green-300 mt-1">
                  Not satisfied? Get a full refund within 30 days of purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}