package week2;

import java.util.*;

public class DiffListSetMap {

	public static void main(String[] args) {
		ArrayList<String> al = new ArrayList<String>();
		al.add("one");
		al.add("two");
		ArrayList<String> a2 = new ArrayList<String>();
		a2.add("Three");
		a2.addAll(al);
		Iterator<String> ir = a2.iterator();
		while (ir.hasNext()) {
			System.out.println(ir.next());
		}
		System.out.println("After remove element from arraylist");
		a2.remove(1);
		ir = a2.iterator();
		while (ir.hasNext()) {
			System.out.println(ir.next());
		}
		System.out.println("~~~~~LinkHasSet output~~~~~");
		HashSet<Integer> ls = new LinkedHashSet<Integer>();
		ls.add(1);
		ls.add(100);
		ls.add(20);
		for (int i : ls) {
			System.out.println(i);
		}
		System.out.println("~~~~~Tree set maintain accending order~~~~~");
		TreeSet<Integer> ts = new TreeSet<Integer>();
		ts.add(1);
		ts.add(100);
		ts.add(20);
		for (int i : ts) {
			System.out.println(i);
		}
		System.out.println("~~~~~LinkedHasMap class~~~~~");
		LinkedHashMap<String, Integer> lhm = new LinkedHashMap<String, Integer>();
		lhm.put("one", 1);
		lhm.put("two", 2);
		lhm.put("three", 3);
		for (Map.Entry<String, Integer> ent : lhm.entrySet()) {
			System.out.println(ent.getKey() + " : " + ent.getValue());
		}

		System.out.println("~~~~~Hashtable Class~~~~~");
		// It is in dictionary class
		Hashtable<Integer, String> ht = new Hashtable<Integer, String>();
		ht.put(102, "one");
		ht.put(100, "two");
		Hashtable<Integer, String> ht1 = new Hashtable<Integer, String>();
		ht1.put(1, "three");
		ht1.put(5, "four");
		ht1.putAll(ht);
		for (int i : ht1.keySet()) {
			System.out.println("Key : " + i + " value : " + ht1.get(i));
		}
		if (ht1.containsKey(100)) {
			System.out.println("Value of key 100 is : " + ht1.get(100));
		}

	}

}
