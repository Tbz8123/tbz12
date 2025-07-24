import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    host: "0.0.0.0",
    allowedHosts: ['.localhost'],
    origin: "http://localhost:3000"
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        // Don't exit process on Vite errors to prevent crashes
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const clientDistPath = path.resolve(import.meta.dirname, "..", "dist", "client");
  const adminDistPath = path.resolve(import.meta.dirname, "..", "dist", "admin");

  if (!fs.existsSync(clientDistPath)) {
    throw new Error(
      `Could not find the client build directory: ${clientDistPath}, make sure to build the client first`,
    );
  }

  if (!fs.existsSync(adminDistPath)) {
    throw new Error(
      `Could not find the admin build directory: ${adminDistPath}, make sure to build the admin first`,
    );
  }

  // Serve admin static files
  app.use("/admin", express.static(adminDistPath));
  
  // Serve client static files
  app.use(express.static(clientDistPath));

  // Admin routes - serve admin index.html for admin paths
  app.use("/admin/*", (_req, res) => {
    res.sendFile(path.resolve(adminDistPath, "index.html"));
  });

  // Client routes - fall through to client index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(clientDistPath, "index.html"));
  });
}
