# Rehacktor

Base React/Vite per il progetto finale "Rehacktor".

## Cosa c'e

- homepage con card giochi
- filtro per genere in sidebar
- ricerca tramite rotta parametrica
- pagina dettaglio dedicata
- integrazione RAWG se `VITE_RAWG_API_KEY` e disponibile
- fallback locale per lavorare anche senza chiave API

## Avvio

```bash
npm install
npm run dev
```

## Chiave RAWG

1. copia `.env.example` in `.env`
2. inserisci la tua chiave in `VITE_RAWG_API_KEY`

Se la chiave manca, l'app parte comunque con un catalogo demo locale.

## Note

- i dati live usano gli endpoint RAWG documentati su https://rawg.io/apidocs
- il footer contiene il backlink verso RAWG richiesto dai loro termini
