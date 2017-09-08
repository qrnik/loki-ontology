<?php

if(!defined('DOKU_INC')) die();

class action_plugin_lokiontology extends DokuWiki_Action_Plugin
{
    const EMPTY_ONTOLOGY = "<?xml version=\"1.0\"?><ontology><name></name><classes></classes>" .
                "<classRelations></classRelations><objectProperties></objectProperties>" .
                "<dataProperties></dataProperties><propertyRelations></propertyRelations>" .
                "</ontology>";

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

        if(preg_match("/^<ontology>.*<\/ontology>$/", str_replace("\n", " ", $event->data)) != 1)
            return false;

        $xslt = file_get_contents("lib/plugins/lokiontology/ontology.xslt");
        $event->data = preg_replace("/<ontology>.*<\/ontology>/",
            "&&XML&&\n\n{$event->data}\n\n&&XSLT&&\n\n$xslt\n\n&&END&&",
            str_replace("\n", " ", $event->data));
    }

    function onEdit(Doku_Event $event, $param)
    {
        // Nie modyfikuj formularza, jeżeli nie edytujemy ontologii
        $specOntPos = strpos($event->data->_hidden["id"], "special:ontology:");

        if($specOntPos === 0)
            $this->swapEditor($event, $param);

        else if($specOntPos === false)
            $this->insertAutocomplete($event, $param);

        return true;
    }

    function swapEditor(Doku_Event $event, $param)
    {
        if(trim($event->data->_content[0]["_text"]) == "")
            $event->data->_content[0]["_text"] = self::EMPTY_ONTOLOGY;

        $xml = new DomDocument();
        $xml->loadXML($event->data->_content[0]["_text"]);

        $xslt = new DomDocument();
        $xslt->load("lib/plugins/lokiontology/ontology_edit.xslt");

        $js = file_get_contents("lib/plugins/lokiontology/ontology_edit.js");

        // Usunięcie pola tekstowego do edycji ontologii
        unset($event->data->_content[0]);

        // Usunięcie przycisku podglądu
        unset($event->data->_content[6]);

        // Określ pozycję
        $pos = $event->data->findElementByAttribute('id', 'wiki__editbar');

        // Kod nowego formularza
        $proc = new XSLTProcessor();
        $proc->importStylesheet($xslt);
        $html = "<script type='text/javascript'>\n$js\n</script>";
        $html .= $proc->transformToXML($xml);

        // Wpisanie formularza
        $event->data->insertElement($pos, $html);
    }

    function insertAutocomplete(Doku_Event $event, $param)
    {

    }
}

?>
