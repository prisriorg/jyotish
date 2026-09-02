export * from './types';
export * from './dictionaries/core';
export * from './dictionaries/panchang';
export * from './dictionaries/festivals';
export * from './dictionaries/matching';
export * from './dictionaries/predictions';

import { Language } from './types';
import {
  rashiNamesI18n,
  planetNamesI18n,
  nakshatraNamesI18n,
  tithiNamesI18n,
  pakshaNamesI18n,
  karanaNamesI18n,
  yogaNamesI18n,
  vaaraNamesI18n,
  houseNamesI18n
} from './dictionaries/core';

export function getLocalizedRashi(index: number, lang: Language = 'en'): string {
  const normIndex = ((index % 12) + 12) % 12;
  return (rashiNamesI18n[lang] && rashiNamesI18n[lang][normIndex]) || rashiNamesI18n.en[normIndex];
}

export function getLocalizedPlanet(name: string, lang: Language = 'en'): string {
  if (planetNamesI18n[lang] && planetNamesI18n[lang][name]) {
    return planetNamesI18n[lang][name];
  }
  return name;
}

export function getLocalizedNakshatra(index: number, lang: Language = 'en'): string {
  const normIndex = ((index % 27) + 27) % 27;
  return (nakshatraNamesI18n[lang] && nakshatraNamesI18n[lang][normIndex]) || nakshatraNamesI18n.en[normIndex];
}

export function getLocalizedTithi(index: number, lang: Language = 'en'): string {
  const normIndex = ((index % 30) + 30) % 30;
  return (tithiNamesI18n[lang] && tithiNamesI18n[lang][normIndex]) || tithiNamesI18n.en[normIndex];
}

export function getLocalizedPaksha(paksha: string, lang: Language = 'en'): string {
  if (pakshaNamesI18n[lang] && pakshaNamesI18n[lang][paksha]) {
    return pakshaNamesI18n[lang][paksha];
  }
  return paksha;
}

export function getLocalizedKarana(index: number, lang: Language = 'en'): string {
  const normIndex = ((index % 11) + 11) % 11;
  return (karanaNamesI18n[lang] && karanaNamesI18n[lang][normIndex]) || karanaNamesI18n.en[normIndex];
}

export function getLocalizedYoga(index: number, lang: Language = 'en'): string {
  const normIndex = ((index % 27) + 27) % 27;
  return (yogaNamesI18n[lang] && yogaNamesI18n[lang][normIndex]) || yogaNamesI18n.en[normIndex];
}

export function getLocalizedVaara(dayIndex: number, lang: Language = 'en'): string {
  const normIndex = ((dayIndex % 7) + 7) % 7;
  return (vaaraNamesI18n[lang] && vaaraNamesI18n[lang][normIndex]) || vaaraNamesI18n.en[normIndex];
}

export function getLocalizedHouse(houseNumber: number, lang: Language = 'en'): string {
  if (houseNamesI18n[lang] && houseNamesI18n[lang][houseNumber]) {
    return houseNamesI18n[lang][houseNumber];
  }
  return `House ${houseNumber}`;
}
