/**
 * 
 */
/**
 * @author user
 *
 */
package naming_convation;


import java.util.Scanner;

public class NamingConvention
{
	static String name;
public static void main(String args[])
{
	
	getName();
	printName();
}
static void getName()
{
	Scanner in=new Scanner(System.in);
	System.out.println("Enter your name : ");
	name = in.next();
	
}
static void printName()
{
	System.out.println("Your name is : " + name);	
	
}
}