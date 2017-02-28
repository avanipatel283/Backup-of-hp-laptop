package data_structures;

public class DemoStack {
	private int top;
	private int a[];
	private int maxLen;

	public DemoStack(int maxl) {
		top = -1;
		maxLen = maxl;
		a = new int[maxLen];
	}
	public void push(int val) {
		a[++top] = val;
	}
	public int pop()
	{
		return a[top--];		
	}
	public boolean isEmpty()
	{
		return top==-1;
	}
	public int print(int i)
	{
		return a[i];
	}
	
	public static void main(String[] args) {
		DemoStack dm=new DemoStack(3);
		dm.push(10);
		dm.push(20);
		dm.push(30);
		System.out.println("Stack values after push");
		for(int i=0;i<3;i++)
		{
			System.out.print(dm.print(i) + " ");
		}
		System.out.println("\nStack values after pop");
		while(! dm.isEmpty())
		{
			System.out.print(dm.pop() + " ");
		}
		
		
	}

}
