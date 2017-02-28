package data_structure;

import java.util.Collections;
import java.util.Scanner;
import java.util.Vector;

public class ExVector{
	public static void main(String args[])
	{
		Vector<String> v=new Vector<String>();
		v.add("Mon");
		v.add("Sun");
		v.add("Fri");
		Collections.sort(v);
		System.out.println(v);
		Scanner in=new Scanner(System.in);
		System.out.print("Enter any value from above list : ");
		String s=in.nextLine();
		if(s.equals("Mon") || s.equals("Sun") || s.equals("Fri"))
		{
		int index=Collections.binarySearch(v,  s);
		System.out.println("Index is : "+ index);
		}
		else
		{
			System.out.println("Wrong Value");
		}
		
		
	}
	
}