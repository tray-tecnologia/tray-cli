import camelCase from 'lodash.camelcase';

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
