public class Passbyvalue {

	    
	    public static void main(String[] args) {
	        Passbyvalue app = new Passbyvalue();
	        
	        //===========================================
	        
	        int value = 7;
	        System.out.println("1. Value is: " + value);
	        
	        app.show(value);
	        
	        System.out.println("4. Value is: " + value);
	        
	        //===========================================
	        System.out.println();
	        
	        Person person = new Person("Bob");
	        System.out.println("1. Person is: " + person);
	        
	        app.show(person);
	        
	        System.out.println("4. Person is: " + person);
	    }
	    
	    public void show(int value) {
	        System.out.println("2. Value is: " + value);
	        
	        value = 8;
	        
	        System.out.println("3. Value is: " + value);
	    }
	    
	    public void show(Person person) {
	        System.out.println("2. Person is: " + person);
	        
	        
	        
	        person = new Person("Mike");
	        person.setName("Sue");
	        
	        System.out.println("3. Person is: " + person);
	        
	    }
	    
	    
	

}


class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Person [name=" + name + "]";
    }
}

