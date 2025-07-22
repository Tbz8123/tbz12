-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELED', 'PAST_DUE', 'UNPAID', 'TRIALING');

-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL', 'EXECUTIVE');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('CREATE_RESUME', 'DOWNLOAD_RESUME', 'ACCESS_PRO_TEMPLATES', 'UNLIMITED_DOWNLOADS', 'AI_SUGGESTIONS', 'PRIORITY_SUPPORT', 'EXPORT_MULTIPLE_FORMATS', 'CUSTOM_BRANDING', 'TEAM_COLLABORATION', 'ANALYTICS_ACCESS', 'ADMIN_PANEL');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'SUBSCRIPTION', 'FEATURE', 'MARKETING', 'SUPPORT');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE', 'PAYPAL', 'BANK_TRANSFER', 'CREDIT_CARD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firebaseUid" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "profilePicture" TEXT,
    "phoneNumber" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "title" TEXT,
    "company" TEXT,
    "location" TEXT,
    "bio" TEXT,
    "website" TEXT,
    "linkedinUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "currentTier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "subscriptionId" TEXT,
    "customerId" TEXT,
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE',
    "subscriptionEndsAt" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "nationality" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "currentJobTitle" TEXT,
    "currentCompany" TEXT,
    "experienceLevel" "ExperienceLevel",
    "industry" TEXT,
    "skills" JSONB,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
    "defaultTemplate" TEXT,
    "favoriteTemplates" JSONB,
    "autoSave" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "stripePriceId" TEXT,
    "subscriptionPackageId" TEXT,
    "tier" "SubscriptionTier" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "canceledAt" TIMESTAMP(3),
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "interval" "BillingInterval" NOT NULL,
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resumesCreated" INTEGER NOT NULL DEFAULT 0,
    "resumesDownloaded" INTEGER NOT NULL DEFAULT 0,
    "templatesUsed" INTEGER NOT NULL DEFAULT 0,
    "monthlyResumes" INTEGER NOT NULL DEFAULT 0,
    "monthlyDownloads" INTEGER NOT NULL DEFAULT 0,
    "monthlyTemplateAccess" INTEGER NOT NULL DEFAULT 0,
    "lastMonthlyReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aiSuggestionsUsed" INTEGER NOT NULL DEFAULT 0,
    "proTemplatesAccessed" INTEGER NOT NULL DEFAULT 0,
    "snapTemplateDownloads" INTEGER NOT NULL DEFAULT 0,
    "proTemplateDownloads" INTEGER NOT NULL DEFAULT 0,
    "monthlySnapDownloads" INTEGER NOT NULL DEFAULT 0,
    "monthlyProDownloads" INTEGER NOT NULL DEFAULT 0,
    "exportFormatsUsed" JSONB,
    "totalLoginDays" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "averageSessionTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" "PermissionType" NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "templateType" TEXT NOT NULL,
    "accessType" TEXT NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "UserTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "actionData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "content" JSONB NOT NULL,
    "templateId" TEXT,
    "templateType" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "tags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Download" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "templateType" TEXT NOT NULL DEFAULT 'snap',
    "templateName" TEXT,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "anonymousId" TEXT,
    "downloadType" TEXT,
    "fileSize" INTEGER,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "Download_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "structure" JSONB NOT NULL,
    "thumbnailUrl" TEXT,
    "enhanced3DThumbnailUrl" TEXT,
    "thumbnailType" TEXT DEFAULT 'standard',
    "thumbnailFormat" TEXT,
    "thumbnailMetadata" JSONB,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "displayMode" TEXT DEFAULT 'thumbnail',
    "uploadedImageUrl" TEXT,

    CONSTRAINT "ResumeTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "structure" JSONB NOT NULL,
    "thumbnailUrl" TEXT,
    "enhanced3DThumbnailUrl" TEXT,
    "uploadedImageUrl" TEXT,
    "thumbnailType" TEXT DEFAULT 'standard',
    "displayMode" TEXT DEFAULT 'thumbnail',
    "thumbnailFormat" TEXT,
    "thumbnailMetadata" JSONB,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "structure" JSONB,
    "thumbnailUrl" TEXT,
    "enhanced3DThumbnailUrl" TEXT,
    "thumbnailType" TEXT DEFAULT 'standard',
    "thumbnailFormat" TEXT,
    "thumbnailMetadata" JSONB,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "displayMode" TEXT DEFAULT 'thumbnail',
    "uploadedImageUrl" TEXT,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobTitle" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobDescription" (
    "id" SERIAL NOT NULL,
    "jobTitleId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillsJobTitle" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillsJobTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillCategory" (
    "id" SERIAL NOT NULL,
    "skillsJobTitleId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalSummaryJobTitle" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalSummaryJobTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalSummary" (
    "id" SERIAL NOT NULL,
    "professionalSummaryJobTitleId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportHistory" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "importType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "totalRecords" INTEGER,
    "processedRecords" INTEGER DEFAULT 0,
    "successCount" INTEGER DEFAULT 0,
    "errorCount" INTEGER DEFAULT 0,
    "errors" JSONB,
    "metadata" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" "SubscriptionTier" NOT NULL,
    "description" TEXT,
    "features" JSONB NOT NULL,
    "monthlyPrice" INTEGER NOT NULL,
    "yearlyPrice" INTEGER NOT NULL,
    "discountMonthlyPrice" INTEGER,
    "discountYearlyPrice" INTEGER,
    "discountValidFrom" TIMESTAMP(3),
    "discountValidUntil" TIMESTAMP(3),
    "discountDescription" TEXT,
    "stripePriceIdMonthly" TEXT,
    "stripePriceIdYearly" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "maxResumes" INTEGER,
    "maxDownloads" INTEGER,
    "maxTemplates" INTEGER,
    "hasAIFeatures" BOOLEAN NOT NULL DEFAULT false,
    "hasPrioritySupport" BOOLEAN NOT NULL DEFAULT false,
    "customBranding" BOOLEAN NOT NULL DEFAULT false,
    "teamCollaboration" BOOLEAN NOT NULL DEFAULT false,
    "analyticsAccess" BOOLEAN NOT NULL DEFAULT false,
    "exportFormats" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "DiscountType" NOT NULL,
    "value" INTEGER NOT NULL,
    "minAmount" INTEGER,
    "maxDiscount" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "applicableTiers" JSONB,
    "firstTimeOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscountCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountCodeUsage" (
    "id" TEXT NOT NULL,
    "discountCodeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionPackageId" TEXT NOT NULL,
    "discountAmount" INTEGER NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscountCodeUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingHistory" (
    "id" TEXT NOT NULL,
    "subscriptionPackageId" TEXT NOT NULL,
    "oldMonthlyPrice" INTEGER NOT NULL,
    "newMonthlyPrice" INTEGER NOT NULL,
    "oldYearlyPrice" INTEGER NOT NULL,
    "newYearlyPrice" INTEGER NOT NULL,
    "changedBy" TEXT NOT NULL,
    "reason" TEXT,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PricingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "subscriptionPackageId" TEXT NOT NULL,
    "billingInterval" "BillingInterval" NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "taxAmount" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "discountCodeId" TEXT,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT,
    "billingAddress" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentIntentId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" "PaymentMethod" NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeChargeId" TEXT,
    "paymentMethodId" TEXT,
    "failureReason" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT,
    "billingAddress" JSONB,
    "items" JSONB NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "taxAmount" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionPackageId" TEXT NOT NULL,
    "billingInterval" "BillingInterval" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "discountCodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitorAnalytics" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "country" TEXT,
    "city" TEXT,
    "region" TEXT,
    "deviceType" TEXT,
    "browserName" TEXT,
    "browserVersion" TEXT,
    "osName" TEXT,
    "osVersion" TEXT,
    "referrer" TEXT,
    "landingPage" TEXT,
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,
    "firstVisit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalSessions" INTEGER NOT NULL DEFAULT 1,
    "totalPageViews" INTEGER NOT NULL DEFAULT 1,
    "sessionDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitorAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionAnalytics" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "userId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "pagesVisited" JSONB,
    "bounceRate" BOOLEAN NOT NULL DEFAULT false,
    "exitPage" TEXT,
    "conversionType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateAnalytics" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "templateType" TEXT NOT NULL,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalDownloads" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "registeredUsers" INTEGER NOT NULL DEFAULT 0,
    "unregisteredUsers" INTEGER NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "avgRating" DOUBLE PRECISION,
    "popularityScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lastViewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeographicAnalytics" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "totalVisitors" INTEGER NOT NULL DEFAULT 0,
    "registeredUsers" INTEGER NOT NULL DEFAULT 0,
    "unregisteredUsers" INTEGER NOT NULL DEFAULT 0,
    "snapDownloads" INTEGER NOT NULL DEFAULT 0,
    "proDownloads" INTEGER NOT NULL DEFAULT 0,
    "totalDownloads" INTEGER NOT NULL DEFAULT 0,
    "subscriptions" INTEGER NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "avgSessionDuration" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "topTemplates" JSONB,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeographicAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsSummary" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalVisitors" INTEGER NOT NULL DEFAULT 0,
    "newVisitors" INTEGER NOT NULL DEFAULT 0,
    "returningVisitors" INTEGER NOT NULL DEFAULT 0,
    "registeredUsers" INTEGER NOT NULL DEFAULT 0,
    "unregisteredUsers" INTEGER NOT NULL DEFAULT 0,
    "newRegistrations" INTEGER NOT NULL DEFAULT 0,
    "snapDownloads" INTEGER NOT NULL DEFAULT 0,
    "proDownloads" INTEGER NOT NULL DEFAULT 0,
    "totalDownloads" INTEGER NOT NULL DEFAULT 0,
    "newSubscriptions" INTEGER NOT NULL DEFAULT 0,
    "totalSubscriptions" INTEGER NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "avgSessionDuration" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "topCountries" JSONB,
    "topTemplates" JSONB,
    "topPages" JSONB,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversionFunnel" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "userId" TEXT,
    "funnelType" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeToComplete" INTEGER,
    "dropoffPoint" TEXT,
    "conversionValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversionFunnel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "User"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_firebaseUid_idx" ON "User"("firebaseUid");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_currentTier_idx" ON "User"("currentTier");

-- CreateIndex
CREATE INDEX "User_subscriptionStatus_idx" ON "User"("subscriptionStatus");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "UserProfile_userId_idx" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "UserProfile_industry_idx" ON "UserProfile"("industry");

-- CreateIndex
CREATE INDEX "UserProfile_experienceLevel_idx" ON "UserProfile"("experienceLevel");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_stripeSubscriptionId_idx" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_tier_idx" ON "Subscription"("tier");

-- CreateIndex
CREATE INDEX "Subscription_subscriptionPackageId_idx" ON "Subscription"("subscriptionPackageId");

-- CreateIndex
CREATE UNIQUE INDEX "UsageStats_userId_key" ON "UsageStats"("userId");

-- CreateIndex
CREATE INDEX "UsageStats_userId_idx" ON "UsageStats"("userId");

-- CreateIndex
CREATE INDEX "UsageStats_lastActiveDate_idx" ON "UsageStats"("lastActiveDate");

-- CreateIndex
CREATE INDEX "UserPermission_userId_idx" ON "UserPermission"("userId");

-- CreateIndex
CREATE INDEX "UserPermission_permission_idx" ON "UserPermission"("permission");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_userId_permission_key" ON "UserPermission"("userId", "permission");

-- CreateIndex
CREATE INDEX "UserTemplate_userId_idx" ON "UserTemplate"("userId");

-- CreateIndex
CREATE INDEX "UserTemplate_templateId_idx" ON "UserTemplate"("templateId");

-- CreateIndex
CREATE INDEX "UserTemplate_templateType_idx" ON "UserTemplate"("templateType");

-- CreateIndex
CREATE UNIQUE INDEX "UserTemplate_userId_templateId_key" ON "UserTemplate"("userId", "templateId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "SupportTicket_userId_idx" ON "SupportTicket"("userId");

-- CreateIndex
CREATE INDEX "SupportTicket_status_idx" ON "SupportTicket"("status");

-- CreateIndex
CREATE INDEX "SupportTicket_priority_idx" ON "SupportTicket"("priority");

-- CreateIndex
CREATE INDEX "SupportTicket_createdAt_idx" ON "SupportTicket"("createdAt");

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");

-- CreateIndex
CREATE INDEX "Resume_templateId_idx" ON "Resume"("templateId");

-- CreateIndex
CREATE INDEX "Resume_isPublic_idx" ON "Resume"("isPublic");

-- CreateIndex
CREATE INDEX "Resume_createdAt_idx" ON "Resume"("createdAt");

-- CreateIndex
CREATE INDEX "Download_userId_idx" ON "Download"("userId");

-- CreateIndex
CREATE INDEX "Download_anonymousId_idx" ON "Download"("anonymousId");

-- CreateIndex
CREATE INDEX "Download_templateId_idx" ON "Download"("templateId");

-- CreateIndex
CREATE INDEX "Download_templateType_idx" ON "Download"("templateType");

-- CreateIndex
CREATE INDEX "Download_downloadedAt_idx" ON "Download"("downloadedAt");

-- CreateIndex
CREATE UNIQUE INDEX "JobTitle_title_key" ON "JobTitle"("title");

-- CreateIndex
CREATE INDEX "JobTitle_title_idx" ON "JobTitle"("title");

-- CreateIndex
CREATE INDEX "JobTitle_category_idx" ON "JobTitle"("category");

-- CreateIndex
CREATE INDEX "JobDescription_jobTitleId_idx" ON "JobDescription"("jobTitleId");

-- CreateIndex
CREATE INDEX "JobDescription_isRecommended_idx" ON "JobDescription"("isRecommended");

-- CreateIndex
CREATE UNIQUE INDEX "SkillsJobTitle_title_key" ON "SkillsJobTitle"("title");

-- CreateIndex
CREATE INDEX "SkillsJobTitle_title_idx" ON "SkillsJobTitle"("title");

-- CreateIndex
CREATE INDEX "SkillsJobTitle_category_idx" ON "SkillsJobTitle"("category");

-- CreateIndex
CREATE INDEX "SkillCategory_skillsJobTitleId_idx" ON "SkillCategory"("skillsJobTitleId");

-- CreateIndex
CREATE INDEX "SkillCategory_isRecommended_idx" ON "SkillCategory"("isRecommended");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalSummaryJobTitle_title_key" ON "ProfessionalSummaryJobTitle"("title");

-- CreateIndex
CREATE INDEX "ProfessionalSummaryJobTitle_title_idx" ON "ProfessionalSummaryJobTitle"("title");

-- CreateIndex
CREATE INDEX "ProfessionalSummaryJobTitle_category_idx" ON "ProfessionalSummaryJobTitle"("category");

-- CreateIndex
CREATE INDEX "ProfessionalSummary_professionalSummaryJobTitleId_idx" ON "ProfessionalSummary"("professionalSummaryJobTitleId");

-- CreateIndex
CREATE INDEX "ProfessionalSummary_isRecommended_idx" ON "ProfessionalSummary"("isRecommended");

-- CreateIndex
CREATE INDEX "ImportHistory_importType_idx" ON "ImportHistory"("importType");

-- CreateIndex
CREATE INDEX "ImportHistory_status_idx" ON "ImportHistory"("status");

-- CreateIndex
CREATE INDEX "ImportHistory_startedAt_idx" ON "ImportHistory"("startedAt");

-- CreateIndex
CREATE INDEX "SubscriptionPackage_tier_idx" ON "SubscriptionPackage"("tier");

-- CreateIndex
CREATE INDEX "SubscriptionPackage_isActive_idx" ON "SubscriptionPackage"("isActive");

-- CreateIndex
CREATE INDEX "SubscriptionPackage_displayOrder_idx" ON "SubscriptionPackage"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountCode_code_key" ON "DiscountCode"("code");

-- CreateIndex
CREATE INDEX "DiscountCode_code_idx" ON "DiscountCode"("code");

-- CreateIndex
CREATE INDEX "DiscountCode_isActive_idx" ON "DiscountCode"("isActive");

-- CreateIndex
CREATE INDEX "DiscountCode_validFrom_idx" ON "DiscountCode"("validFrom");

-- CreateIndex
CREATE INDEX "DiscountCode_validUntil_idx" ON "DiscountCode"("validUntil");

-- CreateIndex
CREATE INDEX "DiscountCodeUsage_discountCodeId_idx" ON "DiscountCodeUsage"("discountCodeId");

-- CreateIndex
CREATE INDEX "DiscountCodeUsage_userId_idx" ON "DiscountCodeUsage"("userId");

-- CreateIndex
CREATE INDEX "DiscountCodeUsage_usedAt_idx" ON "DiscountCodeUsage"("usedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountCodeUsage_discountCodeId_userId_key" ON "DiscountCodeUsage"("discountCodeId", "userId");

-- CreateIndex
CREATE INDEX "PricingHistory_subscriptionPackageId_idx" ON "PricingHistory"("subscriptionPackageId");

-- CreateIndex
CREATE INDEX "PricingHistory_effectiveDate_idx" ON "PricingHistory"("effectiveDate");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_paymentIntentId_idx" ON "Payment"("paymentIntentId");

-- CreateIndex
CREATE INDEX "Payment_stripeCustomerId_idx" ON "Payment"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_orderId_key" ON "Invoice"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_orderId_idx" ON "Invoice"("orderId");

-- CreateIndex
CREATE INDEX "Invoice_invoiceNumber_idx" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_customerEmail_idx" ON "Invoice"("customerEmail");

-- CreateIndex
CREATE INDEX "Invoice_issuedAt_idx" ON "Invoice"("issuedAt");

-- CreateIndex
CREATE INDEX "CartItem_userId_idx" ON "CartItem"("userId");

-- CreateIndex
CREATE INDEX "CartItem_subscriptionPackageId_idx" ON "CartItem"("subscriptionPackageId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_userId_subscriptionPackageId_billingInterval_key" ON "CartItem"("userId", "subscriptionPackageId", "billingInterval");

-- CreateIndex
CREATE UNIQUE INDEX "VisitorAnalytics_sessionId_key" ON "VisitorAnalytics"("sessionId");

-- CreateIndex
CREATE INDEX "VisitorAnalytics_sessionId_idx" ON "VisitorAnalytics"("sessionId");

-- CreateIndex
CREATE INDEX "VisitorAnalytics_userId_idx" ON "VisitorAnalytics"("userId");

-- CreateIndex
CREATE INDEX "VisitorAnalytics_country_idx" ON "VisitorAnalytics"("country");

-- CreateIndex
CREATE INDEX "VisitorAnalytics_isRegistered_idx" ON "VisitorAnalytics"("isRegistered");

-- CreateIndex
CREATE INDEX "VisitorAnalytics_firstVisit_idx" ON "VisitorAnalytics"("firstVisit");

-- CreateIndex
CREATE INDEX "VisitorAnalytics_lastSeen_idx" ON "VisitorAnalytics"("lastSeen");

-- CreateIndex
CREATE INDEX "SessionAnalytics_sessionId_idx" ON "SessionAnalytics"("sessionId");

-- CreateIndex
CREATE INDEX "SessionAnalytics_visitorId_idx" ON "SessionAnalytics"("visitorId");

-- CreateIndex
CREATE INDEX "SessionAnalytics_userId_idx" ON "SessionAnalytics"("userId");

-- CreateIndex
CREATE INDEX "SessionAnalytics_startTime_idx" ON "SessionAnalytics"("startTime");

-- CreateIndex
CREATE INDEX "SessionAnalytics_conversionType_idx" ON "SessionAnalytics"("conversionType");

-- CreateIndex
CREATE INDEX "TemplateAnalytics_templateId_idx" ON "TemplateAnalytics"("templateId");

-- CreateIndex
CREATE INDEX "TemplateAnalytics_templateType_idx" ON "TemplateAnalytics"("templateType");

-- CreateIndex
CREATE INDEX "TemplateAnalytics_totalViews_idx" ON "TemplateAnalytics"("totalViews");

-- CreateIndex
CREATE INDEX "TemplateAnalytics_totalDownloads_idx" ON "TemplateAnalytics"("totalDownloads");

-- CreateIndex
CREATE INDEX "TemplateAnalytics_popularityScore_idx" ON "TemplateAnalytics"("popularityScore");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateAnalytics_templateId_templateType_key" ON "TemplateAnalytics"("templateId", "templateType");

-- CreateIndex
CREATE INDEX "GeographicAnalytics_country_idx" ON "GeographicAnalytics"("country");

-- CreateIndex
CREATE INDEX "GeographicAnalytics_countryCode_idx" ON "GeographicAnalytics"("countryCode");

-- CreateIndex
CREATE INDEX "GeographicAnalytics_totalVisitors_idx" ON "GeographicAnalytics"("totalVisitors");

-- CreateIndex
CREATE INDEX "GeographicAnalytics_registeredUsers_idx" ON "GeographicAnalytics"("registeredUsers");

-- CreateIndex
CREATE INDEX "GeographicAnalytics_totalDownloads_idx" ON "GeographicAnalytics"("totalDownloads");

-- CreateIndex
CREATE UNIQUE INDEX "GeographicAnalytics_country_key" ON "GeographicAnalytics"("country");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsSummary_date_key" ON "AnalyticsSummary"("date");

-- CreateIndex
CREATE INDEX "AnalyticsSummary_date_idx" ON "AnalyticsSummary"("date");

-- CreateIndex
CREATE INDEX "AnalyticsSummary_totalVisitors_idx" ON "AnalyticsSummary"("totalVisitors");

-- CreateIndex
CREATE INDEX "AnalyticsSummary_newRegistrations_idx" ON "AnalyticsSummary"("newRegistrations");

-- CreateIndex
CREATE INDEX "AnalyticsSummary_totalDownloads_idx" ON "AnalyticsSummary"("totalDownloads");

-- CreateIndex
CREATE INDEX "ConversionFunnel_sessionId_idx" ON "ConversionFunnel"("sessionId");

-- CreateIndex
CREATE INDEX "ConversionFunnel_visitorId_idx" ON "ConversionFunnel"("visitorId");

-- CreateIndex
CREATE INDEX "ConversionFunnel_userId_idx" ON "ConversionFunnel"("userId");

-- CreateIndex
CREATE INDEX "ConversionFunnel_funnelType_idx" ON "ConversionFunnel"("funnelType");

-- CreateIndex
CREATE INDEX "ConversionFunnel_step_idx" ON "ConversionFunnel"("step");

-- CreateIndex
CREATE INDEX "ConversionFunnel_completedAt_idx" ON "ConversionFunnel"("completedAt");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_subscriptionPackageId_fkey" FOREIGN KEY ("subscriptionPackageId") REFERENCES "SubscriptionPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageStats" ADD CONSTRAINT "UsageStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTemplate" ADD CONSTRAINT "UserTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobDescription" ADD CONSTRAINT "JobDescription_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillCategory" ADD CONSTRAINT "SkillCategory_skillsJobTitleId_fkey" FOREIGN KEY ("skillsJobTitleId") REFERENCES "SkillsJobTitle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalSummary" ADD CONSTRAINT "ProfessionalSummary_professionalSummaryJobTitleId_fkey" FOREIGN KEY ("professionalSummaryJobTitleId") REFERENCES "ProfessionalSummaryJobTitle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountCodeUsage" ADD CONSTRAINT "DiscountCodeUsage_discountCodeId_fkey" FOREIGN KEY ("discountCodeId") REFERENCES "DiscountCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountCodeUsage" ADD CONSTRAINT "DiscountCodeUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountCodeUsage" ADD CONSTRAINT "DiscountCodeUsage_subscriptionPackageId_fkey" FOREIGN KEY ("subscriptionPackageId") REFERENCES "SubscriptionPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingHistory" ADD CONSTRAINT "PricingHistory_subscriptionPackageId_fkey" FOREIGN KEY ("subscriptionPackageId") REFERENCES "SubscriptionPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_subscriptionPackageId_fkey" FOREIGN KEY ("subscriptionPackageId") REFERENCES "SubscriptionPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_discountCodeId_fkey" FOREIGN KEY ("discountCodeId") REFERENCES "DiscountCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_subscriptionPackageId_fkey" FOREIGN KEY ("subscriptionPackageId") REFERENCES "SubscriptionPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_discountCodeId_fkey" FOREIGN KEY ("discountCodeId") REFERENCES "DiscountCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorAnalytics" ADD CONSTRAINT "VisitorAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionAnalytics" ADD CONSTRAINT "SessionAnalytics_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "VisitorAnalytics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionAnalytics" ADD CONSTRAINT "SessionAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
