export interface CompendiumMonster {
  name: string;
  source: string;
  page?: number;
  action?: Array<{ name: string; entries: any[] }>;
  trait?: Array<{ name: string; entries: any[] }>;
  reaction?: Array<{ name: string; entries: any[] }>;
  legendary?: Array<{ name: string; entries: any[] }>;
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
  save?: Record<string, string>;
}

export interface CompendiumItem {
  name: string;
  source: string;
  dmg1?: string;
  dmg2?: string;
  weaponCategory?: string;
  property?: string[];
  type?: string; // "M" (Melee), "R" (Ranged), etc.
}

const BASE_URL = "https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/master/data";
const HOMEBREW_BASE_URL = "https://raw.githubusercontent.com/TheGiddyLimit/homebrew/master";

let bestiaryCache: CompendiumMonster[] | null = null;
let itemsCache: CompendiumItem[] | null = null;

let homebrewBestiaryCache: CompendiumMonster[] | null = null;
let homebrewItemsCache: CompendiumItem[] | null = null;

export async function fetchAllMonsters(): Promise<CompendiumMonster[]> {
  if (bestiaryCache) return bestiaryCache;

  try {
    // Fetch index to know all files
    const indexRes = await fetch(`${BASE_URL}/bestiary/index.json`);
    const indexData = await indexRes.json();
    
    // indexData is a map of source -> filename, e.g. "MM": "bestiary-mm.json"
    const files = Object.values(indexData) as string[];
    
    // Fetch all files in parallel
    const promises = files.map(file => 
      fetch(`${BASE_URL}/bestiary/${file}`).then(res => res.json())
    );
    
    const results = await Promise.all(promises);
    
    // Combine all monsters
    const allMonsters: CompendiumMonster[] = [];
    for (const result of results) {
      if (result.monster && Array.isArray(result.monster)) {
        allMonsters.push(...result.monster);
      }
    }
    
    bestiaryCache = allMonsters;
    return allMonsters;
  } catch (error) {
    console.error("Failed to fetch monsters:", error);
    return [];
  }
}

export async function fetchAllItems(): Promise<CompendiumItem[]> {
  if (itemsCache) return itemsCache;

  try {
    // Fetch base items and magic items
    const [baseRes, itemsRes] = await Promise.all([
      fetch(`${BASE_URL}/items-base.json`),
      fetch(`${BASE_URL}/items.json`)
    ]);
    
    const baseData = await baseRes.json();
    const itemsData = await itemsRes.json();
    
    const allItems: CompendiumItem[] = [];
    if (baseData.baseitem && Array.isArray(baseData.baseitem)) {
      allItems.push(...baseData.baseitem);
    }
    if (itemsData.item && Array.isArray(itemsData.item)) {
      allItems.push(...itemsData.item);
    }
    
    // Filter to only items that have damage
    const weapons = allItems.filter(i => i.dmg1 || i.dmg2 || i.weaponCategory);
    
    itemsCache = weapons;
    return weapons;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return [];
  }
}

export async function fetchHomebrewMonsters(): Promise<CompendiumMonster[]> {
  if (homebrewBestiaryCache) return homebrewBestiaryCache;

  try {
    const indexRes = await fetch(`${HOMEBREW_BASE_URL}/_generated/index-props.json`);
    const indexData = await indexRes.json();
    
    // Only include files from specific folders to reduce payload size
    const allowedPrefixes = ["creature/", "collection/"];
    const monsterFiles = Object.keys(indexData.monster || {}).filter(file => 
      allowedPrefixes.some(prefix => file.startsWith(prefix))
    );
    const allMonsters: CompendiumMonster[] = [];
    
    const chunkSize = 15;
    for (let i = 0; i < monsterFiles.length; i += chunkSize) {
      const chunk = monsterFiles.slice(i, i + chunkSize);
      const promises = chunk.map(file => {
        // Encode URI to handle spaces and semicolons correctly
        const url = `${HOMEBREW_BASE_URL}/${encodeURI(file).replace(/;/g, "%3B")}`;
        return fetch(url).then(res => res.json()).catch(() => ({}));
      });
      
      const results = await Promise.all(promises);
      for (const result of results) {
        if (result.monster && Array.isArray(result.monster)) {
          allMonsters.push(...result.monster);
        }
      }
    }
    
    homebrewBestiaryCache = allMonsters;
    return allMonsters;
  } catch (error) {
    console.error("Failed to fetch homebrew monsters:", error);
    return [];
  }
}

export async function fetchHomebrewItems(): Promise<CompendiumItem[]> {
  if (homebrewItemsCache) return homebrewItemsCache;

  try {
    const indexRes = await fetch(`${HOMEBREW_BASE_URL}/_generated/index-props.json`);
    const indexData = await indexRes.json();
    
    // Only include files from specific folders to reduce payload size
    const allowedPrefixes = ["item/", "collection/"];
    const itemFiles = Object.keys(indexData.item || {}).filter(file => 
      allowedPrefixes.some(prefix => file.startsWith(prefix))
    );
    const allItems: CompendiumItem[] = [];
    
    const chunkSize = 15;
    for (let i = 0; i < itemFiles.length; i += chunkSize) {
      const chunk = itemFiles.slice(i, i + chunkSize);
      const promises = chunk.map(file => {
        const url = `${HOMEBREW_BASE_URL}/${encodeURI(file).replace(/;/g, "%3B")}`;
        return fetch(url).then(res => res.json()).catch(() => ({}));
      });
      
      const results = await Promise.all(promises);
      for (const result of results) {
        if (result.item && Array.isArray(result.item)) {
          allItems.push(...result.item);
        }
      }
    }
    
    const weapons = allItems.filter(i => i.dmg1 || i.dmg2 || i.weaponCategory);
    homebrewItemsCache = weapons;
    return weapons;
  } catch (error) {
    console.error("Failed to fetch homebrew items:", error);
    return [];
  }
}

