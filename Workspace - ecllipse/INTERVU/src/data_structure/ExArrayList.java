
package data_structure;
import java.util.*;
public class ExArrayList{
	public static void main(String args[])
	{
		System.out.println("1+2 =  "+(1+2));
		ArrayList<String> temp=new ArrayList<String>();
		temp.add("One");
		temp.add("Two");
		temp.add("Three");
		System.out.println("~~~~~Array List~~~~~");
		for(String a : temp)
		{
			System.out.println(a);
		}
		temp.add(2,"six");
		System.out.println("~~~~~After Add New Array List~~~~~");
		for(String a : temp)
		{
			System.out.println(a);
		}
		System.out.println("~~~~~Array List Print Using Iterator~~~~~");
		Iterator<String> i=temp.iterator();
		while(i.hasNext())
		{
			System.out.println(i.next());
			
		}		
		
	}
	
}