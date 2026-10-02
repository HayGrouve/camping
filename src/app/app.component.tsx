import { CSSProperties, useRef, useState } from 'react';
import { Backpack } from '@phosphor-icons/react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import Checklist from '../components/checklist/checklist.component';
import Footer from '../components/common/footer/footer.component';
import Hero from '../components/hero/hero.component';
import ProgressHeader from '../components/progress-header/progress-header.component';
import { CampingChecklistView, useCampingChecklists } from '../hooks/useCampingChecklists';
import { useColumnCount } from '../hooks/useColumnCount';
import { useHeaderHeight } from '../hooks/useHeaderHeight';
import { useTranslation } from '../i18n/locale-context';
import { partitionIntoColumns } from '../utils/columnUtils';
import styles from './app.module.css';

// Keep in sync with the column gap in app.module.css
const COLUMN_LAYOUT = { minColumnWidth: 300, gap: 48, maxColumns: 3 };
// A section header takes roughly as much room as two rows
const HEADER_WEIGHT = 2;

const assignColumns = (
  categories: CampingChecklistView[],
  columnCount: number
): Map<string, number> => {
  const weights = categories.map((category) => category.data.data.length + HEADER_WEIGHT);
  const assignment = new Map<string, number>();
  partitionIntoColumns(weights, columnCount).forEach((group, columnIndex) => {
    group.forEach((categoryIndex) => {
      assignment.set(categories[categoryIndex].storageKey, columnIndex);
    });
  });
  return assignment;
};

function App() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  useHeaderHeight(headerRef);
  const columnCount = useColumnCount(gridRef, COLUMN_LAYOUT);
  const { t } = useTranslation();
  const [clearCount, setClearCount] = useState(0);

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

  // Sections are dealt into columns once per layout (filter, column count, clear all) and then
  // stay put, so nothing hops between columns while items are being checked off.
  const layoutKey = `${showRemaining}-${columnCount}-${clearCount}`;
  const layoutRef = useRef<{ key: string; assignment: Map<string, number> } | null>(null);
  if (layoutRef.current?.key !== layoutKey) {
    layoutRef.current = { key: layoutKey, assignment: assignColumns(categories, columnCount) };
  }
  const { assignment } = layoutRef.current;

  const columns = Array.from({ length: columnCount }, (_, columnIndex) =>
    categories.filter((category) => (assignment.get(category.storageKey) ?? 0) === columnIndex)
  );

  const handleClearAll = () => {
    clearAll();
    // In the "remaining" view every packed item comes back at once, so start a fresh layout
    if (showRemaining) setClearCount((count) => count + 1);
  };

  return (
    <div className={styles.app}>
      <Hero totalProgress={totalProgress} isAllPacked={isAllPacked} />

      <div className={styles.content}>
        <ProgressHeader
          ref={headerRef}
          totalProgress={totalProgress}
          categoriesWithRemaining={categoriesWithRemaining}
          showRemaining={showRemaining}
          isAllPacked={isAllPacked}
          onToggleShowRemaining={() => setShowRemaining((prev) => !prev)}
          onClearAll={handleClearAll}
        />

        <main className={styles.main}>
          <div ref={gridRef}>
            {categories.length === 0 ? (
              <div className={styles.empty}>
                <Backpack className={styles.emptyIcon} aria-hidden='true' />
                <h2 className={styles.emptyTitle}>{t('emptyState.title')}</h2>
                <p className={styles.emptyMessage}>{t('emptyState.message')}</p>
                <button
                  type='button'
                  className={styles.emptyAction}
                  onClick={() => setShowRemaining(false)}
                >
                  {t('emptyState.action')}
                </button>
              </div>
            ) : (
              <m.div
                key={layoutKey}
                className={styles.columns}
                style={{ '--columns': columnCount } as CSSProperties}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {columns.map((column, columnIndex) => (
                  <div key={columnIndex} className={styles.column}>
                    <AnimatePresence initial={false}>
                      {column.map((category) => (
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
                    </AnimatePresence>
                  </div>
                ))}
              </m.div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
