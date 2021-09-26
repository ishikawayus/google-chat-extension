interface Pin {
  messageId: string;
  timestamp: string;
  userId: string;
  user: string;
  body: string;
  links: { title: string; url: string }[];
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
}

interface Reaction {
  label: string;
  src: string;
}

interface Setting {
  locale: 'en' | 'ja';
  isAdvancedSearchEnabled: boolean;
  isMessageTimestampTooltipEnabled: boolean;
  isMessageLinkCopyButtonEnabled: boolean;
  isMessagePinEnabled: boolean;
  isRecentlyUsedReactionEnabled: boolean;
}

interface Window {
  y9JTVCMg: {
    i18n(key: string, ...args: unknown[]): string;
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
    loadLocale(): Promise<'en' | 'ja'>;
    saveLocale(locale: 'en' | 'ja'): Promise<void>;
    loadPins(): Promise<Record<string, Pin[]>>;
    savePins(pins: Record<string, Pin[]>): Promise<void>;
    loadBookmarks(): Promise<Record<string, Bookmark[]>>;
    saveBookmarks(bookmarks: Record<string, Bookmark[]>): Promise<void>;
    loadRecentlyUsedReactions(): Promise<Reaction[]>;
    saveRecentlyUsedReactions(reactions: Reaction[]): Promise<void>;
    loadSetting(): Promise<Setting>;
    saveSetting(setting: Partial<Setting>): Promise<void>;
  };
}
declare var window: Window & typeof globalThis;
