package exception_handling;

import java.util.*;

public class DemoExceptionHandling {
	public int c = 20;
	public static void main(String[] args) {
		int a[] = new int[3];
		
		try {
			Scanner in = new Scanner(System.in);
			for (int i = 0; i <= 3; i++) {
				System.out.print("Enter a[" + i + "] : ");
				a[i] = in.nextInt();
				System.out.println("a[" + i + "] : " + a[i]);
			}
		} catch (Exception e) {
			System.out.println("Array index out of bound");
		}
	}

}
