package debugging;

public class ThrowEx {
	public static void main(String args[]) throws Exception
	{
		method1();
	}
		static void method1()
		{
			System.out.println("Method one called");
			method2();
		}
		static void method2()
		{
			System.out.println("Method two called");
			method3();
		}
		static void method3()
		{
			System.out.println("Method three called");
			method4();
		}
		static void method4()
		{
			System.out.println(20/0);
		}
	
}
