import React from 'react';

interface IconProps {
  className?: string;
}

const StrokeIcon: React.FC<IconProps & { children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <svg
    className={className}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    {children}
  </svg>
);

export const ResetIcon: React.FC<IconProps> = ({ className }) => (
  <StrokeIcon className={className}>
    <path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' />
    <path d='M3 3v5h5' />
  </StrokeIcon>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className }) => (
  <StrokeIcon className={className}>
    <path d='m6 9 6 6 6-6' />
  </StrokeIcon>
);

export const ArrowUpIcon: React.FC<IconProps> = ({ className }) => (
  <StrokeIcon className={className}>
    <path d='m5 12 7-7 7 7' />
    <path d='M12 19V5' />
  </StrokeIcon>
);

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <StrokeIcon className={className}>
    <path d='M20 6 9 17l-5-5' />
  </StrokeIcon>
);

export const TentIcon: React.FC<IconProps> = ({ className }) => (
  <StrokeIcon className={className}>
    <path d='M3.5 21 14 3' />
    <path d='M20.5 21 10 3' />
    <path d='M15.5 21 12 15l-3.5 6' />
    <path d='M2 21h20' />
  </StrokeIcon>
);
