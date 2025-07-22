import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PricingTier {
  id: string;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  limits: {
    resumes: number | string;
    downloads: number | string;
    templates: number | string;
  };
  popular?: boolean;
  buttonText: string;
  buttonColor: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'FREE',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    features: [
      'Basic resume templates',
      'PDF export',
      'Basic customization',
      'Email support'
    ],
    limits: {
      resumes: 3,
      downloads: 5,
      templates: 2
    },
    buttonText: 'Current Plan',
    buttonColor: 'bg-gray-400'
  },
  {
    id: 'BASIC',
    name: 'Basic',
    price: { monthly: 9.99, yearly: 99.99 },
    features: [
      'All Free features',
      'Pro templates access',
      'Multiple export formats (PDF, DOCX)',
      'Priority email support',
      'No watermarks'
    ],
    limits: {
      resumes: 10,
      downloads: 20,
      templates: 5
    },
    buttonText: 'Upgrade to Basic',
    buttonColor: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: { monthly: 19.99, yearly: 199.99 },
    features: [
      'All Basic features',
      'Unlimited resumes & downloads',
      'AI-powered suggestions',
      'All export formats',
      'Custom branding',
      'Priority support',
      'Advanced analytics'
    ],
    limits: {
      resumes: 'Unlimited',
      downloads: 'Unlimited',
      templates: 'Unlimited'
    },
    popular: true,
    buttonText: 'Upgrade to Premium',
    buttonColor: 'bg-purple-600 hover:bg-purple-700'
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: { monthly: 49.99, yearly: 499.99 },
    features: [
      'All Premium features',
      'Team collaboration',
      'Admin dashboard',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'Custom templates'
    ],
    limits: {
      resumes: 'Unlimited',
      downloads: 'Unlimited',
      templates: 'Unlimited'
    },
    buttonText: 'Contact Sales',
    buttonColor: 'bg-gold-600 hover:bg-gold-700'
  }
];

const SubscriptionUpgrade: React.FC = () => {
  const { currentUser, refreshUserData } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const currentTier = currentUser?.currentTier || 'FREE';

  const handleUpgrade = async (tierId: string) => {
    if (tierId === 'FREE' || tierId === currentTier) return;

    setLoading(tierId);

    try {
      if (tierId === 'ENTERPRISE') {
        // For enterprise, redirect to contact sales
        window.location.href = 'mailto:sales@tbzresumebuilder.com?subject=Enterprise Plan Inquiry';
        return;
      }

      // For other tiers, integrate with Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser?.uid,
          priceId: getPriceId(tierId, billingCycle),
          tier: tierId,
          billingCycle
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await import('@stripe/stripe-js').then(m => m.loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!));
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to upgrade subscription. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const getPriceId = (tierId: string, cycle: 'monthly' | 'yearly') => {
    // These would be your actual Stripe price IDs
    const priceIds = {
      BASIC: {
        monthly: 'price_basic_monthly',
        yearly: 'price_basic_yearly'
      },
      PREMIUM: {
        monthly: 'price_premium_monthly',
        yearly: 'price_premium_yearly'
      }
    };

    return priceIds[tierId as keyof typeof priceIds]?.[cycle];
  };

  const getYearlySavings = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 10; // 2 months free
    const monthlySavings = (monthlyPrice * 12 - yearlyPrice) / 12;
    return Math.round(monthlySavings * 100) / 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Unlock powerful features to create professional resumes
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Save 2 months!
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border-2 bg-white p-8 shadow-lg ${
                tier.popular
                  ? 'border-purple-500 ring-2 ring-purple-500'
                  : 'border-gray-200'
              } ${currentTier === tier.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {currentTier === tier.id && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Current
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${billingCycle === 'monthly' ? tier.price.monthly : Math.round(tier.price.yearly / 12 * 100) / 100}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {tier.price.monthly === 0 ? 'forever' : '/month'}
                  </span>
                  {billingCycle === 'yearly' && tier.price.monthly > 0 && (
                    <div className="text-sm text-green-600 mt-1">
                      Save ${getYearlySavings(tier.price.monthly)}/month
                    </div>
                  )}
                </div>

                {/* Usage Limits */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Monthly Limits</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>📄 {tier.limits.resumes} resumes</div>
                    <div>⬇️ {tier.limits.downloads} downloads</div>
                    <div>🎨 {tier.limits.templates} templates</div>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={loading === tier.id || currentTier === tier.id}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    currentTier === tier.id
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : `text-white ${tier.buttonColor}`
                  }`}
                >
                  {loading === tier.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    currentTier === tier.id ? 'Current Plan' : tier.buttonText
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens to my data if I downgrade?
              </h3>
              <p className="text-gray-600">
                Your data is always safe. If you downgrade, you'll retain access to all your created resumes.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is my payment information secure?
              </h3>
              <p className="text-gray-600">
                Absolutely. We use Stripe for secure payment processing and never store your payment details.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Have questions about our plans?
          </p>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpgrade; 