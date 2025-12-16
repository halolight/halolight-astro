/**
 * UI Settings Library for Astro
 * Manages skin presets and UI preferences with localStorage persistence
 */

const STORAGE_KEY = 'ui-settings-storage';

export type SkinPreset =
  | 'default'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'violet'
  | 'rose'
  | 'teal'
  | 'slate'
  | 'ocean'
  | 'sunset'
  | 'aurora';

export interface UiSettings {
  skin: SkinPreset;
  showFooter: boolean;
  showTabBar: boolean;
  mobileHeaderFixed: boolean;
  mobileTabBarFixed: boolean;
}

const defaultSettings: UiSettings = {
  skin: 'default',
  showFooter: true,
  showTabBar: true,
  mobileHeaderFixed: true,
  mobileTabBarFixed: true,
};

/**
 * Load UI settings from localStorage
 */
export function loadUiSettings(): UiSettings {
  if (typeof localStorage === 'undefined') {
    return defaultSettings;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultSettings;
    }

    const parsed = JSON.parse(stored);
    return {
      ...defaultSettings,
      ...parsed.state,
    };
  } catch (error) {
    console.error('Failed to load UI settings:', error);
    return defaultSettings;
  }
}

/**
 * Save UI settings to localStorage
 */
export function saveUiSettings(settings: Partial<UiSettings>): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    const current = loadUiSettings();
    const updated = { ...current, ...settings };

    // Match Zustand persist format
    const data = {
      state: updated,
      version: 0,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save UI settings:', error);
  }
}

/**
 * Apply skin preset to the document
 */
export function applySkin(skin: SkinPreset): void {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;

  if (skin === 'default') {
    root.removeAttribute('data-skin');
  } else {
    root.setAttribute('data-skin', skin);
  }

  saveUiSettings({ skin });
}

/**
 * Get current skin preset
 */
export function getCurrentSkin(): SkinPreset {
  const settings = loadUiSettings();
  return settings.skin;
}

/**
 * Set visibility of UI elements
 */
export function setUiVisibility(options: {
  showFooter?: boolean;
  showTabBar?: boolean;
  mobileHeaderFixed?: boolean;
  mobileTabBarFixed?: boolean;
}): void {
  saveUiSettings(options);
}

/**
 * Reset UI settings to defaults
 */
export function resetUiSettings(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);

  if (typeof document !== 'undefined') {
    document.documentElement.removeAttribute('data-skin');
  }
}

/**
 * Initialize UI settings on page load
 */
export function initUiSettings(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const settings = loadUiSettings();
  applySkin(settings.skin);
}

/**
 * Skin preset metadata
 */
export const skinPresets: Array<{
  value: SkinPreset;
  label: string;
  description: string;
}> = [
  { value: 'default', label: '默认', description: '经典黑白配色' },
  { value: 'blue', label: '蓝色', description: '专业科技感' },
  { value: 'emerald', label: '翡翠', description: '清新自然' },
  { value: 'amber', label: '琥珀', description: '温暖活力' },
  { value: 'violet', label: '紫罗兰', description: '优雅神秘' },
  { value: 'rose', label: '玫瑰', description: '热情浪漫' },
  { value: 'teal', label: '青色', description: '平静专注' },
  { value: 'slate', label: '石板', description: '中性专业' },
  { value: 'ocean', label: '海洋', description: '深邃宁静' },
  { value: 'sunset', label: '日落', description: '温暖橙红' },
  { value: 'aurora', label: '极光', description: '梦幻多彩' },
];
