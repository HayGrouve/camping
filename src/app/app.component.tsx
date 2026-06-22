import Checklist from '../components/checklist/checklist.component';
import Footer from '../components/common/footer/footer.component';
import ProgressHeader from '../components/progress-header/progress-header.component';
import { useCampingChecklists } from '../hooks/useCampingChecklists';
import styles from './app.module.css';

function App() {
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
    <main className={styles.main}>
      <ProgressHeader
        totalProgress={totalProgress}
        categoriesWithRemaining={categoriesWithRemaining}
        showRemaining={showRemaining}
        isAllPacked={isAllPacked}
        onToggleShowRemaining={() => setShowRemaining((prev) => !prev)}
        onClearAll={clearAll}
      />

      <div className={styles.wrapper}>
        {categories.map((category) => (
          <Checklist
            key={category.storageKey}
            anchorId={category.anchorId}
            displayTitle={category.displayTitle}
            data={category.data}
            sectionProgress={category.sectionProgress}
            isComplete={category.isComplete}
            onToggleItem={(itemId) => toggleItem(category.storageKey, itemId)}
            onClearSection={() => clearSection(category.storageKey)}
          />
        ))}
      </div>

      <Footer />
    </main>
  );
}

export default App;
