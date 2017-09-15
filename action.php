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
    const AUTOCOMPLETE_JS_PATH = "lib/plugins/lokiontology/autocomplete/dist/bundle.js";
    const ONTOLOGY_FOLDER_PATH = "data/pages/special/ontology/";
    const ONTO_JSON_PATH = "data/pages/special/ontology/onto.json";

    function register(Doku_Event_Handler $controller)
    {
        //$controller->register_hook('IO_WIKIPAGE_WRITE', 'BEFORE', $this, "onSave");
        $controller->register_hook('PARSER_WIKITEXT_PREPROCESS', 'BEFORE', $this, "transformIfOntology");
        $controller->register_hook('HTML_EDITFORM_OUTPUT', 'BEFORE', $this, "onEdit");
    }

    function transformIfOntology(Doku_Event $event, $param)
    {
        if(trim($event->data) == "")
            $event->data = self::EMPTY_ONTOLOGY;

        $flatData = str_replace("\n", " ", $event->data);
        $isNotOntology = preg_match("/^<ontology>.*<\/ontology>$/", $flatData) != 1;
        if($isNotOntology)
            return false;

        $event->data = $this->transformWithXSLT($event->data);

        $this->createOntoJson();
    }

    private function createOntoJson()
    {
        $ontology_file_iterator = new FilesystemIterator("./data/pages/special/ontology/");
        $result = array();
        foreach ($ontology_file_iterator as $ontology_file) {
            if ($ontology_file->getExtension() != 'txt') continue;
            $xml = simplexml_load_file($ontology_file->getPathname());
            $ontology_id = pathinfo($ontology_file->getFilename(), PATHINFO_FILENAME);
            array_push($result, $this->encodeOntology($xml, $ontology_id));
        }
        $onto_json = json_encode($result);
        $onto_json_fp = fopen("data/pages/special/ontology/onto.json", 'w');
        fwrite($onto_json_fp, $onto_json);
        fclose($onto_json_fp);
    }

    private function encodeOntology($xml, $id)
    {
        $result = array();
        $result['id'] = $id;
        foreach ($xml->children() as $xml_sequence_element) {
            if ($xml_sequence_element->getName() == "name") {
                $result['name'] = (string) $xml_sequence_element;
                continue;
            }
            $ontology_group = $this->encodeOntologyGroup($xml_sequence_element);
            $result[(string)$xml_sequence_element->getName()] = $ontology_group;
        }
        return $result;
    }

    private function encodeOntologyGroup($xml_sequence_element)
    {
        $ontology_group = array();
        foreach ($xml_sequence_element->children() as $xml_element) {
            $ontology_element = $this->encodeOntologyElement($xml_element);
            array_push($ontology_group, $ontology_element);
        }
        return $ontology_group;
    }

    private function encodeOntologyElement($xml_element)
    {
        $ontology_element = array();
        if ($xml_element->getName() == "class") {
            $name = (string) $xml_element;
            $ontology_element['name'] = $name;
        }
        foreach ($xml_element->attributes() as $key => $value ) {
            $ontology_element[$key] = (string) $value;
        }
        return $ontology_element;
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
        $html = $this->toScriptTag($js) . $XSLTProcessor->transformToXML($xml);

        $wikiEditbar = $event->data->findElementByAttribute('id', 'wiki__editbar');
        $event->data->insertElement($wikiEditbar, $html);
    }

    private function insertAutocomplete(Doku_Event $event, $param)
    {
        $js = file_get_contents(self::AUTOCOMPLETE_JS_PATH);
        $event->data->addElement($this->toScriptTag($js));
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

    private function toScriptTag($script) {
        return "<script type='text/javascript'>\n$script\n</script>";
    }
}

?>
