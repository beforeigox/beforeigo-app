import React from 'react';

interface CoverProps {
  title: string;
  subtitle: string;
  role: string;
}

export interface CoverDesign {
  id: string;
  name: string;
  component: React.FC<CoverProps>;
  colorScheme: 'burgundy' | 'navy';
}

export const ClassicBurgundyCover: React.FC<CoverProps> = ({ title, role }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#8f1133' }}>
    <div className="border-4 border-white/30 rounded-lg p-8 w-full h-full flex flex-col items-center justify-center">
      <h2 className="text-4xl font-serif font-bold text-center mb-4" style={{ color: '#FAF7F2', fontFamily: 'Crimson Text, serif' }}>
        {role}'s Life Story
      </h2>
      <p className="text-xl text-center" style={{ color: '#FAF7F2', opacity: 0.9 }}>
        As told by {title}
      </p>
    </div>
  </div>
);

export const CreamEleganceCover: React.FC<CoverProps> = ({ title, role }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-12" style={{ backgroundColor: '#FAF7F2' }}>
    <div className="text-center">
      <div className="mb-4">
        <svg width="60" height="4" className="mx-auto">
          <rect width="60" height="4" fill="#8f1133" rx="2" />
        </svg>
      </div>
      <h2 className="text-4xl font-serif font-bold mb-4" style={{ color: '#8f1133', fontFamily: 'Crimson Text, serif' }}>
        {role}'s Life Story
      </h2>
      <div className="mb-4">
        <svg width="60" height="4" className="mx-auto">
          <rect width="60" height="4" fill="#8f1133" rx="2" />
        </svg>
      </div>
      <p className="text-lg mt-8" style={{ color: '#6B5B73' }}>
        As told by {title}
      </p>
    </div>
  </div>
);

export const VintageFrameCover: React.FC<CoverProps> = ({ title, role }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#FAF7F2' }}>
    <div className="border-8 rounded-xl p-8 w-full h-full flex flex-col items-center justify-center relative" style={{ borderColor: '#8f1133', borderStyle: 'double' }}>
      <div className="absolute top-4 left-4 w-12 h-12 border-4 border-t-0 border-l-0 rounded-br-2xl" style={{ borderColor: '#8f1133' }}></div>
      <div className="absolute top-4 right-4 w-12 h-12 border-4 border-t-0 border-r-0 rounded-bl-2xl" style={{ borderColor: '#8f1133' }}></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 border-4 border-b-0 border-l-0 rounded-tr-2xl" style={{ borderColor: '#8f1133' }}></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 border-4 border-b-0 border-r-0 rounded-tl-2xl" style={{ borderColor: '#8f1133' }}></div>
      <h2 className="text-4xl font-serif font-bold text-center mb-3" style={{ color: '#8f1133', fontFamily: 'Crimson Text, serif' }}>
        {role}'s Life Story
      </h2>
      <p className="text-lg text-center" style={{ color: '#6B5B73' }}>
        As told by {title}
      </p>
    </div>
  </div>
);

export const ModernMinimalistCover: React.FC<CoverProps> = ({ title, role }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-16" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF7F2 100%)' }}>
    <div className="text-center space-y-12">
      <h2 className="text-5xl font-serif font-bold tracking-wider" style={{ color: '#8f1133', fontFamily: 'Crimson Text, serif' }}>
        {role}'s Life Story
      </h2>
      <p className="text-xl tracking-wide" style={{ color: '#6B5B73' }}>
        As told by {title}
      </p>
    </div>
  </div>
);

export const FloralWatercolorCover: React.FC<CoverProps> = ({ title, role }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-8 relative" style={{ backgroundColor: '#FAF7F2' }}>
    <svg className="absolute top-0 left-0 w-32 h-32" viewBox="0 0 100 100">
      <circle cx="20" cy="20" r="15" fill="#8f1133" opacity="0.1" />
      <circle cx="35" cy="25" r="12" fill="#8f1133" opacity="0.15" />
      <circle cx="25" cy="35" r="10" fill="#8f1133" opacity="0.12" />
    </svg>
    <svg className="absolute top-0 right-0 w-32 h-32" viewBox="0 0 100 100">
      <circle cx="80" cy="20" r="15" fill="#8f1133" opacity="0.1" />
      <circle cx="65" cy="25" r="12" fill="#8f1133" opacity="0.15" />
      <circle cx="75" cy="35" r="10" fill="#8f1133" opacity="0.12" />
    </svg>
    <svg className="absolute bottom-0 left-0 w-32 h-32" viewBox="0 0 100 100">
      <circle cx="20" cy="80" r="15" fill="#8f1133" opacity="0.1" />
      <circle cx="35" cy="75" r="12" fill="#8f1133" opacity="0.15" />
      <circle cx="25" cy="65" r="10" fill="#8f1133" opacity="0.12" />
    </svg>
    <svg className="absolute bottom-0 right-0 w-32 h-32" viewBox="0 0 100 100">
      <circle cx="80" cy="80" r="15" fill="#8f1133" opacity="0.1" />
      <circle cx="65" cy="75" r="12" fill="#8f1133" opacity="0.15" />
      <circle cx="75" cy="65" r="10" fill="#8f1133" opacity="0.12" />
    </svg>
    <div className="text-center z-10">
      <h2 className="text-4xl font-serif font-bold mb-4" style={{ color: '#8f1133', fontFamily: 'Crimson Text, serif' }}>
        {role}'s Life Story
      </h2>
      <p className="text-lg" style={{ color: '#6B5B73' }}>
        As told by {title}
      </p>
    </div>
  </div>
);

export const HeritageCover: React.FC<CoverProps> = ({ title, role }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-10 relative" style={{ backgroundColor: '#F5F0E8', backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%238f1133" fill-opacity="0.03"%3E%3Cpath d="M0 0h20L0 20z"/%3E%3C/g%3E%3C/svg%3E")' }}>
    <div className="text-center">
      <div className="inline-block mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-6xl font-serif" style={{ backgroundColor: '#8f1133', color: '#FAF7F2' }}>
          {role.charAt(0)}
        </div>
      </div>
      <h2 className="text-4xl font-serif font-bold mb-2" style={{ color: '#8f1133', fontFamily: 'Crimson Text, serif' }}>
        {role}'s Life Story
      </h2>
      <p className="text-base mb-4" style={{ color: '#6B5B73' }}>
        As told by {title}
      </p>
      <div className="mt-6">
        <p className="text-sm font-semibold tracking-wider" style={{ color: '#8f1133' }}>
          A LEGACY PRESERVED
        </p>
      </div>
    </div>
  </div>
);

// Navy Blue Variants
export const ClassicNavyCover: React.FC<CoverProps> = ({ title, role }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#1e3a5f' }}>
    <div className="border-4 border-white/30 rounded-lg p-8 w-full h-full flex flex-col items-center justify-center">
      <h2 className="text-4xl font-serif font-bold text-center mb-4" style={{ color: '#FAF7F2', fontFamily: 'Crimson Text, serif' }}>
        {role}'s Life Story
      </h2>
      <p className="text-xl text-center" style={{ color: '#FAF7F2', opacity: 0.9 }}>
        As told by {title}
      </p>
    </div>
  </div>
);

export const CreamNavyEleganceCover: React.FC<CoverProps> = ({ title, role }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-12" style={{ backgroundColor: '#FAF7F2' }}>
    <div className="text-center">
      <div className="mb-4">
        <svg width="60" height="4" className="mx-auto">
          <rect width="60" height="4" fill="#1e3a5f" rx="2" />
        </svg>
      </div>
      <h2 className="text-4xl font-serif font-bold mb-4" style={{ color: '#1e3a5f', fontFamily: 'Crimson Text, serif' }}>
        {role}'s Life Story
      </h2>
      <div className="mb-4">
        <svg width="60" height="4" className="mx-auto">
          <rect width="60" height="4" fill="#1e3a5f" rx="2" />
        </svg>
      </div>
      <p className="text-lg mt-8" style={{ color: '#3A5A7A' }}>
        As told by {title}
      </p>
    </div>
  </div>
);

export const VintageFrameNavyCover: React.FC<CoverProps> = ({ title, role }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#FAF7F2' }}>
    <div className="border-8 rounded-xl p-8 w-full h-full flex flex-col items-center justify-center relative" style={{ borderColor: '#1e3a5f', borderStyle: 'double' }}>
      <div className="absolute top-4 left-4 w-12 h-12 border-4 border-t-0 border-l-0 rounded-br-2xl" style={{ borderColor: '#1e3a5f' }}></div>
      <div className="absolute top-4 right-4 w-12 h-12 border-4 border-t-0 border-r-0 rounded-bl-2xl" style={{ borderColor: '#1e3a5f' }}></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 border-4 border-b-0 border-l-0 rounded-tr-2xl" style={{ borderColor: '#1e3a5f' }}></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 border-4 border-b-0 border-r-0 rounded-tl-2xl" style={{ borderColor: '#1e3a5f' }}></div>
      <h2 className="text-4xl font-serif font-bold text-center mb-3" style={{ color: '#1e3a5f', fontFamily: 'Crimson Text, serif' }}>
        {role}'s Life Story
      </h2>
      <p className="text-lg text-center" style={{ color: '#3A5A7A' }}>
        As told by {title}
      </p>
    </div>
  </div>
);

export const ModernMinimalistNavyCover: React.FC<CoverProps> = ({ title, role }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-16" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF7F2 100%)' }}>
    <div className="text-center space-y-12">
      <h2 className="text-5xl font-serif font-bold tracking-wider" style={{ color: '#1e3a5f', fontFamily: 'Crimson Text, serif' }}>
        {role}'s Life Story
      </h2>
      <p className="text-xl tracking-wide" style={{ color: '#3A5A7A' }}>
        As told by {title}
      </p>
    </div>
  </div>
);

export const GeometricNavyCover: React.FC<CoverProps> = ({ title, role }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-8 relative" style={{ backgroundColor: '#FAF7F2' }}>
    {/* Geometric patterns - more masculine */}
    <svg className="absolute top-0 left-0 w-32 h-32" viewBox="0 0 100 100">
      <rect x="10" y="10" width="20" height="20" fill="#1e3a5f" opacity="0.08" transform="rotate(45 20 20)" />
      <rect x="25" y="15" width="15" height="15" fill="#1e3a5f" opacity="0.12" transform="rotate(45 32.5 22.5)" />
      <rect x="15" y="25" width="18" height="18" fill="#1e3a5f" opacity="0.1" transform="rotate(45 24 34)" />
    </svg>
    <svg className="absolute top-0 right-0 w-32 h-32" viewBox="0 0 100 100">
      <rect x="70" y="10" width="20" height="20" fill="#1e3a5f" opacity="0.08" transform="rotate(45 80 20)" />
      <rect x="60" y="15" width="15" height="15" fill="#1e3a5f" opacity="0.12" transform="rotate(45 67.5 22.5)" />
      <rect x="70" y="25" width="18" height="18" fill="#1e3a5f" opacity="0.1" transform="rotate(45 79 34)" />
    </svg>
    <svg className="absolute bottom-0 left-0 w-32 h-32" viewBox="0 0 100 100">
      <rect x="10" y="70" width="20" height="20" fill="#1e3a5f" opacity="0.08" transform="rotate(45 20 80)" />
      <rect x="25" y="70" width="15" height="15" fill="#1e3a5f" opacity="0.12" transform="rotate(45 32.5 77.5)" />
      <rect x="15" y="57" width="18" height="18" fill="#1e3a5f" opacity="0.1" transform="rotate(45 24 66)" />
    </svg>
    <svg className="absolute bottom-0 right-0 w-32 h-32" viewBox="0 0 100 100">
      <rect x="70" y="70" width="20" height="20" fill="#1e3a5f" opacity="0.08" transform="rotate(45 80 80)" />
      <rect x="60" y="70" width="15" height="15" fill="#1e3a5f" opacity="0.12" transform="rotate(45 67.5 77.5)" />
      <rect x="70" y="57" width="18" height="18" fill="#1e3a5f" opacity="0.1" transform="rotate(45 79 66)" />
    </svg>
    <div className="text-center z-10">
      <h2 className="text-4xl font-serif font-bold mb-4" style={{ color: '#1e3a5f', fontFamily: 'Crimson Text, serif' }}>
        {role}'s Life Story
      </h2>
      <p className="text-lg" style={{ color: '#3A5A7A' }}>
        As told by {title}
      </p>
    </div>
  </div>
);

export const HeritageNavyCover: React.FC<CoverProps> = ({ title, role }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-10 relative" style={{ backgroundColor: '#F5F0E8', backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%231e3a5f" fill-opacity="0.03"%3E%3Cpath d="M0 0h20L0 20z"/%3E%3C/g%3E%3C/svg%3E")' }}>
    <div className="text-center">
      <div className="inline-block mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-6xl font-serif" style={{ backgroundColor: '#1e3a5f', color: '#FAF7F2' }}>
          {role.charAt(0)}
        </div>
      </div>
      <h2 className="text-4xl font-serif font-bold mb-2" style={{ color: '#1e3a5f', fontFamily: 'Crimson Text, serif' }}>
        {role}'s Life Story
      </h2>
      <p className="text-base mb-4" style={{ color: '#3A5A7A' }}>
        As told by {title}
      </p>
      <div className="mt-6">
        <p className="text-sm font-semibold tracking-wider" style={{ color: '#1e3a5f' }}>
          A LEGACY PRESERVED
        </p>
      </div>
    </div>
  </div>
);

export const coverDesigns: CoverDesign[] = [
  // Burgundy variants (feminine)
  { id: 'classic-burgundy', name: 'Classic Burgundy', component: ClassicBurgundyCover, colorScheme: 'burgundy' },
  { id: 'cream-elegance', name: 'Cream Elegance', component: CreamEleganceCover, colorScheme: 'burgundy' },
  { id: 'vintage-frame', name: 'Vintage Frame', component: VintageFrameCover, colorScheme: 'burgundy' },
  { id: 'modern-minimalist', name: 'Modern Minimalist', component: ModernMinimalistCover, colorScheme: 'burgundy' },
  { id: 'floral-watercolor', name: 'Floral Watercolor', component: FloralWatercolorCover, colorScheme: 'burgundy' },
  { id: 'heritage', name: 'Heritage', component: HeritageCover, colorScheme: 'burgundy' },
  // Navy variants (masculine)
  { id: 'classic-navy', name: 'Classic Navy', component: ClassicNavyCover, colorScheme: 'navy' },
  { id: 'cream-navy-elegance', name: 'Cream with Navy', component: CreamNavyEleganceCover, colorScheme: 'navy' },
  { id: 'vintage-frame-navy', name: 'Vintage Frame Navy', component: VintageFrameNavyCover, colorScheme: 'navy' },
  { id: 'modern-minimalist-navy', name: 'Modern Minimalist Navy', component: ModernMinimalistNavyCover, colorScheme: 'navy' },
  { id: 'geometric-navy', name: 'Geometric Navy', component: GeometricNavyCover, colorScheme: 'navy' },
  { id: 'heritage-navy', name: 'Heritage Navy', component: HeritageNavyCover, colorScheme: 'navy' }
];
