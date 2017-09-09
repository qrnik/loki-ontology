<?php

if(!defined('DOKU_INC')) die();

class action_plugin_lokiontology extends DokuWiki_Action_Plugin
{
    const EMPTY_ONTOLOGY = "<?xml version=\"1.0\"?><ontology><name></name><classes></classes>" .
                "<classRelations></classRelations><objectProperties></objectProperties>" .
                "<dataProperties></dataProperties><propertyRelations></propertyRelations>" .
                "</ontology>";
    const ONTOLOGY_XSLT_PATH = "lib/plugins/lokiontology/ontology.xslt";
    const ONTOLOGY_EDIT_XSLT_PATH = "lib/plugins/lokiontology/ontology_edit.xslt";
    const ONTOLOGY_JS_PATH = "lib/plugins/lokiontology/ontology_edit.js";

    function register(Doku_Event_Handler $controller)
    {
        //$controller->register_hook('IO_WIKIPAGE_WRITE', 'BEFORE', $this, "onSave");
        $controller->register_hook('PARSER_WIKITEXT_PREPROCESS', 'BEFORE', $this, "wrap");
        $controller->register_hook('HTML_EDITFORM_OUTPUT', 'BEFORE', $this, "onEdit");
    }

    function wrap(Doku_Event $event, $param)
    {
        if(trim($event->data) == "")
            $event->data = self::EMPTY_ONTOLOGY;

        $flatData = str_replace("\n", " ", $event->data);
        $isNotOntology = preg_match("/^<ontology>.*<\/ontology>$/", $flatData) != 1;
        if($isNotOntology)
            return false;

        $event->data = $this->transformWithXSLT($event->data);
    }

    function onEdit(Doku_Event $event, $param)
    {
        $isOntologyPage = strpos($event->data->_hidden["id"], "special:ontology:") === 0;

        if($isOntologyPage)
            $this->swapToOntologyEditor($event, $param);

        else
            $this->insertAutocomplete($event, $param);
    }

    private function swapToOntologyEditor(Doku_Event $event, $param)
    {
        define('PAGE_EDIT_FIELD', 0);
        define('PREVIEW_BUTTON', 6);
        $formContent =& $event->data->_content;
        $pageEditField = $formContent[PAGE_EDIT_FIELD];
        if(trim($pageEditField["_text"]) == "")
            $pageEditField["_text"] = self::EMPTY_ONTOLOGY;

        unset($formContent[PAGE_EDIT_FIELD]);
        unset($formContent[PREVIEW_BUTTON]);

        $xslt = new DomDocument();
        $xslt->load(self::ONTOLOGY_EDIT_XSLT_PATH);
        $XSLTProcessor = new XSLTProcessor();
        $XSLTProcessor->importStylesheet($xslt);

        $xml = new DomDocument();
        $xml->loadXML($pageEditField["_text"]);
        $js = file_get_contents(self::ONTOLOGY_JS_PATH);
        $html = "<script type='text/javascript'>\n$js\n</script>" . $XSLTProcessor->transformToXML($xml);

        $wikiEditbar = $event->data->findElementByAttribute('id', 'wiki__editbar');
        $event->data->insertElement($wikiEditbar, $html);
    }

    private function insertAutocomplete(Doku_Event $event, $param)
    {

    }

    private function transformWithXSLT($input)
    {
        $xslt = file_get_contents(self::ONTOLOGY_XSLT_PATH);
        $flatInput = str_replace("\n", " ", $input);
        return preg_replace(
            "/<ontology>.*<\/ontology>/",
            "&&XML&&\n\n{$input}\n\n&&XSLT&&\n\n$xslt\n\n&&END&&",
            $flatInput
        );
    }
}

?>
