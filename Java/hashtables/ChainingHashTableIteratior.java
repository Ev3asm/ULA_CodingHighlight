package hashtables;

import java.util.Iterator;
import java.util.LinkedList;

public class ChainingHashTableIteratior<E> implements Iterator<E> {

    LinkedList<E> array[];
    int position;
    int index;

    public ChainingHashTableIteratior(LinkedList<E> a[]){
        array = a;
        position = 0;
        index = 0;
        while (this.hasNext() && array[position] == null){
            position++;
            // System.out.println(position);
        }
    }
    @Override
    public boolean hasNext() {
        return position < array.length;
    }

    @Override
    public E next() {
        E nextElement = array[position].get(index);
        index++;
        if (array[position].size() <= index){
            index = 0;
            position++;
            // System.out.println(position);
            while (this.hasNext() && array[position] == null){
                position++;
                // System.out.println(position);
            }
        }
        return nextElement;
    }

}
