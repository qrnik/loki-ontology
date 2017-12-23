function exportOntology(){
    var xsltProcessor = new XSLTProcessor();
    var xslt = jQuery.parseXml(JSINFO['xslt']);
    xsltProcessor.importStylesheet(xslt);
    var baseUri = document.URL.split("?")[0];
    xsltProcessor.setParameter(null, "baseUri", baseUri);
    var xml = jQuery.parseXml(JSINFO['xml']);
    var doc = xsltProcessor.transformToDocument(xml);
    var turtle = doc.getElementsByTagName("transformiix:result")[0].childNodes[0].nodeValue;
    document.open('data:application/octet-stream', + encodeURIComponent(turtle));
}

var button = jQuery(".button .button")[0];
button.attr("value", "Export to RDFS");
button.attr("type", "button");
button.attr("download", "ont.ttl");
button.click(exportOntology)
