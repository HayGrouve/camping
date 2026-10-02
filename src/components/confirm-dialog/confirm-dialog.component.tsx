import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as m from 'motion/react-m';
import { useTranslation } from '../../i18n/locale-context';
import { EASE_OUT } from '../motion';
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

  // Focus the safe action on open and give focus back to the trigger on close
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    cancelRef.current?.focus();
    return () => {
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, []);

  useEffect(() => {
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

  return createPortal(
    <m.div
      className={styles.backdrop}
      role='dialog'
      aria-modal='true'
      aria-labelledby='confirm-title'
      aria-describedby='confirm-message'
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <m.div
        className={styles.dialog}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
      >
        <h2 id='confirm-title' className={styles.title}>
          {title}
        </h2>
        <p id='confirm-message' className={styles.message}>
          {message}
        </p>
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
      </m.div>
    </m.div>,
    document.body
  );
};

export default ConfirmDialog;
