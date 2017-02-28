package data_structures;
import exception_handling.*;
import java.util.*;
public class ArrayListEx {

	public static void main(String[] args) {
		//call class from different package
		DemoExceptionHandling d=new DemoExceptionHandling();
		System.out.println(d.c);
		
		ArrayList<Integer> ar=new ArrayList<Integer>();
		ar.add(1);
		ar.add(20);
		ar.add(30);
		Iterator<Integer> ir=ar.iterator();
		System.out.println("Elements of arraylist");
		while(ir.hasNext())
			{
				System.out.print(ir.next() + " ");
			}
		}

	}

