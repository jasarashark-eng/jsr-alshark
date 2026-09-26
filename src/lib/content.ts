import rawSite from '../data/site.json';
import rawProfiles from '../data/profiles.json';
import rawNews from '../data/news.json';
import { SiteSchema, ProfileSchema, NewsSchema } from './schema';
import { assetUrl, webUrl, telLink } from './urls';

const parsedSite = SiteSchema.parse(rawSite);
const primaryInternational = '+966530720010';
const primaryWhatsapp = '966530720010';
const primaryPhones = parsedSite.phones.filter(phone => phone.international === primaryInternational);
const secondaryPhones = parsedSite.phones.filter(phone => phone.international !== primaryInternational);

// Presentation-only overrides. CMS JSON files remain untouched.
export const site = {
  ...parsedSite,
  launchReady: true,
  phones: [...primaryPhones, ...secondaryPhones],
  whatsapp: primaryWhatsapp,
};

export const profiles = ProfileSchema.array()
  .parse(rawProfiles)
  .filter(p => p.published && p.file);

export const news = NewsSchema.array()
  .parse(rawNews)
  .filter(n => n.published && n.title.trim().toLowerCase() !== 'test')
  .sort((a, b) => b.date.localeCompare(a.date));

export const waLink = (message = '') =>
  'https://wa.me/' + site.whatsapp +
  (message ? '?text=' + encodeURIComponent(message) : '');

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Riyadh',
  }).format(new Date(value + 'T12:00:00Z'));

export const icons: Record<string, string> = {
  home: 'm4 15 12-10 12 10M8 13v14h16V13M13 27v-9h6v9',
  car: 'm6 14 3-7h14l3 7M5 14h22v11H5zM8 25v3m16-3v3M8 19h4m8 0h4',
  file: 'M7 4h18v24H7zM11 11h10M11 16h10M11 21h7',
  support: 'M6 23V15a10 10 0 0 1 20 0v8M6 17h4v8H6zM22 17h4v8h-4zM25 25c0 3-4 4-9 4',
};

import rawTheme from '../data/theme.json';
import rawLayout from '../data/layout.json';
import rawCopy from '../data/copy.json';
import rawAnimations from '../data/animations.json';
import { validateConfig, makeThemeCss, fontUrl } from './customization.js';

export const theme = rawTheme;
export const layout = rawLayout;
export const copy: Record<string, string> = rawCopy;
export const animations = rawAnimations;

validateConfig({ theme, layout, copy, animations });

export const themeCss = makeThemeCss(theme, layout);
export const themeFontUrl = fontUrl(theme.font);
export const navItems = layout.navigation.filter(
  n => layout.sections.some(s => s.id === n.target && s.enabled) &&
    (n.target !== 'news' || news.length > 0)
);
