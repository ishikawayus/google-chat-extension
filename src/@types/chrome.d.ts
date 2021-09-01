declare namespace chrome.storage {
  interface StorageArea {
    clear(callback?: () => void): void;
    get(keys: string | string[], callback: (items: { [key: string]: unknown }) => void): void;
    remove(keys: string | string[], callback?: () => void): void;
    set(items: { [key: string]: unknown }, callback?: () => void): void;
  }
  export var local: StorageArea;
  export var sync: StorageArea;
}

declare namespace chrome.runtime {
  export var lastError: { message?: string } | undefined;
}
