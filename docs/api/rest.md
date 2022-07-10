# API Reference

## Authentifizierung

```{warning}
Bisher besteht keine Authentifizierung.
```

## API Testen

Zum Testen der API wird [Postman](https://www.postman.com/) empfohlen.

### Test Endpunkt GET

Um zu testen ob der Server gestartet ist und auch erreichbar ist, gibt es den Test-Endpunkt.

```{http:get} /api/test/
Testen der API
```

```bash
localhost:8000/api/test
```

**Example response**:

Die Antwortet des Servers lautet wie folgt:

```javascript
{
    "req": "GET",
    "msg": "Hi from Django"
}
```

### Test Endpunkt POST

Genau so funktioniert der selbe Endpunkt auch für POST Requests

```{http:post} /api/test/
Testen der API
```

**Example response**:

Die Antwortet des Servers lautet wie folgt:

```javascript
{
    "req": "POST",
    "msg": "Hi from Django"
}
```

Alle anderen Methoden (abseits von GET und POST) sind vom Test-Endpunkt nicht unterstützt und führen, am Beispiel von DELETE,  zu folgender Response:

```{http:delete} /api/test/
Testen der API
```

**Example response**:

```javascript
{
    "detail": "Method \"DELETE\" not allowed."
}
```

## API Endpunkte (Resources)

### Szenario Liste

```{http:get} /api/scenario/
Abfragen einer Liste mit allen Szenarios (ID und Name) in der Datenbank. Als Szenario sind hier Template Szenarios gemeint, nicht einzelne Nutzer-Szenarios.
```

**Example request**:

```bash
localhost:8000/api/scenario
```

**Example response**:

```javascript
{
    "count": 2,
    "results": {
        '64abc': "Scenario Name",
        '64abd': "Ein zweites Szenario",
    }
}
```

| Response Parameter | |
|--------------------|-|
|*int* **count** | Anzahl der Szenarios|
|*object* **results**| json-Objekt mit einem Eintrag pro Szenario `'<id>':'<name>'`|

### Szenario Details

```{warning}
Dieser Endpunkt ist WIP und steht derzeit nicht bereit
```

```{http:get} /api/scenario/(str:id)/
Abfragen aller Informationen eines spezifischen Szenarios
```

**Example request**:

```bash
curl https://readthedocs.org/api/v2/project/?slug=pip
```

**Example response**:

```javascript
{

}
```

| Response Parameter | |
|--------------------|-|
|*int* **count** | Anzahl der Szenarios|
|*object* **results**| json-Objekt mit einem Eintrag pro scenario `'<id>':'<name>'`|
