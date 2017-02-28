package logdata;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

public class LoginServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException {
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		PrintWriter out = res.getWriter();
		res.setContentType("text/html");

		String femail, fpass, email, pass;

		email = req.getParameter("txtemail");
		pass = req.getParameter("txtpassword");
		Key key = KeyFactory.createKey("User", 1);

		System.out.println("User key is : " + key);
		try {
			Entity e = ds.get(key);
			femail = e.getProperty("Email").toString();
			fpass = e.getProperty("Password").toString();
			if (email.equals(femail) && pass.equals(fpass)) {
				RequestDispatcher rd = req.getRequestDispatcher("/userscreen.html");
				rd.forward(req, res);
			} else {

				RequestDispatcher rd = req.getRequestDispatcher("/login.html");
				out.println("<font color=red>Please ennter correct details</font>");
				rd.include(req, res);
			}
		} catch (EntityNotFoundException e) {
			e.printStackTrace();
		}

	}
}
