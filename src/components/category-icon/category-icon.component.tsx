import React from 'react';
import { CategoryIconId } from '../../data/categories';
import styles from './category-icon.module.css';

interface CategoryIconProps {
  iconId: CategoryIconId;
}

const ICONS: Record<CategoryIconId, React.ReactNode> = {
  indoors: (
    <path d='M3 14h18v2H3v-2zm2-8h14v10H5V6zm2 2v6h10V8H7z' />
  ),
  outdoors: (
    <path d='M12 3L4 18h16L12 3zm0 4.5L16.5 16h-9L12 7.5z' />
  ),
  furniture: (
    <path d='M4 10h16v2H4v-2zm2-4h12v3H6V6zm0 9h5v3H6v-3zm7 0h5v3h-5v-3z' />
  ),
  clothes: (
    <path d='M12 2l3 3h5v2h-1l-2 12H7L5 7H4V5h5l3-3z' />
  ),
  food: (
    <path d='M8 2v8c0 2.2 1.8 4 4 4s4-1.8 4-4V2h-2v8c0 1.1-.9 2-2 2s-2-.9-2-2V2H8zm-4 18h12v2H4v-2z' />
  ),
  hygiene: (
    <path d='M12 2c-2 4-6 6-6 10a6 6 0 0012 0c0-4-4-6-6-10z' />
  ),
  recreational: (
    <path d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 5h2v5h-2V7zm0 7h2v2h-2v-2z' />
  ),
  cleanup: (
    <path d='M6 2h12v2H6V2zm-1 4h14l-1.5 14h-11L5 6zm5 3v7h2V9h-2z' />
  ),
  safety: (
    <path d='M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z' />
  ),
  firstaid: (
    <path d='M10 2h4v6h6v4h-6v6h-4v-6H4v-4h6V2z' />
  ),
  personal: (
    <path d='M4 4h16v14H4V4zm2 2v10h12V6H6zm2 2h8v2H8V8zm0 4h5v2H8v-2z' />
  ),
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ iconId }) => (
  <svg
    className={styles.icon}
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden='true'
  >
    {ICONS[iconId]}
  </svg>
);

export default CategoryIcon;
