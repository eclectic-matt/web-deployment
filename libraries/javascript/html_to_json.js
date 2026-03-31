/**
 * Concept - represent a HTML document in JSON and vice-versa.
 * SEE: https://html.spec.whatwg.org/#the-root-element
 */

class JSONHTML 
{
	constructor() 
	{
		this.resetProperties();
	}

	resetProperties()
	{
		//Reset the properties
		this.documentObject = {
			meta: {},
			head: {
				elements: []
			},
			body: {
				elements: []
			}
		};
		this.json = "";
	}

	//OUTPUTS
	getJson()
	{
		return JSON.stringify(this.documentObject);
	}

	getHTML()
	{
		return this.convertToHtml(this.documentObject);
	}

	//CONVERT
	convertToHtml(obj)
	{
		//INIT DOCUMENT STRING
		let doc = "<!DOCTYPE html>";
		//DO WE HAVE METADATA? 
		if(obj.meta != {})
		{
			//ONLY html lang SUPPORTED AT PRESENT
			if(obj.meta.lang != "")
			{
				doc += "<html lang=\"" + obj.meta.lang + "\">";
			}
		}
		else
		{
			doc += "<html>";
		}
		// - HEAD
		doc += "<head>";
		if(obj.head.elements != [])
		{
			for(let prop in obj.head)
			{
				doc += "<" + prop.tag + " ";
				for(let attr in prop.attrs)
				{
					doc += attr.name + "=\"" + attr.value + "\" "
				}
				doc += ">";
			}
		}
		doc += "</head>";
		
		// - BODY
		//Init body
		doc += "<body ";
		//Do we have meta for the body (onload etc)
		if(obj.body.meta.length > 0)
		{
			
			for(let prop in obj.body.meta)
			{
				doc += prop.name + "=\"" + prop.value + "\" ";
			}
		}
		//Close body opening tag
		doc += ">";
		for(let element in obj.body.elements)
		{
			//Open this element (e.g. "<h1")
			doc += "<" + element.tag;
			for(let attr in element.attrs)
			{
				doc += attr.name + "=\"" + attr.value + " ";
			}
			doc += ">";
			doc += element.innerHTML;
			doc += "</" + element.tag + ">";
		}
		//Close body
		doc += "</body>";
		//Close HTML
		doc += "</html>";

		return doc;
	}

	//CREATE
	createDocument()
	{
		this.resetProperties();
		return this.getJson();
	}

	//HEAD OPERATIONS

}

var exampleJson = {
	meta: {
		lang: "en"
	},
	head: {
		elements: [
			{
				tag: "link",
				attrs: [
					{
						name: "href",
						value: "https://example.com/style/default.css"
					}
				]
			}
		]
	},
	body: {
		meta: [
			{

			}
		],
		elements: [
			{
				tag: "h1",
				attrs: [
					{
						name: "id",
						value: "mainHeader"
					}
				],
				innerHTML: "Header"
			}
		]
	}
}

let converter = new JSONHTML();
let doc = converter.convertToHtml(exampleJson);
console.log(doc);
/*
<!DOCTYPE html>
<head lang=\"en\">
<head>
<undefined >
</head>
<body undefined=\"undefined\" >
<undefined>undefined</undefined>
</body>
</html>
*/