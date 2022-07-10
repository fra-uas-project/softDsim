# Dokumentation schreiben 

Wir hosten unsere Dokumentation auf [Read The Docs](https://softdsim.readthedocs.io/). Alle Dokumente welche die Dokumentation benötigt finden sich im Verzeichnis `docs/`.

## Ein Beispiel

Ich möchte nun eine neue Doku-Seite darüber erstellen wie man Dokumentation schreibt (diese Seite hier). Dazu erstelle ich das Verzeichnis `docs/documentation` und darin eine neue Datei `how_to.md`. Das ist eine Markdown-Datei, ein sehr einfaches Format um Text zu schreiben, mehr dazu weiter unten. Du kannst dir die Datei `docs/documentation/how_to.md` ansehen um zu verstehen wie man Markdown schreibt.

### Im Inhaltsverzeichnis Hinzufügen

Als nächstes muss ich in `docs/index.rst` meine Datei im Inhaltsverzeichnis listen. Dies sieht so aus:

```rst
.. toctree::
   API/endpoints.md
   API/endpoints/test_endpoint.md
   API/reference.md
   documentation/how_to.md
```

### Deploy

Wenn ich fertig bin pushe ich meinen Code auf GitHub. Kurz nach dem der Code auf dem `develop`-Branch landet, wird die neue Doku auf Read The Docs erscheinen.

### Lokales Build

Es ist möglich, aber nicht notwendig, lokal aus den `.md` Dateien die statischen Read The Docs Dateien zu erzeugen. Dazu muss sphinx mit `pip install sphinx` installiert sein sowie alle Abhängigkeiten in `docs/requirements.txt`. Dann kann über den Befehl `make html` ein Build erstellt werden.
Im Verzeichnis `_build` finden sich dann alle statischen Dateien und können in einem Browser angesehen werden.

## Was kann Markdown

[Hier ist die Basic Syntax](https://www.markdownguide.org/basic-syntax/)

Die wichtigsten Basics für uns:

Einen **Titel erstellen:

```markdown
# Dokumentation schreiben 
```

***

```markdown
## Heading 2
Text
### Heading 3 
Und so weiter
```

## Heading 2

Text

### Heading 3

Und so weiter

***

```Das ist **fetter** und das *kursiver* Text. Das ist ein `code ` Wort```
Das ist **fetter** und das *kursiver* Text. Das ist ein `code` Wort

***

### URL

```markdown
[MySt](https://myst-parser.readthedocs.io/en/latest/syntax/syntax.html) bietet und noch mehr nützliches. 
```

[MySt](https://myst-parser.readthedocs.io/en/latest/syntax/syntax.html) bietet und noch mehr nützliches.

```{note}
Zum Beispiel eine *Infobox*
```

```{warning}
Oder ein Warning
```

### Klasse automatisch referenzieren

```{eval-rst}
.. autoclass:: app.src.scenario.Scenario
    :members: json, add, tasks_total
```
