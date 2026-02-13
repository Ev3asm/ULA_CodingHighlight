package hashtables;

import java.util.Iterator;
import java.util.LinkedList;

/**
 * An implementation of HashTable.
 * 
 * This implementation uses chaining to resolve collisions. Chaining means 
 * the underlying array stores references to growable structures (like 
 * LinkedLists) that we expect to remain small in size. When there is a 
 * collision, the element is added to the end of the growable structure. It
 * must search the entire growable structure whenever checking membership
 * or removing elements.
 * 
 * This implementation maintains a capacity equal to 2^n - 1 for some positive
 * integer n. When the load factor exceeds 0.75, the next add() triggers a
 * resize by incrementing n (by one). For example, when n=3, then capacity=7.
 * When size=6, then load factor ~=0.86. The addition of the seventh item would
 * trigger a resize, increasing the capacity of the array to 15.
 */
public class ChainingHashTable<E> implements HashTable<E> {
    
    LinkedList<E>[] array;
    int capacity;
    int size;

    /**
     * Instantiate a new hash table. The initial capacity should be 7.
     */
    public ChainingHashTable() {
        capacity = 7;
        array = (LinkedList<E>[])new LinkedList[capacity];
        size = 0;
    }

    /**
     * Instantiate a new hash table. The initial capacity should be 
     * at least sufficient to hold n elements, but must be one less
     * than a power of two.
     */
    public ChainingHashTable(int n) {
        capacity = 2;
        while (capacity <= n){
            capacity *= 2;
        }
        capacity--;
        array = (LinkedList<E>[])new LinkedList[capacity];
        size = 0;
    }

    @Override
    public int capacity() {
        return capacity;
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public double loadFactor() {
        return (double)(size)/capacity;
    }

    @Override
    public boolean add(E e) {
        if (this.loadFactor() > 0.75){
            enlarge();
        }
        int hash = Math.abs(e.hashCode());
        if (array[hash % capacity] == null){
            array[hash % capacity] = new LinkedList<>();
        }
        boolean result = !array[hash % capacity].contains(e);
        if  (result){
            size++;
        } else {
            array[hash % capacity].remove(e);
        }
        array[hash % capacity].add(e);
        return result;
    }

    @Override
    public boolean remove(E e) {
        int hash = Math.abs(e.hashCode());
        if (array[hash % capacity] == null){
            return false;
        } 
        boolean result = (array[hash % capacity].remove(e));
        if (result){
            size--;
        }
        if (array[hash % capacity].size() == 0){
            array[hash % capacity] = null;
        }
        return result;
    }

    @Override
    public boolean contains(E e) {
        int hash = Math.abs(e.hashCode());
        if (array[hash % capacity] == null){
            return false;
        }
        return ((array[hash % capacity].contains(e)));
    }

    @Override
    public E get(E e) {
        int hash = Math.abs(e.hashCode());
        if (array[hash % capacity] == null){
            return null;
        } 
        for (E element: array[hash % capacity]) {
            if (e.equals(element)) {
                return element; 
            }
        }
        return null;
    }

    @Override
    public Iterator<E> iterator() {
        return new ChainingHashTableIteratior<>(array);
    }

    private void enlarge(){
        capacity = ((capacity+1) * 2) - 1;
        LinkedList<E> newArray[] = (LinkedList<E>[])new LinkedList[capacity];
        for (E element : this){
            int hash = Math.abs(element.hashCode());
            if (newArray[hash % capacity] == null){
                newArray[hash % capacity] = new LinkedList<>();
            }
            newArray[hash % capacity].add(element);
        }
        this.array = newArray;
    }
}
