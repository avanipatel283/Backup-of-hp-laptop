package filestream;
import java.io.*;
import java.util.*;
public class CreateFile {
	public static void main(String args[]) 
	{
		try
		{
			FileWriter f=new FileWriter("task1.txt");	
		}
		catch(Exception e){
			System.out.println("Error");
		}
		System.out.println("File Created");
	}
	
	}
