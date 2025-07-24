[17:26:11.522] Running build in Washington, D.C., USA (East) – iad1
[17:26:11.522] Build machine configuration: 4 cores, 8 GB
[17:26:11.539] Cloning github.com/Tbz8123/tbz12 (Branch: main, Commit: 27f1a78)
[17:26:11.547] Skipping build cache, deployment was triggered without cache.
[17:26:11.929] Cloning completed: 389.000ms
[17:26:13.956] Running "vercel build"
[17:26:14.811] Vercel CLI 44.5.0
[17:26:15.119] WARN! Due to `builds` existing in your configuration file, the Build and Development Settings defined in your Project Settings will not apply. Learn More: https://vercel.link/unused-build-settings
[17:26:15.728] Installing dependencies...
[17:26:27.454] npm warn deprecated @types/jspdf@2.0.0: This is a stub types definition. jspdf provides its own type definitions, so you do not need this installed.
[17:27:13.115] 
[17:27:13.115] added 919 packages in 57s
[17:27:15.091] Using TypeScript 5.6.3 (local user-provided)
[17:27:21.302] server/index.ts(138,17): error TS2339: Property 'code' does not exist on type 'Error'.
[17:27:21.303] 
[17:27:23.314] server/routes.ts(1325,34): error TS7006: Parameter 'template' implicitly has an 'any' type.
[17:27:23.315] 
[17:27:24.625] server/routes/analytics.ts(14,43): error TS2554: Expected 0 arguments, but got 1.
[17:27:24.626] server/routes/analytics.ts(40,69): error TS2554: Expected 0-1 arguments, but got 2.
[17:27:24.626] server/routes/analytics.ts(92,31): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'VisitorAnalyticsWhereInput'.
[17:27:24.626] server/routes/analytics.ts(144,47): error TS7006: Parameter 'v' implicitly has an 'any' type.
[17:27:24.626] server/routes/analytics.ts(161,51): error TS7006: Parameter 'v' implicitly has an 'any' type.
[17:27:24.626] server/routes/analytics.ts(196,31): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'ActivityLogWhereInput'.
[17:27:24.626] server/routes/analytics.ts(223,31): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'SessionAnalyticsWhereInput'.
[17:27:24.626] server/routes/analytics.ts(481,14): error TS2339: Property 'sessionId' does not exist on type 'Request<{}, any, any, ParsedQs, Record<string, any>>'.
[17:27:24.627] server/routes/analytics.ts(481,32): error TS2339: Property 'visitorId' does not exist on type 'Request<{}, any, any, ParsedQs, Record<string, any>>'.
[17:27:24.627] server/routes/analytics.ts(486,22): error TS2339: Property 'sessionId' does not exist on type 'Request<{}, any, any, ParsedQs, Record<string, any>>'.
[17:27:24.627] server/routes/analytics.ts(487,22): error TS2339: Property 'visitorId' does not exist on type 'Request<{}, any, any, ParsedQs, Record<string, any>>'.
[17:27:24.627] server/routes/analytics.ts(488,19): error TS2551: Property 'userId' does not exist on type 'Request<{}, any, any, ParsedQs, Record<string, any>>'. Did you mean 'user'?
[17:27:24.627] 
[17:27:25.074] server/routes/import-history.ts(40,25): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'ImportHistoryWhereInput'.
[17:27:25.075] server/routes/import-history.ts(476,52): error TS7006: Parameter 't' implicitly has an 'any' type.
[17:27:25.075] server/routes/import-history.ts(480,32): error TS7006: Parameter 't' implicitly has an 'any' type.
[17:27:25.075] server/routes/import-history.ts(492,42): error TS7006: Parameter 't' implicitly has an 'any' type.
[17:27:25.075] server/routes/import-history.ts(710,52): error TS7006: Parameter 't' implicitly has an 'any' type.
[17:27:25.075] server/routes/import-history.ts(714,32): error TS7006: Parameter 't' implicitly has an 'any' type.
[17:27:25.075] server/routes/import-history.ts(726,42): error TS7006: Parameter 't' implicitly has an 'any' type.
[17:27:25.075] server/routes/import-history.ts(959,52): error TS7006: Parameter 't' implicitly has an 'any' type.
[17:27:25.075] 
[17:27:25.278] server/routes/professional-summaries.ts(105,25): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'ProfessionalSummaryWhereInput'.
[17:27:25.278] server/routes/professional-summaries.ts(146,25): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'ProfessionalSummaryWhereInput'.
[17:27:25.278] server/routes/professional-summaries.ts(453,38): error TS7006: Parameter 'row' implicitly has an 'any' type.
[17:27:25.278] server/routes/professional-summaries.ts(460,64): error TS7006: Parameter 'row' implicitly has an 'any' type.
[17:27:25.278] 
[17:27:25.554] server/services/memoryAnalyticsService.ts(342,5): error TS2322: Type '{ uniqueVisitors: number; templateId: string; templateName: string; templateType: "snap" | "pro"; views: number; downloads: number; lastActivity: number; }[]' is not assignable to type 'TemplateStats[]'.
[17:27:25.554]   Type '{ uniqueVisitors: number; templateId: string; templateName: string; templateType: "snap" | "pro"; views: number; downloads: number; lastActivity: number; }' is not assignable to type 'TemplateStats'.
[17:27:25.554]     Types of property 'uniqueVisitors' are incompatible.
[17:27:25.554]       Type 'number' is not assignable to type 'Set<string>'.
[17:27:25.554] 
[17:27:25.746] server/services/analyticsService.ts(166,62): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'VisitorAnalytics'.
[17:27:25.746] server/services/analyticsService.ts(221,62): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'SessionAnalytics'.
[17:27:25.746] server/services/analyticsService.ts(280,60): error TS2345: Argument of type '{ userTier: string | undefined; country: string | undefined; deviceType: string | undefined; sessionId: string; visitorId: string; userId?: string; activityType: string; activityName: string; ... 13 more ...; userAgent?: string; }' is not assignable to parameter of type '{ sessionId: string; userId?: string | undefined; activityType: string; activityName: string; description?: string | undefined; metadata?: Record<string, any> | undefined; templateId?: string | undefined; ... 9 more ...; errorMessage?: string | undefined; }'.
[17:27:25.746]   Types of property 'templateType' are incompatible.
[17:27:25.746]     Type 'string | undefined' is not assignable to type '"snap" | "pro" | undefined'.
[17:27:25.746]       Type 'string' is not assignable to type '"snap" | "pro" | undefined'.
[17:27:25.746] server/services/analyticsService.ts(422,7): error TS2322: Type 'ActivityEvent' is not assignable to type 'void'.
[17:27:25.747] server/services/analyticsService.ts(600,34): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'TemplateAnalyticsUpdateInput'.
[17:27:25.747] server/services/analyticsService.ts(638,34): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'UsageStatsUpdateInput'.
[17:27:25.747] server/services/analyticsService.ts(677,34): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'GeographicAnalyticsUpdateInput'.
[17:27:25.747] server/services/analyticsService.ts(716,34): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'GeographicAnalyticsUpdateInput'.
[17:27:25.747] server/services/analyticsService.ts(745,34): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'GeographicAnalyticsUpdateInput'.
[17:27:25.747] server/services/analyticsService.ts(769,34): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'GeographicAnalyticsUpdateInput'.
[17:27:25.747] server/services/analyticsService.ts(800,37): error TS2339: Property 'prisma' does not exist on type 'AnalyticsService'.
[17:27:25.747] server/services/analyticsService.ts(803,39): error TS2339: Property 'prisma' does not exist on type 'AnalyticsService'.
[17:27:25.747] server/services/analyticsService.ts(949,50): error TS7006: Parameter 'template' implicitly has an 'any' type.
[17:27:25.747] server/services/analyticsService.ts(1029,36): error TS7006: Parameter 'template' implicitly has an 'any' type.
[17:27:25.747] server/services/analyticsService.ts(1073,37): error TS2339: Property 'timestamp' does not exist on type '{ createdAt: { gte: Date; lte: Date; }; }'.
[17:27:25.747] server/services/analyticsService.ts(1080,37): error TS2339: Property 'timestamp' does not exist on type '{ createdAt: { gte: Date; lte: Date; }; }'.
[17:27:25.747] server/services/analyticsService.ts(1086,34): error TS2339: Property 'timestamp' does not exist on type '{ createdAt: { gte: Date; lte: Date; }; }'.
[17:27:25.747] server/services/analyticsService.ts(1134,54): error TS2554: Expected 0 arguments, but got 1.
[17:27:25.747] 
[17:27:37.447] Build Completed in /vercel/output [1m]
[17:27:37.699] Deploying outputs...
[17:27:44.450] 
[17:27:44.597] Deployment completed
[17:28:14.559] Uploading build cache [284.82 MB]...
[17:28:17.143] Build cache uploaded: 2.584s
[17:28:19.418] Exiting build container