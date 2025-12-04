/**
 * Tabs Store for Astro
 * Manages multi-tab navigation with localStorage persistence
 */

const STORAGE_KEY = 'tabs-storage';

export interface Tab {
  id: string;
  title: string;
  path: string;
  icon?: string;
  closable?: boolean;
}

interface TabsState {
  tabs: Tab[];
  activeTabId: string | null;
}

const homeTab: Tab = {
  id: 'home',
  title: '首页',
  path: '/dashboard',
  closable: false,
};

const defaultState: TabsState = {
  tabs: [homeTab],
  activeTabId: 'home',
};

/**
 * Load tabs state from localStorage
 */
export function loadTabsState(): TabsState {
  if (typeof localStorage === 'undefined') {
    return defaultState;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultState;
    }

    const parsed = JSON.parse(stored);
    return {
      tabs: parsed.state?.tabs || defaultState.tabs,
      activeTabId: parsed.state?.activeTabId || defaultState.activeTabId,
    };
  } catch (error) {
    console.error('Failed to load tabs state:', error);
    return defaultState;
  }
}

/**
 * Save tabs state to localStorage
 */
export function saveTabsState(state: Partial<TabsState>): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    const current = loadTabsState();
    const updated = { ...current, ...state };

    // Match Zustand persist format
    const data = {
      state: {
        tabs: updated.tabs,
        activeTabId: updated.activeTabId,
      },
      version: 0,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save tabs state:', error);
  }
}

/**
 * Add a new tab or activate existing one
 */
export function addTab(tab: Omit<Tab, 'id'>): string {
  const state = loadTabsState();

  // Check if tab with same path already exists
  const existingTab = state.tabs.find((t) => t.path === tab.path);
  if (existingTab) {
    saveTabsState({ activeTabId: existingTab.id });
    return existingTab.id;
  }

  const newTab: Tab = {
    ...tab,
    id: `tab-${Date.now()}`,
    closable: tab.closable !== false,
  };

  saveTabsState({
    tabs: [...state.tabs, newTab],
    activeTabId: newTab.id,
  });

  return newTab.id;
}

/**
 * Remove a tab
 */
export function removeTab(id: string): void {
  const state = loadTabsState();

  const tabToRemove = state.tabs.find((t) => t.id === id);
  if (!tabToRemove || tabToRemove.closable === false) {
    return;
  }

  const newTabs = state.tabs.filter((t) => t.id !== id);
  let newActiveId = state.activeTabId;

  // If closing active tab, switch to adjacent tab
  if (state.activeTabId === id) {
    const closedIndex = state.tabs.findIndex((t) => t.id === id);
    if (closedIndex > 0) {
      newActiveId = newTabs[closedIndex - 1]?.id || newTabs[0]?.id;
    } else {
      newActiveId = newTabs[0]?.id;
    }
  }

  saveTabsState({
    tabs: newTabs,
    activeTabId: newActiveId,
  });
}

/**
 * Set active tab
 */
export function setActiveTab(id: string): void {
  const state = loadTabsState();
  if (state.tabs.some((t) => t.id === id)) {
    saveTabsState({ activeTabId: id });
  }
}

/**
 * Update tab properties
 */
export function updateTab(id: string, updates: Partial<Tab>): void {
  const state = loadTabsState();
  const updatedTabs = state.tabs.map((t) => (t.id === id ? { ...t, ...updates } : t));
  saveTabsState({ tabs: updatedTabs });
}

/**
 * Clear all tabs except home
 */
export function clearTabs(): void {
  saveTabsState({
    tabs: [homeTab],
    activeTabId: 'home',
  });
}

/**
 * Get tab by ID
 */
export function getTab(id: string): Tab | undefined {
  const state = loadTabsState();
  return state.tabs.find((t) => t.id === id);
}

/**
 * Get tab by path
 */
export function getTabByPath(path: string): Tab | undefined {
  const state = loadTabsState();
  return state.tabs.find((t) => t.path === path);
}

/**
 * Get all tabs
 */
export function getTabs(): Tab[] {
  const state = loadTabsState();
  return state.tabs;
}

/**
 * Get active tab ID
 */
export function getActiveTabId(): string | null {
  const state = loadTabsState();
  return state.activeTabId;
}
