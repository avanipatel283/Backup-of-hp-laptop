package logdata;

import java.io.IOException;
import javax.servlet.http.*;

@SuppressWarnings("serial")
public class LogDataServlet extends HttpServlet {
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("text/html");
	
		String fname=req.getParameter("fullname");
		String email=req.getParameter("email");
		String mno=req.getParameter("mobileno");
		String password=req.getParameter("password");
		String repass=req.getParameter("repassword");
		String sequ=req.getParameter("sequ");
		String ans=req.getParameter("answer");
		System.out.println("Full name is : " + fname);
		System.out.println("Email id is : " + email);
		System.out.println("Mobile no is : " + mno);
		System.out.println("Password is : " + password);
		System.out.println("Repasswors is : " + repass);
		System.out.println("Sequrity question is : " + sequ);		
		System.out.println("Answer is : " + ans);
		resp.getWriter().println("<h1>Success!! Data logged on console</h1>");
	}
}
