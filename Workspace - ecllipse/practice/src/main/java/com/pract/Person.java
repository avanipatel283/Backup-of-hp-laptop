package com.pract;

public class Person {
	private int id;
	private String name;
	private int temp;

	public void setTemp(int temp) {
		this.temp = temp;
	}

	public Person(int id, String name) {
		this.id = id;
		this.name = name;
	}

	public void print() {
		System.out.println("hello from person class");
	}

	@Override
	public String toString() {
		return "id = " + id + " name = " + name + " emp = " + temp;
	}
}
