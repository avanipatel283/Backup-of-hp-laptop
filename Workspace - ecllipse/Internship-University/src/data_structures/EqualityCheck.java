package data_structures;

class test{
	test(){
		System.out.println("parent class constructor");
	}
	static void temp(){
		System.out.println("Temp method of parent class called");
	}

}
public class EqualityCheck extends test{
	 static String str="abc";
	 static boolean b=true;
		static{
			System.out.println("Static block");
		}
		{System.out.println("Instance block");}
		public EqualityCheck() {
			// TODO Auto-generated constructor stub
			System.out.println("Dirived class constructor");
		}
		
	public static void main(String[] args) {
		EqualityCheck e=new EqualityCheck();
		}
		
	}
