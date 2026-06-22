import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n/locale-context';
import styles from './confirm-dialog.module.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  const resolvedCancel = cancelLabel ?? t('cancel');
  const resolvedConfirm = confirmLabel ?? t('confirm');
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = [cancelRef.current, confirmRef.current].filter(
        (element): element is HTMLButtonElement => element != null
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className={styles.backdrop}
      role='dialog'
      aria-modal='true'
      aria-labelledby='confirm-title'
      onClick={handleBackdropClick}
    >
      <div className={styles.dialog}>
        <h2 id='confirm-title' className={styles.title}>
          {title}
        </h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button
            ref={cancelRef}
            type='button'
            className={styles.cancelBtn}
            onClick={onCancel}
          >
            {resolvedCancel}
          </button>
          <button
            ref={confirmRef}
            type='button'
            className={styles.confirmBtn}
            onClick={onConfirm}
          >
            {resolvedConfirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
