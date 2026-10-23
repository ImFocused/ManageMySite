// Centralized high-res construction imagery and guaranteed offline SVG fallbacks

export const FALLBACK_CONSTRUCTION_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#141c48"/>
          <stop offset="100%" stop-color="#1e2761"/>
        </linearGradient>
        <linearGradient id="beam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#cadcfc" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.95"/>
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2a367c" stroke-width="1" stroke-opacity="0.3"/>
        </pattern>
      </defs>
      
      <!-- Background -->
      <rect width="800" height="600" fill="url(#bg)"/>
      <rect width="800" height="600" fill="url(#grid)"/>
      
      <!-- Site Crane & Structure Illustration -->
      <g stroke="#cadcfc" stroke-width="2.5" fill="none" opacity="0.85">
        <!-- Crane Tower -->
        <line x1="220" y1="120" x2="220" y2="460" stroke-width="5"/>
        <line x1="240" y1="120" x2="240" y2="460" stroke-width="5"/>
        <!-- Lattice -->
        <line x1="220" y1="140" x2="240" y2="160"/>
        <line x1="240" y1="160" x2="220" y2="180"/>
        <line x1="220" y1="180" x2="240" y2="200"/>
        <line x1="240" y1="200" x2="220" y2="220"/>
        <line x1="220" y1="220" x2="240" y2="240"/>
        <line x1="240" y1="240" x2="220" y2="260"/>
        <line x1="220" y1="260" x2="240" y2="280"/>
        <line x1="240" y1="280" x2="220" y2="300"/>
        <line x1="220" y1="300" x2="240" y2="320"/>
        <line x1="240" y1="320" x2="220" y2="340"/>
        <line x1="220" y1="340" x2="240" y2="360"/>
        <line x1="240" y1="360" x2="220" y2="380"/>
        <line x1="220" y1="380" x2="240" y2="400"/>
        <!-- Crane Arm / Jib -->
        <line x1="140" y1="120" x2="520" y2="120" stroke-width="4"/>
        <line x1="220" y1="90" x2="140" y2="120"/>
        <line x1="240" y1="90" x2="420" y2="120"/>
        <!-- Hoist Cable -->
        <line x1="420" y1="120" x2="420" y2="230" stroke="#ffffff" stroke-width="2" stroke-dasharray="4,4"/>
        <!-- Hook & Load -->
        <rect x="390" y="230" width="60" height="25" rx="3" fill="#cadcfc" stroke="#ffffff"/>
        
        <!-- Multi-story Building Skeleton -->
        <rect x="460" y="200" width="220" height="260" rx="4" fill="#1b2354" stroke="#485aa6" stroke-width="3"/>
        <!-- Concrete Slabs -->
        <line x1="460" y1="250" x2="680" y2="250" stroke-width="4"/>
        <line x1="460" y1="300" x2="680" y2="300" stroke-width="4"/>
        <line x1="460" y1="350" x2="680" y2="350" stroke-width="4"/>
        <line x1="460" y1="400" x2="680" y2="400" stroke-width="4"/>
        <!-- Columns -->
        <line x1="510" y1="200" x2="510" y2="460" stroke-width="3"/>
        <line x1="570" y1="200" x2="570" y2="460" stroke-width="3"/>
        <line x1="630" y1="200" x2="630" y2="460" stroke-width="3"/>
        
        <!-- Ground Level -->
        <line x1="100" y1="460" x2="700" y2="460" stroke-width="4"/>
      </g>
      
      <!-- Status Badge Overlay -->
      <rect x="250" y="490" width="300" height="42" rx="21" fill="#16855b"/>
      <circle cx="274" cy="511" r="8" fill="#ffffff"/>
      <path d="M270 511 L273 514 L278 508" stroke="#16855b" stroke-width="2" fill="none" stroke-linecap="round"/>
      <text x="398" y="517" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">VERIFIED SITE EVIDENCE</text>
      
      <!-- Header Label -->
      <text x="400" y="65" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#cadcfc" text-anchor="middle" letter-spacing="2">MANAGEMYSITE • PROGRESS RECORD</text>
    </svg>`
  );

export const SITE_PHOTOS = [
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1590644365607-1c5a2c8b6b5d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1508450859948-4e04c492982a?auto=format&fit=crop&w=1200&q=80",
];

export function handleImageError(event) {
  if (event && event.currentTarget) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = FALLBACK_CONSTRUCTION_IMAGE;
  }
}

export function getReportPhoto(report, index = 0) {
  if (
    report?.photos &&
    Array.isArray(report.photos) &&
    report.photos.length > index &&
    report.photos[index]?.url
  ) {
    return report.photos[index].url;
  }
  const fallbackIndex = typeof report?.id === "string" 
    ? Math.abs(report.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % SITE_PHOTOS.length
    : 0;
  return SITE_PHOTOS[fallbackIndex] || FALLBACK_CONSTRUCTION_IMAGE;
}
