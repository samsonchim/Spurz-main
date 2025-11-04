import React, { useEffect, useState } from 'react';
import GlobalPopup, { PopupType } from '../components/GlobalPopup';

type PopupItem = {
  id: string;
  title?: string;
  message: string;
  type?: PopupType;
  duration?: number; // auto-close
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

type Listener = (queue: PopupItem[]) => void;

class PopupController {
  private queue: PopupItem[] = [];
  private listeners = new Set<Listener>();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.queue);
    return () => { this.listeners.delete(listener); };
  }

  private notify() {
    for (const l of this.listeners) l(this.queue);
  }

  show(message: string, options?: { title?: string; type?: PopupType; duration?: number }) {
    const item: PopupItem = { id: String(Date.now()) + Math.random().toString(36).slice(2), message, ...options };
    this.queue.push(item);
    this.notify();
    return item.id;
  }

  dismiss(id?: string) {
    if (!id) this.queue.shift();
    else this.queue = this.queue.filter((x) => x.id !== id);
    this.notify();
  }

  info(message: string, title?: string, duration?: number) { return this.show(message, { title, type: 'info', duration }); }
  error(message: string, title?: string, duration?: number) { return this.show(message, { title, type: 'error', duration }); }
  success(message: string, title?: string, duration?: number) { return this.show(message, { title, type: 'success', duration }); }

  confirm(message: string, options?: { title?: string; type?: PopupType; okText?: string; cancelText?: string }) {
    const { title, type = 'info', okText = 'OK', cancelText = 'Cancel' } = options || {};
    return new Promise<boolean>((resolve) => {
      const id = String(Date.now()) + Math.random().toString(36).slice(2);
      const onPrimary = () => { this.dismiss(id); resolve(true); };
      const onSecondary = () => { this.dismiss(id); resolve(false); };
      const item: PopupItem = { id, title, message, type, primaryLabel: okText, secondaryLabel: cancelText, onPrimary, onSecondary };
      this.queue.push(item);
      this.notify();
    });
  }
}

export const popupController = new PopupController();

export function useGlobalPopup() {
  return {
    show: popupController.show.bind(popupController),
    info: popupController.info.bind(popupController),
    error: popupController.error.bind(popupController),
    success: popupController.success.bind(popupController),
    confirm: popupController.confirm.bind(popupController),
    dismiss: popupController.dismiss.bind(popupController),
  };
}

export const GlobalPopupProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [queue, setQueue] = useState<PopupItem[]>([]);
  const top = queue[0];

  useEffect(() => {
    return popupController.subscribe(setQueue);
  }, []);

  useEffect(() => {
    if (!top?.duration) return;
    const id = setTimeout(() => popupController.dismiss(top.id), top.duration);
    return () => clearTimeout(id);
  }, [top?.id, top?.duration]);

  return (
    <>
      {children}
      <GlobalPopup
        visible={!!top}
        title={top?.title}
        message={top?.message || ''}
        type={top?.type}
        onClose={() => popupController.dismiss(top?.id)}
        primaryLabel={top?.primaryLabel}
        secondaryLabel={top?.secondaryLabel}
        onPrimary={top?.onPrimary}
        onSecondary={top?.onSecondary}
      />
    </>
  );
};
