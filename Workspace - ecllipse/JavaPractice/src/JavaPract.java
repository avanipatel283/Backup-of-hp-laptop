
class abc implements Ipract {
	protected int a;
	int temp = 8;

	public String toString() {
		return "hi";
	}
	
	@Override
	public void print() {

		System.out.println(a1);
		// TODO Auto-generated method stub
		System.out.println("hello");
	
	}
}

public class JavaPract extends Ipract.pract {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int i = 8;
		abc b = new abc();

		b.a = 4;
		System.out.println(b.a);
		System.out.println(i + b.a);
		System.out.println(b);
		b.print();
		Ipract itemp = new abc();
		itemp.print();
		// Anonymous class
		Ipract anno = new abc() {
			public void print() {
				System.out.println("this annonymous class");			
			}
		};
		
		anno.print();
		// If class is abstract
		// Ipract.pract b1 = new Ipract.pract();
		// b1.print1();		
		// If class is concrete
		JavaPract j = new JavaPract();
		j.print1();

		}

}
