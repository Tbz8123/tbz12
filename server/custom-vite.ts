import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";

const viteLogger = createLogger();

export async function setupCustomVite(app: Express, server: Server) {
  console.log('🔧 Setting up custom Vite server with Replit host support...');
  
  // Get the current Replit domain from environment
  const replId = process.env.REPL_ID;
  const replitDomain = `${replId}.replit.dev`;
  
  const isReplit = !!process.env.REPL_ID;
  
  console.log(`🌐 Configuring for Replit domain: ${replitDomain}`);
  
  const serverOptions = {
    middlewareMode: true,
    hmr: { 
      server,
      host: isReplit ? "0.0.0.0" : "localhost",
      port: 3000  // Keep as 3000
    },
    host: isReplit ? "0.0.0.0" : "localhost",
    allowedHosts: "all",
    origin: "http://localhost:3000"  // Changed from 0.0.0.0 to localhost
  };

  const viteConfig = {
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        // Suppress allowedHosts errors for Replit domains
        if (typeof msg === 'string' && (msg.includes('not allowed') || msg.includes('allowedHosts'))) {
          console.log('🛡️ Bypassing host restriction for Replit environment');
          return;
        }
        viteLogger.error(msg, options);
      },
    },
    server: serverOptions,
    appType: "custom" as const,
    root: path.resolve(process.cwd(), "client"),
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "client", "src"),
        "@shared": path.resolve(process.cwd(), "shared"),
        "@assets": path.resolve(process.cwd(), "attached_assets"),
      },
    },
    build: {
      outDir: path.resolve(process.cwd(), "dist/public"),
      emptyOutDir: true,
    },
    define: {
      __REPLIT_DEV_DOMAIN__: JSON.stringify(replitDomain)
    }
  };

  const vite = await createViteServer(viteConfig);

  // Custom middleware to handle host restrictions for all Replit domains
  app.use((req, res, next) => {
    // Allow all requests in development mode on Replit
    if (process.env.NODE_ENV === 'development' && process.env.REPL_ID) {
      // Accept any replit.dev domain
      const host = req.headers.host;
      if (host && host.includes('.replit.dev')) {
        req.headers.host = '0.0.0.0:3000'; // Changed from 5000 to 3000
      } else {
        req.headers.host = req.headers.host || '0.0.0.0:3000'; // Changed from 5000 to 3000
      }
    }
    next();
  });

  app.use(vite.middlewares);
  
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        process.cwd(),
        "client",
        "index.html",
      );

      // Always reload the index.html file from disk in case it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      
      // Add cache busting for development
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${Date.now()}"`,
      );
      
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  console.log('✅ Custom Vite server configured successfully');
}