import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, children, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()}>
    {children}
  </div>
));
Card.displayName = 'Card';

const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 2,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: { x: number; y: number; z: number; zIndex: number }, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (index: number) => void;
  skewAmount?: number;
  easing?: 'elastic' | 'smooth';
  children: ReactNode;
}

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const isPausedByClick = useRef(false);

  const swapRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => {
        if (r.current) {
            placeNow(r.current as HTMLElement, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
        }
    });

    const swap = () => {
      if (order.current.length < 2 || isPausedByClick.current) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      if (!elFront) return;
      
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront as any, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el as any, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el as any,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    swapRef.current = swap;

    const timeout = setTimeout(() => {
        intervalRef.current = window.setInterval(swap, delay);
    }, 100);

    const node = container.current;
    const pause = () => {
      tlRef.current?.pause();
      clearInterval(intervalRef.current);
    };
    const resume = () => {
      if (isPausedByClick.current) return;
      tlRef.current?.play();
      clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(swap, delay);
    };

    if (node && pauseOnHover) {
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
    }

    return () => {
        if (node && pauseOnHover) {
            node.removeEventListener('mouseenter', pause);
            node.removeEventListener('mouseleave', resume);
        }
        clearTimeout(timeout);
        clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const handleManualClick = (i: number) => {
    const pos = order.current.indexOf(i);
    if (pos === -1) return;

    if (pos > 0) {
      const newOrder = [...order.current.slice(pos), ...order.current.slice(0, pos)];
      order.current = newOrder;
      
      const total = refs.length;
      refs.forEach((ref, cardIndex) => {
        if (!ref.current) return;
        const newPosInStack = order.current.indexOf(cardIndex);
        const slot = makeSlot(newPosInStack, cardDistance, verticalDistance, total);
        
        gsap.to(ref.current as HTMLElement, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          zIndex: slot.zIndex,
          duration: config.durMove,
          ease: config.ease,
          overwrite: true
        });
      });
    }

    isPausedByClick.current = true;
    tlRef.current?.pause();
    clearInterval(intervalRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    
    onCardClick?.(i);
    
    pauseTimeoutRef.current = setTimeout(() => {
      isPausedByClick.current = false;
      tlRef.current?.play();
      
      clearInterval(intervalRef.current);
      if (swapRef.current) {
        intervalRef.current = window.setInterval(swapRef.current, delay);
      }
      pauseTimeoutRef.current = null;
    }, 5000); 
  };

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child as React.ReactElement<any>, {
          ref: refs[i],
          style: { width, height, cursor: 'pointer', ...((child.props as any).style ?? {}) },
          onClick: (e: React.MouseEvent) => {
            (child.props as any).onClick?.(e);
            handleManualClick(i);
          }
        })
      : child
  );

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
