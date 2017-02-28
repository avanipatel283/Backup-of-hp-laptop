package exection_handaling;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.*;
public class temp {

	public static void main(String[] args) throws Exception {
		//arithmatic();
		arrayindex();
		//filenotfound();
		//catchioexception();
		//classnotf();
	}
	public static void arithmatic()
	{
		try
		{
		Scanner in=new Scanner(System.in);
		System.out.println("Enter number 1 : ");
		int n1=in.nextInt();
		System.out.println("Enter number 2 : ");
		int n2=in.nextInt();
		int div=n1/n2;
		System.out .println("Answer is : " + div);
		}
		catch(ArithmeticException ae)
		{
			System.out.println("Arithmatic Exception");
		}
		
	}
	public static void arrayindex()
	{
		try
		{
			int a[]=new int[2];
			System.out.println("accessing element a[2] : " + a[2]);
		}catch(ArrayIndexOutOfBoundsException ae){
			System.out.println("error in array index");
		}
	}
public static void filenotfound()
{
	try
	{
		FileInputStream fis = new FileInputStream("B:/myfile.txt"); 
			
	}catch(FileNotFoundException fi){
	System.out.println("File not found");	
	}
	
}
public static void catchioexception() throws IOException
{

		FileInputStream fis = new FileInputStream("B:/myfile.txt"); 
		int k; 
		while(( k = fis.read() ) != -1) 
		{ 
			System.out.print((char)k); 
		} 
		fis.close(); 	
}
public static void classnotf() throws ClassNotFoundException
{
	Class.forName("abc");
	System.out.print("Class not found");
}

}
