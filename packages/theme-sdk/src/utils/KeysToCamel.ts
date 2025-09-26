import { camelCase } from './camelCase';

export function keysToCamel(item: any): any {
  if (item === Object(item) && !Array.isArray(item) && typeof item !== 'function') {
    const n = {};

    Object.keys(item).forEach((key) => {
      const newKey: string = camelCase(key);
      // @ts-ignore
      n[newKey] = keysToCamel(item[key]);
    });

    return n;
  } else if (Array.isArray(item)) {
    return item.map((i) => {
      return keysToCamel(i);
    });
  }

  return item;
}
