"use strict";
jQuery(document).ready(function () {
    function ontologyAsTurtle(){
        var xsltProcessor = new XSLTProcessor();
        var xslt = jQuery.parseXML(JSINFO['xslt']);
        xsltProcessor.importStylesheet(xslt);
        var baseUri = document.URL.split("?")[0];
        xsltProcessor.setParameter("", "baseUri", baseUri);
        var xml = jQuery.parseXML(JSINFO['xml']);
        var doc = xsltProcessor.transformToDocument(xml);
        return doc.getElementsByTagName("transformiix:result")[0].childNodes[0].nodeValue;
    }

    function download() {
        var turtle = ontologyAsTurtle();
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/turtle;charset=utf-8,' + encodeURIComponent(turtle));
        element.setAttribute('download', "ontology.ttl");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return false;
    }
    
    var isOntologyPage = JSINFO['id'].startsWith("special:ontology");
    if (isOntologyPage) {
        var form = jQuery("form.button");
        form.submit(download);
        var button = jQuery(".button .button");
        button.attr("value", "Export to RDFS");
    }
});