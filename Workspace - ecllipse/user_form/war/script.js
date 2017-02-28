function validate(e) {
	alert("Abc");
	var uid_bol=uid();
	var pwd_bol=pwd();
	var name_bol=name();
	var add_bol=address();
	var con_bol=country();
	var zip_bol=zip();
	var email_bol=email();
	var gen_bol=gender();
	var lan_bol=lang();
	 e.preventDefault();
	 if(uid_bol == true && pwd_bol==true && name_bol==true && add_bol == true && con_bol==true && zip_bol==true && email_bol == true && gen_bol==true && lan_bol==true ){
		 window.location.href ="/temp.html";
		 return true;
		 
	 }
	 else 
		 return false;
	
}

function uid() {
	var uid = document.getElementById("uid").value;
	var len = uid.length;
	if (len == 0) {
		alert("Enter user name");
		return false;
	} else {
		var max = 12;
		var min = 5;
		if (len < min || len > max) {
			alert("Enter the name between 5 and 12 letters");
			document.getElementById("uid").focus();
			return false;
			
		}
	}
	return true;
}

function pwd() {
	var pwd = document.getElementById("passid").value;
	var len = pwd.length;
	if (len == 0) {
		alert("Enter password");
		return false;
	} else {
		var max = 12;
		var min = 7;
		if (len < min || len > max) {
			alert("Enter the name between 7 and 12 letters");
			document.getElementById("passid").focus();
			return false;
			
		}
	}
	return true;
}

function name() {
	var name = document.getElementById("name").value;
	var letters = /^[A-Za-z]+$/;
	var len = name.length;
	if (len == 0) {
		alert("Enter Full Name");
		return false;
	}

	else if (name.match(letters)) {
		return true;
	} else {
		alert('Username must have alphabet characters only');
		document.getElementById("name").focus();
		return false;
		
	}
	return true;
}

function address() {
	var address = document.getElementById("address").value;
	var len = address.length;
	if (len == 0) {
		alert("Enter Address");
		return false;
	}
	return true;
}

function country() {
	var country = document.getElementById("country").value;
	if (country == "Default") {
		alert("Select Country");
		document.getElementById("country").focus();
		return false;
		
	}
	return true;
}

function zip() {
	var zip = document.getElementById("zip").value;
	var letters = /^[0-9]+$/;
	if (zip.match(letters)) {
		return true;
	} else {
		alert('Zip must have numeric characters only');
		document.getElementById("zip").focus();
		return false;
		
	}
	return true;
}

function email() {
	var email = document.getElementById("email").value;
	var atpos = email.indexOf("@");
	var dotpos = email.lastIndexOf(".");

	var len = email.length;
	if (len == 0) {
		alert("Enter Email");
		return false;
	} else if (atpos < 1 && dotpos < atpos + 2 && dotpos + 2 >= x.length){
		alert("Enter valid e-mail address");
		document.getElementById("email").focus();
		return false;
		
	}
	return true;
}

function gender() {

	var x = 0;
	var msex = document.getElementById("msex");
	var fsex = document.getElementById("fsex");

	if (msex.checked) {
		x++;
	}

	if (fsex.checked) {
		x++;
	}

	if (x == 0) {
		alert('Select Male/Female');
		return false;
	}
	return true;
}

function lang() {

	var x = 0;
	var eng = document.getElementById("eng");
	var hin = document.getElementById("hindi");
	var tam = document.getElementById("tamil");

	if (eng.checked) {
		x++;
	}

	if (hin.checked) {
		x++;
	}

	if (tam.checked) {
		x++;
	}

	if (x == 0) {
		alert('Select languges known');
		return false;
	}
	return true;
}
