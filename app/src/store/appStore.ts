import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppState = {
  hasOnboarded: boolean;
  setOnboarded: (v: boolean) => Promise<void>;
  hydrate: () => Promise<void>;
  hydrated: boolean;
};

export const useAppStore = create<AppState>((set, get) => ({
  hasOnboarded: false,
  hydrated: false,
  async hydrate() {
    const raw = await AsyncStorage.getItem('hasOnboarded');
    set({ hasOnboarded: raw === '1', hydrated: true });
  },
  async setOnboarded(v: boolean) {
    await AsyncStorage.setItem('hasOnboarded', v ? '1' : '0');
    set({ hasOnboarded: v });
  },
}));
