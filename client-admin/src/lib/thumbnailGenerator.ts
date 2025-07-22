import html2canvas from 'html2canvas';

export interface ThumbnailOptions {
  scale?: number;
  quality?: number;
  backgroundColor?: string;
  padding?: string;
}

/**
 * High-quality thumbnail generator utility
 * Uses the same enhanced settings as the admin template editor
 */
export async function generateHighQualityThumbnail(
  element: HTMLElement,
  options: ThumbnailOptions = {}
): Promise<string> {
  const {
    scale = 3,
    quality = 0.95,
    backgroundColor = '#ffffff',
    padding = '8px'
  } = options;

  // Store ALL possible border/shadow styles to restore later
  const originalStyles = {
    border: element.style.border,
    borderTop: element.style.borderTop,
    borderRight: element.style.borderRight,
    borderBottom: element.style.borderBottom,
    borderLeft: element.style.borderLeft,
    borderWidth: element.style.borderWidth,
    borderStyle: element.style.borderStyle,
    borderColor: element.style.borderColor,
    boxShadow: element.style.boxShadow,
    padding: element.style.padding,
    margin: element.style.margin,
    backgroundColor: element.style.backgroundColor,
    outline: element.style.outline,
    filter: element.style.filter
  };

  // Aggressively remove ALL border and shadow styles
  element.style.border = 'none';
  element.style.borderTop = 'none';
  element.style.borderRight = 'none';
  element.style.borderBottom = 'none';
  element.style.borderLeft = 'none';
  element.style.borderWidth = '0';
  element.style.borderStyle = 'none';
  element.style.borderColor = 'transparent';
  element.style.boxShadow = 'none';
  element.style.outline = 'none';
  element.style.filter = 'none';
  element.style.padding = padding;
  element.style.margin = '0';
  element.style.backgroundColor = backgroundColor;

  // Remove ALL border-related CSS classes
  const originalClassName = element.className;
  const cleanClassName = element.className
    .replace(/border-dashed/g, '')
    .replace(/border-dotted/g, '')
    .replace(/border-solid/g, '')
    .replace(/border-gray-\d+/g, '')
    .replace(/border-slate-\d+/g, '')
    .replace(/shadow-\w+/g, '')
    .replace(/\bborder\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  element.className = cleanClassName;

  // Create a clean wrapper div to ensure no artifacts
  const wrapperDiv = document.createElement('div');
  wrapperDiv.style.cssText = `
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    margin: 0 !important;
    padding: ${padding} !important;
    background-color: ${backgroundColor} !important;
    width: ${element.offsetWidth}px;
    height: ${element.offsetHeight}px;
    overflow: hidden;
  `;

  // Temporarily wrap the element
  const originalParent = element.parentNode;
  const originalNextSibling = element.nextSibling;

  if (originalParent) {
    originalParent.insertBefore(wrapperDiv, element);
    wrapperDiv.appendChild(element);
  }

  try {
    // Wait longer for styles to fully apply
    await new Promise(resolve => setTimeout(resolve, 150));

    const canvas = await html2canvas(wrapperDiv, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor,
      width: wrapperDiv.offsetWidth,
      height: wrapperDiv.offsetHeight,
      logging: false,
      foreignObjectRendering: true,
      removeContainer: true,
      ignoreElements: (el) => {
        // Ignore any elements that might have borders
        const classList = Array.from(el.classList || []);
        return classList.some(cls => 
          cls.includes('border') || 
          cls.includes('shadow') ||
          cls.includes('outline')
        );
      }
    });

    return canvas.toDataURL('image/png', quality);
  } finally {
    // Restore the original DOM structure
    if (originalParent) {
      if (originalNextSibling) {
        originalParent.insertBefore(element, originalNextSibling);
      } else {
        originalParent.appendChild(element);
      }
      if (wrapperDiv.parentNode) {
        wrapperDiv.parentNode.removeChild(wrapperDiv);
      }
    }

    // Restore ALL original styles
    Object.entries(originalStyles).forEach(([property, value]) => {
      (element.style as any)[property] = value;
    });
    element.className = originalClassName;
  }
}

/**
 * Generate thumbnail from a scaled template preview
 * Temporarily removes scaling to capture full resolution, then scales down
 */
export async function generateScaledTemplateThumbnail(
  scaledElement: HTMLElement,
  options: ThumbnailOptions = {}
): Promise<string> {
  const {
    scale = 0.3, // Scale down to thumbnail size
    quality = 0.95,
    backgroundColor = '#ffffff',
    padding = '0px'
  } = options;

  // Create a temporary container that won't affect layout
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'fixed';
  tempContainer.style.top = '-9999px';
  tempContainer.style.left = '-9999px';
  tempContainer.style.zIndex = '-1';
  tempContainer.style.visibility = 'hidden';
  tempContainer.style.pointerEvents = 'none';
  tempContainer.style.overflow = 'hidden';
  tempContainer.style.width = '800px';
  tempContainer.style.height = '1131px';

  try {
    // Clone the element with deep cloning to preserve React components
    const clonedElement = scaledElement.cloneNode(true) as HTMLElement;

    // Remove scaling from the clone to capture at full resolution
    clonedElement.style.transform = 'none';
    clonedElement.style.transformOrigin = 'top left';
    clonedElement.style.backgroundColor = backgroundColor;
    clonedElement.style.width = '800px';
    clonedElement.style.height = '1131px';
    clonedElement.style.position = 'relative';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '0';

    // Add to document temporarily
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    // Wait for render and any dynamic content (longer wait for React components)
    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(clonedElement, {
      scale, // Scale down during capture for thumbnail size
      useCORS: true,
      allowTaint: false,
      backgroundColor,
      width: 800, // Full template width
      height: 1131, // Full template height
      logging: false,
      foreignObjectRendering: true,
      removeContainer: false, // Keep container to avoid issues
      imageTimeout: 0, // No timeout
      onclone: (clonedDoc) => {
        // Ensure all styles are properly applied in the cloned document
        const clonedBody = clonedDoc.body;
        if (clonedBody) {
          clonedBody.style.margin = '0';
          clonedBody.style.padding = '0';
        }
      }
    });

    return canvas.toDataURL('image/png', quality);
  } catch (error) {
    console.error('Error in generateScaledTemplateThumbnail:', error);
    throw error;
  } finally {
    // Cleanup
    try {
      if (tempContainer.parentNode) {
        document.body.removeChild(tempContainer);
      }
    } catch (cleanupError) {
      console.warn('Error during cleanup:', cleanupError);
    }
  }
}

/**
 * Generate thumbnail from a template preview container
 * Specifically designed for resume template previews
 */
export async function generateTemplateThumbnail(
  previewContainer: HTMLElement,
  options: ThumbnailOptions = {}
): Promise<string> {
  // Check if this is a scaled element (contains transform: scale)
  const computedStyle = window.getComputedStyle(previewContainer);
  const transform = computedStyle.transform || previewContainer.style.transform;

  // Look for scaled child elements if the container itself isn't scaled
  let scaledChild: HTMLElement | null = null;
  if (!transform.includes('scale')) {
    const children = previewContainer.querySelectorAll('[style*="scale"]');
    if (children.length > 0) {
      scaledChild = children[0] as HTMLElement;
    }
  }

  // If we found a scaled element or the container is scaled, use the specialized generator
  if ((transform && transform.includes('scale')) || scaledChild) {
    const targetElement = scaledChild || previewContainer;
    return generateScaledTemplateThumbnail(targetElement, {
      scale: 0.3, // Scale for thumbnail size (240x320 approx)
      quality: 0.95,
      backgroundColor: '#ffffff',
      padding: '0px',
      ...options
    });
  }

  // For direct containers (like from admin regeneration), capture directly
  return generateHighQualityThumbnail(previewContainer, {
    scale: 0.3, // Scale down for thumbnail size
    quality: 0.95,
    backgroundColor: '#ffffff',
    padding: '8px',
    ...options
  });
} 