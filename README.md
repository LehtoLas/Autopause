# 🚐 AutoPause

AutoPause on mobiilisovellus ajoneuvojen liikennekäytön hallintaan. Sovelluksen avulla käyttäjä voi kirjautua sisään Suomi.fi-tunnistautumisen kautta ja hallinnoida rekisteröityjä ajoneuvoja suoraan puhelimestaan.

---

## 📋 Ominaisuudet

- **Suomi.fi-tunnistautuminen** — kirjautuminen pankkitunnuksilla (simuloitu)
- **Ajoneuvon hallinta** — poista ajoneuvo liikennekäytöstä tai ota se takaisin käyttöön
- **Usean ajoneuvon tuki** — vaihda ajoneuvojen välillä välilehtien avulla
- **Tapahtumahistoria** — kaikki toimenpiteet kirjataan lokiin aikaleimoineen
- **Vaalea/tumma teema** — vaihda teemaa sovelluksesta käsin
- **Tietojen tallennus** — ajoneuvotiedot ja historia tallennetaan laitteelle
- **Virheenhallinta** — sovellus ei kaadu kriittisten virheiden sattuessa

---

## 🗂️ Projektin rakenne

```
autopause/
  App.js                        ← Sovelluksen juuritiedosto
  theme.js                      ← Tumman ja vaalean teeman värimäärittelyt
  constants.js                  ← Testidata, pankit ja ajoneuvotyypit
  utils.js                      ← Apufunktiot (esim. aikaleima)
  components/
    ErrorBoundary.js            ← Virheenhallintakomponentti
    ModalShells.js              ← Yleiset modaali-komponentit
    EditModal.js                ← Ajoneuvon lisäys- ja muokkausmodaali
  screens/
    SuomiFiScreen.js            ← Tunnistautuminen, pankkivalinta
    BankLoginScreen.js          ← Pankin kirjautumislomake
    LoadingScreen.js            ← Latausnäkymä
    AppScreen.js                ← Päänakyma, ajoneuvokortit ja historia
```

---

## 🚀 Asennus ja käynnistys

### Vaatimukset

- [Node.js](https://nodejs.org/) (versio 18 tai uudempi)
- [Expo Go](https://expo.dev/client) -sovellus Android-puhelimella
- npm tai yarn

### Asennus

```bash
# Kloonaa projekti
git clone https://github.com/kayttajatunnus/autopause.git
cd autopause

# Asenna riippuvuudet
npm install

# Asenna AsyncStorage
npx expo install @react-native-async-storage/async-storage
```

### Käynnistys

```bash
npx expo start --tunnel
```

Skannaa QR-koodi Expo Go -sovelluksella. Sovellus avautuu puhelimella.

---

## 🔐 Kirjautuminen (demo)

Sovellus käyttää simuloitua Suomi.fi-tunnistautumista. Valitse mikä tahansa pankki ja kirjaudu demotunnuksilla:

| Käyttäjätunnus | Salasana | Käyttäjä |
|---|---|---|
| `123456` | mikä tahansa | Matti Meikäläinen (2 ajoneuvoa) |
| `654321` | mikä tahansa | Liisa Virtanen (1 ajoneuvo) |

---

## 🛠️ Tekninen toteutus

| Teknologia | Käyttötarkoitus |
|---|---|
| React Native | Mobiilisovelluskehys |
| Expo | Kehitysympäristö ja buildaus |
| React Context | Teemanhallinta koko sovelluksessa |
| AsyncStorage | Tietojen tallennus laitteelle |
| Suomi.fi (simuloitu) | Käyttäjän tunnistautuminen |
| Traficom API (simuloitu) | Ajoneuvorekisterin päivitys |

---

## 📱 Näkymät

### Suomi.fi-tunnistautuminen
Käyttäjä valitsee pankin ja kirjautuu sisään. Tunnistautumisen jälkeen sovellus hakee käyttäjän ajoneuvot Traficomin rekisteristä.

### Päänakyma
- Ajoneuvon rekisterinumero, merkki, malli, vuosi ja väri
- Liikennekäyttöstatus reaaliajassa
- Välilehdet usean ajoneuvon välillä vaihtamiseen
- Tapahtumahistoria kiinteänä alhaalla

### Ajoneuvon hallinta
- **Poista liikennekäytöstä** — vahvistusdialogi → API-kutsu (simuloitu) → valmis
- **Ota liikennekäyttöön** — sama flow
- Kaikki toimenpiteet kirjautuvat historiaan

---

## 📄 Lisenssi

Tämä projekti on kehitetty demotarkoituksiin. Kaikki oikeudet pidätetään.

---