<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="ontology">
        <h1><xsl:value-of select="name"/></h1>
        <xsl:variable name="namespace">
            <xsl:choose>
                <xsl:when test="id = 'default'">
                    <!--empty-->
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="concat(id, ':')"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <h2>Classes</h2>
        <ul>
            <xsl:for-each select="classes/class">
                <li>
                    <xsl:variable name="classId" select="self::node()/@id"/>
                    <a href='doku.php?id=special:category:{$namespace}{$classId}'>
                        <xsl:value-of select="self::node()"/>
                    </a>
                    <xsl:text> (ID: </xsl:text>
                    <xsl:value-of select="self::node()/@id"/>
                    <xsl:text>)</xsl:text>
                </li>
            </xsl:for-each>
        </ul>

        <h2>Class relations</h2>
        <ul>
            <xsl:for-each select="classRelations/relation">
                <li>
                    <xsl:variable name="subject" select="self::node()/@subject"/>
                    <xsl:variable name="object" select="self::node()/@object"/>

                    <a href='doku.php?id=special:category:{$namespace}{$subject}'>
                        <xsl:value-of select="/ontology/classes/class[@id=$subject]"/>
                    </a>

                    <xsl:text> -&gt; </xsl:text>
                    <xsl:value-of select="self::node()/@type"/>
                    <xsl:text> -&gt; </xsl:text>

                    <a href='doku.php?id=special:category:{$namespace}{$object}'>
                        <xsl:value-of select="/ontology/classes/class[@id=$object]"/>
                    </a>
                </li>
            </xsl:for-each>
        </ul>

        <h2>Object properties</h2>
        <ul>
            <xsl:for-each select="objectProperties/property">
                <li>
                    <xsl:variable name="subject" select="self::node()/@subject"/>
                    <xsl:variable name="object" select="self::node()/@object"/>

                    <xsl:value-of select="self::node()/@id"/>
                    <xsl:text>(</xsl:text>

                    <a href='doku.php?id=special:category:{$namespace}{$subject}'>
                        <xsl:value-of select="/ontology/classes/class[@id=$subject]"/>
                    </a>

                    <xsl:text>, </xsl:text>

                    <a href='doku.php?id=special:category:{$namespace}{$subject}'>
                        <xsl:value-of select="/ontology/classes/class[@id=$object]"/>
                    </a>

                    <xsl:text>)</xsl:text>
                </li>
            </xsl:for-each>
        </ul>

        <h2>Data properties</h2>
        <ul>
            <xsl:for-each select="dataProperties/property">
                <li>
                    <xsl:variable name="domain" select="self::node()/@domain" />

                    <xsl:value-of select="self::node()/@id"/>
                    <xsl:text>(</xsl:text>

                    <a href='doku.php?id=special:category:{$namespace}{$domain}'>
                        <xsl:value-of select="/ontology/classes/class[@id=$domain]"/>
                    </a>

                    <xsl:text>, </xsl:text>
                    <xsl:value-of select="self::node()/@range"/>
                    <xsl:text>)</xsl:text>
                </li>
            </xsl:for-each>
        </ul>

        <h2>Property relations</h2>
        <ul>
            <xsl:for-each select="propertyRelations/relation">
                <li>
                    <xsl:value-of select="self::node()/@subject"/>
                    <xsl:text> -&gt; </xsl:text>
                    <xsl:value-of select="self::node()/@type"/>
                    <xsl:text> -&gt; </xsl:text>
                    <xsl:value-of select="self::node()/@object"/>
                </li>
            </xsl:for-each>
        </ul>

    </xsl:template>
</xsl:stylesheet>
