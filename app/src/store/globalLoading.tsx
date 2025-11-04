import React, { useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import GlobalPreloader from '../components/GlobalPreloader';

type Listener = (count: number) => void;

class LoadingController {
  private count = 0;
  private listeners = new Set<Listener>();

  getCount() {
    return this.count;
  }

  private notify() {
    for (const l of this.listeners) l(this.count);
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.count);
    return () => {
      this.listeners.delete(listener);
    };
  }

  increment() {
    this.count += 1;
    this.notify();
  }

  decrement() {
    if (this.count > 0) this.count -= 1;
    this.notify();
  }

  async runWithLoading<T>(work: () => Promise<T>): Promise<T> {
    this.increment();
    try {
      return await work();
    } finally {
      this.decrement();
    }
  }
}

export const loadingController = new LoadingController();

export function useGlobalLoading() {
  return {
    show: () => loadingController.increment(),
    hide: () => loadingController.decrement(),
    runWithLoading: <T,>(work: () => Promise<T>) => loadingController.runWithLoading(work),
    getCount: () => loadingController.getCount(),
  };
}

export const GlobalLoadingProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [count, setCount] = useState<number>(loadingController.getCount());
  const [visible, setVisible] = useState(false);
  const [shownAt, setShownAt] = useState<number | null>(null);
  const SHOW_DELAY = 150; // ms before showing to avoid flicker for very fast calls
  const MIN_VISIBLE = 300; // ms minimum visible time
  const timers = React.useRef<{ show?: any; hide?: any }>({});

  useEffect(() => {
    return loadingController.subscribe(setCount);
  }, []);

  useEffect(() => {
    // manage delayed show/hide
    if (count > 0) {
      if (timers.current.hide) { clearTimeout(timers.current.hide); timers.current.hide = undefined; }
      if (!visible) {
        if (timers.current.show) clearTimeout(timers.current.show);
        timers.current.show = setTimeout(() => {
          setVisible(true);
          setShownAt(Date.now());
        }, SHOW_DELAY);
      }
    } else {
      if (timers.current.show) { clearTimeout(timers.current.show); timers.current.show = undefined; }
      if (visible) {
        const elapsed = shownAt ? Date.now() - shownAt : MIN_VISIBLE;
        const wait = Math.max(0, MIN_VISIBLE - elapsed);
        timers.current.hide = setTimeout(() => {
          setVisible(false);
          setShownAt(null);
        }, wait);
      }
    }
    return () => {
      // no-op
    };
  }, [count, visible, shownAt]);

  // Optional: reset any stuck loaders when app comes back to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && loadingController.getCount() < 0) {
        while (loadingController.getCount() < 0) loadingController.increment();
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <>
      {children}
      <GlobalPreloader visible={visible} />
    </>
  );
};
