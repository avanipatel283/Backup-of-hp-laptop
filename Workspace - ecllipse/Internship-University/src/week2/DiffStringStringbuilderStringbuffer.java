package week2;

public class DiffStringStringbuilderStringbuffer {

	public static void main(String[] args) {
		String s = "cat";
		StringBuffer sbuff = new StringBuffer("hello");
		StringBuilder sbuilder = new StringBuilder("world");
		System.out.println("String is : " + s + " : " + s.hashCode());
		System.out.println("String buffer value : " + sbuff + " " + sbuff.hashCode());
		System.out.println("String builder value : " + sbuilder + " " + sbuilder.hashCode());
		s = "dog";
		System.out.println("After chnage value : " + s + " : " + s.hashCode());
		sbuff.append("world");
		System.out.println("sbuff.append(world) : " + sbuff + " " + sbuff.hashCode());
		System.out.println("sbuff.append(sbuilder) : " + sbuff.append(sbuilder).toString() + " " + sbuff.hashCode());

	}

}
