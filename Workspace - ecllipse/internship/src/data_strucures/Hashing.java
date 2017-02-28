package data_strucures;

import java.util.*;

public class Hashing {
	public static void main(String args[]) {
		System.out.println("Hash Map");
		HashMap<Integer, String> hasmap = new HashMap<Integer, String>();
		hasmap.put(1, "Apple");
		hasmap.put(2, "Mango");
		for (int i : hasmap.keySet()) {
			System.out.println("Key is : " + i + " and value is : " + hasmap.get(i));
		}
		
		System.out.println("\nHash Table");
		Hashtable<Integer, String> hastable = new Hashtable<Integer, String>();
		hastable.put(44, "Apple");
		hastable.put(20, "Mango");
		hastable.put(22, "Orange");
		hastable.put(55, "Water Melon");
		for (int i : hastable.keySet()) {
			System.out.println("Key is : " + i + " and value is : " + hastable.get(i));
		}
	}

}
