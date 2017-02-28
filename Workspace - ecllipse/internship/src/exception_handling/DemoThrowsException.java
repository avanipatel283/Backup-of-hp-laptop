package exception_handling;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;
public class DemoThrowsException {

	public static void main(String[] args) throws Exception {
		int c;
		Scanner in = new Scanner(System.in);
		System.out.println("1. Arithmetic Exception");
		System.out.println("2. Array Out Of Index");
		System.out.println("3. File Not Found");
		System.out.println("4. IO Exception");
		System.out.println("5. Illegal Argument Exception");
		System.out.println("6. Exit");
		
	
		do {
			System.out.print("Enter choice : ");
			c = in.nextInt();
			switch (c) {
			case 1: {
				try {
					int a = 10, b = 0;
					int ans = a / b;
					System.out.println("Answer is :" + ans);
				} catch (ArithmeticException ae) {
					System.out.println("Cannot devide by zero;");
				}
				break;
			}
			case 2: {
				try {
					int a[] = new int[2];
					a[3] = 5;
					System.out.println("a[3] is : " + a[3]);
				} catch (ArrayIndexOutOfBoundsException ab) {
					System.out.println("Array Index Out of Bound");
				}
				break;
			}
			case 3: {
				try {
					FileReader f = new FileReader("task1.txt");
				} catch (FileNotFoundException fe) {
					System.out.println("Wrong File Path");
				}
				break;
			}
			case 4: {
				try {
					File f = new File("C:\temp.txt");
					FileWriter fw = new FileWriter(f);
					String s = "This is my file";
					fw.write(s);
					fw.close();
				} catch (IOException io) {
					System.out.println("File path has problem");
				}
				break;
			}
			case 5: {
				int i;
				Scanner inp = new Scanner(System.in);
				i = inp.nextInt();
				if (i <= 10 || i >= 20) {
					throw new IllegalArgumentException("Wrong Value");
				}
				break;
			}
			case 6: {
				System.out.println("Good Bye");
				break;
			}
			default: {
				System.out.println("Wrong Choice");
				break;
			}		

			}
		} while (c!= 6);
	}

}
