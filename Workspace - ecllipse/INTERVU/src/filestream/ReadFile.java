package filestream;
import java.io.*;
import java.util.*;
public class ReadFile {
	public static void main(String args[]) 
	{
		try
		{
			FileReader fout =new FileReader("C:/Avani/Avani.txt");
			int i;
			while((i= fout.read()) !=-1)
			{
				System.out.print((char)i);
				
			}
			fout.close();
		}
		catch(Exception e){
			System.out.println("Error");
		}
		System.out.println("\nSuccess..");
	}
	
	}