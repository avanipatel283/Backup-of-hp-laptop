package pack2;

import java.util.Scanner;
class Protact {
	int t = 5;
	protected static int a = 10;
	int temp = 8;

	public static void main(String[] args)  {
		// TODO Auto-generated method stub
		int[][] b = { { 1, 2 }, { 4, 5, 6 } };
		Scanner s = new Scanner(System.in);
		b[1][2] = s.nextInt();
		String s1[][] = { { "hello" }, { "how r u " } };
	//	s1[1][0] = "hi";
		//System.out.println(s1[1][0]);
		for (int i = 0; i < s1.length; i++) {
			for (int j = 0; j < s1[i].length; j++) {
				System.out.print(i + " " + j + " : " + s1[i][j] + " ");
			}
			System.out.println();
		}

		for (int i = 0; i < b.length; i++) {
			for (int j = 0; j < b[i].length; j++) {
				System.out.print(b[i][j] + " ");
			}
			System.out.println();
		}

			
	}

}
