import { create } from "zustand";

export type Preferences = {
  goal?: string;
  cuisines: string[];
  dietary: string[];
  allergies: string[];
};

export type GroceryItem = {
  id: string;
  name: string;
  quantity: string;
  store?: string;
};

type State = {
  prefs: Preferences;
  setPrefs: (p: Partial<Preferences>) => void;

  groceryList: GroceryItem[];
  setGroceryList: (list: GroceryItem[]) => void;
  addItem: (item: GroceryItem) => void;
  removeItem: (id: string) => void;
};

export const useAppStore = create<State>((set) => ({
  prefs: {
    cuisines: [],
    dietary: [],
    allergies: [],
  },
  setPrefs: (p) =>
    set((s) => ({
      prefs: { ...s.prefs, ...p },
    })),

  groceryList: [],
  setGroceryList: (list) => set({ groceryList: list }),
  addItem: (item) =>
    set((s) => ({ groceryList: [...s.groceryList, item] })),
  removeItem: (id) =>
    set((s) => ({
      groceryList: s.groceryList.filter((x) => x.id !== id),
    })),
}));
