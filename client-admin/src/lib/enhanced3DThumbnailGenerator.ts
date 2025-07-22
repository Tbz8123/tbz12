import html2canvas from 'html2canvas';

export interface Enhanced3DThumbnailOptions {
  scale?: number;
  quality?: number;
  backgroundColor?: string;
  padding?: string;
  format?: 'webp' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  aspectRatio?: '3:4' | 'A4';
  enableGlassmorphism?: boolean;
  enableSoftShadows?: boolean;
  enableReflection?: boolean;
}

/**
 * Enhanced 3D Thumbnail Generator for Modern Web Apps
 * Optimized for 3D UI environments with glassmorphism and soft shadows
 * Generates 600x800px high-quality thumbnails with WebP/JPEG fallback
 */
export class Enhanced3DThumbnailGenerator {
  private static defaultOptions: Enhanced3DThumbnailOptions = {
    scale: 2.5, // Higher scale for sharper images
    quality: 0.92,
    backgroundColor: '#ffffff',
    padding: '12px',
    format: 'webp',
    width: 600,
    height: 800,
    aspectRatio: '3:4',
    enableGlassmorphism: true,
    enableSoftShadows: true,
    enableReflection: false
  };

  /**
   * Generate enhanced 3D thumbnail with modern web aesthetics
   */
  static async generate(
    element: HTMLElement,
    options: Enhanced3DThumbnailOptions = {}
  ): Promise<{ webp: string; jpeg: string; metadata: any }> {
    const config = { ...this.defaultOptions, ...options };

    // Store original styles for restoration
    const originalStyles = this.storeOriginalStyles(element);

    try {
      // Apply enhanced 3D styling
      this.apply3DStyling(element, config);

      // Create enhanced wrapper with 3D effects
      const enhancedWrapper = this.create3DWrapper(element, config);

      // Generate high-quality canvas
      const canvas = await this.generateCanvas(enhancedWrapper, config);

      // Apply post-processing effects
      const processedCanvas = this.applyPostProcessing(canvas, config);

      // Generate multiple formats
      const webpUrl = this.generateWebP(processedCanvas, config);
      const jpegUrl = this.generateJPEG(processedCanvas, config);

      const metadata = {
        width: config.width,
        height: config.height,
        aspectRatio: config.aspectRatio,
        format: config.format,
        generatedAt: new Date().toISOString(),
        fileSize: {
          webp: this.estimateFileSize(webpUrl),
          jpeg: this.estimateFileSize(jpegUrl)
        }
      };

      // Cleanup
      this.cleanup(enhancedWrapper, element, originalStyles);

      return { webp: webpUrl, jpeg: jpegUrl, metadata };

    } catch (error) {
      // Ensure cleanup even on error
      this.restoreOriginalStyles(element, originalStyles);
      throw error;
    }
  }

  /**
   * Generate optimized thumbnail for template previews
   */
  static async generateTemplateThumbnail(
    previewContainer: HTMLElement,
    options: Enhanced3DThumbnailOptions = {}
  ): Promise<{ primary: string; fallback: string; metadata: any }> {
    const config = { 
      ...this.defaultOptions, 
      ...options,
      scale: 1.8, // Optimized for template previews
      width: 600,
      height: 800,
      enableGlassmorphism: true,
      enableSoftShadows: true
    };

    // Check if element is scaled and needs special handling
    const isScaled = this.detectScaledElement(previewContainer);

    if (isScaled) {
      return this.generateFromScaledElement(previewContainer, config);
    }

    const result = await this.generate(previewContainer, config);
    return { 
      primary: config.format === 'webp' ? result.webp : result.jpeg,
      fallback: result.jpeg,
      metadata: result.metadata
    };
  }

  /**
   * Batch generate thumbnails for multiple templates
   */
  static async batchGenerate(
    elements: { element: HTMLElement; id: string }[],
    options: Enhanced3DThumbnailOptions = {}
  ): Promise<Array<{ id: string; webp: string; jpeg: string; metadata: any }>> {
    const results = [];

    for (const { element, id } of elements) {
      try {
        const result = await this.generate(element, options);
        results.push({ id, ...result });

        // Small delay between generations to prevent browser overload
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to generate thumbnail for ${id}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        results.push({ 
          id, 
          webp: '', 
          jpeg: '', 
          metadata: { error: errorMessage } 
        });
      }
    }

    return results;
  }

  // Private helper methods
  private static storeOriginalStyles(element: HTMLElement): Record<string, string> {
    return {
      border: element.style.border,
      borderRadius: element.style.borderRadius,
      boxShadow: element.style.boxShadow,
      filter: element.style.filter,
      transform: element.style.transform,
      backgroundColor: element.style.backgroundColor,
      padding: element.style.padding,
      margin: element.style.margin,
      backdropFilter: element.style.backdropFilter,
      WebkitBackdropFilter: (element.style as any).WebkitBackdropFilter
    };
  }

  private static apply3DStyling(element: HTMLElement, config: Enhanced3DThumbnailOptions): void {
    // Remove conflicting styles
    element.style.border = 'none';
    element.style.outline = 'none';
    element.style.boxShadow = 'none';
    element.style.margin = '0';
    element.style.padding = config.padding || '12px';
    element.style.backgroundColor = config.backgroundColor || '#ffffff';

    if (config.enableGlassmorphism) {
      element.style.backdropFilter = 'blur(20px)';
      (element.style as any).WebkitBackdropFilter = 'blur(20px)';
      element.style.borderRadius = '16px';
    }
  }

  private static create3DWrapper(element: HTMLElement, config: Enhanced3DThumbnailOptions): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: ${config.width}px;
      height: ${config.height}px;
      background: ${config.backgroundColor};
      overflow: hidden;
      perspective: 1000px;
      transform-style: preserve-3d;
      ${config.enableSoftShadows ? 'box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);' : ''}
      ${config.enableGlassmorphism ? 'backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2);' : ''}
      border-radius: 16px;
    `;

    // Clone element to avoid affecting original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.width = '100%';
    clonedElement.style.height = '100%';
    clonedElement.style.transform = 'translateZ(0)'; // GPU acceleration

    wrapper.appendChild(clonedElement);
    document.body.appendChild(wrapper);

    return wrapper;
  }

  private static async generateCanvas(
    wrapper: HTMLElement, 
    config: Enhanced3DThumbnailOptions
  ): Promise<HTMLCanvasElement> {
    // Wait for styles to apply and content to render
    await new Promise(resolve => setTimeout(resolve, 200));

    return html2canvas(wrapper, {
      scale: config.scale || 2.5,
      useCORS: true,
      allowTaint: false,
      backgroundColor: config.backgroundColor,
      width: config.width,
      height: config.height,
      logging: false,
      foreignObjectRendering: true,
      imageTimeout: 0,
      removeContainer: false
    });
  }

  private static applyPostProcessing(
    canvas: HTMLCanvasElement, 
    config: Enhanced3DThumbnailOptions
  ): HTMLCanvasElement {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Apply subtle enhancements
    if (config.enableSoftShadows) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;
    }

    // Apply reflection effect if enabled
    if (config.enableReflection) {
      this.addReflectionEffect(ctx, canvas);
    }

    return canvas;
  }

  private static addReflectionEffect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const gradient = ctx.createLinearGradient(0, canvas.height * 0.8, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.2);
  }

  private static generateWebP(canvas: HTMLCanvasElement, config: Enhanced3DThumbnailOptions): string {
    try {
      return canvas.toDataURL('image/webp', config.quality || 0.92);
    } catch (error) {
      // Fallback to JPEG if WebP not supported
      return canvas.toDataURL('image/jpeg', config.quality || 0.92);
    }
  }

  private static generateJPEG(canvas: HTMLCanvasElement, config: Enhanced3DThumbnailOptions): string {
    return canvas.toDataURL('image/jpeg', config.quality || 0.92);
  }

  private static estimateFileSize(dataUrl: string): string {
    const base64Length = dataUrl.split(',')[1]?.length || 0;
    const sizeInBytes = (base64Length * 3) / 4;
    return `${Math.round(sizeInBytes / 1024)}KB`;
  }

  private static detectScaledElement(element: HTMLElement): boolean {
    const computedStyle = window.getComputedStyle(element);
    const transform = computedStyle.transform || element.style.transform;
    return transform.includes('scale');
  }

  private static async generateFromScaledElement(
    scaledElement: HTMLElement,
    config: Enhanced3DThumbnailOptions
  ): Promise<{ primary: string; fallback: string; metadata: any }> {
    // Create temporary unscaled version for high-quality capture
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 800px;
      height: 1131px;
      background: ${config.backgroundColor};
      overflow: hidden;
    `;

    const clonedElement = scaledElement.cloneNode(true) as HTMLElement;
    clonedElement.style.transform = 'none';
    clonedElement.style.width = '800px';
    clonedElement.style.height = '1131px';

    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    try {
      const result = await this.generate(tempContainer, config);
      return { 
        primary: config.format === 'webp' ? result.webp : result.jpeg,
        fallback: result.jpeg,
        metadata: result.metadata
      };
    } finally {
      document.body.removeChild(tempContainer);
    }
  }

  private static cleanup(
    wrapper: HTMLElement, 
    originalElement: HTMLElement, 
    originalStyles: Record<string, string>
  ): void {
    // Remove wrapper
    if (wrapper.parentNode) {
      document.body.removeChild(wrapper);
    }

    // Restore original styles
    this.restoreOriginalStyles(originalElement, originalStyles);
  }

  private static restoreOriginalStyles(
    element: HTMLElement, 
    originalStyles: Record<string, string>
  ): void {
    Object.entries(originalStyles).forEach(([property, value]) => {
      (element.style as any)[property] = value;
    });
  }
}

/**
 * Convenience function for quick 3D thumbnail generation
 */
export async function generate3DThumbnail(
  element: HTMLElement,
  options?: Enhanced3DThumbnailOptions
): Promise<string> {
  const result = await Enhanced3DThumbnailGenerator.generate(element, options);
  return options?.format === 'jpeg' ? result.jpeg : result.webp;
}

/**
 * Generate with automatic format selection based on browser support
 */
export async function generateOptimizedThumbnail(
  element: HTMLElement,
  options?: Enhanced3DThumbnailOptions
): Promise<{ url: string; format: string; metadata: any }> {
  const result = await Enhanced3DThumbnailGenerator.generate(element, options);

  // Check WebP support
  const supportsWebP = await checkWebPSupport();

  return {
    url: supportsWebP ? result.webp : result.jpeg,
    format: supportsWebP ? 'webp' : 'jpeg',
    metadata: result.metadata
  };
}

// WebP support detection
function checkWebPSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
} 