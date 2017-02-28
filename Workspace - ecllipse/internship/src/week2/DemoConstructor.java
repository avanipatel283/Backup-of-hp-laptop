package week2;

public class DemoConstructor {

	public DemoConstructor() {
		int i = 10;
		System.out.println(i);
	}

	public DemoConstructor(int no1, int no2) {
		System.out.println("Sum of " + no1 + " + " + no2 + " is : " + (no1 + no2));
	}

	public static void main(String[] args) {
		System.out.println("Default counstructor");
		new DemoConstructor();
		System.out.println("Parameterized counstructor");
		new DemoConstructor(10, 20);
	}
}
