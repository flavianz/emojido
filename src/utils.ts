export function mergeMaps<K, V>(
    base: Map<K, V>,
    replacement: Map<K, V>,
): Map<K, V> {
    for (const key of replacement.keys()) {
        base.set(key, replacement.get(key));
    }
    return base;
}
