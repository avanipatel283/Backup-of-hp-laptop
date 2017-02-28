package filestream;
import java.io.*;
import java.util.*;
public class CollegeName {
	public static void main(String args[]) 
	{
		try
		{
			FileWriter fin=new FileWriter("c:/Avani/Avani.txt");
			fin.write("My college name is Nirma University");
			fin.close();
		}
		catch(Exception e){
			System.out.println("Error");
		}
		System.out.println("Success");
	}
	
	}