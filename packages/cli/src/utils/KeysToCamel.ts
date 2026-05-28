function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

export default function keysToCamel(item: any): any {
  if (item === Object(item) && !Array.isArray(item) && typeof item !== 'function') {
    const n = {};

    Object.keys(item).forEach((key) => {
      const newKey: string = camelCase(key);
      // @ts-ignore
      n[newKey] = keysToCamel(item[key]);
    });

    return n;
  }

  if (Array.isArray(item)) {
    return item.map((i) => keysToCamel(i));
  }

  return item;
}
