import { useState, useEffect } from 'react';

export function useResponsive() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  const albumSize = Math.max(120, Math.min(220, width * 0.18));
  const spacing = Math.max(80, Math.min(180, width * 0.15));
  const playBtnSize = isMobile ? 56 : 64;
  const ctrlBtnSize = isMobile ? 40 : 44;
  const iconSize = isMobile ? 24 : 28;
  const modeIconSize = isMobile ? 18 : 20;
  const progressHeight = isMobile ? 2 : 1.5;
  const gap = isMobile ? 16 : 20;
  const containerHeight = isMobile ? 280 : 384;

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
    albumSize,
    spacing,
    playBtnSize,
    ctrlBtnSize,
    iconSize,
    modeIconSize,
    progressHeight,
    gap,
    containerHeight,
  };
}
