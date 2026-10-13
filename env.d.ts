/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical site origin, e.g. https://snapkit.42web.io */
  readonly VITE_SITE_URL?: string;
  /** Contact email shown on the Contact page, e.g. hello@example.com */
  readonly VITE_CONTACT_EMAIL?: string;
  /** AdSense publisher id (ca-pub-XXXXXXXXXXXXXXXX). Ads stay disabled unless set. */
  readonly VITE_ADSENSE_CLIENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
