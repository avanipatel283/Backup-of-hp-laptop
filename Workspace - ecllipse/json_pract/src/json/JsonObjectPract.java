package json;

import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

public class JsonObjectPract {

	public static void main(String[] args) {
		JSONObject j = new JSONObject();
		
		try {
			j.put("name", "avnai");
			j.put("Age", new Integer(26));
			System.out.println(j);
		} catch (JSONException e) {
			e.printStackTrace();
		}	
		
	}

}
