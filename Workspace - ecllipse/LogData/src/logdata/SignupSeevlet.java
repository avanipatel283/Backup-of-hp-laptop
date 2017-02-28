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

public class SignupSeevlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	//int id=0;
	
	public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException {
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		PrintWriter out=res.getWriter();
		
		res.setContentType("text/html");
		
		String fname = req.getParameter("txtfullname");
		String email = req.getParameter("txtemail");
		String mno = req.getParameter("txtmobileno");
		String password = req.getParameter("txtpassword");
		String repass = req.getParameter("txtrepassword");
		String sequ = req.getParameter("ddbsequ");
		String ans = req.getParameter("txtanswer");
		
		Entity user = new Entity("User", 1);
		user.setProperty("Fullname", fname);
		user.setProperty("Email", email);
		user.setProperty("Mobile no", mno);
		user.setProperty("Password", password);
		user.setProperty("Re password", repass);
		user.setProperty("Security que", sequ);
		user.setProperty("Answer", ans);	

		ds.put(user);
		
		Key key=KeyFactory.createKey("User", 1);
		System.out.println("User key is : "+ key);
		try {
			Entity e=ds.get(key);
			System.out.println("Entity is : "+ e);
		} catch (EntityNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		if(fname.isEmpty())
		{
			RequestDispatcher rd = req.getRequestDispatcher("/signup.html");
			out.println("<font color=red>Please fill all the fields of signup form</font>");
			rd.include(req, res);
		}
		else
		{
			RequestDispatcher rd = req.getRequestDispatcher("/login.html");
			rd.forward(req, res);
		}
		
	}
}
