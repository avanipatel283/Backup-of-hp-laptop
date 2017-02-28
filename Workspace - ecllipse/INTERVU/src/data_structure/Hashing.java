package data_structure;

import java.util.HashMap;
import java.util.Hashtable;

public class Hashing{
	public static void main(String args[])
	{
		System.out.println("HashMap");
		HashMap<Integer,String> has=new HashMap<Integer,String>();
		has.put(2,"feb");
		has.put(20,"sun");
		has.put(12,"mon");
		for(Integer i : has.keySet())
		{
			System.out.println("Key is : " + i + " and value is : " + has.get(i));
		}
		System.out.println("HashTable");
		Hashtable<String , Integer> table=new Hashtable<String, Integer>();
		table.put("one", 1);
		table.put("two", 2);
		table.put("three", 3);
		for(String j : table.keySet())
		{
			System.out.println("Key is : " + j + " and value is : " + table.get(j));
		}
	}
	
}