<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="text" encoding="UTF-8"/>
    <xsl:param name="baseUri" />
    <xsl:template match="ontology">
        <xsl:value-of select="concat('@base &lt;', $baseUri, '/', id, '/', '&gt; .&#xa;')"/>
        <xsl:text disable-output-escaping="yes">
@prefix rdf: &lt;http://www.w3.org/1999/02/22-rdf-syntax-ns#&gt; .
@prefix rdfs: &lt;http://www.w3.org/2000/01/rdf-schema#&gt; .
@prefix xslt: &lt;http://www.w3.org/1999/XSL/Transform#&gt; .&#xa;
</xsl:text>
        <xsl:text>#Classes&#xa;</xsl:text>
        <xsl:for-each select="classes/class">
            <xsl:value-of select="concat('&lt;', @id, '&gt; rdf:type rdfs:Class .&#xa;')"/>
        </xsl:for-each>

        <xsl:text>&#xa;#Class relations&#xa;</xsl:text>
        <xsl:for-each select="classRelations/relation">
            <xsl:value-of select="concat('&lt;', @subject, '&gt; ', @type, ' &lt;', @object, '&gt; .&#xa;')"/>
        </xsl:for-each>

        <xsl:text>&#xa;#Object properties&#xa;</xsl:text>
        <xsl:for-each select="objectProperties/property">
            <xsl:value-of select="concat('&lt;', @id, '&gt; rdf:type rdf:Property ;&#xa;')"/>
            <xsl:value-of select="concat('  rdfs:domain &lt;', @subject, '&gt; ;&#xa;')"/>
            <xsl:value-of select="concat('  rdfs:range &lt;', @object, '&gt; .&#xa;')"/>
        </xsl:for-each>

        <xsl:text>&#xa;#Data properties&#xa;</xsl:text>
        <xsl:for-each select="dataProperties/property">
            <xsl:value-of select="concat('&lt;', @id, '&gt; rdf:type rdf:Property ;&#xa;')"/>
            <xsl:value-of select="concat('  rdfs:domain &lt;', @domain, '&gt; ;&#xa;')"/>
            <xsl:value-of select="concat('  rdfs:range ', @range, ' .&#xa;')"/>
        </xsl:for-each>

        <xsl:text>&#xa;#Property relations&#xa;</xsl:text>
        <xsl:for-each select="propertyRelations/relation">
            <xsl:value-of select="concat('&lt;', @subject, '&gt; ', @type, ' &lt;', @object, '&gt; .&#xa;')"/>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>