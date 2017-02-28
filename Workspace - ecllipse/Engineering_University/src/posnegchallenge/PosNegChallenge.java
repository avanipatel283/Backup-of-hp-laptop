package posnegchallenge;
/*Name : Avani PAtel
 * Date : 29 Dec 2016
 * PosNegChallenge Project 
 */
public class PosNegChallenge {

	public static boolean posNeg(int a, int b, boolean negative) {
		if (negative == false) {
			if (a == b)
				return false;
			else
				return true;
		} else {
			if (a < 0 && b < 0)
				return true;
			else
				return false;
		}
	}

	public static void main(String[] args) {
	System.out.println(posNeg(1, -1, false));		
	System.out.println(posNeg(-1, 1, false));
	System.out.println(posNeg(1, 1, false)) ;
	System.out.println(posNeg(-1, -1, false));

	System.out.println(posNeg(-1, -1, true));
	System.out.println(posNeg(-1, 1, true));
	System.out.println(posNeg(1, 1, true)) ;
	System.out.println(posNeg(1, -1, true));
	}

}
