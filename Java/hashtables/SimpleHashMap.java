package hashmaps;

import java.util.HashSet;
import java.util.Set;

import hashtables.ChainingHashTable;



/**
 * An implementation of a SimpleMap, built using the ChainingHashTable and 
 * SimpleMapEntry classes. This class should behave similarly to the built-in
 * java.util.HashMap, though it is much simpler!
 */
public class SimpleHashMap<K, V> implements SimpleMap<K, V> {

    ChainingHashTable<KeyValuePair<K, V>> map;

    public SimpleHashMap() {
        map = new ChainingHashTable<>();
    }

    @Override
    public int size() {
        return map.size();
    }

    @Override
    public void put(K k, V v) {
        map.add(new KeyValuePair<K,V>(k, v));
    }

    @Override
    public V get(K k) {
        KeyValuePair<K, V> dummy = new KeyValuePair<K,V>(k, null);
        KeyValuePair<K, V> kvp = map.get(dummy);
        if (kvp == null){
            return null;
        }
        return kvp.get();
    }

    @Override
    public V getOrDefault(K k, V defaultValue) {
        KeyValuePair<K, V> dummy = new KeyValuePair<K,V>(k, null);
        KeyValuePair<K, V> kvp = map.get(dummy);
        if (kvp == null || kvp.get() == null){
            return defaultValue;
        } else {
            return kvp.get();
        }
        
    }

    @Override
    public V remove(K k) {
        KeyValuePair<K, V> kvp = map.get(new KeyValuePair<K,V>(k, null));
        if (kvp == null){
            return null;
        }
        map.remove(kvp);
        return kvp.get();
    }

    @Override
    public Set<K> keys() {
        Set<K> keys = new HashSet<>();
        for (KeyValuePair<K, V> kvp : map){
            keys.add(kvp.k);
        }
        return keys;
    }    
}
