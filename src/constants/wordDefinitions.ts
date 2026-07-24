/**
 * WORD DEFINITIONS — work in progress, NOT yet wired into the app.
 * ---------------------------------------------------------------------------
 * Idea: after a win/loss, show a short definition of the day's solution
 * (on-brand with the name "Bukvar" = a primer). The new word list added many
 * less-common words (turcizmi, rarer nouns), so a one-line gloss softens the
 * "I've never heard this word" moment and teaches.
 *
 * APPROACH (decided, not yet executed for the full list):
 *  - Bundle definitions STATICALLY (like wordlist.ts). Lookup is
 *    WORD_DEFINITIONS[solution.toLowerCase()] — no runtime network, works
 *    offline, consistent. Avoids CORS / rate limits / uptime issues that a
 *    runtime Wikipedia/Wiktionary/HJP fetch would bring.
 *  - Author short glosses with an LLM, then VERIFY the rare / uncertain ones
 *    (turcizmi, archaic) against Wiktionary (bs/hr/sr) + HJP (hjp.znanje.hr) /
 *    vokabular.org. Same find→verify flow used to build the word list.
 *  - Sources, by role:
 *      • pravopis.novalic.xyz — SPELLING only (orthography). Use as a
 *        "provjeri pravopis" link, NOT a meaning source.
 *      • HJP / vokabular — full dictionary entries → "vidi više" link.
 *      • Wikipedia — only notable nouns (animals, places, concepts); fallback.
 *
 * STYLE (to align with Ahmet before generating all ~1319):
 *  - One short sentence/phrase, Bosnian ijekavian, neutral dictionary tone.
 *  - `pos`: part of speech + gender for nouns (imenica, m./ž./s.).
 *  - `note`: optional flag — turcizam, arhaično, regionalizam, deminutiv…
 *  - Keep it game-sized (≈ 4–12 words); avoid spoilery synonyms when the word
 *    itself is obvious.
 *
 * WIRING (later, ~one small change):
 *  - import { WORD_DEFINITIONS } here, look up by `solution`, render a small
 *    block in the win/loss alert or StatsModal, with optional HJP/Pravopis link.
 *  - Keys are lowercase and use the SAME ligature spelling as WORDS (ǌ ǉ ǆ).
 *
 * STATUS: LIVE — imported in App.tsx and rendered by WordMeaning on win/loss.
 * Covers the 12 style samples + the daily solutions from Bukvar 914 onward, in
 * schedule order (WORDS index order). Backfilling forward a few months at a
 * time; the card only renders on days whose word has an entry here.
 */

export type WordDefinition = {
  /** Short Bosnian (ijekavian) gloss — one line. */
  def: string
  /** Part of speech + gender, e.g. 'imenica, m.' (optional). */
  pos?: string
  /** Flag: 'turcizam' | 'arhaično' | 'regionalizam' | 'deminutiv' … (optional). */
  note?: string
}

// Sample only — random 10 from the approved list, for style alignment.
export const WORD_DEFINITIONS: Record<string, WordDefinition> = {
  // Today's word (Bukvar 913, the legacy list) — so the card shows on launch eve too.
  pumpa: {
    def: 'Naprava za potiskivanje ili crpljenje tekućine, gasa ili zraka.',
    pos: 'imenica, ž.',
  },
  nemar: {
    def: 'Nedostatak brige ili pažnje; nehaj.',
    pos: 'imenica, m.',
  },
  haram: {
    def: 'Ono što je vjerski zabranjeno (u islamu) — suprotno od halal.',
    note: 'turcizam',
  },
  plast: {
    def: 'Velika kupa sijena složena na otvorenom („igla u plastu sijena”).',
    pos: 'imenica, m.',
  },
  briga: {
    def: 'Osjećaj zabrinutosti; ono o čemu se neko stara.',
    pos: 'imenica, ž.',
  },
  čorba: {
    def: 'Rijetka, vodenasta supa, najčešće mesna ili od povrća.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  svila: {
    def: 'Fina, sjajna tkanina dobivena od svilene bube.',
    pos: 'imenica, ž.',
  },
  dolar: {
    def: 'Novčana jedinica SAD-a i niza drugih zemalja.',
    pos: 'imenica, m.',
  },
  pačić: {
    def: 'Mladunče patke; pače.',
    pos: 'imenica, m.',
    note: 'deminutiv',
  },
  urnek: {
    def: 'Uzorak, primjer ili obrazac po kojem se nešto radi.',
    note: 'turcizam, arhaično',
  },
  čelik: {
    def: 'Vrlo tvrda legura željeza i ugljika.',
    pos: 'imenica, m.',
  },

  // ── Upcoming daily solutions — Bukvar 914–943 (2026-06-29 → 2026-07-28) ──
  // The first 30 words players see after the relaunch, in schedule order.
  potez: {
    def: 'Pojedinačni pokret ili postupak, npr. u igri ili pregovorima.',
    pos: 'imenica, m.',
  },
  šǉaka: {
    def: 'Tvrdi otpadni ostatak od sagorijevanja uglja ili topljenja rude; troska.',
    pos: 'imenica, ž.',
  },
  mazga: {
    def: 'Domaća životinja nastala križanjem magarca i kobile.',
    pos: 'imenica, ž.',
  },
  feder: {
    def: 'Opruga; savitljiv metalni dio koji se vraća u prvobitni oblik.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  odraz: {
    def: 'Slika koja nastaje odbijanjem svjetlosti, npr. u ogledalu; odsjaj.',
    pos: 'imenica, m.',
  },
  skije: {
    def: 'Par dugih, uskih dasaka za klizanje po snijegu.',
    pos: 'imenica, ž. (mn.)',
  },
  audio: {
    def: 'Ono što se odnosi na zvuk te njegovo snimanje i reprodukciju.',
    note: 'pridjevski / prefiks',
  },
  znaǌe: {
    def: 'Ukupnost onoga što neko zna; spoznaja stečena učenjem.',
    pos: 'imenica, s.',
  },
  ribež: {
    def: 'Kuhinjska sprava s oštrim rupicama za ribanje sira ili povrća.',
    pos: 'imenica, m.',
  },
  čekić: {
    def: 'Alat s teškom glavom za udaranje i zabijanje eksera.',
    pos: 'imenica, m.',
  },
  glina: {
    def: 'Mekana, plastična zemlja za grnčariju i izradu cigle.',
    pos: 'imenica, ž.',
  },
  prvak: {
    def: 'Onaj ko je prvi; pobjednik takmičenja, šampion.',
    pos: 'imenica, m.',
  },
  svrha: {
    def: 'Cilj ili namjera radi koje se nešto čini.',
    pos: 'imenica, ž.',
  },
  cijev: {
    def: 'Šuplje, izduženo tijelo kroz koje protiče tekućina ili gas.',
    pos: 'imenica, ž.',
  },
  bluza: {
    def: 'Lagana ženska košulja ili gornji dio odjeće.',
    pos: 'imenica, ž.',
  },
  hefta: {
    def: 'Sedmica; period od sedam dana.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  ragbi: {
    def: 'Timski sport s jajolikom loptom koja se nosi i dodaje rukama.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  konop: { def: 'Debelo uže od upletenih vlakana.', pos: 'imenica, m.' },
  ideal: { def: 'Savršen uzor ili cilj kojem se teži.', pos: 'imenica, m.' },
  zamak: {
    def: 'Utvrđena srednjovjekovna građevina; dvorac.',
    pos: 'imenica, m.',
  },
  gesta: {
    def: 'Pokret ruke ili tijela koji nešto izražava; kretnja.',
    pos: 'imenica, ž.',
  },
  berba: {
    def: 'Skupljanje zrelih plodova, naročito grožđa.',
    pos: 'imenica, ž.',
  },
  ǆemre: {
    def: 'Razdoblja zatopljenja krajem zime, prema narodnom vjerovanju.',
    pos: 'imenica, s. (mn.)',
    note: 'turcizam, narodni običaj',
  },
  pakao: {
    def: 'Mjesto vječne patnje i kazne u vjerskim predstavama; suprotno od raja.',
    pos: 'imenica, m.',
  },
  kǌiga: {
    def: 'Skup uvezanih listova s tekstom za čitanje.',
    pos: 'imenica, ž.',
  },
  dubak: {
    def: 'Okvir na točkićima u kojem dijete uči hodati; hodalica.',
    pos: 'imenica, m.',
  },
  moler: {
    def: 'Zanatlija koji boji zidove i prostorije; soboslikar.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  tarot: {
    def: 'Špil posebnih karata koji se koristi za proricanje.',
    pos: 'imenica, m.',
  },
  nosač: {
    def: 'Onaj ili ono što nešto nosi ili podupire; držač.',
    pos: 'imenica, m.',
  },
  krema: {
    def: 'Gusta, maziva smjesa, kozmetička ili slastičarska.',
    pos: 'imenica, ž.',
  },

  // ── Backfill: Bukvar 944 onward — next ~90 daily solutions, schedule order ──
  // WORDS indices 30–120 (calendar dates drift with special-occasion days).
  // 'plast' (52) and 'pumpa' (61) already have entries above.
  nalet: {
    def: 'Nagli, kratkotrajan udar ili navala (vjetra, bijesa, snaga).',
    pos: 'imenica, m.',
  },
  epoha: {
    def: 'Duže historijsko razdoblje obilježeno zajedničkim osobinama.',
    pos: 'imenica, ž.',
  },
  ǆezva: {
    def: 'Metalna posuda s dugom drškom za kuhanje kahve.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  izlog: {
    def: 'Zastakljeni prostor u kojem trgovina izlaže robu.',
    pos: 'imenica, m.',
  },
  babun: {
    def: 'Krupan uskonosi majmun psoglave njuške; pavijan.',
    pos: 'imenica, m.',
  },
  blago: {
    def: 'Nakupljene dragocjenosti, novac i vrijedne stvari; bogatstvo.',
    pos: 'imenica, s.',
  },
  puška: {
    def: 'Vatreno oružje s dugom cijevi za gađanje.',
    pos: 'imenica, ž.',
  },
  ponor: { def: 'Duboka provalija ili bezdan u tlu.', pos: 'imenica, m.' },
  buket: { def: 'Svežanj ubranog i složenog cvijeća.', pos: 'imenica, m.' },
  štivo: {
    def: 'Ono što se čita; tekst namijenjen čitanju.',
    pos: 'imenica, s.',
  },
  medij: {
    def: 'Sredstvo javnog prenošenja informacija (novine, TV, internet).',
    pos: 'imenica, m.',
  },
  tipla: {
    def: 'Umetak u zid u koji se učvršćuje vijak.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  žbuǌe: {
    def: 'Niske, razgranate drvenaste biljke; grmlje.',
    pos: 'imenica, s. (zbirno)',
  },
  šteka: {
    def: 'Kartonsko pakovanje od deset kutija cigareta; drška od vrata.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  kanal: {
    def: 'Umjetno iskopano korito za vodu; prolaz ili veza.',
    pos: 'imenica, m.',
  },
  kašaǉ: {
    def: 'Naglo, glasno izbacivanje zraka iz pluća, često znak bolesti.',
    pos: 'imenica, m.',
  },
  namaz: {
    def: 'Ono što se maže po hljebu (pašteta, med); u vjeri i islamska molitva.',
    pos: 'imenica, m.',
  },
  koleǆ: {
    def: 'Visokoškolska ustanova; fakultet.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  sudac: {
    def: 'Osoba koja sudi na sudu ili u sportskom nadmetanju.',
    pos: 'imenica, m.',
  },
  zvaǌe: {
    def: 'Stručni ili počasni naziv koji neko stekne; titula.',
    pos: 'imenica, s.',
  },
  basna: {
    def: 'Kratka poučna priča u kojoj životinje govore i djeluju.',
    pos: 'imenica, ž.',
  },
  mozak: {
    def: 'Organ u glavi, središte živčanog sistema i mišljenja.',
    pos: 'imenica, m.',
  },
  lokva: { def: 'Plitka nakupina vode na tlu; bara.', pos: 'imenica, ž.' },
  neven: {
    def: 'Vrtni cvijet žuto-narandžaste boje (Calendula).',
    pos: 'imenica, m.',
  },
  ateǉe: { def: 'Radionica umjetnika ili fotografa.', pos: 'imenica, m.' },
  tesar: {
    def: 'Zanatlija koji grubo obrađuje i sastavlja drvenu građu.',
    pos: 'imenica, m.',
  },
  kopar: {
    def: 'Aromatična začinska biljka perastih listova.',
    pos: 'imenica, m.',
  },
  gužva: {
    def: 'Velika gomila ljudi na malom prostoru; metež.',
    pos: 'imenica, ž.',
  },
  argon: {
    def: 'Plemeniti gas bez boje i mirisa, hemijski element (Ar).',
    pos: 'imenica, m.',
  },
  obrok: {
    def: 'Količina hrane koja se pojede u jednom navratu.',
    pos: 'imenica, m.',
  },
  otvor: {
    def: 'Rupa ili prolaz kroz koji se ulazi, izlazi ili prolazi.',
    pos: 'imenica, m.',
  },
  arsen: {
    def: 'Otrovni polumetalni hemijski element (As).',
    pos: 'imenica, m.',
  },
  maslo: {
    def: 'Prečišćena mast dobivena od mlijeka; puter.',
    pos: 'imenica, s.',
  },
  pošta: {
    def: 'Služba za prenošenje pisama i pošiljki; poštanski ured.',
    pos: 'imenica, ž.',
  },
  žurba: { def: 'Stanje kad se nešto radi na brzinu.', pos: 'imenica, ž.' },
  sinus: {
    def: 'Trigonometrijska funkcija; šupljina u kostima lica.',
    pos: 'imenica, m.',
  },
  april: { def: 'Četvrti mjesec u godini.', pos: 'imenica, m.' },
  slovo: { def: 'Pisani znak kojim se bilježi glas.', pos: 'imenica, s.' },
  aktiv: {
    def: 'Skupina ljudi okupljenih radi zajedničkog rada; glagolski oblik',
    pos: 'imenica, m.',
  },
  nekad: { def: 'U prošlosti, u neko ranije vrijeme.', note: 'prilog' },
  sunce: {
    def: 'Zvijezda oko koje kruži Zemlja; izvor svjetlosti i toplote.',
    pos: 'imenica, s.',
  },
  album: {
    def: 'Knjiga za slike ili marke; muzičko izdanje s više pjesama.',
    pos: 'imenica, m.',
  },
  štene: { def: 'Mladunče psa.', pos: 'imenica, s.' },
  farma: {
    def: 'Veliko poljoprivredno ili stočarsko gazdinstvo.',
    pos: 'imenica, ž.',
  },
  bošča: {
    def: 'Platno u koje se zavežu stvari; velika marama.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  zalog: {
    def: 'Ono što se daje kao garancija da će dug biti vraćen.',
    pos: 'imenica, m.',
  },
  salon: {
    def: 'Reprezentativna soba za goste; radnja za uljepšavanje.',
    pos: 'imenica, m.',
  },
  stado: {
    def: 'Skupina domaćih životinja koje se zajedno napasaju.',
    pos: 'imenica, s.',
  },
  moǉac: {
    def: 'Sitni leptir čije gusjenice glođu tkaninu ili brašno.',
    pos: 'imenica, m.',
  },
  rogač: {
    def: 'Mediteransko drvo i njegov slatki, mahunasti plod.',
    pos: 'imenica, m.',
  },
  lavež: { def: 'Glasanje psa; lajanje.', pos: 'imenica, m.' },
  vrgaǌ: {
    def: 'Cijenjena jestiva gljiva debele stručke (Boletus).',
    pos: 'imenica, m.',
  },
  plaža: {
    def: 'Pješčani ili šljunkoviti pojas uz vodu za kupanje.',
    pos: 'imenica, ž.',
  },
  idiot: { def: 'Glupa, budalasta osoba (pogrdno).', pos: 'imenica, m.' },
  šiške: {
    def: 'Pramenovi kose začešljani preko čela.',
    pos: 'imenica, ž. (mn.)',
  },
  sačma: {
    def: 'Sitna olovna zrna kojima se puni lovački metak.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  kokos: {
    def: 'Plod palme s tvrdom ljuskom i bijelim jezgrom.',
    pos: 'imenica, m.',
  },
  pamet: {
    def: 'Sposobnost mišljenja i razumijevanja; razum.',
    pos: 'imenica, ž.',
  },
  redar: { def: 'Osoba koja održava red i poredak.', pos: 'imenica, m.' },
  lonac: { def: 'Duboka posuda za kuhanje hrane.', pos: 'imenica, m.' },
  plašt: {
    def: 'Široka gornja odjeća bez rukava; ogrtač.',
    pos: 'imenica, m.',
  },
  mrena: {
    def: 'Tanka opna u tijelu; zamućenje očnog sočiva (katarakta).',
    pos: 'imenica, ž.',
  },
  tutaǌ: { def: 'Potmula, duboka tutnjava.', pos: 'imenica, m.' },
  flora: {
    def: 'Ukupnost biljnog svijeta nekog područja.',
    pos: 'imenica, ž.',
  },
  bedro: { def: 'Dio noge između kuka i koljena; but.', pos: 'imenica, s.' },
  kombi: {
    def: 'Manje putničko-teretno vozilo zatvorene karoserije.',
    pos: 'imenica, m.',
  },
  kanta: { def: 'Limena ili plastična posuda s drškom.', pos: 'imenica, ž.' },
  šifra: { def: 'Tajni znak ili niz znakova; lozinka.', pos: 'imenica, ž.' },
  bogaǉ: {
    def: 'Osoba s teškim tjelesnim oštećenjem; sakat čovjek.',
    pos: 'imenica, m.',
    note: 'često pogrdno',
  },
  hokej: {
    def: 'Timski sport u kojem se palicama tjera pak ili loptica.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  ptica: { def: 'Kičmenjak s perjem, krilima i kljunom.', pos: 'imenica, ž.' },
  barka: { def: 'Manji čamac.', pos: 'imenica, ž.' },
  žvaka: { def: 'Slatka guma za žvakanje.', pos: 'imenica, ž.' },
  cezij: {
    def: 'Meki, srebrnastobijeli hemijski element (Cs).',
    pos: 'imenica, m.',
  },
  proza: {
    def: 'Književnost pisana običnim govorom, nasuprot stihu.',
    pos: 'imenica, ž.',
  },
  paǉba: { def: 'Ispaljivanje iz vatrenog oružja; vatra.', pos: 'imenica, ž.' },
  zebra: {
    def: 'Afrička životinja srodna konju, s crno-bijelim prugama.',
    pos: 'imenica, ž.',
  },
  čuvar: {
    def: 'Osoba koja nešto čuva, pazi ili nadzire.',
    pos: 'imenica, m.',
  },
  stoka: {
    def: 'Domaće životinje koje se drže radi koristi.',
    pos: 'imenica, ž.',
  },
  akord: {
    def: 'Skladan istovremeni zvuk triju ili više tonova.',
    pos: 'imenica, m.',
  },
  šarka: {
    def: 'Metalni zglob na kojem se okreću vrata ili prozor.',
    pos: 'imenica, ž.',
  },
  obuća: {
    def: 'Ono što se nosi na nogama; cipele, čizme i sl.',
    pos: 'imenica, ž.',
  },
  kečap: {
    def: 'Gusti, začinjeni sos od paradajza.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  graja: { def: 'Buka mnogih izmiješanih glasova; vika.', pos: 'imenica, ž.' },
  krava: { def: 'Odrasla ženka goveda koja daje mlijeko.', pos: 'imenica, ž.' },
  fauna: {
    def: 'Ukupnost životinjskog svijeta nekog područja.',
    pos: 'imenica, ž.',
  },
  kusur: {
    def: 'Novac koji se vraća pri plaćanju; ostatak, sitniš.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  talac: {
    def: 'Osoba silom zadržana kao garancija ili ucjena, radi iznude.',
    pos: 'imenica, m.',
  },
  tumor: {
    def: 'Bolesna izraslina tkiva u organizmu; oteklina.',
    pos: 'imenica, m.',
  },
}
