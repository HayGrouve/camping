import React from 'react';
import { CategoryIconId } from '../../data/categories';
import styles from './category-icon.module.css';

interface CategoryIconProps {
  iconId: CategoryIconId;
  className?: string;
}

export const CATEGORY_TINTS: Record<CategoryIconId, string> = {
  indoors: '#8b9cf7',
  outdoors: '#5fbf7f',
  furniture: '#d49a5e',
  clothes: '#e07a9b',
  food: '#eda13a',
  hygiene: '#4fb3d9',
  recreational: '#b07ce8',
  cleanup: '#4fbfa6',
  safety: '#d9b53c',
  firstaid: '#e5645c',
  personal: '#8f9daf',
};

const ICONS: Record<CategoryIconId, React.ReactNode> = {
  indoors: (
    <>
      <path d='M2 4v16' />
      <path d='M2 8h18a2 2 0 0 1 2 2v10' />
      <path d='M2 17h20' />
      <path d='M6 8v9' />
    </>
  ),
  outdoors: (
    <>
      <path d='M3.5 21 14 3' />
      <path d='M20.5 21 10 3' />
      <path d='M15.5 21 12 15l-3.5 6' />
      <path d='M2 21h20' />
    </>
  ),
  furniture: (
    <>
      <path d='M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3' />
      <path d='M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z' />
      <path d='M5 18v2' />
      <path d='M19 18v2' />
    </>
  ),
  clothes: (
    <path d='M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z' />
  ),
  food: (
    <>
      <path d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2' />
      <path d='M7 2v20' />
      <path d='M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7' />
    </>
  ),
  hygiene: (
    <path d='M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z' />
  ),
  recreational: (
    <>
      <circle cx='12' cy='12' r='10' />
      <path d='m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z' />
    </>
  ),
  cleanup: (
    <>
      <path d='M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' />
      <path d='M20 3v4' />
      <path d='M22 5h-4' />
    </>
  ),
  safety: (
    <path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' />
  ),
  firstaid: (
    <>
      <rect x='3' y='3' width='18' height='18' rx='4' />
      <path d='M12 8v8' />
      <path d='M8 12h8' />
    </>
  ),
  personal: (
    <>
      <path d='M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1' />
      <path d='M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4' />
    </>
  ),
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ iconId, className }) => (
  <svg
    className={[styles.icon, className].filter(Boolean).join(' ')}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.9'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    {ICONS[iconId]}
  </svg>
);

export default CategoryIcon;
