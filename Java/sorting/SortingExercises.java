package sorting;

public class SortingExercises {

    /**
     * Swap the values at a[i] and a[j].
     */
    static void swap(double[] a, int i, int j) {
        double t = a[i];
        a[i] = a[j];
        a[j] = t;
    }

    /**
     * Perform an in-place insertion sort on the array a.
     * The array will be in ascending order (least-to-greatest) after sorting.
     */
    static void insertionSort(double[] a) {
        for (int i = 1; i < a.length; i++) {
            for (int j = i; (j > 0 && a[j - 1] > a[j]); j--) {
                swap(a, j, j - 1);
            }
        }
    }

    /**
     * Perform an in-place insertion sort of the range start (inclusive) 
     * through end (exclusive) on array a.
     * The array will be in ascending order (least-to-greatest) after sorting.
     */
    static void insertionSort(double[] a, int start, int end) {
        for (int i = start + 1; i < end; i++) {
            for (int j = i; (j > start && a[j - 1] > a[j]); j--) {
                swap(a, j, j - 1);
            }
        }
    }

    /**
     * Perform a destructive mergesort on the array a.
    
     * The array will be in ascending order (least-to-greatest) after sorting; the original
     * values will be overwritten.
     * Additional array space will be allocated by this method.
     * 
     * For efficiency, this method will *insertion sort* any array of length less than 10.
     */
    public static void mergeSort(double[] a) {
        if (a.length < 10){
            insertionSort(a);
            return;
        }

        int half = a.length / 2;
        double[] left = new double[half];
        double[] right = new double[a.length - half];
        for (int i = 0; i < a.length; i++){
            if (i < half){
                left[i] = a[i];
            } else {
                right[i-half] = a[i];
            }
        }
        mergeSort(left);
        mergeSort(right);
        merge(a, left, right);
    }

    /**
     * Merge the sorted arrays l and r into the array a (overwriting its previous contents).
     */
    static void merge(double[] a, double[] l, double[] r) {
        int leftIndex = 0;
        int rightIndex = 0;
        for (int i = 0; i < a.length; i++){
            if (leftIndex >= l.length){
                a[i] = r[rightIndex];
                rightIndex++;
            } else if (rightIndex >= r.length){
                a[i] = l[leftIndex];
                leftIndex++;
            } else {
                if (l[leftIndex] <= r[rightIndex]){
                    a[i] = l[leftIndex];
                    leftIndex++;
                } else {
                    a[i] = r[rightIndex];
                    rightIndex++;
                }
            }
        }
    }

    /**
     * Perform an in-place quicksort on the array a.
     */
    static void quickSort(double[] a) {
        quickSort(a, 0, a.length);
    }

    /**
     * Perform an in-place quicksort on the range i (inclusive) to j 
     * (exclusive) of the array a.
     * 
     * For efficiency, this method will *insertion sort* any range of 
     * length less than 10.
     */
    static void quickSort(double[] a, int i, int j) {
        if (j - i < 10){
            insertionSort(a, i, j);
            return;
        }

        int pivotIndex = partition(a, i, j); 
        quickSort(a, i, pivotIndex); // remember, quickSort inclusive/exclusive, partition inclusive/inclusive
        quickSort(a, pivotIndex + 1, j);
    }

    /**
     * Perform an in-place partition on the  range i (inclusive) to j 
     * (exclusive) of the array a, returning the index of the pivot
     * after partitioning.
     * 
     * To cut down on worst case choices, this method will chose the 
     * pivot value at random from among the values in the range.
     * 
     * @return the index of the pivot after the partition
     */
    static int partition(double[] a, int i, int j) {
        swap(a, (int)(j * Math.random()), j - 1);
        double value = a[j - 1]; // pivot value
        int parseIndex = i;
        int swapIndex = i;
        while (parseIndex < j - 1){
            if (a[parseIndex] <= value){
                swap(a, parseIndex, swapIndex);
                swapIndex++;
            }
            parseIndex++;
        }
        swap(a, swapIndex, j - 1);
        return swapIndex;
    }
}