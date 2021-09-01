interface Pin {
  messageId: string;
  timestamp: string;
  userId: string;
  user: string;
  body: string;
}

interface Bookmark {
  title: string;
  url: string;
}

interface Window {
  y9JTVCMg: {
    isEmpty(s: string | null | undefined): boolean;
    isNotEmpty(s: string | null | undefined): s is string;
    formatDate(date: Date): string;
    h<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
    h<K extends keyof HTMLElementTagNameMap>(tagName: K, attributes: Record<string, string>): HTMLElementTagNameMap[K];
    h<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      children: (Element | undefined)[] | string
    ): HTMLElementTagNameMap[K];
    h<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      attributes: Record<string, string>,
      children: (Element | undefined)[] | string
    ): HTMLElementTagNameMap[K];
    i(icon: string): SVGSVGElement;
    loadPins(): Promise<Record<string, Pin[]>>;
    savePins(pins: Record<string, Pin[]>): Promise<void>;
    loadBookmarks(): Promise<Record<string, Bookmark[]>>;
    saveBookmarks(bookmarks: Record<string, Bookmark[]>): Promise<void>;
  };
}
declare var window: Window & typeof globalThis;
