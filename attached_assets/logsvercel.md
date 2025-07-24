[15:03:02.517] Running build in Washington, D.C., USA (East) – iad1
[15:03:02.518] Build machine configuration: 4 cores, 8 GB
[15:03:02.533] Cloning github.com/Tbz8123/tbz12 (Branch: main, Commit: 8854a5e)
[15:03:02.539] Skipping build cache, deployment was triggered without cache.
[15:03:02.953] Cloning completed: 419.000ms
[15:03:03.304] Running "vercel build"
[15:03:04.057] Vercel CLI 44.5.0
[15:03:04.350] WARN! Due to `builds` existing in your configuration file, the Build and Development Settings defined in your Project Settings will not apply. Learn More: https://vercel.link/unused-build-settings
[15:03:05.138] Installing dependencies...
[15:03:09.504] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[15:03:10.670] npm warn deprecated lodash.pick@4.4.0: This package is deprecated. Use destructuring assignment syntax instead.
[15:03:11.016] npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
[15:03:11.682] npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
[15:03:12.368] npm warn deprecated @types/jspdf@2.0.0: This is a stub types definition. jspdf provides its own type definitions, so you do not need this installed.
[15:03:13.754] npm warn deprecated @esbuild-kit/esm-loader@2.6.5: Merged into tsx: https://tsx.is
[15:03:13.841] npm warn deprecated @esbuild-kit/core-utils@3.3.2: Merged into tsx: https://tsx.is
[15:03:14.126] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[15:03:19.376] npm warn deprecated puppeteer@10.4.0: < 22.8.2 is no longer supported
[15:03:40.623] 
[15:03:40.624] added 936 packages in 35s
[15:03:40.911] Using TypeScript 5.6.3 (local user-provided)
[15:03:50.506] server/routes/professional-summaries.ts(46,25): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'ProfessionalSummaryJobTitleWhereInput'.
[15:03:50.506] server/routes/professional-summaries.ts(105,25): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'ProfessionalSummaryWhereInput'.
[15:03:50.506] server/routes/professional-summaries.ts(146,25): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'ProfessionalSummaryWhereInput'.
[15:03:50.506] server/routes/professional-summaries.ts(217,16): error TS2339: Property 'meta' does not exist on type '{ code?: string | undefined; }'.
[15:03:50.506] server/routes/professional-summaries.ts(402,49): error TS7006: Parameter 'jt' implicitly has an 'any' type.
[15:03:50.506] server/routes/professional-summaries.ts(424,50): error TS7006: Parameter 'summary' implicitly has an 'any' type.
[15:03:50.506] server/routes/professional-summaries.ts(438,38): error TS7006: Parameter 'row' implicitly has an 'any' type.
[15:03:50.506] server/routes/professional-summaries.ts(445,64): error TS7006: Parameter 'row' implicitly has an 'any' type.
[15:03:50.507] server/routes/professional-summaries.ts(453,38): error TS7006: Parameter 'row' implicitly has an 'any' type.
[15:03:50.507] server/routes/professional-summaries.ts(460,64): error TS7006: Parameter 'row' implicitly has an 'any' type.
[15:03:50.507] 
[15:03:50.739] server/routes/analytics.ts(140,48): error TS7006: Parameter 'v' implicitly has an 'any' type.
[15:03:50.739] server/routes/analytics.ts(141,50): error TS7006: Parameter 'v' implicitly has an 'any' type.
[15:03:50.740] server/routes/analytics.ts(144,52): error TS7006: Parameter 'v' implicitly has an 'any' type.
[15:03:50.740] server/routes/analytics.ts(145,54): error TS7006: Parameter 'v' implicitly has an 'any' type.
[15:03:50.740] server/routes/analytics.ts(148,47): error TS7006: Parameter 'v' implicitly has an 'any' type.
[15:03:50.740] server/routes/analytics.ts(165,51): error TS7006: Parameter 'v' implicitly has an 'any' type.
[15:03:50.740] server/routes/analytics.ts(445,88): error TS7006: Parameter 'item' implicitly has an 'any' type.
[15:03:50.740] server/routes/analytics.ts(466,11): error TS18046: 'item' is of type 'unknown'.
[15:03:50.740] server/routes/analytics.ts(467,9): error TS18046: 'item' is of type 'unknown'.
[15:03:50.740] server/routes/analytics.ts(467,24): error TS18046: 'item' is of type 'unknown'.
[15:03:50.740] server/routes/analytics.ts(467,41): error TS18046: 'item' is of type 'unknown'.
[15:03:50.740] 
[15:03:50.976] server/routes/import-history.ts(78,45): error TS7006: Parameter 'imp' implicitly has an 'any' type.
[15:03:50.976] server/routes/import-history.ts(313,32): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'ImportHistoryUpdateInput'.
[15:03:50.976] server/routes/import-history.ts(481,53): error TS7006: Parameter 't' implicitly has an 'any' type.
[15:03:50.977] server/routes/import-history.ts(485,33): error TS7006: Parameter 't' implicitly has an 'any' type.
[15:03:50.977] server/routes/import-history.ts(497,42): error TS7006: Parameter 't' implicitly has an 'any' type.
[15:03:50.977] server/routes/import-history.ts(716,53): error TS7006: Parameter 't' implicitly has an 'any' type.
[15:03:50.977] server/routes/import-history.ts(720,33): error TS7006: Parameter 't' implicitly has an 'any' type.
[15:03:50.977] 
[15:03:52.021] server/services/analyticsService.ts(172,62): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'VisitorAnalyticsGetPayload'.
[15:03:52.021] server/services/analyticsService.ts(227,62): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'SessionAnalyticsGetPayload'.
[15:03:52.021] 
[15:04:07.182] Build Completed in /vercel/output [1m]
[15:04:07.575] Deploying outputs...
[15:04:15.237] 
[15:04:15.379] Deployment completed
[15:04:43.379] Uploading build cache [302.23 MB]...
[15:04:46.885] Build cache uploaded: 3.506s