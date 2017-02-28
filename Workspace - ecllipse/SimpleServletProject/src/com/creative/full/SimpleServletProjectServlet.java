package com.creative.full;

import java.io.IOException;
import javax.servlet.http.*;

@SuppressWarnings("serial")
public class SimpleServletProjectServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("text/plain");
		resp.sendRedirect("SuccessPage.jsp");
	}
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("text/plain");
		resp.sendRedirect("SuccessPage.jsp");	}
	
}
