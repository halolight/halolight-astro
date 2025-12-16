/**
 * Page State Caching for Astro
 * Saves and restores scroll position, form data, and custom state
 */

const CACHE_KEY = 'page-cache-storage';

interface PageState {
  scrollY: number;
  formData?: Record<string, unknown>;
  customState?: Record<string, unknown>;
  timestamp: number;
}

type CacheStore = Record<string, PageState>;

/**
 * Load entire cache from sessionStorage
 */
function loadCache(): CacheStore {
  if (typeof sessionStorage === 'undefined') {
    return {};
  }

  try {
    const stored = sessionStorage.getItem(CACHE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load page cache:', error);
    return {};
  }
}

/**
 * Save entire cache to sessionStorage
 */
function saveCache(cache: CacheStore): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to save page cache:', error);
  }
}

/**
 * Get page state for a specific path
 */
export function getPageState(path: string): PageState | undefined {
  const cache = loadCache();
  return cache[path];
}

/**
 * Set page state for a specific path
 */
export function setPageState(path: string, state: Partial<PageState>): void {
  const cache = loadCache();
  const existing = cache[path] || {
    scrollY: 0,
    timestamp: Date.now(),
  };

  cache[path] = {
    ...existing,
    ...state,
    timestamp: Date.now(),
  };

  saveCache(cache);
}

/**
 * Clear page state for a specific path
 */
export function clearPageState(path: string): void {
  const cache = loadCache();
  delete cache[path];
  saveCache(cache);
}

/**
 * Clear all cached page states
 */
export function clearAllPageCache(): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }
  sessionStorage.removeItem(CACHE_KEY);
}

/**
 * Restore scroll position for current page
 * Call this function on page load
 */
export function restoreScroll(path: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const state = getPageState(path);
  if (state?.scrollY) {
    requestAnimationFrame(() => {
      window.scrollTo(0, state.scrollY);
    });
  }

  // Save scroll position on scroll
  let timeoutId: NodeJS.Timeout;
  const handleScroll = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setPageState(path, { scrollY: window.scrollY });
    }, 100);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(timeoutId);
  });
}

/**
 * Get cached form data
 */
export function getFormCache<T = Record<string, unknown>>(
  path: string,
  formKey: string
): T | undefined {
  const cacheKey = `${path}:${formKey}`;
  const state = getPageState(cacheKey);
  return state?.formData as T | undefined;
}

/**
 * Save form data to cache
 */
export function saveFormCache<T = Record<string, unknown>>(
  path: string,
  formKey: string,
  data: T
): void {
  const cacheKey = `${path}:${formKey}`;
  setPageState(cacheKey, { formData: data as Record<string, unknown> });
}

/**
 * Clear form cache
 */
export function clearFormCache(path: string, formKey: string): void {
  const cacheKey = `${path}:${formKey}`;
  clearPageState(cacheKey);
}

/**
 * Get custom state cache
 */
export function getStateCache<T = unknown>(path: string, stateKey: string): T | undefined {
  const state = getPageState(path);
  return state?.customState?.[stateKey] as T | undefined;
}

/**
 * Save custom state to cache
 */
export function saveStateCache<T = unknown>(path: string, stateKey: string, value: T): void {
  const state = getPageState(path) || {
    scrollY: 0,
    timestamp: Date.now(),
  };

  setPageState(path, {
    customState: {
      ...state.customState,
      [stateKey]: value,
    },
  });
}

/**
 * Clear custom state cache
 */
export function clearStateCache(path: string, stateKey: string): void {
  const state = getPageState(path);
  if (state?.customState) {
    delete state.customState[stateKey];
    setPageState(path, { customState: state.customState });
  }
}

/**
 * Auto-save form inputs to cache
 * Usage: Call this in a client-side script with form element
 */
export function enableFormAutoSave(
  path: string,
  formKey: string,
  formElement: HTMLFormElement
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  // Restore form data on mount
  const cached = getFormCache(path, formKey);
  if (cached) {
    const _formData = new FormData(formElement);
    Object.entries(cached).forEach(([key, value]) => {
      const input = formElement.elements.namedItem(key) as HTMLInputElement | null;
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = Boolean(value);
        } else if (input.type === 'radio') {
          input.checked = input.value === value;
        } else {
          input.value = String(value);
        }
      }
    });
  }

  // Save form data on input
  const handleInput = () => {
    const formData = new FormData(formElement);
    const data: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    saveFormCache(path, formKey, data);
  };

  formElement.addEventListener('input', handleInput);
  formElement.addEventListener('change', handleInput);

  // Return cleanup function
  return () => {
    formElement.removeEventListener('input', handleInput);
    formElement.removeEventListener('change', handleInput);
  };
}
