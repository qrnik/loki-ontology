<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="ontology">
        <input type="hidden" id="ontologyHtml" value=""/>
        <div id="ontologyEditor">
            <div><b>Ontology name:</b>
                <xsl:text> </xsl:text>
                <xsl:variable name="ontologyName" select="name"/>
                <input type="text" id="name" value="{$ontologyName}"/>
            </div>

            <!-- Classes -->

            <h2 style="margin: 10px 0 0 0;">Classes</h2>
            <div style="font-weight: bold;">
                <span style="display: inline-block; width: 250px;">ID</span>
                <span style="display: inline-block; width: 250px;">Name</span>
            </div>
            <hr style="margin: 0;"/>
            <div>
                <xsl:for-each select="classes/class">
                    <xsl:sort select="self::node()/@id"/>
                    <xsl:variable name="classId" select="self::node()/@id"/>

                    <div>

                        <span style="display: inline-block; width: 250px;">
                            <xsl:value-of select="self::node()/@id"/>
                        </span>

                        <span style="display: inline-block; width: 250px;">
                        <xsl:value-of select="self::node()"/>
                        </span>

                        <a href="javascript:void(0);" onclick="javascript:OntEdit.deleteClass('{$classId}');">delete</a>
                        <hr style="margin: 0;"/>
                    </div>
                </xsl:for-each>
                <div id="addClass">
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="ID"/>
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="Name"/>
                    <button onclick="javascript:OntEdit.addClass(); return false;">Save</button>
                </div>
            </div>

            <!-- Class relations -->

            <h2 style="margin: 10px 0 0 0;">Class relations</h2>
            <div style="font-weight: bold;">
                <span style="display: inline-block; width: 250px;">Relation</span>
                <span style="display: inline-block; width: 250px;">Subject ID</span>
                <span style="display: inline-block; width: 250px;">Object ID</span>
            </div>
            <hr style="margin: 0;"/>
            <div>
                <xsl:for-each select="classRelations/relation">
                    <xsl:sort select="self::node()/@type"/>
                    <xsl:sort select="self::node()/@subject"/>
                    <xsl:variable name="index" select="position()-1"/>
                    <div>
                        <span style="display: inline-block; width: 250px;">
                            <xsl:value-of select="self::node()/@type"/>
                        </span>
                        <span style="display: inline-block; width: 250px;">
                            <xsl:value-of select="self::node()/@subject"/>
                        </span>
                        <span style="display: inline-block; width: 250px;">
                            <xsl:value-of select="self::node()/@object"/>
                        </span>

                        <a href="javascript:void(0);" onclick="javascript:OntEdit.deleteClassRelation({$index});">delete</a>
                        <hr style="margin: 0;"/>
                    </div>
                </xsl:for-each>
                <div id="addClassRelation">
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="Relation"/>
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="Subject ID"/>
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="Object ID"/>
                    <button onclick="javascript:OntEdit.addClassRelation(); return false;">Save</button>
                </div>
            </div>

            <!-- Object properties -->

            <h2 style="margin: 10px 0 0 0;">Object properties</h2>
            <div style="font-weight: bold;">
                <span style="display: inline-block; width: 250px;">Property ID</span>
                <span style="display: inline-block; width: 250px;">Subject ID</span>
                <span style="display: inline-block; width: 250px;">Object ID</span>
            </div>
            <hr style="margin: 0;"/>
            <div>
                <xsl:for-each select="objectProperties/property">
                    <xsl:sort select="self::node()/@id"/>
                    <xsl:sort select="self::node()/@subject"/>
                    <xsl:variable name="index" select="position()-1"/>
                    <div>
                        <span style="display: inline-block; width: 250px;">
                            <xsl:value-of select="self::node()/@id"/>
                        </span>
                        <span style="display: inline-block; width: 250px;">
                            <xsl:value-of select="self::node()/@subject"/>
                        </span>
                        <span style="display: inline-block; width: 250px;">
                            <xsl:value-of select="self::node()/@object"/>
                        </span>

                        <a href="javascript:void(0);" onclick="javascript:OntEdit.deleteObjectProperty({$index});">delete</a>
                        <hr style="margin: 0;"/>
                    </div>
                </xsl:for-each>
                <div id="addObjectProperty">
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="Property ID"/>
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="Subject ID"/>
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="Object ID"/>
                    <button onclick="javascript:OntEdit.addObjectProperty(); return false;">Save</button>
                </div>
            </div>

            <!-- Data properties -->

            <h2 style="margin: 10px 0 0 0;">Data properties</h2>
            <div style="font-weight: bold;">
                <span style="display: inline-block; width: 250px;">Property ID</span>
                <span style="display: inline-block; width: 250px;">Domain</span>
                <span style="display: inline-block; width: 250px;">Range</span>
            </div>
            <hr style="margin: 0;"/>
            <div>
                <xsl:for-each select="dataProperties/property">
                    <xsl:sort select="self::node()/@id"/>
                    <xsl:sort select="self::node()/@domain"/>
                    <xsl:variable name="index" select="position()-1"/>
                    <div>
                        <span style="display: inline-block; width: 250px;">
                            <xsl:value-of select="self::node()/@id"/>
                        </span>
                        <span style="display: inline-block; width: 250px;">
                            <xsl:value-of select="self::node()/@domain"/>
                        </span>
                        <span style="display: inline-block; width: 250px;">
                            <xsl:value-of select="self::node()/@range"/>
                        </span>

                        <a href="javascript:void(0);" onclick="javascript:OntEdit.deleteDataProperty({$index});">delete</a>
                        <hr style="margin: 0;"/>
                    </div>
                </xsl:for-each>
                <div id="addDataProperty">
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="Property ID"/>
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="Domain"/>
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="Range"/>
                    <button onclick="javascript:OntEdit.addDataProperty(); return false;">Save</button>
                </div>
            </div>

            <!-- Property relations -->

            <h2 style="margin: 10px 0 0 0;">Property relations</h2>
            <div style="font-weight: bold;">
                <span style="display: inline-block; width: 250px;">Property ID</span>
                <span style="display: inline-block; width: 250px;">Subject ID</span>
                <span style="display: inline-block; width: 250px;">Object ID</span>
            </div>
            <hr style="margin: 0;"/>
            <div>
                <xsl:for-each select="propertyRelations/relation">
                    <xsl:sort select="self::node()/@type"/>
                    <xsl:sort select="self::node()/@subject"/>
                    <xsl:variable name="index" select="position()-1"/>
                    <div>
                        <span style="display: inline-block; width: 250px;">
                            <xsl:value-of select="self::node()/@type"/>
                        </span>
                        <span style="display: inline-block; width: 250px;">
                            <xsl:value-of select="self::node()/@subject"/>
                        </span>
                        <span style="display: inline-block; width: 250px;">
                            <xsl:value-of select="self::node()/@object"/>
                        </span>

                        <a href="javascript:void(0);" onclick="javascript:OntEdit.deletePropertyRelation({$index});">delete</a>
                        <hr style="margin: 0;"/>
                    </div>
                </xsl:for-each>
                <div id="addPropertyRelation">
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="Property ID"/>
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="Subject ID"/>
                    <input type="text" style="width: 250px; box-sizing: border-box;" placeholder="Object ID"/>
                    <button onclick="javascript:OntEdit.addPropertyRelation(); return false;">Save</button>
                </div>
            </div>
            <hr style="background: none; border: none;"/>
        </div>

        <script type='text/javascript'>
            OntEdit.update();
        </script>
    </xsl:template>
</xsl:stylesheet>
