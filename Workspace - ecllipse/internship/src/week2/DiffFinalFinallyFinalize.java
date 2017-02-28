package week2;

class DemoFinalMethod {
	// final method
	final public void finalMethod() {
		System.out.println("Final method cannot be overrided");
	}

	protected void finalize() throws Throwable {
		// super.finalize();
		System.out.println("Finalize method excecuted");
	}

}

// final class
final class DemoFinalClass {
	void printMessage() {
		System.out.println("Final class cannot be inherited");
	}
}

public class DiffFinalFinallyFinalize extends DemoFinalMethod {
	final int EMP_NO;
	static final int temp;

	// constructor
	public DiffFinalFinallyFinalize() {
		// using constructor we can initialize final variable
		EMP_NO = 4;
		System.out.println("Final vriable (Employee no) : " + EMP_NO);
		// temp=6; cannot initialize static variable except static block
	}

	// static block is used to initialize static variable
	static {
		temp = 5;
		System.out.println("Static final variable :" + temp);
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		try {
			DiffFinalFinallyFinalize d = new DiffFinalFinallyFinalize();
			d.finalMethod(); // can call final method..can't override it
		} catch (Exception e) {
			System.out.println(e);
		} finally {
			System.out.println("Success...Finally block run everytime eventhough error in program");
		}
		// Integer i = 1;
		while (true) {
			System.out.println("Inside while loop " + new DiffFinalFinallyFinalize());

		}

	}

}
