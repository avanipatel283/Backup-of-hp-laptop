package week2;

public class DiffStaticInstantMenmer {
	static int i;
	int j;

	void print() {
		j++;
		i++;
		System.out.println("Value of i : " + i + " value of j : " + j);
	}

	public static void main(String[] args) {
		System.out.println("i is static variable and j is instance variable");
		DiffStaticInstantMenmer d = new DiffStaticInstantMenmer();

		d.print();
		DiffStaticInstantMenmer d1 = new DiffStaticInstantMenmer();
		d1.print();
		d.print();
		DiffStaticInstantMenmer d2 = new DiffStaticInstantMenmer();
		d2.print();
	}

}
