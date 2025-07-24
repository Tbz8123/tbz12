import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { analyticsService } from '../services/analyticsService';
import { trackTemplateDownload } from '../middleware/visitorTracking';

const router = Router();
const prisma = new PrismaClient();

// Enhanced template download endpoint with analytics
router.post('/download/:templateId', trackTemplateDownload, async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const { templateType = 'snap', downloadType = 'pdf' } = req.body;

    // Get template information
    const template = await prisma.resumeTemplate.findUnique({
      where: { id: parseInt(templateId) }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Add template name to request body for analytics middleware
    req.body.templateName = template.name;
    req.body.userId = req.userId;

    // Track the download in existing Download model
    await prisma.download.create({
      data: {
        templateId: templateId,
        templateType: templateType,
        templateName: template.name,
        downloadType: downloadType,
        userId: req.userId,
        downloadedAt: new Date(),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    // The trackTemplateDownload middleware will handle the comprehensive analytics tracking

    res.json({
      success: true,
      message: 'Template downloaded successfully',
      templateName: template.name,
      templateType: templateType,
      downloadType: downloadType
    });

  } catch (error: unknown) {
    console.error('Error downloading template:', error);
    res.status(500).json({ error: 'Failed to download template' });
  }
});

// Get template popularity statistics
router.get('/stats/:templateId', async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;

    // Get template analytics
    const analytics = await prisma.templateAnalytics.findUnique({
      where: { templateId_templateType: { templateId, templateType: 'snap' } }
    });

    // Get download count from existing Download model
    const downloadCount = await prisma.download.count({
      where: { templateId }
    });

    res.json({
      templateId,
      analytics: analytics || {
        totalViews: 0,
        totalDownloads: downloadCount,
        uniqueVisitors: 0,
        conversionRate: 0
      },
      legacyDownloads: downloadCount
    });

  } catch (error: any) {
    console.error('Error getting template stats:', error);
    res.status(500).json({ error: 'Failed to get template statistics' });
  }
});

export default router;