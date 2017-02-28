
package filestream;
import java.io.*;
import java.util.*;
public class CreateFileInFolder {
	public static void main(String args[]) 
	{
		try
		{
			FileWriter f=new FileWriter("c:/Avani/Avani.txt");	
			f.close();
		}
		catch(Exception e){
			System.out.println("Error");
		}
		System.out.println("File Created");
	}
	
	}