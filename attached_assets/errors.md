[14:36:32.112] Running build in Washington, D.C., USA (East) – iad1
[14:36:32.113] Build machine configuration: 4 cores, 8 GB
[14:36:32.125] Cloning github.com/Tbz8123/tbz12 (Branch: main, Commit: 8854a5e)
[14:36:32.131] Skipping build cache, deployment was triggered without cache.
[14:36:32.546] Cloning completed: 421.000ms
[14:36:33.709] Running "vercel build"
[14:36:34.429] Vercel CLI 44.5.0
[14:36:34.670] WARN! Due to `builds` existing in your configuration file, the Build and Development Settings defined in your Project Settings will not apply. Learn More: https://vercel.link/unused-build-settings
[14:36:35.185] Installing dependencies...
[14:36:39.124] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[14:36:40.504] npm warn deprecated lodash.pick@4.4.0: This package is deprecated. Use destructuring assignment syntax instead.
[14:36:40.907] npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
[14:36:41.725] npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
[14:36:41.847] npm warn deprecated @types/jspdf@2.0.0: This is a stub types definition. jspdf provides its own type definitions, so you do not need this installed.
[14:36:43.065] npm warn deprecated @esbuild-kit/esm-loader@2.6.5: Merged into tsx: https://tsx.is
[14:36:43.146] npm warn deprecated @esbuild-kit/core-utils@3.3.2: Merged into tsx: https://tsx.is
[14:36:43.362] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[14:36:47.899] npm warn deprecated puppeteer@10.4.0: < 22.8.2 is no longer supported
[14:37:07.210] 
[14:37:07.211] added 936 packages in 32s
[14:37:07.503] Using TypeScript 5.6.3 (local user-provided)
[14:37:16.135] server/routes/professional-summaries.ts(46,25): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'ProfessionalSummaryJobTitleWhereInput'.
[14:37:16.135] server/routes/professional-summaries.ts(105,25): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'ProfessionalSummaryWhereInput'.
[14:37:16.135] server/routes/professional-summaries.ts(146,25): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'ProfessionalSummaryWhereInput'.
[14:37:16.136] server/routes/professional-summaries.ts(217,16): error TS2339: Property 'meta' does not exist on type '{ code?: string | undefined; }'.
[14:37:16.136] server/routes/professional-summaries.ts(402,49): error TS7006: Parameter 'jt' implicitly has an 'any' type.
[14:37:16.136] server/routes/professional-summaries.ts(424,50): error TS7006: Parameter 'summary' implicitly has an 'any' type.
[14:37:16.136] server/routes/professional-summaries.ts(438,38): error TS7006: Parameter 'row' implicitly has an 'any' type.
[14:37:16.136] server/routes/professional-summaries.ts(445,64): error TS7006: Parameter 'row' implicitly has an 'any' type.
[14:37:16.136] server/routes/professional-summaries.ts(453,38): error TS7006: Parameter 'row' implicitly has an 'any' type.
[14:37:16.136] server/routes/professional-summaries.ts(460,64): error TS7006: Parameter 'row' implicitly has an 'any' type.
[14:37:16.136] 
[14:37:16.360] server/routes/analytics.ts(140,48): error TS7006: Parameter 'v' implicitly has an 'any' type.
[14:37:16.360] server/routes/analytics.ts(141,50): error TS7006: Parameter 'v' implicitly has an 'any' type.
[14:37:16.360] server/routes/analytics.ts(144,52): error TS7006: Parameter 'v' implicitly has an 'any' type.
[14:37:16.360] server/routes/analytics.ts(145,54): error TS7006: Parameter 'v' implicitly has an 'any' type.
[14:37:16.360] server/routes/analytics.ts(148,47): error TS7006: Parameter 'v' implicitly has an 'any' type.
[14:37:16.360] server/routes/analytics.ts(165,51): error TS7006: Parameter 'v' implicitly has an 'any' type.
[14:37:16.361] server/routes/analytics.ts(445,88): error TS7006: Parameter 'item' implicitly has an 'any' type.
[14:37:16.361] server/routes/analytics.ts(466,11): error TS18046: 'item' is of type 'unknown'.
[14:37:16.361] server/routes/analytics.ts(467,9): error TS18046: 'item' is of type 'unknown'.
[14:37:16.361] server/routes/analytics.ts(467,24): error TS18046: 'item' is of type 'unknown'.
[14:37:16.361] server/routes/analytics.ts(467,41): error TS18046: 'item' is of type 'unknown'.
[14:37:16.361] 
[14:37:16.603] server/routes/import-history.ts(78,45): error TS7006: Parameter 'imp' implicitly has an 'any' type.
[14:37:16.604] server/routes/import-history.ts(313,32): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'ImportHistoryUpdateInput'.
[14:37:16.604] server/routes/import-history.ts(481,53): error TS7006: Parameter 't' implicitly has an 'any' type.
[14:37:16.604] server/routes/import-history.ts(485,33): error TS7006: Parameter 't' implicitly has an 'any' type.
[14:37:16.604] server/routes/import-history.ts(497,42): error TS7006: Parameter 't' implicitly has an 'any' type.
[14:37:16.604] server/routes/import-history.ts(716,53): error TS7006: Parameter 't' implicitly has an 'any' type.
[14:37:16.604] server/routes/import-history.ts(720,33): error TS7006: Parameter 't' implicitly has an 'any' type.
[14:37:16.604] 
[14:37:17.464] server/services/analyticsService.ts(172,62): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'VisitorAnalyticsGetPayload'.
[14:37:17.464] server/services/analyticsService.ts(227,62): error TS2694: Namespace '"/vercel/path0/node_modules/.prisma/client/default".Prisma' has no exported member 'SessionAnalyticsGetPayload'.
[14:37:17.464] 
[14:37:31.840] Build Completed in /vercel/output [57s]
[14:37:32.217] Deploying outputs...
[14:37:39.707] 
[14:37:39.871] Deployment completed
[14:38:07.102] Uploading build cache [302.23 MB]...
[14:38:10.950] Build cache uploaded: 3.847s
[14:38:13.197] Exiting build container