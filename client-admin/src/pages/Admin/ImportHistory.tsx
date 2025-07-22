import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Trash2,
  Filter
} from 'lucide-react';

interface ImportRecord {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  importType: 'job_titles' | 'skills';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRecords?: number;
  processedRecords?: number;
  successCount?: number;
  errorCount?: number;
  errors?: string[];
  metadata?: any;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ImportStats {
  totalImports: number;
  totalRecords: number;
  processedRecords: number;
  successCount: number;
  errorCount: number;
  statusBreakdown: Record<string, number>;
}

export default function ImportHistory() {
  const [imports, setImports] = useState<ImportRecord[]>([]);
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'job_titles' | 'skills'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all');

  useEffect(() => {
    fetchImports();
    fetchStats();
  }, [filterType, filterStatus]);

  const fetchImports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('importType', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/import-history?${params}`);
      const data = await response.json();
      setImports(data);
    } catch (error) {
      console.error('Error fetching imports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('importType', filterType);

      const response = await fetch(`/api/import-history/stats/summary?${params}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const deleteImport = async (id: string) => {
    try {
      await fetch(`/api/import-history/${id}`, { method: 'DELETE' });
      fetchImports();
      fetchStats();
    } catch (error) {
      console.error('Error deleting import:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      completed: 'default',
      failed: 'destructive',
      processing: 'secondary',
      pending: 'secondary'
    };
    return (
      <Badge variant={variants[status] || 'secondary'} className="capitalize">
        {status}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDuration = (startedAt: string, completedAt?: string) => {
    const start = new Date(startedAt);
    const end = completedAt ? new Date(completedAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) return `${diffSecs}s`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ${diffSecs % 60}s`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Import History</h1>
          <p className="text-gray-300">Track and manage your data import progress</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="bg-white/10 border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Imports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalImports}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalRecords.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Processed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.processedRecords.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {stats.totalRecords > 0 ? Math.round((stats.successCount / stats.totalRecords) * 100) : 0}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{stats.errorCount.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-300" />
              <span className="text-sm font-medium text-gray-300">Filters:</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm"
              >
                <option value="all">All Types</option>
                <option value="job_titles">Job Titles</option>
                <option value="skills">Skills</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <Button
              onClick={() => { fetchImports(); fetchStats(); }}
              variant="outline"
              size="sm"
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Import Records */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading import history...</p>
            </div>
          ) : imports.length === 0 ? (
            <Card className="bg-white/10 border-white/20">
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Import History</h3>
                <p className="text-gray-400">
                  No imports found. Import some data from the Job Titles or Skills management pages.
                </p>
              </CardContent>
            </Card>
          ) : (
            imports.map((importRecord) => (
              <Card key={importRecord.id} className="bg-white/10 border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(importRecord.status)}
                      <div>
                        <CardTitle className="text-white">{importRecord.fileName}</CardTitle>
                        <CardDescription className="text-gray-300">
                          {formatFileSize(importRecord.fileSize)} • {importRecord.fileType} • {importRecord.importType.replace('_', ' ')}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(importRecord.status)}
                      <Button
                        onClick={() => deleteImport(importRecord.id)}
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    {importRecord.status === 'processing' && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-300">Progress</span>
                          <span className="text-sm text-white">{importRecord.progress}%</span>
                        </div>
                        <Progress value={importRecord.progress} className="h-2" />
                      </div>
                    )}

                    {/* Statistics */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400 block">Total Records</span>
                        <span className="text-white font-medium">{importRecord.totalRecords || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Processed</span>
                        <span className="text-white font-medium">{importRecord.processedRecords || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Success</span>
                        <span className="text-green-400 font-medium">{importRecord.successCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Errors</span>
                        <span className="text-red-400 font-medium">{importRecord.errorCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Duration</span>
                        <span className="text-white font-medium">
                          {getDuration(importRecord.startedAt, importRecord.completedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      <span>Started: {formatDate(importRecord.startedAt)}</span>
                      {importRecord.completedAt && (
                        <span>Completed: {formatDate(importRecord.completedAt)}</span>
                      )}
                    </div>

                    {/* Errors */}
                    {importRecord.errors && importRecord.errors.length > 0 && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded p-3">
                        <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Errors ({importRecord.errors.length})
                        </h4>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {importRecord.errors.slice(0, 5).map((error, index) => (
                            <p key={index} className="text-xs text-red-300">{error}</p>
                          ))}
                          {importRecord.errors.length > 5 && (
                            <p className="text-xs text-red-400 italic">
                              ... and {importRecord.errors.length - 5} more errors
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 