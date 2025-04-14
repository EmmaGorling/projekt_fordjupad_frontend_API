# Book Review API

## Projektbeskrivning
Detta projekt är en webbapplikation där användare kan hantera sina bokrecensioner. 
Användare kan skapa konton, logga in, lägga till recensioner, gilla ogilla recensioner, 
och läsa recensioner för böcker. 

### User Model
| Fält	| Typ |	Beskrivning |
|------|-----|------|
| email |	String |	E-postadress, unik för varje användare |
| password |	String |	Lösenord (krypterat med bcrypt) |
| firstName |	String |	Förnamn på användaren |
| lastName |	String	| Efternamn på användaren |

### Review Model
| Fält |	Typ |	Beskrivning |
|------|------|---------|
| user |	ObjectId	| Referens till användaren som skapade recensionen |
| bookId |	String |	ID för boken som recenseras |
| bookTitle |	String |	Titel på boken |
| reviewText |	String |	Själva texten för recensionen |
| rating |	Number |	Betyg (1 till 5) |
| likes |	Array	| Lista på användare som gillar recensionen |
| dislikes |	Array	| Lista på användare som ogillar recensionen |
| createdAt |	Date	| Datum då recensionen skapades |
| updatedAt |	Date |	Datum då recensionen senast uppdaterades |

### Routes for Reviews
| HTTP-metod |	Route |	Beskrivning |
|---------|---------|------|
| POST |	/reviews |	Skapa en ny recension |
| GET |	/reviews/{id} |	Hämta en recension med angivet ID |
| PUT |	/reviews/{id} |	Uppdatera en recension med angivet ID |
| DELETE |	/reviews/{id}	| Ta bort en recension med angivet ID |
| GET |	/reviews/book/{bookId} |	Hämta recensioner för en specifik bok |
| GET |	/reviews/top |	Hämta de bästa recensionerna (betyg 5) |
| GET |	/users/{id}/reviews |	Hämta recensioner för en specifik användare |
| POST |	/reviews/{reviewId}/like |	Gilla en recension med angivet ID |
| POST |	/reviews/{reviewId}/dislike	| Ogilla en recension med angivet ID |

### Routes for Users
| HTTP-metod |	Route |	Beskrivning |
|----------|----------|-----------|
| GET	| /users	| Hämta alla användare |
| GET	| /users/{id}	| Hämta en användare baserat på ID |
| POST |	/users	| Skapa en ny användare |
| PUT	| /users/{id}	| Uppdatera en användare med angivet ID |
| DELETE	| /users/{id}	| Ta bort en användare med angivet ID |
| POST	| /users/login	| Logga in en användare |
| GET	| /users/logout	| Logga ut en användare |
| GET	| /users/validate	| Verifiera användartoken |
 
