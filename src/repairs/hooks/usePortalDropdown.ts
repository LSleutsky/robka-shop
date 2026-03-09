import { useCallback, useEffect, useRef, useState } from 'react';

interface PortalDropdownOptions {
  width: number | 'match';
  anchor: 'above' | 'below';
  offset?: number;
  trackScroll?: boolean;
}

interface PortalDropdownPosition {
  top: number;
  left: number;
  width?: number;
}

export default function usePortalDropdown<
  B extends HTMLElement = HTMLButtonElement,
  D extends HTMLElement = HTMLDivElement
>(options: PortalDropdownOptions) {
  const buttonRef = useRef<B>(null);
  const dropdownRef = useRef<D>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<PortalDropdownPosition>({ top: 0, left: 0 });

  const { width, anchor, offset = 6, trackScroll = false } = options;

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) {
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = width === 'match' ? rect.width : width;
    const left = Math.min(rect.left, window.innerWidth - dropdownWidth - 8);

    const position: PortalDropdownPosition = {
      top: anchor === 'below' ? rect.bottom + offset : rect.top - offset,
      left: Math.max(8, left)
    };

    if (width === 'match') {
      position.width = rect.width;
    }

    setPosition(position);
  }, [width, anchor, offset]);

  useEffect(() => {
    if (!open) {
      return;
    }

    updatePosition();

    const handleClose = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClose);
    document.addEventListener('keydown', handleKeyDown);

    if (trackScroll) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClose);
      document.removeEventListener('keydown', handleKeyDown);

      if (trackScroll) {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      }
    };
  }, [open, updatePosition, trackScroll]);

  return { buttonRef, dropdownRef, open, setOpen, position };
}
