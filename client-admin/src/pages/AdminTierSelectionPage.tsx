import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Crown, 
  ArrowRight
} from "lucide-react";

const AdminTierSelectionPage = () => {
  const [_, setLocation] = useLocation();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tiers = [
    {
      id: 'snap',
      name: 'Snap',
      subtitle: 'Basic Management',
      description: 'Essential tools for basic resume template and content management',
      icon: <Zap className="h-8 w-8" />,
      color: 'from-blue-500 to-cyan-500',
      path: '/admin/snap'
    },
    {
      id: 'pro',
      name: 'Pro Suite',
      subtitle: 'Advanced Management',
      description: 'Complete administrative control with advanced features and tools',
      icon: <Crown className="h-8 w-8" />,
      color: 'from-purple-500 to-pink-500',
      path: '/admin/pro',
      badge: 'Premium'
    }
  ];

  const handleTierSelect = (tier: typeof tiers[0]) => {
    console.log('Tier selected:', tier.id, 'Path:', tier.path);
    setSelectedTier(tier.id);
    localStorage.setItem('selectedAdminTier', tier.id);
    console.log('About to navigate to:', tier.path);
    setLocation(tier.path);
    console.log('Navigation called');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Main content */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-4xl w-full mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Choose Your Admin Tier
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the management tier that best fits your administrative needs
            </p>
          </div>

          {/* Tier Selection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {tiers.map((tier) => (
              <Card 
                key={tier.id} 
                className="relative h-full border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg cursor-pointer group"
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                      {tier.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${tier.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {tier.icon}
                  </div>

                  <CardTitle className="text-2xl font-bold">
                    {tier.name}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      {tier.subtitle}
                    </span>
                  </CardTitle>

                  <p className="text-base text-gray-600">
                    {tier.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button
                    className={`w-full py-3 text-base font-medium transition-all duration-300 bg-gradient-to-r ${tier.color} hover:shadow-lg hover:scale-105 text-white`}
                    onClick={() => handleTierSelect(tier)}
                  >
                    Access {tier.name}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTierSelectionPage; 