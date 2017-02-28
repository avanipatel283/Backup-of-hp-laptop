package com.pract;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

public class App {

	public static void main(String[] args) {
		ApplicationContext context=new FileSystemXmlApplicationContext("src/main/java/com/pract/beans_file/beans.xml");
		System.out.println("app.java");
		Person p = (Person)context.getBean("person");
		p.print();
		System.out.println(p);
		((FileSystemXmlApplicationContext)context).close();

	}

}
