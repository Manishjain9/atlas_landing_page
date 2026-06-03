'use client';

import { useEffect, useRef, ReactNode, ElementType } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3;
  className?: string;
  tag?: ElementType;
}

export default function FadeIn({ children, delay = 0, className = '', tag: Tag = 'div' }: FadeInProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('vis'); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const delayClass = delay === 1 ? ' fd1' : delay === 2 ? ' fd2' : delay === 3 ? ' fd3' : '';

  return (
    <Tag ref={ref as never} className={`fu${delayClass}${className ? ` ${className}` : ''}`}>
      {children}
    </Tag>
  );
}
