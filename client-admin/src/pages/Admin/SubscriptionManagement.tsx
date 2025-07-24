import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Percent, 
  DollarSign,
  Users,
  Calendar,
  Settings,
  Tag,
  TrendingUp
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from '@/components/ui/use-toast';

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
  _count: {
    subscriptions: number;
    discountCodes: number;
  };
}

interface DiscountCode {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  minAmount: number | null;
  maxDiscount: number | null;
  isActive: boolean;
  usageLimit: number | null;
  usageCount: number;
  validFrom: string;
  validUntil: string | null;
  applicableTiers: string[];
  firstTimeOnly: boolean;
  createdAt: string;
  _count: {
    usages: number;
  };
  usages: Array<{
    user: {
      name: string;
      email: string;
    };
    usedAt: string;
  }>;
}

const SubscriptionManagement: React.FC = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'packages' | 'discounts' | 'analytics'>('packages');
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPackageDialog, setShowPackageDialog] = useState(false);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<SubscriptionPackage | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);

  // Package form state
  const [packageForm, setPackageForm] = useState({
    name: '',
    tier: 'FREE',
    description: '',
    features: [''],
    monthlyPrice: '',
    yearlyPrice: '',
    discountMonthlyPrice: '',
    discountYearlyPrice: '',
    discountValidFrom: '',
    discountValidUntil: '',
    discountDescription: '',
    maxResumes: '',
    maxDownloads: '',
    maxTemplates: '',
    hasAIFeatures: false,
    hasPrioritySupport: false,
    customBranding: false,
    teamCollaboration: false,
    analyticsAccess: false,
    exportFormats: ['pdf'],
    isPopular: false,
    displayOrder: '0',
    isActive: true
  });

  // Discount form state
  const [discountForm, setDiscountForm] = useState({
    code: '',
    name: '',
    description: '',
    type: 'PERCENTAGE',
    value: '',
    minAmount: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: '',
    applicableTiers: ['FREE'],
    firstTimeOnly: false,
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [packagesResponse, discountsResponse] = await Promise.all([
        fetch('/api/admin/subscription-packages'),
        fetch('/api/admin/discount-codes')
      ]);

      if (packagesResponse.ok) {
        const packagesData = await packagesResponse.json();
        setPackages(packagesData);
      }

      if (discountsResponse.ok) {
        const discountsData = await discountsResponse.json();
        setDiscountCodes(discountsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPackage 
        ? `/api/admin/subscription-packages/${editingPackage.id}`
        : '/api/admin/subscription-packages';

      const method = editingPackage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...packageForm,
          features: packageForm.features.filter(f => f.trim() !== ''),
          monthlyPrice: parseInt(packageForm.monthlyPrice) * 100, // Convert to cents
          yearlyPrice: parseInt(packageForm.yearlyPrice) * 100, // Convert to cents
          maxResumes: packageForm.maxResumes ? parseInt(packageForm.maxResumes) : null,
          maxDownloads: packageForm.maxDownloads ? parseInt(packageForm.maxDownloads) : null,
          maxTemplates: packageForm.maxTemplates ? parseInt(packageForm.maxTemplates) : null,
          displayOrder: parseInt(packageForm.displayOrder)
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Package ${editingPackage ? 'updated' : 'created'} successfully`,
        });
        setShowPackageDialog(false);
        setEditingPackage(null);
        resetPackageForm();
        loadData();
      } else {
        throw new Error('Failed to save package');
      }
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: "Error",
        description: "Failed to save package",
        variant: "destructive",
      });
    }
  };

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingDiscount 
        ? `/api/admin/discount-codes/${editingDiscount.id}`
        : '/api/admin/discount-codes';

      const method = editingDiscount ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...discountForm,
          value: discountForm.type === 'PERCENTAGE' 
            ? parseInt(discountForm.value) 
            : parseInt(discountForm.value) * 100, // Convert to cents for fixed amount
          minAmount: discountForm.minAmount ? parseInt(discountForm.minAmount) * 100 : null,
          maxDiscount: discountForm.maxDiscount ? parseInt(discountForm.maxDiscount) * 100 : null,
          usageLimit: discountForm.usageLimit ? parseInt(discountForm.usageLimit) : null
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Discount code ${editingDiscount ? 'updated' : 'created'} successfully`,
        });
        setShowDiscountDialog(false);
        setEditingDiscount(null);
        resetDiscountForm();
        loadData();
      } else {
        throw new Error('Failed to save discount code');
      }
    } catch (error) {
      console.error('Error saving discount code:', error);
      toast({
        title: "Error",
        description: "Failed to save discount code",
        variant: "destructive",
      });
    }
  };

  const deletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const response = await fetch(`/api/admin/subscription-packages/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Package deleted successfully",
        });
        loadData();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  const deleteDiscountCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount code?')) return;

    try {
      const response = await fetch(`/api/admin/discount-codes/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Discount code deleted successfully",
        });
        loadData();
      } else {
        throw new Error('Failed to delete discount code');
      }
    } catch (error) {
      console.error('Error deleting discount code:', error);
      toast({
        title: "Error",
        description: "Failed to delete discount code",
        variant: "destructive",
      });
    }
  };

  const editPackage = (pkg: SubscriptionPackage) => {
    setEditingPackage(pkg);
    setPackageForm({
      name: pkg.name,
      tier: pkg.tier,
      description: pkg.description || '',
      features: pkg.features.length > 0 ? pkg.features : [''],
      monthlyPrice: (pkg.monthlyPrice / 100).toString(),
      yearlyPrice: (pkg.yearlyPrice / 100).toString(),
      discountMonthlyPrice: pkg.discountMonthlyPrice ? (pkg.discountMonthlyPrice / 100).toString() : '',
      discountYearlyPrice: pkg.discountYearlyPrice ? (pkg.discountYearlyPrice / 100).toString() : '',
      discountValidFrom: pkg.discountValidFrom ? new Date(pkg.discountValidFrom).toISOString().slice(0, 16) : '',
      discountValidUntil: pkg.discountValidUntil ? new Date(pkg.discountValidUntil).toISOString().slice(0, 16) : '',
      discountDescription: pkg.discountDescription || '',
      maxResumes: pkg.maxResumes?.toString() || '',
      maxDownloads: pkg.maxDownloads?.toString() || '',
      maxTemplates: pkg.maxTemplates?.toString() || '',
      hasAIFeatures: pkg.hasAIFeatures,
      hasPrioritySupport: pkg.hasPrioritySupport,
      customBranding: pkg.customBranding,
      teamCollaboration: pkg.teamCollaboration,
      analyticsAccess: pkg.analyticsAccess,
      exportFormats: pkg.exportFormats,
      isPopular: pkg.isPopular,
      displayOrder: pkg.displayOrder.toString(),
      isActive: pkg.isActive
    });
    setShowPackageDialog(true);
  };

  const editDiscountCode = (discount: DiscountCode) => {
    setEditingDiscount(discount);
    setDiscountForm({
      code: discount.code,
      name: discount.name,
      description: discount.description || '',
      type: discount.type,
      value: discount.type === 'PERCENTAGE' 
        ? discount.value.toString() 
        : (discount.value / 100).toString(),
      minAmount: discount.minAmount ? (discount.minAmount / 100).toString() : '',
      maxDiscount: discount.maxDiscount ? (discount.maxDiscount / 100).toString() : '',
      usageLimit: discount.usageLimit?.toString() || '',
      validFrom: discount.validFrom.split('T')[0],
      validUntil: discount.validUntil ? discount.validUntil.split('T')[0] : '',
      applicableTiers: discount.applicableTiers,
      firstTimeOnly: discount.firstTimeOnly,
      isActive: discount.isActive
    });
    setShowDiscountDialog(true);
  };

  const resetPackageForm = () => {
    setPackageForm({
      name: '',
      tier: 'FREE',
      description: '',
      features: [''],
      monthlyPrice: '',
      yearlyPrice: '',
      discountMonthlyPrice: '',
      discountYearlyPrice: '',
      discountValidFrom: '',
      discountValidUntil: '',
      discountDescription: '',
      maxResumes: '',
      maxDownloads: '',
      maxTemplates: '',
      hasAIFeatures: false,
      hasPrioritySupport: false,
      customBranding: false,
      teamCollaboration: false,
      analyticsAccess: false,
      exportFormats: ['pdf'],
      isPopular: false,
      displayOrder: '0',
      isActive: true
    });
  };

  const resetDiscountForm = () => {
    setDiscountForm({
      code: '',
      name: '',
      description: '',
      type: 'PERCENTAGE',
      value: '',
      minAmount: '',
      maxDiscount: '',
      usageLimit: '',
      validFrom: '',
      validUntil: '',
      applicableTiers: ['FREE'],
      firstTimeOnly: false,
      isActive: true
    });
  };

  const addFeature = () => {
    setPackageForm(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setPackageForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setPackageForm(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'FREE': return 'bg-gray-100 text-gray-800';
      case 'BASIC': return 'bg-blue-100 text-blue-800';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'ENTERPRISE': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setLocation('/admin/pro')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
                <p className="text-gray-600">Manage subscription packages, pricing, and discount codes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="packages" className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Packages
            </TabsTrigger>
            <TabsTrigger value="discounts" className="flex items-center">
              <Percent className="h-4 w-4 mr-2" />
              Discount Codes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Subscription Packages</h2>
              <Dialog open={showPackageDialog} onOpenChange={setShowPackageDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => { resetPackageForm(); setEditingPackage(null); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Package
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPackage ? 'Edit Package' : 'Create New Package'}
                    </DialogTitle>
                    <DialogDescription>
                      Configure subscription package details, pricing, and features.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handlePackageSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Package Name</Label>
                        <Input
                          id="name"
                          value={packageForm.name}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="tier">Tier</Label>
                        <Select value={packageForm.tier} onValueChange={(value) => setPackageForm(prev => ({ ...prev, tier: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FREE">Free</SelectItem>
                            <SelectItem value="BASIC">Basic</SelectItem>
                            <SelectItem value="PREMIUM">Premium</SelectItem>
                            <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={packageForm.description}
                        onChange={(e) => setPackageForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="monthlyPrice">Monthly Price ($)</Label>
                        <Input
                          id="monthlyPrice"
                          type="number"
                          step="0.01"
                          value={packageForm.monthlyPrice}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, monthlyPrice: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="yearlyPrice">Yearly Price ($)</Label>
                        <Input
                          id="yearlyPrice"
                          type="number"
                          step="0.01"
                          value={packageForm.yearlyPrice}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, yearlyPrice: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Percent className="h-4 w-4 text-purple-600" />
                        <Label className="text-sm font-medium">Discount Pricing (Optional)</Label>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="discountMonthlyPrice">Discounted Monthly Price ($)</Label>
                          <Input
                            id="discountMonthlyPrice"
                            type="number"
                            step="0.01"
                            value={packageForm.discountMonthlyPrice || ''}
                            onChange={(e) => setPackageForm(prev => ({ ...prev, discountMonthlyPrice: e.target.value }))}
                            placeholder="Optional discount price"
                          />
                        </div>
                        <div>
                          <Label htmlFor="discountYearlyPrice">Discounted Yearly Price ($)</Label>
                          <Input
                            id="discountYearlyPrice"
                            type="number"
                            step="0.01"
                            value={packageForm.discountYearlyPrice || ''}
                            onChange={(e) => setPackageForm(prev => ({ ...prev, discountYearlyPrice: e.target.value }))}
                            placeholder="Optional discount price"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="discountValidFrom">Discount Valid From</Label>
                          <Input
                            id="discountValidFrom"
                            type="datetime-local"
                            value={packageForm.discountValidFrom || ''}
                            onChange={(e) => setPackageForm(prev => ({ ...prev, discountValidFrom: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="discountValidUntil">Discount Valid Until</Label>
                          <Input
                            id="discountValidUntil"
                            type="datetime-local"
                            value={packageForm.discountValidUntil || ''}
                            onChange={(e) => setPackageForm(prev => ({ ...prev, discountValidUntil: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="discountDescription">Discount Description</Label>
                        <Input
                          id="discountDescription"
                          value={packageForm.discountDescription || ''}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, discountDescription: e.target.value }))}
                          placeholder="e.g., 'Limited Time Offer', 'Holiday Special'"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Features</Label>
                      {packageForm.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder="Enter feature"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFeature(index)}
                            disabled={packageForm.features.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addFeature}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="maxResumes">Max Resumes</Label>
                        <Input
                          id="maxResumes"
                          type="number"
                          value={packageForm.maxResumes}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, maxResumes: e.target.value }))}
                          placeholder="Unlimited"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxDownloads">Max Downloads</Label>
                        <Input
                          id="maxDownloads"
                          type="number"
                          value={packageForm.maxDownloads}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, maxDownloads: e.target.value }))}
                          placeholder="Unlimited"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxTemplates">Max Templates</Label>
                        <Input
                          id="maxTemplates"
                          type="number"
                          value={packageForm.maxTemplates}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, maxTemplates: e.target.value }))}
                          placeholder="Unlimited"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="hasAIFeatures"
                          checked={packageForm.hasAIFeatures}
                          onCheckedChange={(checked) => setPackageForm(prev => ({ ...prev, hasAIFeatures: checked }))}
                        />
                        <Label htmlFor="hasAIFeatures">AI Features</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="hasPrioritySupport"
                          checked={packageForm.hasPrioritySupport}
                          onCheckedChange={(checked) => setPackageForm(prev => ({ ...prev, hasPrioritySupport: checked }))}
                        />
                        <Label htmlFor="hasPrioritySupport">Priority Support</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="customBranding"
                          checked={packageForm.customBranding}
                          onCheckedChange={(checked) => setPackageForm(prev => ({ ...prev, customBranding: checked }))}
                        />
                        <Label htmlFor="customBranding">Custom Branding</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="teamCollaboration"
                          checked={packageForm.teamCollaboration}
                          onCheckedChange={(checked) => setPackageForm(prev => ({ ...prev, teamCollaboration: checked }))}
                        />
                        <Label htmlFor="teamCollaboration">Team Collaboration</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="analyticsAccess"
                          checked={packageForm.analyticsAccess}
                          onCheckedChange={(checked) => setPackageForm(prev => ({ ...prev, analyticsAccess: checked }))}
                        />
                        <Label htmlFor="analyticsAccess">Analytics Access</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isPopular"
                          checked={packageForm.isPopular}
                          onCheckedChange={(checked) => setPackageForm(prev => ({ ...prev, isPopular: checked }))}
                        />
                        <Label htmlFor="isPopular">Popular Badge</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="displayOrder">Display Order</Label>
                        <Input
                          id="displayOrder"
                          type="number"
                          value={packageForm.displayOrder}
                          onChange={(e) => setPackageForm(prev => ({ ...prev, displayOrder: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2 mt-6">
                        <Switch
                          id="isActive"
                          checked={packageForm.isActive}
                          onCheckedChange={(checked) => setPackageForm(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="isActive">Active</Label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setShowPackageDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingPackage ? 'Update Package' : 'Create Package'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Limits</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Subscriptions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div>
                            <div className="font-medium">{pkg.name}</div>
                            <div className="text-sm text-gray-500">{pkg.description}</div>
                          </div>
                          {pkg.isPopular && (
                            <Badge className="bg-yellow-100 text-yellow-800">Popular</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTierColor(pkg.tier)}>
                          {pkg.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>${formatPrice(pkg.monthlyPrice)}/month</div>
                          <div className="text-gray-500">${formatPrice(pkg.yearlyPrice)}/year</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Resumes: {pkg.maxResumes || '∞'}</div>
                          <div>Downloads: {pkg.maxDownloads || '∞'}</div>
                          <div>Templates: {pkg.maxTemplates || '∞'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {pkg.hasAIFeatures && <Badge variant="outline">AI</Badge>}
                          {pkg.hasPrioritySupport && <Badge variant="outline">Priority</Badge>}
                          {pkg.customBranding && <Badge variant="outline">Branding</Badge>}
                          {pkg.teamCollaboration && <Badge variant="outline">Team</Badge>}
                          {pkg.analyticsAccess && <Badge variant="outline">Analytics</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{pkg._count.subscriptions}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editPackage(pkg)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePackage(pkg.id)}
                            disabled={pkg._count.subscriptions > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="discounts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Discount Codes</h2>
              <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => { resetDiscountForm(); setEditingDiscount(null); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Discount Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingDiscount ? 'Edit Discount Code' : 'Create New Discount Code'}
                    </DialogTitle>
                    <DialogDescription>
                      Configure discount code details and restrictions.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleDiscountSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="code">Code</Label>
                        <Input
                          id="code"
                          value={discountForm.code}
                          onChange={(e) => setDiscountForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                          placeholder="SAVE20"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={discountForm.name}
                          onChange={(e) => setDiscountForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="20% Off Sale"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={discountForm.description}
                        onChange={(e) => setDiscountForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Discount Type</Label>
                        <Select value={discountForm.type} onValueChange={(value) => setDiscountForm(prev => ({ ...prev, type: value as any }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                            <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="value">
                          Value {discountForm.type === 'PERCENTAGE' ? '(%)' : '($)'}
                        </Label>
                        <Input
                          id="value"
                          type="number"
                          step={discountForm.type === 'PERCENTAGE' ? '1' : '0.01'}
                          value={discountForm.value}
                          onChange={(e) => setDiscountForm(prev => ({ ...prev, value: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minAmount">Min Amount ($)</Label>
                        <Input
                          id="minAmount"
                          type="number"
                          step="0.01"
                          value={discountForm.minAmount}
                          onChange={(e) => setDiscountForm(prev => ({ ...prev, minAmount: e.target.value }))}
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxDiscount">Max Discount ($)</Label>
                        <Input
                          id="maxDiscount"
                          type="number"
                          step="0.01"
                          value={discountForm.maxDiscount}
                          onChange={(e) => setDiscountForm(prev => ({ ...prev, maxDiscount: e.target.value }))}
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="usageLimit">Usage Limit</Label>
                        <Input
                          id="usageLimit"
                          type="number"
                          value={discountForm.usageLimit}
                          onChange={(e) => setDiscountForm(prev => ({ ...prev, usageLimit: e.target.value }))}
                          placeholder="Unlimited"
                        />
                      </div>
                      <div className="flex items-center space-x-2 mt-6">
                        <Switch
                          id="firstTimeOnly"
                          checked={discountForm.firstTimeOnly}
                          onCheckedChange={(checked) => setDiscountForm(prev => ({ ...prev, firstTimeOnly: checked }))}
                        />
                        <Label htmlFor="firstTimeOnly">First Time Only</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="validFrom">Valid From</Label>
                        <Input
                          id="validFrom"
                          type="date"
                          value={discountForm.validFrom}
                          onChange={(e) => setDiscountForm(prev => ({ ...prev, validFrom: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="validUntil">Valid Until</Label>
                        <Input
                          id="validUntil"
                          type="date"
                          value={discountForm.validUntil}
                          onChange={(e) => setDiscountForm(prev => ({ ...prev, validUntil: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={discountForm.isActive}
                        onCheckedChange={(checked) => setDiscountForm(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setShowDiscountDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingDiscount ? 'Update Code' : 'Create Code'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discountCodes.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{discount.code}</div>
                          <div className="text-sm text-gray-500">{discount.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {discount.type === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {discount.type === 'PERCENTAGE' 
                          ? `${discount.value}%` 
                          : `$${formatPrice(discount.value)}`
                        }
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{discount.usageCount} used</div>
                          {discount.usageLimit && (
                            <div className="text-gray-500">of {discount.usageLimit}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>From: {new Date(discount.validFrom).toLocaleDateString()}</div>
                          {discount.validUntil && (
                            <div>Until: {new Date(discount.validUntil).toLocaleDateString()}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={discount.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {discount.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editDiscountCode(discount)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteDiscountCode(discount.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{packages.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {packages.filter(p => p.isActive).length} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {packages.reduce((sum, pkg) => sum + pkg._count.subscriptions, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all packages
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Discount Codes</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{discountCodes.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {discountCodes.filter(d => d.isActive).length} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Discount Usage</CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {discountCodes.reduce((sum, code) => sum + code.usageCount, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All time usage
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Package Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {packages.map((pkg) => (
                      <div key={pkg.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getTierColor(pkg.tier)}>
                            {pkg.tier}
                          </Badge>
                          <span className="text-sm">{pkg.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{pkg._count.subscriptions}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Discount Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {discountCodes
                      .sort((a, b) => b.usageCount - a.usageCount)
                      .slice(0, 5)
                      .map((discount) => (
                        <div key={discount.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{discount.code}</Badge>
                            <span className="text-sm">{discount.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{discount.usageCount} uses</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SubscriptionManagement;