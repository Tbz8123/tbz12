import React from "react"

const MOBILE_BREAKPOINT = 768
const IPAD_PRO_MIN_WIDTH = 1024 // iPad Pro 11" is 1024px, iPad Pro 12.9" is 1366px

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const userAgent = navigator.userAgent

      // Enhanced iPhone detection
      const isIPhone = /iPhone/.test(userAgent)
      const isIPad = /iPad|Macintosh/.test(userAgent) && 'ontouchend' in document
      const isIOS = isIPhone || isIPad

      // Safari version detection for debugging
      const safariVersion = /Version\/([\d.]+).*Safari/.exec(userAgent)?.[1]
      console.log(`[Device Detection] Device: ${isIPhone ? 'iPhone' : isIPad ? 'iPad' : 'Other'}`)
      console.log(`[Device Detection] Safari Version: ${safariVersion || 'Unknown'}`)
      console.log(`[Device Detection] User Agent: ${userAgent}`)
      console.log(`[Device Detection] Screen: ${width}x${height}`)

      // Force mobile for ALL iPhones (including iPhone XS)
      if (isIPhone) {
        // Detect iPhone XS specifically for additional compatibility
        const isIPhoneXS = /iPhone/.test(userAgent) && (
          (width === 375 && height === 812) || // iPhone XS portrait
          (width === 812 && height === 375)    // iPhone XS landscape
        );
        
        if (isIPhoneXS) {
          console.log(`[Device Detection] iPhone XS detected - applying enhanced compatibility mode`)
          // Add a global class for iPhone XS specific fixes
          document.documentElement.classList.add('iphone-xs-compat');
        }
        
        console.log(`[Device Detection] iPhone detected - forcing mobile mode`)
        return true
      }

      // Check if it's an iPad
      if (isIPad) {
        // iPad Pro detection: more precise screen size matching
        // iPad Pro 11" (2018+): 834×1194 logical pixels (1668×2388 physical)
        // iPad Pro 12.9" (2018+): 1024×1366 logical pixels (2048×2732 physical) 
        // iPad Air/Regular: 820×1180, 768×1024, etc.

        const maxDimension = Math.max(width, height)
        const minDimension = Math.min(width, height)
        const devicePixelRatio = window.devicePixelRatio || 1

        // iPad Pro 12.9" detection (most common for professional use)
        const isIpadPro129 = (maxDimension >= 1366 && minDimension >= 1024)

        // iPad Pro 11" detection 
        const isIpadPro11 = (maxDimension >= 1194 && minDimension >= 834 && maxDimension < 1366)

        // Additional check: iPad Pro typically has higher pixel density
        const hasProPixelRatio = devicePixelRatio >= 2

        const isIpadPro = (isIpadPro129 || isIpadPro11) && hasProPixelRatio

        console.log(`[Device Detection] iPad detected - ${width}x${height}, DPR: ${devicePixelRatio}`)
        console.log(`[Device Detection] iPad Pro 12.9": ${isIpadPro129}, iPad Pro 11": ${isIpadPro11}`)
        console.log(`[Device Detection] Has Pro pixel ratio: ${hasProPixelRatio}`)
        console.log(`[Device Detection] Final: Is iPad Pro: ${isIpadPro}`)

        // iPad Pro should be treated as desktop (show preview)
        // Regular iPads should be treated as mobile (hide preview)
        return !isIpadPro
      }

      // Check for Windows tablets, foldable devices, and convertible laptops
      const isWindows = /Windows/.test(userAgent)
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      if (isWindows && hasTouch) {
        // Detect specific tablet/foldable devices
        const isWindowsTablet = /Windows NT.*?Touch/.test(userAgent) || 
                               /Tablet PC/.test(userAgent) ||
                               userAgent.includes('ZenBook') ||
                               userAgent.includes('Surface') ||
                               userAgent.includes('Fold') ||
                               userAgent.includes('Duo') ||
                               userAgent.includes('Yoga') ||
                               userAgent.includes('Spectre') ||
                               userAgent.includes('Envy x360')

        // Detect based on aspect ratio and screen size (common for foldables/tablets)
        const aspectRatio = Math.max(width, height) / Math.min(width, height)
        const isSquarish = aspectRatio < 1.6 // More square-like aspect ratios
        const isLargeTouch = hasTouch && width >= 768 && width <= 1600 // Expanded range for foldables

        // Additional check: high DPI touch devices (common in premium tablets/convertibles)
        const devicePixelRatio = window.devicePixelRatio || 1
        const isHighDPI = devicePixelRatio >= 1.5

        // Multiple detection methods for robustness
        const isFoldableTablet = isWindowsTablet || 
                               (isLargeTouch && isSquarish) ||
                               (hasTouch && isHighDPI && width >= 800 && width <= 1400)

        console.log(`[Device Detection] Windows Touch Device - ${width}x${height}, DPR: ${devicePixelRatio}`)
        console.log(`[Device Detection] User Agent: ${userAgent}`)
        console.log(`[Device Detection] Is Windows Tablet: ${isWindowsTablet}`)
        console.log(`[Device Detection] Aspect Ratio: ${aspectRatio.toFixed(2)}, Is Squarish: ${isSquarish}`)
        console.log(`[Device Detection] Is High DPI: ${isHighDPI}, Is Large Touch: ${isLargeTouch}`)
        console.log(`[Device Detection] Is Foldable/Tablet: ${isFoldableTablet}`)

        // Windows tablets/foldables should be treated as mobile (hide preview)
        if (isFoldableTablet) {
          return true
        }
      }

      // For other non-iPad devices, use width breakpoint
      const isMobileDevice = width < MOBILE_BREAKPOINT
      console.log(`[Device Detection] Standard Device - Width: ${width}, Is Mobile: ${isMobileDevice}`)

      return isMobileDevice
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(detectDevice())
    }

    mql.addEventListener("change", onChange)
    setIsMobile(detectDevice())

    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
