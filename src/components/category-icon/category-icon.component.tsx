import React from 'react';
import {
  Bed,
  Broom,
  Compass,
  CookingPot,
  Drop,
  FirstAidKit,
  Icon,
  PicnicTable,
  ShieldCheck,
  Tent,
  TShirt,
  Wallet,
} from '@phosphor-icons/react';
import { CategoryIconId } from '../../data/categories';
import styles from './category-icon.module.css';

interface CategoryIconProps {
  iconId: CategoryIconId;
  className?: string;
}

const ICONS: Record<CategoryIconId, Icon> = {
  indoors: Bed,
  outdoors: Tent,
  furniture: PicnicTable,
  clothes: TShirt,
  food: CookingPot,
  hygiene: Drop,
  recreational: Compass,
  cleanup: Broom,
  safety: ShieldCheck,
  firstaid: FirstAidKit,
  personal: Wallet,
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ iconId, className }) => {
  const IconComponent = ICONS[iconId];
  return (
    <IconComponent
      className={[styles.icon, className].filter(Boolean).join(' ')}
      aria-hidden='true'
    />
  );
};

export default CategoryIcon;
