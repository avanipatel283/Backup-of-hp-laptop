package week2;

public class DemoControlStatements {

	public static void main(String[] args) {
		System.out.println("~~~Demo of countinue statement~~~");
		int i;
		for (i = 0; i < 5; i++) {
			if (i == 2) {
				System.out.println("Not print value");
			}
			System.out.println("Value is : " + (i + 1));
		}
		System.out.println("~~~Demo of break statement");
		for (i = 0; i < 5; i++) {
			if (i == 2) {
				System.out.println("Loop come out...");
				break;
			}
			System.out.println("Value is : " + (i + 1));
		}

	}

}
