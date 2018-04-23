
# Modul-Information

Hier werden alle Module im `./module` Verzeichnis dokumentiert.  
Die Module werden ab dem zeitpunk in dem sie in der Entwicklung sind dokumentiert, damit von beginn an klar ist, ob es ein abhängiges oder ein unabhägiges Modul werden soll.  
Alle module werden in 2 Kategorien eingeteielt: 

Die Unabhängigen Module:  
Dazu zählen alle Module, die keine Abhägigkeiten zu Modulen oder Datein außerhalb des `./module` Verzeichnis haben. Das bedeuted, dass diese Module eingenständig oder nur mithilfe von weiteren Modulen aus dem `./module` Verzeichnis funktionieren können. Wenn ein Modul eine Abhängigkeit zu einem Modul inerhalt des `./module`  Verzeichnis hat, dass eine Abhängigkeit nach außen hat ist es NICHT mehr Unabhängig. Wenn aber npm Module eingebunden werden ist das vertretbar.

Die Abhängigen Module:  
Dazu zählen alle Module, die auch abhängigkeiten nach außerhalb haben. Zum Beispiel wenn die `helper.js` eingebunden wird ist es ein Abhängiges Modul. Auch bei dem einbinden von Datein aus dem `./static` Verzeichnis ist es eine Abhängiges Modul.

## Unabhängig

 - exNativ
 - exNativ/array
 - exNativ/date
 - exNativ/object
 - exNativ/string
 - logger
 - jsonSQL [BUILD]

## Abhängig

 - session
