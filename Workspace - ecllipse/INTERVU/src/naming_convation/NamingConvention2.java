package naming_convation;

import java.util.Scanner;

public class NamingConvention2 {

	public static void main(String[] args) {
		String firstName,lastName;
		Scanner in=new Scanner(System.in);
		System.out.println("Enter first Name : ");
		firstName=in.nextLine();
		System.out.println("Enter Last Name : ");
		lastName=in.nextLine();
		System.out.println("Your full name is : " + firstName + " " + lastName);
		
		

	}

}
