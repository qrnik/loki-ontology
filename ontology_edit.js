var OntEdit =
{
	update: function()
	{
		var contentInput = document.getElementById("ontologyHtml");
		contentInput.name = "wikitext";
		
		// Początek
		var ontology = "<ontology>";
		ontology += "<name>" + document.getElementById("name").value + "</name>";
		
		// Klasy
		ontology += "<classes>";
		var classes = document.getElementById("addClass").parentElement.children;
		for(var i = 0; i < classes.length-1; i++)
		{
			if(classes[i].children.length == 0)
				continue;
			
			ontology += "<class id='" + classes[i].children[0].textContent + "'>" +
				classes[i].children[1].textContent + "</class>";
		}
		ontology += "</classes>";
		
		// Relacje klas
		ontology += "<classRelations>";
		var classRelations = document.getElementById("addClassRelation").parentElement.children;
		for(var i = 0; i < classRelations.length-1; i++)
		{
			if(classRelations[i].children.length == 0)
				continue;
			
			ontology += "<relation type='" + classRelations[i].children[0].textContent +
				"' subject='" + classRelations[i].children[1].textContent +
				"' object='" + classRelations[i].children[2].textContent + "'/>";
		}
		ontology += "</classRelations>";
		
		// Własności obiektowe
		ontology += "<objectProperties>";
		var objectProperties = document.getElementById("addObjectProperty").parentElement.children;
		for(var i = 0; i < objectProperties.length-1; i++)
		{
			if(objectProperties[i].children.length == 0)
				continue;
			
			ontology += "<property id='" + objectProperties[i].children[0].textContent +
				"' subject='" + objectProperties[i].children[1].textContent +
				"' object='" + objectProperties[i].children[2].textContent + "'/>";
		}
		ontology += "</objectProperties>";
		
		// Własności proste
		ontology += "<dataProperties>";
		var dataProperties = document.getElementById("addDataProperty").parentElement.children;
		for(var i = 0; i < dataProperties.length-1; i++)
		{
			if(dataProperties[i].children.length == 0)
				continue;
			
			ontology += "<property id='" + dataProperties[i].children[0].textContent +
				"' domain='" + dataProperties[i].children[1].textContent +
				"' range='" + dataProperties[i].children[2].textContent + "'/>";
		}
		ontology += "</dataProperties>";
		
		// Relacje własności
		ontology += "<propertyRelations>";
		var propertyRelations = document.getElementById("addPropertyRelation").parentElement.children;
		for(var i = 0; i < propertyRelations.length-1; i++)
		{
			if(propertyRelations[i].children.length == 0)
				continue;
			
			ontology += "<relation type='" + propertyRelations[i].children[0].textContent +
				"' subject='" + propertyRelations[i].children[1].textContent +
				"' object='" + propertyRelations[i].children[2].textContent + "'/>";
		}
		ontology += "</propertyRelations>";
		
		// Końcówka
		ontology += "</ontology>";
		contentInput.value = ontology;
	},
	
	classExists: function(classId)
	{
		var classes = document.getElementById("addClass").parentElement.children;
		
		for(var i = 0; i < classes.length-1; i++)
		{
			if(classes[i].children.length == 0)
				continue;
			
			if(classes[i].children[0].textContent == classId)
				return true;
		}
		
		return false;
	},
	
	propertyExists: function(property)
	{
		var objProperties = document.getElementById("addObjectProperty").parentElement.children;
		var dataProperties = document.getElementById("addDataProperty").parentElement.children;
		
		for(var i = 0; i < objProperties.length+dataProperties.length-2; i++)
		{
			var prop = i < objProperties.length-1 ?
				objProperties[i] : dataProperties[i+1-objProperties.length];
			
			if(prop.children.length == 0)
				continue;
			
			if(prop.children[0].textContent == property)
				return true;
		}
		
		return false;
	},
	
	classUsed: function(classId)
	{
		var classRelations = document.getElementById("addClassRelation").parentElement.children;
		var objProperties = document.getElementById("addObjectProperty").parentElement.children;
		var dataProperties = document.getElementById("addDataProperty").parentElement.children;
		var propertyRelations = document.getElementById("addPropertyRelation").parentElement.children;
		
		for(var i = 0; i < classRelations.length-1; i++)
		{
			if(classRelations[i].children.length == 0)
				continue;
			
			if(classRelations[i].children[1].textContent == classId ||
				classRelations[i].children[2].textContent == classId)
				return true;
		}
		
		for(var i = 0; i < objProperties.length-1; i++)
		{
			if(objProperties[i].children.length == 0)
				continue;
			
			if(objProperties[i].children[1].textContent == classId ||
				objProperties[i].children[2].textContent == classId)
				return true;
		}
		
		for(var i = 0; i < dataProperties.length-1; i++)
		{
			if(dataProperties[i].children.length == 0)
				continue;
			
			if(dataProperties[i].children[1].textContent == classId)
				return true;
		}
		
		for(var i = 0; i < propertyRelations.length-1; i++)
		{
			if(propertyRelations[i].children.length == 0)
				continue;
			
			if(propertyRelations[i].children[1].textContent == classId ||
				propertyRelations[i].children[2].textContent == classId)
				return true;
		}
		
		return false;
	},
	
	/*
	 * KLASY
	 */
	addClass: function()
	{
		var addClassDiv = document.getElementById("addClass");
		
		var id = addClassDiv.children[0].value;
		var name = addClassDiv.children[1].value;
		
		// Weryfikacja parametrów
		if(!id.match(/^[a-zA-Z0-9\u00C0-\u017F:]+$/))
		{
			alert("ID can contain only alphanumeric characters and colons.");
			return;
		}
		
		if(!name.match(/^[a-zA-Z0-9\u00C0-\u017F ]+$/))
		{
			alert("Name can contain only alphanumeric characters and spaces.");
			return;
		}
		
		var classes = addClassDiv.parentElement.children;
		
		// Jeżeli ID się potarza, edycja
		for(var i = 0; i < classes.length-1; i++)
		{
			if(classes[i].children.length == 0)
				continue;
			
			if(classes[i].children[0].textContent == id)
			{
				classes[i].children[0].textContent = id;
				classes[i].children[1].textContent = name;
				
				// Czyszczenie formularza
				addClassDiv.children[0].value = "";
				addClassDiv.children[1].value = "";
				
				OntEdit.update();
				return;
			}
		}
		
		// Utworzenie rekordu
		var newDiv = document.createElement('div');
		newDiv.innerHTML =
		"<span style=\"display: inline-block; width: 250px;\">" + id + "</span>" +
		"<span style=\"display: inline-block; width: 250px;\">" + name + "</span>" +
		"<a href=\"javascript:void(0);\" onclick=\"javascript:OntEdit.editClass('"
			+ id + "');\">edit</a> :: " +
		"<a href=\"javascript:void(0);\" onclick=\"javascript:OntEdit.deleteClass('"
			+ id + "');\">delete</a>" +
		"<hr style=\"margin: 0;\"/>";
		
		// Dodanie rekordu
		addClassDiv.parentElement
			.insertBefore(newDiv, addClassDiv);
		
		// Wyczyszczenie formularza
		addClassDiv.children[0].value = "";
		addClassDiv.children[1].value = "";
		
		OntEdit.update();
	},
	
	deleteClass: function(id)
	{
		var classes = document.getElementById("addClass").parentElement.children;
		
		if(OntEdit.classUsed(id))
		{
			alert('Podana klasa jest używana - proszę najpierw usunąć związane z nią relacje i własności.');
			return;
		}
		
		for(var i = 0; i < classes.length-1; i++)
		{
			if(classes[i].children.length == 0)
				continue;
			
			if(classes[i].children[0].textContent == id)
			{
				classes[i].innerHTML = "";
				classes[i].style.display = "none";
				
				OntEdit.update();
				return;
			}
		}
		
		alert('Nie ma takiej klasy.');
		return;
	},
	
	/*
	 * RELACJE KLAS
	 */
	addClassRelation: function()
	{
		var addClassRelationDiv = document.getElementById("addClassRelation");
		
		var relation = addClassRelationDiv.children[0].value;
		var subject = addClassRelationDiv.children[1].value;
		var object = addClassRelationDiv.children[2].value;
		
		// Weryfikacja parametrów
		if(!relation.match(/^[a-zA-Z0-9\u00C0-\u017F:]+$/))
		{
			alert("Relation can contain only alphanumeric characters and colons.");
			return;
		}
		
		if(!subject.match(/^[a-zA-Z0-9\u00C0-\u017F:]+$/))
		{
			alert("Subject ID can contain only alphanumeric characters and colons.");
			return;
		}
		
		if(!object.match(/^[a-zA-Z0-9\u00C0-\u017F:]+$/))
		{
			alert("Object ID can contain only alphanumeric characters and spaces.");
			return;
		}
		
		// Sprawdzenie, czy subject i object istnieją
		if(!OntEdit.classExists(subject))
		{
			alert("Class with ID '" + subject + "' does not exist.");
			return;
		}
		
		if(!OntEdit.classExists(object))
		{
			alert("Class with ID '" + object + "' does not exist.");
			return;
		}
		
		var classRelations = addClassRelationDiv.parentElement.children;
		
		// Jeżeli rekord już jest, nic nie rób
		for(var i = 0; i < classRelations.length-1; i++)
		{
			if(classRelations[i].children.length == 0)
				continue;
			
			if(classRelations[i].children[0].textContent == relation &&
				classRelations[i].children[1].textContent == subject &&
				classRelations[i].children[2].textContent == object)
				return;
		}
		
		// Utworzenie rekordu
		var newDiv = document.createElement('div');
		newDiv.innerHTML =
		"<span style=\"display: inline-block; width: 250px;\">" + relation + "</span>" +
		"<span style=\"display: inline-block; width: 250px;\">" + subject + "</span>" +
		"<span style=\"display: inline-block; width: 250px;\">" + object + "</span>" +
		"<a href=\"javascript:void(0);\" onclick=\"javascript:OntEdit.deleteClassRelation('"
			+ (addClassRelationDiv.parentElement.children.length-1) + "');\">delete</a>" +
		"<hr style=\"margin: 0;\"/>";
		
		// Dodanie rekordu
		addClassRelationDiv.parentElement
			.insertBefore(newDiv, addClassRelationDiv);
		
		// Wyczyszczenie formularza
		addClassRelationDiv.children[0].value = "";
		addClassRelationDiv.children[1].value = "";
		addClassRelationDiv.children[2].value = "";
		
		OntEdit.update();
	},
	
	deleteClassRelation: function(index)
	{
		var classRelations = document.getElementById("addClassRelation").parentElement.children;
		classRelations[index].innerHTML = "";
		classRelations[index].style.display = "none";
		
		OntEdit.update();
		return;
	},
	
	/*
	 * WŁASNOŚCI OBIEKTOWE
	 */
	addObjectProperty: function()
	{
		var addObjectPropertyDiv = document.getElementById("addObjectProperty");
		
		var relation = addObjectPropertyDiv.children[0].value;
		var subject = addObjectPropertyDiv.children[1].value;
		var object = addObjectPropertyDiv.children[2].value;
		
		// Weryfikacja parametrów
		if(!relation.match(/^[a-zA-Z0-9\u00C0-\u017F:]+$/))
		{
			alert("Relation can contain only alphanumeric characters and colons.");
			return;
		}
		
		if(!subject.match(/^[a-zA-Z0-9\u00C0-\u017F:]+$/))
		{
			alert("Subject ID can contain only alphanumeric characters and colons.");
			return;
		}
		
		if(!object.match(/^[a-zA-Z0-9\u00C0-\u017F:]+$/))
		{
			alert("Object ID can contain only alphanumeric characters and spaces.");
			return;
		}
		
		// Sprawdzenie, czy subject i object istnieją
		if(!OntEdit.classExists(subject))
		{
			alert("Class with ID '" + subject + "' does not exist.");
			return;
		}
		
		if(!OntEdit.classExists(object))
		{
			alert("Class with ID '" + object + "' does not exist.");
			return;
		}
		
		var objectProperties = addObjectPropertyDiv.parentElement.children;
		
		// Jeżeli rekord już jest, nic nie rób
		for(var i = 0; i < objectProperties.length-1; i++)
		{
			if(objectProperties[i].children.length == 0)
				continue;
				
			if(objectProperties[i].children[0].textContent == relation &&
				objectProperties[i].children[1].textContent == subject &&
				objectProperties[i].children[2].textContent == object)
				return;
		}
		
		// Utworzenie rekordu
		var newDiv = document.createElement('div');
		newDiv.innerHTML =
		"<span style=\"display: inline-block; width: 250px;\">" + relation + "</span>" +
		"<span style=\"display: inline-block; width: 250px;\">" + subject + "</span>" +
		"<span style=\"display: inline-block; width: 250px;\">" + object + "</span>" +
		"<a href=\"javascript:void(0);\" onclick=\"javascript:OntEdit.deleteObjectProperty('"
			+ (addObjectPropertyDiv.parentElement.children.length-1) + "');\">delete</a>" +
		"<hr style=\"margin: 0;\"/>";
		
		// Dodanie rekordu
		addObjectPropertyDiv.parentElement
			.insertBefore(newDiv, addObjectPropertyDiv);
		
		// Wyczyszczenie formularza
		addObjectPropertyDiv.children[0].value = "";
		addObjectPropertyDiv.children[1].value = "";
		addObjectPropertyDiv.children[2].value = "";
		
		OntEdit.update();
	},
	
	deleteObjectProperty: function(index)
	{
		var objectProperties = document.getElementById("addObjectProperty").parentElement.children;
		objectProperties[index].innerHTML = "";
		objectProperties[index].style.display = "none";
		
		OntEdit.update();
		return;
	},
	
	/*
	 * WŁASNOŚCI PROSTE
	 */
	addDataProperty: function()
	{
		var addDataPropertyDiv = document.getElementById("addDataProperty");
		
		var relation = addDataPropertyDiv.children[0].value;
		var domain = addDataPropertyDiv.children[1].value;
		var range = addDataPropertyDiv.children[2].value;
		
		// Weryfikacja parametrów
		if(!relation.match(/^[a-zA-Z0-9\u00C0-\u017F:]+$/))
		{
			alert("Relation can contain only alphanumeric characters and colons.");
			return;
		}
		
		if(!domain.match(/^[a-zA-Z0-9\u00C0-\u017F:]+$/))
		{
			alert("Domain ID can contain only alphanumeric characters and colons.");
			return;
		}
		
		if(!domain.match(/^[a-zA-Z0-9\u00C0-\u017F:]+$/))
		{
			alert("Range ID can contain only alphanumeric characters and colons.");
			return;
		}
		
		// Sprawdzenie, czy domain i range istnieją
		if(!OntEdit.classExists(domain))
		{
			alert("Class with ID '" + domain + "' does not exist.");
			return;
		}
		
		var dataProperties = addDataPropertyDiv.parentElement.children;
		
		// Jeżeli rekord już jest, nic nie rób
		for(var i = 0; i < dataProperties.length-1; i++)
		{
			if(dataProperties[i].children.length == 0)
				continue;
				
			if(dataProperties[i].children[0].textContent == relation &&
				dataProperties[i].children[1].textContent == domain &&
				dataProperties[i].children[2].textContent == range)
				return;
		}
		
		// Utworzenie rekordu
		var newDiv = document.createElement('div');
		newDiv.innerHTML =
		"<span style=\"display: inline-block; width: 250px;\">" + relation + "</span>" +
		"<span style=\"display: inline-block; width: 250px;\">" + domain + "</span>" +
		"<span style=\"display: inline-block; width: 250px;\">" + range + "</span>" +
		"<a href=\"javascript:void(0);\" onclick=\"javascript:OntEdit.deleteDataProperty('"
			+ (addDataPropertyDiv.parentElement.children.length-1) + "');\">delete</a>" +
		"<hr style=\"margin: 0;\"/>";
		
		// Dodanie rekordu
		addDataPropertyDiv.parentElement
			.insertBefore(newDiv, addDataPropertyDiv);
		
		// Wyczyszczenie formularza
		addDataPropertyDiv.children[0].value = "";
		addDataPropertyDiv.children[1].value = "";
		addDataPropertyDiv.children[2].value = "";
		
		OntEdit.update();
	},
	
	deleteDataProperty: function(index)
	{
		var dataProperties = document.getElementById("addDataProperty").parentElement.children;
		dataProperties[index].innerHTML = "";
		dataProperties[index].style.display = "none";
		
		OntEdit.update();
	},
	
	/*
	 * RELACJE WŁASNOŚCI
	 */
	addPropertyRelation: function()
	{
		var addPropertyRelationDiv = document.getElementById("addPropertyRelation");
		
		var relation = addPropertyRelationDiv.children[0].value;
		var subject = addPropertyRelationDiv.children[1].value;
		var object = addPropertyRelationDiv.children[2].value;
		
		// Weryfikacja parametrów
		if(!relation.match(/^[a-zA-Z0-9\u00C0-\u017F:]+$/))
		{
			alert("Relation can contain only alphanumeric characters and colons.");
			return;
		}
		
		if(!subject.match(/^[a-zA-Z0-9\u00C0-\u017F:]+$/))
		{
			alert("Subject ID can contain only alphanumeric characters and colons.");
			return;
		}
		
		if(!object.match(/^[a-zA-Z0-9\u00C0-\u017F:]+$/))
		{
			alert("Object ID can contain only alphanumeric characters and spaces.");
			return;
		}
		
		// Sprawdzenie, czy własności istnieją
		if(!OntEdit.propertyExists(subject))
		{
			alert("Property with ID '" + subject + "' does not exist.");
			return;
		}
		
		if(!OntEdit.propertyExists(object))
		{
			alert("Property with ID '" + object + "' does not exist.");
			return;
		}
		
		var propertyRelations = addPropertyRelationDiv.parentElement.children;
		
		// Jeżeli rekord już jest, nic nie rób
		for(var i = 0; i < propertyRelations.length-1; i++)
		{
			if(propertyRelations[i].children.length == 0)
				continue;
			
			if(propertyRelations[i].children[0].textContent == relation &&
				propertyRelations[i].children[1].textContent == subject &&
				propertyRelations[i].children[2].textContent == object)
				return;
		}
		
		// Utworzenie rekordu
		var newDiv = document.createElement('div');
		newDiv.innerHTML =
		"<span style=\"display: inline-block; width: 250px;\">" + relation + "</span>" +
		"<span style=\"display: inline-block; width: 250px;\">" + subject + "</span>" +
		"<span style=\"display: inline-block; width: 250px;\">" + object + "</span>" +
		"<a href=\"javascript:void(0);\" onclick=\"javascript:OntEdit.deletePropertyRelation('"
			+ (addPropertyRelationDiv.parentElement.children.length-1) + "');\">delete</a>" +
		"<hr style=\"margin: 0;\"/>";
		
		// Dodanie rekordu
		addPropertyRelationDiv.parentElement
			.insertBefore(newDiv, addPropertyRelationDiv);
		
		// Wyczyszczenie formularza
		addPropertyRelationDiv.children[0].value = "";
		addPropertyRelationDiv.children[1].value = "";
		addPropertyRelationDiv.children[2].value = "";
		
		OntEdit.update();
	},
	
	deletePropertyRelation: function(index)
	{
		var propertyRelations = document.getElementById("addPropertyRelation").parentElement.children;
		propertyRelations[index].innerHTML = "";
		propertyRelations[index].style.display = "none";
		
		OntEdit.update();
	}
}
