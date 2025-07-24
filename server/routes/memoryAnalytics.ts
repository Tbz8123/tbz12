// Memory Analytics Routes - Real-time analytics endpoints
import { Router } from 'express';
import memoryAnalytics from '../services/memoryAnalyticsService';

const router = Router();

// Get real-time analytics dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const stats = memoryAnalytics.getRealtimeStats();
    res.json(stats);
  } catch (error: unknown) {
    console.error('Error fetching realtime dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch realtime dashboard data' });
  }
});

// Get recent activities
router.get('/activities', async (req, res) => {
  try {
    const { limit = 50, type } = req.query;

    let activities;
    if (type) {
      activities = memoryAnalytics.getActivitiesByType(type as string, parseInt(limit as string));
    } else {
      activities = memoryAnalytics.getRecentActivities(parseInt(limit as string));
    }

    res.json(activities);
  } catch (error: any) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ error: 'Failed to fetch recent activities' });
  }
});

// Get template statistics
router.get('/templates', async (req, res) => {
  try {
    const templates = memoryAnalytics.getTemplateStats();
    res.json(templates);
  } catch (error: any) {
    console.error('Error fetching template statistics:', error);
    res.status(500).json({ error: 'Failed to fetch template statistics' });
  }
});

// Get country statistics
router.get('/countries', async (req, res) => {
  try {
    const countries = memoryAnalytics.getCountryStats();
    res.json(countries);
  } catch (error: any) {
    console.error('Error fetching country statistics:', error);
    res.status(500).json({ error: 'Failed to fetch country statistics' });
  }
});

// Get session details
router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = memoryAnalytics.getSessionDetails(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error: any) {
    console.error('Error fetching session details:', error);
    res.status(500).json({ error: 'Failed to fetch session details' });
  }
});

// Get activities by user
router.get('/users/:userId/activities', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 100 } = req.query;

    const activities = memoryAnalytics.getActivitiesByUser(userId, parseInt(limit as string));
    res.json(activities);
  } catch (error: any) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ error: 'Failed to fetch user activities' });
  }
});

// Get activities by session
router.get('/sessions/:sessionId/activities', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const activities = memoryAnalytics.getActivitiesBySession(sessionId);
    res.json(activities);
  } catch (error: any) {
    console.error('Error fetching session activities:', error);
    res.status(500).json({ error: 'Failed to fetch session activities' });
  }
});

// Get memory usage stats
router.get('/memory-usage', async (req, res) => {
  try {
    const usage = memoryAnalytics.getMemoryUsage();
    res.json(usage);
  } catch (error: any) {
    console.error('Error fetching memory usage:', error);
    res.status(500).json({ error: 'Failed to fetch memory usage' });
  }
});

// Get top templates
router.get('/top-templates', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const templates = memoryAnalytics.getTopTemplates(parseInt(limit as string));
    res.json(templates);
  } catch (error: any) {
    console.error('Error fetching top templates:', error);
    res.status(500).json({ error: 'Failed to fetch top templates' });
  }
});

// Get top countries
router.get('/top-countries', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const countries = memoryAnalytics.getTopCountries(parseInt(limit as string));
    res.json(countries);
  } catch (error: any) {
    console.error('Error fetching top countries:', error);
    res.status(500).json({ error: 'Failed to fetch top countries' });
  }
});

// Clear all data (for testing/admin only)
router.delete('/clear', async (req, res) => {
  try {
    memoryAnalytics.clear();
    res.json({ message: 'Memory analytics cleared successfully' });
  } catch (error: any) {
    console.error('Error clearing memory analytics:', error);
    res.status(500).json({ error: 'Failed to clear memory analytics' });
  }
});

export default router;