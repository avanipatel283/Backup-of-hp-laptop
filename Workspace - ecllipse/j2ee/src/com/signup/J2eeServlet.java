package com.signup;

import java.io.IOException;
import javax.servlet.http.*;

@SuppressWarnings("serial")
public class J2eeServlet extends HttpServlet {
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("text/plain");
		String name = req.getParameter("name");
		String email = req.getParameter("emailid");
		String mno = req.getParameter("mobile_no");
		System.out.print("Name is : " + name);
		System.out.print("\tEmail is : " + email);
		System.out.print("\tMobile number is : " + mno);
		resp.sendRedirect("welcome.jsp");
	}
}
