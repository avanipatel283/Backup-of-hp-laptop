package posnegchallenge;

import static org.junit.Assert.*;

import org.junit.Test;

public class JunitTestCase {

	@Test
	public void test() {
		assertEquals(true,PosNegChallenge.posNeg(1, -1, false));
		assertEquals(true,PosNegChallenge.posNeg(-1, 1, false));
		assertEquals(false,PosNegChallenge.posNeg(1, 1, false));
		assertEquals(false,PosNegChallenge.posNeg(-1, -1, false));
		
		assertEquals(true,PosNegChallenge.posNeg(-1, -1, true));
		assertEquals(false,PosNegChallenge.posNeg(-1, 1, true));
		assertEquals(false,PosNegChallenge.posNeg(1, 1, true));
	
	}
 
}
//posNeg(1, -1, false) -> true
//posNeg(-1, 1, false) -> true
//posNeg(1, 1, false) -> false
//posNeg(-1, -1, false) -> false
//
//posNeg(-1, -1, true) -> true
//posNeg(-1, 1, true) -> false
//posNeg(1, 1, true) -> false