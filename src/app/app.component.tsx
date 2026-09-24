import { useRef } from 'react';
import Checklist from '../components/checklist/checklist.component';
import Footer from '../components/common/footer/footer.component';
import Hero from '../components/hero/hero.component';
import { TentIcon } from '../components/icons/icons';
import ProgressHeader from '../components/progress-header/progress-header.component';
import { useCampingChecklists } from '../hooks/useCampingChecklists';
import { useHeaderHeight } from '../hooks/useHeaderHeight';
import { useTranslation } from '../i18n/locale-context';
import styles from './app.module.css';

function App() {
  const headerRef = useRef<HTMLDivElement>(null);
  useHeaderHeight(headerRef);
  const { t } = useTranslation();

  const {
    categories,
    totalProgress,
    categoriesWithRemaining,
    showRemaining,
    setShowRemaining,
    toggleItem,
    clearSection,
    clearAll,
    isAllPacked,
  } = useCampingChecklists();

  return (
    <div className={styles.app}>
      <Hero totalProgress={totalProgress} isAllPacked={isAllPacked} />

      <ProgressHeader
        ref={headerRef}
        totalProgress={totalProgress}
        categoriesWithRemaining={categoriesWithRemaining}
        showRemaining={showRemaining}
        isAllPacked={isAllPacked}
        onToggleShowRemaining={() => setShowRemaining((prev) => !prev)}
        onClearAll={clearAll}
      />

      <main className={styles.main}>
        {categories.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <TentIcon className={styles.emptyIconSvg} />
            </span>
            <h2 className={styles.emptyTitle}>{t('emptyState.title')}</h2>
            <p className={styles.emptyMessage}>{t('emptyState.message')}</p>
          </div>
        ) : (
          <div className={styles.wrapper}>
            {categories.map((category) => (
              <Checklist
                key={category.storageKey}
                anchorId={category.anchorId}
                displayTitle={category.displayTitle}
                iconId={category.iconId}
                data={category.data}
                sectionProgress={category.sectionProgress}
                isComplete={category.isComplete}
                onToggleItem={(itemId) => toggleItem(category.storageKey, itemId)}
                onClearSection={() => clearSection(category.storageKey)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
