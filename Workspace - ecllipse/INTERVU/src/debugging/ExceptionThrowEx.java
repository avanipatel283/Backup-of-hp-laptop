package debugging;

import java.util.Scanner;

public class ExceptionThrowEx{

	public static void main(String[] args) throws Exception {
		int arry[]=new int[3];
		int n1,n2;
		try
		{
		Scanner in=new Scanner(System.in);
		System.out.print("Enter number 1 : ");
				n1=in.nextInt();
				System.out.println("Enter number 2 : \n");
		n2=in.nextInt();
		arry[2]=n1/n2;
		System.out.println("Answer is : " + arry[2]);
		}catch(ArithmeticException ae)
		{
			System.out.println(ae);
		}
	}

}
