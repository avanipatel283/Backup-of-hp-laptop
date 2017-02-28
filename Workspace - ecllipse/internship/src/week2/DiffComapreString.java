package week2;

import javax.net.ssl.HandshakeCompletedEvent;

public class DiffComapreString {

	public static void main(String[] args) {
		String s1 = "Cat";// will create reference
		String s2 = "Cat";
		String s3 = new String("Cat");// will create a object
		Object obj1 = new Object();
		Object obj2 = new Object();
		//In case of string
		// == checks references
		// equal() checks values
		System.out.print("Cat == Cat : ");
		if (s1 == s2) {
			System.out.print("true");
		} else {
			System.out.print("false");
		}
		System.out.print("\nCat == Cat Object : ");
		if (s1 == s3) {
			System.out.print("true");
		} else {
			System.out.print("false");
		}
		System.out.print("\nCat Object.equals(Cat) : ");
		if (s3.equals(s2)) {
			System.out.print("true");
		} else {
			System.out.print("False");
		}
		//In case of object == and equals both check the references only
		System.out.print("\nobj1==obj2 : ");
		if (obj1 == obj2) {
			System.out.print("true");
		} else {
			System.out.print("False");
		}
		System.out.print("\nobj1.equals(obj2) : ");
		if (obj1.equals(obj2)) {
			System.out.print("true");
		} else {
			System.out.print("False");
		}
		obj1 = obj2;
		System.out.println("\n\nAfter obj1=obj2");
		System.out.print("\nobj1 == obj2 : ");
		if (obj1 == obj2) {
			System.out.print("true");
		} else {
			System.out.print("False");
		}
		System.out.print("\nobj1.equals(obj2) : ");
		if (obj1.equals(obj2)) {
			System.out.print("true");
		} else {
			System.out.print("False");
		}
		System.out.println();
		Integer intiger1, intiger2;
		//Both has difference values stored on difference location
		intiger1 = 3;
		intiger2 = 6;		
		System.out.println("intiger1 == intiger2 : " + (intiger1 == intiger2));
		System.out.println("intiger1.equals(intiger2) : " + (intiger1.equals(intiger2)));
		int int1, int2;
		int1 = 5;
		int2 = 5;
		System.out.println("int1 == int2 : " + (int1 == int2));
		//not used with primitive data type : System.out.println(int1.equals(int2));
		String str1, str2, str3;
		str1 = "Hello";
		str2 = "Hello";
		str3=new String("Hello");
		System.out.println("str1 == str2 : " + (str1 == str2));
		System.out.println("str1.equals(str2) : " + (str1.equals(str2)));
		//Comparison of String and Object of String 
		System.out.println("str1 == str3 : " + (str1 == str3));
		System.out.println("str1.equals(str3) : " + (str1.equals(str3)));
		//not used with primitive data type : System.out.println(int1.equals(int2));
		
		System.out.println(intiger1.hashCode());
		System.out.println(intiger2.hashCode());
		System.out.println(str1.hashCode());
	}
}
