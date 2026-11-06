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
 * Covers the 12 style samples + every WORDS solution, in schedule order (WORDS
 * index order), except a few that couldn't be verified as real words (uloža,
 * siper, išćil, givit, nutma, cepǉa, poǉev, rezga). The card only renders on
 * days whose word has an entry here, so those days simply show no card.
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
    def: 'Skupina ljudi okupljenih radi zajedničkog rada; radno stanje glagola.',
    pos: 'imenica, m.',
  },
  nekad: { def: 'U prošlosti, u neko ranije vrijeme.', pos: 'prilog' },
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

  // ── Backfill: remaining WORDS in schedule order (WORDS index 121 onward) ──
  // The `WORDS[a–b]` markers below give the WORDS index range, to aid navigation.
  // WORDS[100–149]
  zarez: {
    def: 'Interpunkcijski znak (,) koji odvaja dijelove rečenice; mali urez.',
    pos: 'imenica, m.',
  },
  vrana: {
    def: 'Krupna crna ptica hrapavog, kreštavog glasa (Corvus).',
    pos: 'imenica, ž.',
  },
  šegrt: {
    def: 'Mladić koji kod majstora izučava zanat; zanatski učenik.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  arena: {
    def: 'Ograđeni prostor za takmičenja ili predstave okružen gledalištem.',
    pos: 'imenica, ž.',
  },
  nijet: {
    def: 'Namjera, naročito ona koja se učini prije namaza ili posta.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  sklop: {
    def: 'Cjelina sastavljena od više povezanih dijelova; spoj.',
    pos: 'imenica, m.',
  },
  perec: {
    def: 'Slano, hrskavo pecivo u obliku petlje ili osmice.',
    pos: 'imenica, m.',
    note: 'hungarizam',
  },
  ǉubav: {
    def: 'Snažna naklonost i privrženost prema nekome ili nečemu.',
    pos: 'imenica, ž.',
  },
  zidar: {
    def: 'Zanatlija koji zida zidove i objekte od cigle ili kamena.',
    pos: 'imenica, m.',
  },
  ugǉen: {
    def: 'Crna čvrsta gorivna stijena nastala od drevnih biljnih ostataka.',
    pos: 'imenica, m.',
  },
  leđen: {
    def: 'Široka plitka posuda za umivanje, obično uz ibrik; lavor.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  đubre: {
    def: 'Smeće, otpad; pogrdno i podla, pokvarena osoba.',
    pos: 'imenica, s.',
    note: 'turcizam',
  },
  vreća: {
    def: 'Velika torba od platna, jute ili plastike za nošenje i čuvanje stvari.',
    pos: 'imenica, ž.',
  },
  kazan: {
    def: 'Veliki metalni kotao, npr. za kuhanje ili pečenje rakije.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  dušek: {
    def: 'Debela, mekana podloga na kojoj se spava.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  poriv: {
    def: 'Snažna unutrašnja pobuda da se nešto učini; nagon.',
    pos: 'imenica, m.',
  },
  zbrka: {
    def: 'Nered i pometnja u kojoj se ništa ne može razabrati.',
    pos: 'imenica, ž.',
  },
  desno: { def: 'Na desnoj strani ili prema desnoj strani.', pos: 'prilog' },
  korzo: {
    def: 'Glavna gradska ulica ili šetalište za večernje šetnje.',
    pos: 'imenica, m.',
    note: 'talijanizam',
  },
  talog: {
    def: 'Čvrste čestice koje se slegnu na dno tekućine, npr. kahve.',
    pos: 'imenica, m.',
  },
  perut: {
    def: 'Sitne bijele ljuspice odumrle kože na tjemenu.',
    pos: 'imenica, ž.',
  },
  rabat: {
    def: 'Popust na cijenu, naročito pri kupovini na veliko.',
    pos: 'imenica, m.',
  },
  lakat: { def: 'Zglob između nadlaktice i podlaktice.', pos: 'imenica, m.' },
  šeher: {
    def: 'Grad, naročito velik i lijep (Šeher-Sarajevo).',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  kazna: {
    def: 'Mjera izrečena nekome zbog prekršaja ili zločina.',
    pos: 'imenica, ž.',
  },
  hlače: {
    def: 'Odjevni predmet s dvije nogavice, od struka do članaka; pantalone.',
    pos: 'imenica, ž. (mn.)',
  },
  gospa: {
    def: 'Gospođa, dama; u katoličkoj tradiciji naziv za Bogorodicu.',
    pos: 'imenica, ž.',
  },
  mućka: {
    def: 'Nepošten, mutan posao radi brze i lake zarade.',
    pos: 'imenica, ž.',
    note: 'žargon',
  },
  // WORDS[150–199]
  prkos: {
    def: 'Namjerno suprotstavljanje tuđoj volji ili zabrani; inat.',
    pos: 'imenica, m.',
  },
  ćumur: {
    def: 'Drveni ugalj dobiven sporim sagorijevanjem drveta.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  tufna: {
    def: 'Okrugla tačkica kao uzorak na tkanini.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  tacna: {
    def: 'Poslužavnik; mali tanjirić ispod šolje.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  odred: {
    def: 'Manja vojna ili organizovana jedinica s posebnim zadatkom.',
    pos: 'imenica, m.',
  },
  pilot: {
    def: 'Osoba koja upravlja avionom ili drugom letjelicom.',
    pos: 'imenica, m.',
  },
  skija: {
    def: 'Duga, uska daska za klizanje po snijegu, jedna od para.',
    pos: 'imenica, ž.',
  },
  vokal: { def: 'Samoglasnik; pjevač u muzičkoj grupi.', pos: 'imenica, m.' },
  štala: {
    def: 'Zgrada u kojoj se drže konji, krave ili druga stoka.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  melem: {
    def: 'Ljekovita mast za rane; ono što donosi utjehu i olakšanje.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  karma: {
    def: 'U hinduizmu i budizmu: posljedica djela koja određuje sudbinu.',
    pos: 'imenica, ž.',
  },
  smeće: { def: 'Otpaci i stvari koje se bacaju; otpad.', pos: 'imenica, s.' },
  motor: {
    def: 'Mašina koja pretvara energiju u mehanički rad; razg. motocikl.',
    pos: 'imenica, m.',
  },
  ritam: {
    def: 'Pravilno ponavljanje udara, tonova ili pokreta u vremenu.',
    pos: 'imenica, m.',
  },
  šapat: { def: 'Vrlo tih govor, bez punog glasa.', pos: 'imenica, m.' },
  rebro: {
    def: 'Jedna od zakrivljenih kostiju koje čine grudni koš.',
    pos: 'imenica, s.',
  },
  porez: {
    def: 'Obavezno davanje koje građani i firme plaćaju državi.',
    pos: 'imenica, m.',
  },
  zombi: {
    def: 'Oživljeni mrtvac iz filmova i vjerovanja; razg. tupa, odsutna osoba.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  kovač: {
    def: 'Zanatlija koji kuje i obrađuje željezo, npr. potkovice.',
    pos: 'imenica, m.',
  },
  ploha: {
    def: 'Ravna površina nekog predmeta; u geometriji vanjska strana tijela.',
    pos: 'imenica, ž.',
  },
  kmica: {
    def: 'Potpuni mrak; gusta tama.',
    pos: 'imenica, ž.',
    note: 'regionalizam',
  },
  kugla: { def: 'Okruglo geometrijsko tijelo; lopta.', pos: 'imenica, ž.' },
  vaǉak: {
    def: 'Geometrijsko tijelo s dvije kružne osnovice; sprava koja se kotrlja po površini.',
    pos: 'imenica, m.',
  },
  pasus: {
    def: 'Dio teksta koji počinje novim redom; odlomak.',
    pos: 'imenica, m.',
  },
  ugǉik: {
    def: 'Nemetal koji je osnova svih organskih spojeva, hemijski element (C).',
    pos: 'imenica, m.',
  },
  jagǌe: { def: 'Mladunče ovce; janje.', pos: 'imenica, s.' },
  patka: {
    def: 'Vodena ptica pljosnatog kljuna i kratkih nogu.',
    pos: 'imenica, ž.',
  },
  sport: {
    def: 'Tjelesna aktivnost i takmičenje po utvrđenim pravilima.',
    pos: 'imenica, m.',
  },
  ovčar: {
    def: 'Onaj ko čuva ovce, čoban; pas koji čuva stado.',
    pos: 'imenica, m.',
  },
  otpor: {
    def: 'Suprotstavljanje sili ili nečijoj volji; u fizici sila koja koči kretanje.',
    pos: 'imenica, m.',
  },
  šećer: {
    def: 'Slatka kristalna materija dobivena od šećerne repe ili trske.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  govno: {
    def: 'Izmet; pren. bezvrijedna stvar ili podla osoba.',
    pos: 'imenica, s.',
    note: 'vulgarno',
  },
  šiber: {
    def: 'Pomični zatvarač, npr. na cijevi peći ili krovu auta; nepošten preprodavac.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  tenor: {
    def: 'Najviši muški pjevački glas; pjevač s takvim glasom.',
    pos: 'imenica, m.',
  },
  kukac: {
    def: 'Sitna životinja sa šest nogu i tijelom iz tri dijela; insekt.',
    pos: 'imenica, m.',
  },
  obraz: {
    def: 'Dio lica ispod oka; čast, ugled („nemati obraza”).',
    pos: 'imenica, m.',
  },
  greda: {
    def: 'Dugačak, debeo komad drveta ili metala koji nosi konstrukciju.',
    pos: 'imenica, ž.',
  },
  hrana: {
    def: 'Ono što se jede i pije radi održavanja života.',
    pos: 'imenica, ž.',
  },
  norma: {
    def: 'Pravilo ili mjerilo ponašanja; propisana količina rada.',
    pos: 'imenica, ž.',
  },
  aroma: { def: 'Ugodan i izražen miris ili ukus.', pos: 'imenica, ž.' },
  oglas: {
    def: 'Javno objavljena obavijest, npr. o prodaji ili poslu.',
    pos: 'imenica, m.',
  },
  odora: { def: 'Službena ili svečana odjeća; uniforma.', pos: 'imenica, ž.' },
  prasa: {
    def: 'Povrće dugog bijelog stabla i zelenih listova; praziluk.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  dokaz: {
    def: 'Činjenica ili argument koji potvrđuje istinitost nečega.',
    pos: 'imenica, m.',
  },
  izǉev: {
    def: 'Naglo isticanje tekućine, npr. krvi u mozak; nagao izraz osjećaja.',
    pos: 'imenica, m.',
  },
  fosna: {
    def: 'Debela i dugačka daska, naročito u građevinarstvu.',
    pos: 'imenica, ž.',
    note: 'germanizam, regionalizam',
  },
  mošus: {
    def: 'Jak miris životinjskog porijekla koji se koristi u parfemima.',
    pos: 'imenica, m.',
  },
  kavez: {
    def: 'Prostor ograđen rešetkama ili žicom za držanje ptica i životinja.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  rampa: {
    def: 'Pokretna prečka koja zatvara prolaz; kosa površina za utovar.',
    pos: 'imenica, ž.',
  },
  pismo: {
    def: 'Pisana poruka upućena nekome; sistem slova (latinica, ćirilica).',
    pos: 'imenica, s.',
  },
  // WORDS[200–249]
  ulema: {
    def: 'Islamski vjerski učenjaci kao skupina.',
    pos: 'imenica, ž. (zbirno)',
    note: 'turcizam',
  },
  puter: {
    def: 'Mliječna masnoća dobivena mućenjem pavlake.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  pjena: {
    def: 'Masa sitnih mjehurića na površini tekućine.',
    pos: 'imenica, ž.',
  },
  mišić: {
    def: 'Organ od elastičnih vlakana koji pokreće dijelove tijela; mali miš.',
    pos: 'imenica, m.',
  },
  jecaj: { def: 'Isprekidan, grčevit zvuk pri plaču.', pos: 'imenica, m.' },
  porod: { def: 'Rađanje djeteta; potomstvo.', pos: 'imenica, m.' },
  papak: {
    def: 'Rožnati završetak prsta kod krave, ovce i sl.; razg. nesnalažljiv čovjek.',
    pos: 'imenica, m.',
  },
  pašče: {
    def: 'Pas, naročito mlad ili malen.',
    pos: 'imenica, s.',
    note: 'razgovorno, često pogrdno',
  },
  lutka: {
    def: 'Igračka u obliku čovjeka; figura kojom se upravlja u pozorištu.',
    pos: 'imenica, ž.',
  },
  egzil: {
    def: 'Prisilan ili dobrovoljan život izvan domovine; progonstvo.',
    pos: 'imenica, m.',
  },
  sirup: {
    def: 'Gusta, slatka tekućina od šećera i voćnog soka; tekući lijek.',
    pos: 'imenica, m.',
  },
  agent: {
    def: 'Osoba koja zastupa nečije interese; tajni obavještajac.',
    pos: 'imenica, m.',
  },
  štaka: {
    def: 'Štap s osloncem pod pazuhom koji pomaže pri hodu.',
    pos: 'imenica, ž.',
  },
  bijes: { def: 'Silna, teško obuzdana ljutnja; srdžba.', pos: 'imenica, m.' },
  bunar: {
    def: 'Duboko iskopana jama iz koje se crpi podzemna voda.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  pelin: {
    def: 'Gorka ljekovita biljka srebrnastih listova (Artemisia).',
    pos: 'imenica, m.',
  },
  zebǌa: {
    def: 'Tjeskoban strah i nemir zbog onoga što se očekuje.',
    pos: 'imenica, ž.',
  },
  patak: { def: 'Mužjak patke.', pos: 'imenica, m.' },
  šǉiva: {
    def: 'Voćka i njen tamnoplavi, sočni koštičavi plod.',
    pos: 'imenica, ž.',
  },
  kisik: {
    def: 'Gas bez boje i mirisa neophodan za disanje, hemijski element (O).',
    pos: 'imenica, m.',
  },
  veslo: {
    def: 'Motka s plosnatim krajem kojom se pokreće čamac.',
    pos: 'imenica, s.',
  },
  nokat: { def: 'Tvrda rožnata pločica na vrhu prsta.', pos: 'imenica, m.' },
  tavan: {
    def: 'Prostor ispod krova iznad najvišeg sprata; potkrovlje.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  pleme: {
    def: 'Zajednica srodnih porodica sa zajedničkim porijeklom i običajima.',
    pos: 'imenica, s.',
  },
  vesta: {
    def: 'Pleteni vuneni gornji dio odjeće, obično na dugmad.',
    pos: 'imenica, ž.',
  },
  pčela: {
    def: 'Insekt koji živi u roju i proizvodi med i vosak.',
    pos: 'imenica, ž.',
  },
  ranac: {
    def: 'Torba koja se nosi na leđima; ruksak.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  čeǉad: {
    def: 'Ukućani, članovi porodice; ljudi uopće.',
    pos: 'imenica, ž. (zbirno)',
  },
  brana: {
    def: 'Pregrada preko rijeke koja zaustavlja i usmjerava vodu.',
    pos: 'imenica, ž.',
  },
  pazar: {
    def: 'Pijaca ili pijačni dan; novac utržen prodajom.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  grana: {
    def: 'Izdanak koji raste iz stabla drveta; oblast, dio neke cjeline.',
    pos: 'imenica, ž.',
  },
  tuǉan: {
    def: 'Morski sisar s perajama umjesto udova; foka.',
    pos: 'imenica, m.',
  },
  konto: {
    def: 'Knjigovodstveni račun; razg. nečiji račun, interes („na moj konto”).',
    pos: 'imenica, m.',
    note: 'talijanizam',
  },
  palac: { def: 'Prvi, najdeblji prst na ruci ili nozi.', pos: 'imenica, m.' },
  muzej: {
    def: 'Ustanova koja čuva i izlaže predmete kulturne ili naučne vrijednosti.',
    pos: 'imenica, m.',
  },
  popis: {
    def: 'Spisak stvari ili osoba; zvanično prebrojavanje stanovništva.',
    pos: 'imenica, m.',
  },
  harem: {
    def: 'Ženski dio muslimanske kuće ili dvora; ograđeno dvorište ili mezarje uz džamiju.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  ravan: {
    def: 'Bez izbočina i udubljenja, gladak; uspravan, prav.',
    pos: 'pridjev',
  },
  bokal: {
    def: 'Posuda s ručkom i grlićem za vodu ili vino; vrč.',
    pos: 'imenica, m.',
    note: 'talijanizam',
  },
  germa: {
    def: 'Kvasac; sredstvo za dizanje tijesta.',
    pos: 'imenica, ž.',
    note: 'germanizam, regionalizam',
  },
  farba: {
    def: 'Boja za premazivanje zidova, drveta ili metala.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  letva: { def: 'Duga, uska i tanka daščica.', pos: 'imenica, ž.' },
  živac: {
    def: 'Snop vlakana koji prenosi nadražaje između mozga i organa.',
    pos: 'imenica, m.',
  },
  obruč: {
    def: 'Kružni prsten od metala ili drveta koji nešto steže ili oivičava.',
    pos: 'imenica, m.',
  },
  kičma: {
    def: 'Niz povezanih pršljenova duž leđa; pren. čvrstina karaktera.',
    pos: 'imenica, ž.',
  },
  fosil: {
    def: 'Okamenjeni ostatak ili trag biljke ili životinje iz davnine.',
    pos: 'imenica, m.',
  },
  povez: {
    def: 'Korice i način uvezivanja knjige; traka kojom se nešto previje.',
    pos: 'imenica, m.',
  },
  kajla: {
    def: 'Klin ili podmetač kojim se nešto učvrsti ili podupre.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  metar: {
    def: 'Osnovna jedinica za dužinu; sprava za mjerenje dužine.',
    pos: 'imenica, m.',
  },
  // WORDS[250–299]
  odgoj: {
    def: 'Briga o razvoju djeteta i usađivanje vrijednosti; lijepo ponašanje.',
    pos: 'imenica, m.',
  },
  navod: {
    def: 'Citirane tuđe riječi; tvrdnja koju neko iznosi.',
    pos: 'imenica, m.',
  },
  brlog: {
    def: 'Skrovište divlje životinje, naročito medvjeda; pren. prljavo, neuredno mjesto.',
    pos: 'imenica, m.',
  },
  jelek: {
    def: 'Kratak prsluk bez rukava, dio tradicionalne nošnje.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  tmina: { def: 'Gusta tama; mrak.', pos: 'imenica, ž.' },
  vitez: {
    def: 'Srednjovjekovni plemić ratnik na konju; plemenit i hrabar čovjek.',
    pos: 'imenica, m.',
  },
  kaput: {
    def: 'Dug, topao gornji odjevni predmet s rukavima.',
    pos: 'imenica, m.',
  },
  datum: { def: 'Tačno određen dan, mjesec i godina.', pos: 'imenica, m.' },
  korov: {
    def: 'Nepoželjna divlja biljka koja raste među usjevima.',
    pos: 'imenica, m.',
  },
  lovac: { def: 'Osoba koja lovi divljač.', pos: 'imenica, m.' },
  crtež: {
    def: 'Slika izvedena linijama olovkom, perom ili ugljenom.',
    pos: 'imenica, m.',
  },
  kibla: {
    def: 'Smjer prema Kabi u Mekki u koji se okreće pri namazu; kanta.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  zaliv: {
    def: 'Dio mora ili jezera koji se uvlači u kopno.',
    pos: 'imenica, m.',
  },
  plima: {
    def: 'Periodično dizanje nivoa mora uzrokovano privlačenjem Mjeseca.',
    pos: 'imenica, ž.',
  },
  polog: {
    def: 'Novac ili dragocjenost data na čuvanje kao garancija; jaje ostavljeno u gnijezdu.',
    pos: 'imenica, m.',
  },
  burek: {
    def: 'Pita od razvučenog tijesta punjena mljevenim mesom.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  somun: {
    def: 'Okrugao, mekan hljeb od dizanog tijesta, naročito uz ćevape.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  tezga: {
    def: 'Pult na kojem se izlaže i prodaje roba; razg. dodatni honorarni posao.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  punac: { def: 'Ženin otac; tast.', pos: 'imenica, m.' },
  četka: {
    def: 'Predmet s gustim dlakama ili vlaknima za čišćenje, češljanje ili bojenje.',
    pos: 'imenica, ž.',
  },
  droga: {
    def: 'Opojna supstanca koja izaziva ovisnost; narkotik.',
    pos: 'imenica, ž.',
  },
  obrat: {
    def: 'Nagla promjena toka događaja ili smjera; preokret.',
    pos: 'imenica, m.',
  },
  šerpa: {
    def: 'Metalna posuda s drškama za kuhanje ili pečenje hrane.',
    pos: 'imenica, ž.',
  },
  uputa: {
    def: 'Objašnjenje ili savjet kako nešto uraditi; uputstvo.',
    pos: 'imenica, ž.',
  },
  stvar: {
    def: 'Bilo kakav predmet; pitanje, posao ili događaj.',
    pos: 'imenica, ž.',
  },
  fetiš: {
    def: 'Predmet kojem se pripisuje natprirodna moć; predmet pretjerane opsesije.',
    pos: 'imenica, m.',
  },
  kapak: {
    def: 'Pokretni kožni nabor koji pokriva i štiti oko; poklopac.',
    pos: 'imenica, m.',
  },
  obred: {
    def: 'Ustaljen niz svečanih, često vjerskih radnji; ritual.',
    pos: 'imenica, m.',
  },
  lijek: {
    def: 'Sredstvo kojim se liječi ili ublažava bolest.',
    pos: 'imenica, m.',
  },
  oblik: { def: 'Vanjski izgled i obris nečega; forma.', pos: 'imenica, m.' },
  izvor: {
    def: 'Mjesto gdje voda izbija iz zemlje; porijeklo nečega.',
    pos: 'imenica, m.',
  },
  lavor: {
    def: 'Široka, plitka posuda za umivanje i pranje.',
    pos: 'imenica, m.',
  },
  slika: {
    def: 'Prikaz izrađen bojama na platnu ili papiru; fotografija.',
    pos: 'imenica, ž.',
  },
  cezar: {
    def: 'Titula rimskih careva; car, svemoćni vladar.',
    pos: 'imenica, m.',
  },
  apoen: {
    def: 'Nominalna vrijednost novčanice ili kovanice.',
    pos: 'imenica, m.',
  },
  lišaj: {
    def: 'Organizam od gljive i alge koji raste na kamenu i drveću; kožna bolest.',
    pos: 'imenica, m.',
  },
  šipak: {
    def: 'Nar, plod s mnogo sočnih crvenih zrna; plod divlje ruže (šipurak).',
    pos: 'imenica, m.',
  },
  enzim: {
    def: 'Bjelančevina koja ubrzava hemijske reakcije u organizmu.',
    pos: 'imenica, m.',
  },
  cimet: {
    def: 'Mirisni začin od osušene kore cimetovog drveta.',
    pos: 'imenica, m.',
  },
  limit: {
    def: 'Granica koja se ne smije preći; ograničenje.',
    pos: 'imenica, m.',
  },
  magla: {
    def: 'Gusta vodena para pri tlu koja smanjuje vidljivost.',
    pos: 'imenica, ž.',
  },
  ždral: {
    def: 'Velika ptica selica dugih nogu i vrata (Grus).',
    pos: 'imenica, m.',
  },
  fazan: {
    def: 'Šumska ptica dugog repa; mužjak ima šareno perje.',
    pos: 'imenica, m.',
  },
  hamam: {
    def: 'Tradicionalno tursko javno kupatilo s parom.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  opera: {
    def: 'Scensko djelo u kojem se radnja pjeva uz pratnju orkestra.',
    pos: 'imenica, ž.',
  },
  junak: {
    def: 'Hrabar, neustrašiv čovjek; glavni lik priče ili djela.',
    pos: 'imenica, m.',
  },
  rubin: { def: 'Dragi kamen jarkocrvene boje.', pos: 'imenica, m.' },
  sprej: {
    def: 'Tekućina koja se iz boce raspršuje pod pritiskom.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  fešta: {
    def: 'Veselje, proslava ili zabava.',
    pos: 'imenica, ž.',
    note: 'talijanizam, razgovorno',
  },
  mezar: {
    def: 'Grob, naročito muslimanski.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  // WORDS[300–349]
  celer: {
    def: 'Povrće mirisnog gomoljastog korijena i listova.',
    pos: 'imenica, m.',
  },
  vrelo: {
    def: 'Mjesto gdje voda izvire iz zemlje; izvor.',
    pos: 'imenica, s.',
  },
  sehur: {
    def: 'Obrok pred zoru tokom ramazanskog posta.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  zadah: { def: 'Neugodan miris, naročito iz usta.', pos: 'imenica, m.' },
  staza: {
    def: 'Uzak, utaban put; trasa za trčanje ili utrke.',
    pos: 'imenica, ž.',
  },
  čvoka: {
    def: 'Lagan udarac prstom odapetim od palca, obično po glavi.',
    pos: 'imenica, ž.',
    note: 'razgovorno',
  },
  ustav: {
    def: 'Najviši pravni akt kojim se uređuje država.',
    pos: 'imenica, m.',
  },
  nasip: {
    def: 'Uzdignut zemljani bedem, npr. uz rijeku ili prugu.',
    pos: 'imenica, m.',
  },
  odmor: { def: 'Vrijeme predaha od rada ili napora.', pos: 'imenica, m.' },
  butik: {
    def: 'Mala prodavnica moderne odjeće i modnih dodataka.',
    pos: 'imenica, m.',
  },
  marža: {
    def: 'Razlika između nabavne i prodajne cijene robe.',
    pos: 'imenica, ž.',
  },
  pohod: {
    def: 'Organizovano kretanje vojske radi napada; dug, naporan put.',
    pos: 'imenica, m.',
  },
  hrast: {
    def: 'Listopadno drvo vrlo tvrdog drveta čiji je plod žir (Quercus).',
    pos: 'imenica, m.',
  },
  vidra: {
    def: 'Riječna zvijer vitkog tijela i gustog krzna, odličan plivač.',
    pos: 'imenica, ž.',
  },
  sajam: { def: 'Velika izložba i prodaja robe; vašar.', pos: 'imenica, m.' },
  sidro: {
    def: 'Teški metalni teret na lancu koji drži brod na mjestu.',
    pos: 'imenica, s.',
  },
  mamut: { def: 'Izumrli dlakavi slon iz ledenog doba.', pos: 'imenica, m.' },
  batat: {
    def: 'Slatki krompir; jestivi gomolj slatkastog ukusa.',
    pos: 'imenica, m.',
  },
  tekst: {
    def: 'Niz napisanih riječi i rečenica koje čine cjelinu.',
    pos: 'imenica, m.',
  },
  šipka: {
    def: 'Dug, tanak komad metala ili drveta; štap.',
    pos: 'imenica, ž.',
  },
  vapaj: { def: 'Očajnički krik ili poziv u pomoć.', pos: 'imenica, m.' },
  burma: { def: 'Vjenčani prsten.', pos: 'imenica, ž.', note: 'turcizam' },
  krilo: {
    def: 'Organ kojim ptice i insekti lete; natkoljenice sjedeće osobe (u krilu).',
    pos: 'imenica, s.',
  },
  metan: {
    def: 'Zapaljivi gas bez boje i mirisa, glavni sastojak prirodnog gasa.',
    pos: 'imenica, m.',
  },
  nakit: {
    def: 'Ukrasni predmeti koji se nose na tijelu, poput prstenja i ogrlica.',
    pos: 'imenica, m.',
  },
  ribar: {
    def: 'Osoba koja lovi ribu, često kao zanimanje.',
    pos: 'imenica, m.',
  },
  juriš: {
    def: 'Nagao, brz i silovit napad, naročito vojni.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  kupac: { def: 'Onaj ko nešto kupuje.', pos: 'imenica, m.' },
  pirat: {
    def: 'Morski razbojnik; onaj ko nezakonito umnožava tuđa djela.',
    pos: 'imenica, m.',
  },
  tetka: { def: 'Sestra oca ili majke.', pos: 'imenica, ž.' },
  šumar: {
    def: 'Stručnjak koji se brine o šumi i nadzire je.',
    pos: 'imenica, m.',
  },
  breme: {
    def: 'Teret koji se nosi na leđima; ono što tišti.',
    pos: 'imenica, s.',
  },
  ispis: {
    def: 'Ono što je odštampano iz računara; odjava iz škole ili evidencije.',
    pos: 'imenica, m.',
  },
  bodež: {
    def: 'Kratko oružje s oštrim, šiljatim sječivom.',
    pos: 'imenica, m.',
  },
  alarm: {
    def: 'Zvučni ili svjetlosni signal koji upozorava na opasnost.',
    pos: 'imenica, m.',
  },
  tjeme: { def: 'Najviši, gornji dio glave.', pos: 'imenica, s.' },
  zmija: { def: 'Gmizavac dugog tijela bez nogu.', pos: 'imenica, ž.' },
  ameba: {
    def: 'Jednoćelijski organizam promjenljivog oblika tijela.',
    pos: 'imenica, ž.',
  },
  kotao: {
    def: 'Velika metalna posuda za kuhanje ili zagrijavanje vode.',
    pos: 'imenica, m.',
  },
  geler: {
    def: 'Komadić rasprsnute granate, bombe ili metka.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  način: {
    def: 'Ono kako se nešto radi; postupak, metod.',
    pos: 'imenica, m.',
  },
  patǌa: { def: 'Teška tjelesna ili duševna bol; muka.', pos: 'imenica, ž.' },
  vegan: {
    def: 'Osoba koja ne jede ni ne koristi ništa životinjskog porijekla.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  puder: { def: 'Fini prah za njegu ili šminkanje kože.', pos: 'imenica, m.' },
  šteta: {
    def: 'Gubitak ili oštećenje; ono zbog čega se žali.',
    pos: 'imenica, ž.',
  },
  stepa: {
    def: 'Prostrana ravnica obrasla travom, bez šuma.',
    pos: 'imenica, ž.',
  },
  // WORDS[350–399]
  punkt: {
    def: 'Određeno mjesto s posebnom namjenom, npr. kontrolni punkt.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  sviǌa: {
    def: 'Domaća životinja koja se uzgaja zbog mesa i masti.',
    pos: 'imenica, ž.',
  },
  tenda: {
    def: 'Platnena nadstrešnica koja štiti od sunca i kiše.',
    pos: 'imenica, ž.',
    note: 'talijanizam',
  },
  lampa: {
    def: 'Svjetiljka; naprava koja daje svjetlost.',
    pos: 'imenica, ž.',
  },
  kolut: {
    def: 'Predmet u obliku kruga ili prstena; prevrtanje preko glave u gimnastici.',
    pos: 'imenica, m.',
  },
  bukva: {
    def: 'Listopadno drvo glatke sive kore, često u našim šumama (Fagus).',
    pos: 'imenica, ž.',
  },
  ćuran: { def: 'Mužjak ćurke, krupne domaće peradi.', pos: 'imenica, m.' },
  jarac: { def: 'Mužjak koze.', pos: 'imenica, m.' },
  bravo: { def: 'Uzvik odobravanja i pohvale.', pos: 'uzvik' },
  klada: {
    def: 'Kratak, debeo komad stabla; glup, trom čovjek.',
    pos: 'imenica, ž.',
  },
  vizir: {
    def: 'Pokretni dio kacige koji se spušta preko lica.',
    pos: 'imenica, m.',
  },
  citat: { def: 'Doslovno navedene tuđe riječi.', pos: 'imenica, m.' },
  teren: {
    def: 'Zemljište, tlo; prostor za igru ili sportsko takmičenje.',
    pos: 'imenica, m.',
  },
  šaran: {
    def: 'Krupna slatkovodna riba, česta u ribnjacima (Cyprinus).',
    pos: 'imenica, m.',
  },
  kaǌon: {
    def: 'Duboka, uska riječna dolina strmih strana.',
    pos: 'imenica, m.',
  },
  endem: {
    def: 'Biljna ili životinjska vrsta koja živi samo na jednom području.',
    pos: 'imenica, m.',
  },
  stres: {
    def: 'Stanje napetosti izazvano pritiskom ili opterećenjem.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  taǌir: { def: 'Plitka okrugla posuda iz koje se jede.', pos: 'imenica, m.' },
  torta: {
    def: 'Slatki kolač od više slojeva tijesta i krema.',
    pos: 'imenica, ž.',
  },
  trava: {
    def: 'Niska zeljasta biljka koja prekriva livade i travnjake.',
    pos: 'imenica, ž.',
  },
  elita: {
    def: 'Najbolji, najugledniji ili najuticajniji dio društva ili grupe.',
    pos: 'imenica, ž.',
  },
  barok: {
    def: 'Umjetnički stil 17. i 18. vijeka, raskošan i bogat ukrasima.',
    pos: 'imenica, m.',
  },
  svrab: {
    def: 'Neugodan osjećaj na koži koji tjera na češanje.',
    pos: 'imenica, m.',
  },
  zemǉa: {
    def: 'Planeta na kojoj živimo; tlo pod nogama; država.',
    pos: 'imenica, ž.',
  },
  struk: {
    def: 'Uži dio tijela iznad kukova; stabljika biljke.',
    pos: 'imenica, m.',
  },
  obrva: { def: 'Luk dlačica iznad oka.', pos: 'imenica, ž.' },
  krila: {
    def: 'Organi kojima ptice, insekti i šišmiši lete; množina od krilo.',
    pos: 'imenica, s. (mn.)',
  },
  škrob: {
    def: 'Bijeli ugljikohidrat iz krompira i žitarica; sredstvo za ukrućivanje rublja.',
    pos: 'imenica, m.',
  },
  osoba: { def: 'Ljudsko biće kao pojedinac; čovjek.', pos: 'imenica, ž.' },
  tovar: {
    def: 'Teret natovaren na životinju ili vozilo.',
    pos: 'imenica, m.',
  },
  belaj: {
    def: 'Nevolja, nesreća, neprilika.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  metež: { def: 'Nered i gužva; zbrka.', pos: 'imenica, m.' },
  čežǌa: {
    def: 'Snažna želja za nekim ili nečim dalekim.',
    pos: 'imenica, ž.',
  },
  parče: {
    def: 'Manji dio nečega; komad.',
    pos: 'imenica, s.',
    note: 'turcizam',
  },
  potop: {
    def: 'Plavljenje velikog područja vodom; biblijski potop.',
    pos: 'imenica, m.',
  },
  sjeta: { def: 'Blaga tuga i čežnja; melanholija.', pos: 'imenica, ž.' },
  samrt: { def: 'Trenutak ili čas umiranja; smrt.', pos: 'imenica, ž.' },
  stora: {
    def: 'Zavjesa na oprugu ili roletna koja se spušta preko prozora.',
    pos: 'imenica, ž.',
    note: 'galicizam, regionalizam',
  },
  izlet: {
    def: 'Kratko putovanje radi odmora i razonode.',
    pos: 'imenica, m.',
  },
  otpad: {
    def: 'Ono što se baci kao neupotrebljivo; smeće.',
    pos: 'imenica, m.',
  },
  rotor: { def: 'Okretni dio mašine; elisa helikoptera.', pos: 'imenica, m.' },
  ražaǌ: {
    def: 'Metalna šipka na kojoj se meso peče nad vatrom.',
    pos: 'imenica, m.',
  },
  čamac: { def: 'Malo plovilo na vesla, jedra ili motor.', pos: 'imenica, m.' },
  ubrus: {
    def: 'Komad papira ili platna za brisanje ruku i usta; salveta.',
    pos: 'imenica, m.',
  },
  radio: {
    def: 'Uređaj za slušanje emisija koje se prenose radiotalasima.',
    pos: 'imenica, m.',
  },
  laser: {
    def: 'Uređaj koji proizvodi uzak i snažan snop svjetlosti.',
    pos: 'imenica, m.',
  },
  čipka: {
    def: 'Prozračna ukrasna tkanina s uzorcima od konca.',
    pos: 'imenica, ž.',
  },
  // WORDS[400–449]
  uzdah: {
    def: 'Dubok, čujan izdah koji odaje tugu, olakšanje ili čežnju.',
    pos: 'imenica, m.',
  },
  pucaǌ: { def: 'Prasak ispaljenog metka; hitac.', pos: 'imenica, m.' },
  izvoz: { def: 'Prodaja robe i usluga u inostranstvo.', pos: 'imenica, m.' },
  ligǌa: {
    def: 'Morski glavonožac izduženog tijela s deset krakova.',
    pos: 'imenica, ž.',
  },
  uštap: {
    def: 'Faza u kojoj je Mjesec potpuno osvijetljen; pun mjesec.',
    pos: 'imenica, m.',
    note: 'zastarjelo',
  },
  cucla: {
    def: 'Gumena bradavica koju beba siše radi umirenja ili hranjenja.',
    pos: 'imenica, ž.',
    note: 'razgovorno',
  },
  temeǉ: {
    def: 'Donji, noseći dio građevine; osnova nečega.',
    pos: 'imenica, m.',
  },
  treǌe: {
    def: 'Otpor koji nastaje kad jedno tijelo klizi po drugom; trljanje.',
    pos: 'imenica, s.',
  },
  koraǉ: {
    def: 'Morski organizam čiji krečni skeleti grade grebene; nakit od njega.',
    pos: 'imenica, m.',
  },
  staǌe: {
    def: 'Okolnosti ili prilike u kojima se neko ili nešto nalazi.',
    pos: 'imenica, s.',
  },
  sklad: {
    def: 'Usklađenost dijelova u lijepu cjelinu; harmonija.',
    pos: 'imenica, m.',
  },
  hajka: {
    def: 'Lov u kojem se divljač bukom tjera prema lovcima; progon.',
    pos: 'imenica, ž.',
  },
  nalog: {
    def: 'Naredba ili službeni zahtjev da se nešto uradi.',
    pos: 'imenica, m.',
  },
  piton: {
    def: 'Velika neotrovna zmija koja plijen ubija stezanjem.',
    pos: 'imenica, m.',
  },
  vakat: {
    def: 'Vrijeme, doba; vrijeme propisano za namaz.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  odvod: { def: 'Cijev ili otvor kojim otiče voda.', pos: 'imenica, m.' },
  zamah: {
    def: 'Snažan pokret ruke ili tijela; polet, snaga.',
    pos: 'imenica, m.',
  },
  glava: {
    def: 'Gornji dio tijela u kojem je mozak; poglavlje u knjizi.',
    pos: 'imenica, ž.',
  },
  fazon: {
    def: 'Način ili stil; šala, dosjetka.',
    pos: 'imenica, m.',
    note: 'razgovorno',
  },
  jasle: {
    def: 'Ustanova za čuvanje male djece; korito za hranu stoci.',
    pos: 'imenica, ž. (mn.)',
  },
  ekipa: {
    def: 'Skupina ljudi koji zajedno rade ili igraju; tim.',
    pos: 'imenica, ž.',
  },
  svota: { def: 'Iznos novca; suma.', pos: 'imenica, ž.' },
  berza: {
    def: 'Mjesto organizovanog trgovanja vrijednosnim papirima, robom ili devizama.',
    pos: 'imenica, ž.',
  },
  očǌak: {
    def: 'Šiljasti zub između sjekutića i kutnjaka.',
    pos: 'imenica, m.',
  },
  strip: {
    def: 'Priča ispričana nizom crteža s tekstom u oblačićima.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  tempo: {
    def: 'Brzina kojom se nešto odvija; brzina izvođenja muzičkog djela.',
    pos: 'imenica, m.',
  },
  ǉuska: {
    def: 'Tvrdi omotač jajeta ili ploda; pločica na koži ribe.',
    pos: 'imenica, ž.',
  },
  vazal: {
    def: 'Feudalni podanik koji duguje vjernost gospodaru; zavisna država.',
    pos: 'imenica, m.',
  },
  odziv: {
    def: 'Odgovor na poziv; broj ljudi koji su se odazvali, npr. na izborima.',
    pos: 'imenica, m.',
  },
  video: {
    def: 'Snimak pokretnih slika, obično sa zvukom.',
    pos: 'imenica, m.',
  },
  obzir: {
    def: 'Pažnja prema tuđim osjećajima i potrebama; ono što se uzima u račun.',
    pos: 'imenica, m.',
  },
  rubǉe: {
    def: 'Donja odjeća i posteljina koje se peru; veš.',
    pos: 'imenica, s. (zbirno)',
  },
  dlaka: {
    def: 'Tanka nit koja raste iz kože ljudi i životinja.',
    pos: 'imenica, ž.',
  },
  obuka: {
    def: 'Sticanje znanja i vještina vježbom i poukom; trening.',
    pos: 'imenica, ž.',
  },
  farsa: {
    def: 'Komedija grubog, pretjeranog humora; smiješan, neozbiljan postupak.',
    pos: 'imenica, ž.',
  },
  šnala: {
    def: 'Kopča za kosu ili dijelove odjeće; ukosnica.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  izlaz: {
    def: 'Mjesto kroz koje se izlazi; rješenje iz teške situacije.',
    pos: 'imenica, m.',
  },
  jesen: { def: 'Godišnje doba između ljeta i zime.', pos: 'imenica, ž.' },
  metak: {
    def: 'Naboj za vatreno oružje: čahura, barut i zrno.',
    pos: 'imenica, m.',
  },
  anđeo: {
    def: 'Nebesko biće, Božiji glasnik u vjerovanjima; dobra, blaga osoba.',
    pos: 'imenica, m.',
  },
  ǉiǉan: {
    def: 'Ukrasna biljka krupnih, mirisnih, često bijelih cvjetova (Lilium).',
    pos: 'imenica, m.',
  },
  zapis: {
    def: 'Ono što je zapisano; bilješka ili zabilježen podatak.',
    pos: 'imenica, m.',
  },
  uvala: {
    def: 'Dio mora ili jezera uvučen u kopno; manji zaliv.',
    pos: 'imenica, ž.',
  },
  zubar: { def: 'Ljekar koji liječi zube; stomatolog.', pos: 'imenica, m.' },
  nepar: {
    def: 'Ono što nema svog para; neparan broj („par ili nepar”).',
    pos: 'imenica, m.',
  },
  pozor: {
    def: 'Uzvik kojim se upozorava ili traži pažnja, npr. na startu trke.',
    pos: 'uzvik',
  },
  major: {
    def: 'Oficirski čin između kapetana i potpukovnika.',
    pos: 'imenica, m.',
  },
  šlauf: {
    def: 'Gumeno crijevo za vodu; zračnica u gumi točka.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  okrug: {
    def: 'Upravno-teritorijalna jedinica unutar države; oblast.',
    pos: 'imenica, m.',
  },
  penal: {
    def: 'Kazneni udarac u fudbalu, jedanaesterac; ugovorna novčana kazna.',
    pos: 'imenica, m.',
  },
  // WORDS[450–499]
  danak: {
    def: 'Porez koji pokoreni narod plaća vladaru; cijena ili žrtva za nešto.',
    pos: 'imenica, m.',
  },
  psiha: { def: 'Duševni život čovjeka; um i osjećaji.', pos: 'imenica, ž.' },
  grupa: {
    def: 'Više osoba ili stvari koje čine cjelinu; skupina.',
    pos: 'imenica, ž.',
  },
  izrez: {
    def: 'Otvor na odjeći oko vrata; isječak iz novina.',
    pos: 'imenica, m.',
  },
  padež: {
    def: 'Oblik imenske riječi koji pokazuje njenu službu u rečenici.',
    pos: 'imenica, m.',
  },
  tuđin: {
    def: 'Osoba iz drugog kraja ili naroda; stranac.',
    pos: 'imenica, m.',
  },
  buǆet: {
    def: 'Plan prihoda i rashoda države, firme ili domaćinstva.',
    pos: 'imenica, m.',
  },
  reket: {
    def: 'Palica s napetom mrežom za tenis, badminton i sl.',
    pos: 'imenica, m.',
  },
  odaja: {
    def: 'Soba, prostorija, naročito u dvorcu ili palati.',
    pos: 'imenica, ž.',
  },
  sonar: {
    def: 'Uređaj koji zvučnim talasima otkriva predmete pod vodom.',
    pos: 'imenica, m.',
  },
  kalaj: {
    def: 'Mekani srebrnasti metal, kositar; hemijski element (Sn).',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  ispit: {
    def: 'Provjera znanja ili sposobnosti, u školi ili na fakultetu.',
    pos: 'imenica, m.',
  },
  ekser: {
    def: 'Metalni klin sa šiljkom i glavom koji se zabija čekićem.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  odron: {
    def: 'Masa zemlje i kamenja koja se obrušila niz padinu.',
    pos: 'imenica, m.',
  },
  sevap: {
    def: 'Dobro djelo koje po islamskom učenju donosi Božiju nagradu.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  vrhǌe: {
    def: 'Masni sloj koji se skuplja na površini mlijeka; pavlaka.',
    pos: 'imenica, s.',
  },
  nitna: {
    def: 'Metalni klin kojim se trajno spajaju limovi ili dijelovi; zakovica.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  kriza: {
    def: 'Teško, prelomno razdoblje; zastoj u privredi ili društvu.',
    pos: 'imenica, ž.',
  },
  letak: {
    def: 'List papira s kratkom porukom ili reklamom koji se dijeli.',
    pos: 'imenica, m.',
  },
  kvaka: {
    def: 'Ručka za otvaranje vrata; skrivena začkoljica ili zamka.',
    pos: 'imenica, ž.',
  },
  peron: {
    def: 'Uzdignuta platforma uz kolosijek za ulazak u voz.',
    pos: 'imenica, m.',
  },
  višak: {
    def: 'Količina veća od potrebne ili predviđene.',
    pos: 'imenica, m.',
  },
  špaga: {
    def: 'Tanak konopac, kanap; raskorak nogu pod 180° u gimnastici.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  larva: {
    def: 'Mladi razvojni oblik insekta ili vodozemca; ličinka.',
    pos: 'imenica, ž.',
  },
  rival: {
    def: 'Onaj ko se s nekim takmiči za isti cilj; suparnik.',
    pos: 'imenica, m.',
  },
  saldo: {
    def: 'Razlika između uplata i isplata na računu; stanje računa.',
    pos: 'imenica, m.',
  },
  dodir: { def: 'Doticanje rukom ili tijelom; kontakt.', pos: 'imenica, m.' },
  lider: {
    def: 'Vođa stranke, grupe ili pokreta; prvoplasirani na tabeli.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  suton: {
    def: 'Doba dana kad sunce zalazi i pada mrak; sumrak.',
    pos: 'imenica, m.',
  },
  obala: {
    def: 'Kopneni pojas uz more, rijeku ili jezero.',
    pos: 'imenica, ž.',
  },
  tepih: {
    def: 'Debela, često šarena tkanina kojom se prekriva pod.',
    pos: 'imenica, m.',
  },
  utaja: {
    def: 'Nezakonito prikrivanje prihoda ili imovine, npr. utaja poreza.',
    pos: 'imenica, ž.',
  },
  udaja: { def: 'Stupanje djevojke ili žene u brak.', pos: 'imenica, ž.' },
  šahta: {
    def: 'Okno s poklopcem na ulici za pristup kanalizaciji ili instalacijama.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  tinta: {
    def: 'Obojena tekućina za pisanje ili štampanje; mastilo.',
    pos: 'imenica, ž.',
  },
  miraz: {
    def: 'Imovina koju nevjesta iz roditeljske kuće donosi u brak.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  orden: {
    def: 'Odlikovanje u obliku znaka koje se dodjeljuje za zasluge.',
    pos: 'imenica, m.',
  },
  vijak: {
    def: 'Metalni klin s navojem koji se uvrće; šaraf.',
    pos: 'imenica, m.',
  },
  pisac: {
    def: 'Autor književnih ili drugih djela; književnik.',
    pos: 'imenica, m.',
  },
  ubica: { def: 'Osoba koja je nekoga ubila.', pos: 'imenica, m.' },
  papir: {
    def: 'Tanak materijal od biljnih vlakana za pisanje, štampu i pakovanje.',
    pos: 'imenica, m.',
  },
  tašna: {
    def: 'Ženska ručna torba za lične sitnice.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  panel: {
    def: 'Ploča od drveta, metala i sl.; stručna rasprava pred publikom.',
    pos: 'imenica, m.',
  },
  smrad: { def: 'Neugodan, odvratan miris.', pos: 'imenica, m.' },
  seoba: {
    def: 'Preseljenje većeg broja ljudi ili životinja na drugo područje.',
    pos: 'imenica, ž.',
  },
  litar: {
    def: 'Mjerna jedinica za zapreminu, jednaka kubnom decimetru.',
    pos: 'imenica, m.',
  },
  roker: {
    def: 'Izvođač ili ljubitelj rok muzike.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  uzrok: {
    def: 'Ono što izaziva neku pojavu ili posljedicu.',
    pos: 'imenica, m.',
  },
  sabah: {
    def: 'Zora, rano jutro; prvi od pet dnevnih namaza.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  opeka: { def: 'Pečena glinena cigla za zidanje.', pos: 'imenica, ž.' },
  // WORDS[500–549]
  ajvar: {
    def: 'Namaz od pečenih paprika, često s patlidžanom.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  gepek: {
    def: 'Prostor u automobilu za prtljag; prtljažnik.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  stric: { def: 'Očev brat.', pos: 'imenica, m.' },
  panda: {
    def: 'Kineski medvjed crno-bijelog krzna koji se hrani bambusom.',
    pos: 'imenica, ž.',
  },
  psiho: {
    def: 'Psihopata, poremećena osoba; prvi dio složenica sa značenjem „duša”.',
    pos: 'imenica, m.',
    note: 'razgovorno',
  },
  poraz: { def: 'Gubitak u borbi, ratu ili takmičenju.', pos: 'imenica, m.' },
  pehar: {
    def: 'Ukrasna čaša na nozi; nagrada pobjedniku takmičenja.',
    pos: 'imenica, m.',
  },
  bijeg: {
    def: 'Brzo udaljavanje od opasnosti, potjere ili iz zatočeništva.',
    pos: 'imenica, m.',
  },
  krzno: {
    def: 'Koža životinje s gustom dlakom; odjeća od nje.',
    pos: 'imenica, s.',
  },
  nomad: {
    def: 'Pripadnik naroda bez stalnog boravišta koji se seli sa stadima.',
    pos: 'imenica, m.',
  },
  šofer: {
    def: 'Vozač automobila, naročito profesionalni.',
    pos: 'imenica, m.',
    note: 'galicizam',
  },
  visak: {
    def: 'Uteg na niti kojim se provjerava okomitost zida.',
    pos: 'imenica, m.',
  },
  oblak: {
    def: 'Nakupina sitnih vodenih kapljica ili kristalića leda na nebu.',
    pos: 'imenica, m.',
  },
  oluja: {
    def: 'Nevrijeme s jakim vjetrom, kišom i grmljavinom.',
    pos: 'imenica, ž.',
  },
  prase: { def: 'Mladunče svinje.', pos: 'imenica, s.' },
  jazuk: {
    def: 'Šteta, grijeh; uzvik žaljenja („Jazuk!”).',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  prdež: {
    def: 'Ispuštanje crijevnih gasova; prdac.',
    pos: 'imenica, m.',
    note: 'vulgarno',
  },
  baraž: {
    def: 'Dodatna utakmica ili takmičenje koje odlučuje o plasmanu ili opstanku.',
    pos: 'imenica, m.',
    note: 'galicizam',
  },
  spona: { def: 'Ono što nešto spaja ili povezuje; veza.', pos: 'imenica, ž.' },
  kamin: {
    def: 'Otvoreno ložište u zidu prostorije, s dimnjakom.',
    pos: 'imenica, m.',
  },
  pleća: {
    def: 'Ramena i gornji dio leđa („nositi na svojim plećima”).',
    pos: 'imenica, s. (mn.)',
  },
  žlica: {
    def: 'Pribor za jelo s plitkim udubljenjem i drškom; kašika.',
    pos: 'imenica, ž.',
  },
  ponoć: { def: 'Dvanaesti sat noći; sredina noći.', pos: 'imenica, ž.' },
  tiraž: {
    def: 'Broj primjeraka u kojem se štampa knjiga, list ili časopis.',
    pos: 'imenica, m.',
  },
  šetǌa: {
    def: 'Lagano hodanje radi odmora ili razonode.',
    pos: 'imenica, ž.',
  },
  mamac: {
    def: 'Hrana kojom se namamljuju ribe ili životinje; ono što privlači.',
    pos: 'imenica, m.',
  },
  pasta: {
    def: 'Gusta, mazava smjesa (npr. za zube); italijanska tjestenina.',
    pos: 'imenica, ž.',
  },
  nalaz: {
    def: 'Ono što je pronađeno; rezultat ljekarskog pregleda ili analize.',
    pos: 'imenica, m.',
  },
  izraz: {
    def: 'Riječ ili skup riječi ustaljenog značenja; izgled lica.',
    pos: 'imenica, m.',
  },
  režim: {
    def: 'Oblik vladavine ili vlast u državi; propisan način života ili rada.',
    pos: 'imenica, m.',
  },
  bunda: { def: 'Topli kaput od krzna.', pos: 'imenica, ž.' },
  viola: {
    def: 'Gudački instrument nešto veći i dubljeg tona od violine.',
    pos: 'imenica, ž.',
  },
  petak: {
    def: 'Peti dan u sedmici, između četvrtka i subote.',
    pos: 'imenica, m.',
  },
  kahva: {
    def: 'Napitak od prženih i mljevenih zrna tropskog grma; ta zrna.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  behar: {
    def: 'Cvijet voćke; proljetni cvat voćaka.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  kreda: {
    def: 'Bijeli štapić za pisanje po tabli; meki bijeli krečnjak.',
    pos: 'imenica, ž.',
  },
  balet: {
    def: 'Scenska umjetnost u kojoj se priča izražava plesom i muzikom.',
    pos: 'imenica, m.',
  },
  vihor: { def: 'Snažan vjetar koji se kovitla; vrtlog.', pos: 'imenica, m.' },
  droǉa: {
    def: 'Žena lakog morala; neuredna, nečasna žena.',
    pos: 'imenica, ž.',
    note: 'pogrdno',
  },
  razum: {
    def: 'Sposobnost logičnog mišljenja i rasuđivanja; pamet.',
    pos: 'imenica, m.',
  },
  amiǆa: { def: 'Stric, očev brat.', pos: 'imenica, m.', note: 'turcizam' },
  dašak: {
    def: 'Lagan, jedva primjetan pokret zraka; mali trag nečega.',
    pos: 'imenica, m.',
  },
  jezik: {
    def: 'Mišićni organ u ustima; sistem riječi kojim se ljudi sporazumijevaju.',
    pos: 'imenica, m.',
  },
  limun: { def: 'Južno voće žute kore i kiselog soka.', pos: 'imenica, m.' },
  čapǉa: {
    def: 'Barska ptica dugih nogu, vrata i kljuna (Ardea).',
    pos: 'imenica, ž.',
  },
  komad: {
    def: 'Dio odvojen od cjeline; pojedinačan predmet.',
    pos: 'imenica, m.',
  },
  zrnce: {
    def: 'Malo zrno; sitna čestica nečega.',
    pos: 'imenica, s.',
    note: 'deminutiv',
  },
  domet: {
    def: 'Najveća udaljenost koju nešto može dosegnuti; doseg.',
    pos: 'imenica, m.',
  },
  helij: {
    def: 'Lagani plemeniti gas bez boje i mirisa, hemijski element (He).',
    pos: 'imenica, m.',
  },
  dabar: {
    def: 'Vodeni glodar širokog, plosnatog repa koji gradi brane (Castor).',
    pos: 'imenica, m.',
  },
  // WORDS[550–599]
  haker: {
    def: 'Osoba koja neovlašteno upada u računarske sisteme.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  večer: {
    def: 'Dio dana od zalaska sunca do noći; veče.',
    pos: 'imenica, ž.',
  },
  pojam: {
    def: 'Misaona predstava o bitnim osobinama nečega; zamisao.',
    pos: 'imenica, m.',
  },
  bosna: {
    def: 'Historijska zemlja i veći dio današnje BiH; rijeka, pritoka Save.',
    pos: 'imenica, ž.',
    note: 'vlastito ime',
  },
  metod: {
    def: 'Način ili postupak kojim se nešto radi ili istražuje; metoda.',
    pos: 'imenica, m.',
  },
  leǌir: {
    def: 'Pribor za povlačenje ravnih linija i mjerenje dužine.',
    pos: 'imenica, m.',
  },
  kobra: {
    def: 'Otrovna zmija koja pri prijetnji širi kožu na vratu.',
    pos: 'imenica, ž.',
  },
  afera: {
    def: 'Skandal koji izaziva pažnju javnosti; ljubavna veza.',
    pos: 'imenica, ž.',
  },
  nazad: {
    def: 'U smjeru iza sebe ili prema polaznom mjestu; natrag.',
    pos: 'prilog',
  },
  cimer: {
    def: 'Osoba s kojom se dijeli soba ili stan.',
    pos: 'imenica, m.',
    note: 'germanizam, razgovorno',
  },
  vodič: {
    def: 'Osoba koja vodi i upoznaje druge s nekim mjestom; priručnik.',
    pos: 'imenica, m.',
  },
  zlato: {
    def: 'Dragocjeni sjajni žuti metal, hemijski element (Au).',
    pos: 'imenica, s.',
  },
  sokak: {
    def: 'Uska ulica, naročito u starom dijelu grada ili mahali.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  oltar: {
    def: 'Posvećeno mjesto u hramu za bogosluženje ili prinošenje žrtve.',
    pos: 'imenica, m.',
  },
  kupka: {
    def: 'Kupanje, naročito u kadi; voda pripremljena za kupanje.',
    pos: 'imenica, ž.',
  },
  djelo: {
    def: 'Ono što je neko učinio; ostvarenje umjetnika ili naučnika.',
    pos: 'imenica, s.',
  },
  hiǆab: {
    def: 'Marama ili pokrivalo kojim muslimanke pokrivaju kosu.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  bruka: { def: 'Velika sramota, javno poniženje.', pos: 'imenica, ž.' },
  ćufte: {
    def: 'Okruglice od mljevenog mesa, često kuhane u sosu.',
    pos: 'imenica, ž. (mn.)',
    note: 'turcizam',
  },
  safir: { def: 'Plavi dragi kamen velike tvrdoće.', pos: 'imenica, m.' },
  đuveč: {
    def: 'Zapečeno jelo od mesa, povrća i riže; zemljana posuda za njega.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  ivica: {
    def: 'Krajnji dio neke površine ili predmeta; rub.',
    pos: 'imenica, ž.',
  },
  fetva: {
    def: 'Pravno mišljenje muftije o nekom vjerskom pitanju u islamu.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  mamba: {
    def: 'Vrlo otrovna, brza afrička zmija (Dendroaspis).',
    pos: 'imenica, ž.',
  },
  levha: {
    def: 'Uramljen, krasopisom ispisan citat iz Kur’ana koji visi kao ukras.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  flaša: {
    def: 'Staklena ili plastična posuda uskog grla za tekućinu; boca.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  alčak: {
    def: 'Obješenjak, vragolan; nevaljao, podao čovjek.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  daska: { def: 'Ravan, tanak komad otpiljenog drveta.', pos: 'imenica, ž.' },
  varka: {
    def: 'Obmana, prevara; pogrešan utisak čula (optička varka).',
    pos: 'imenica, ž.',
  },
  vodik: {
    def: 'Najlakši hemijski element, gas bez boje i mirisa (H).',
    pos: 'imenica, m.',
  },
  proba: {
    def: 'Pokušaj ili provjera; uvježbavanje prije javnog izvođenja.',
    pos: 'imenica, ž.',
  },
  nered: { def: 'Stanje bez reda i poretka; zbrka, haos.', pos: 'imenica, m.' },
  iskaz: {
    def: 'Ono što neko izjavi, naročito pred sudom ili policijom; izjava.',
    pos: 'imenica, m.',
  },
  metro: {
    def: 'Gradska podzemna željeznica za brzi prevoz putnika.',
    pos: 'imenica, m.',
  },
  kiosk: {
    def: 'Mali ulični objekat za prodaju novina, cigareta i sitnica.',
    pos: 'imenica, m.',
  },
  insan: {
    def: 'Čovjek, ljudsko biće; čestit, dobar čovjek.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  djeca: {
    def: 'Mladi ljudi koji još nisu odrasli; nečiji sinovi i kćeri.',
    pos: 'imenica, ž. (zbirno)',
  },
  uloga: {
    def: 'Lik koji glumac tumači; zadatak ili funkcija u nečemu.',
    pos: 'imenica, ž.',
  },
  horda: {
    def: 'Neorganizovana, divlja gomila ljudi; nomadska ratnička skupina.',
    pos: 'imenica, ž.',
  },
  sirće: {
    def: 'Kisela tekućina za začinjavanje i konzervisanje hrane; ocat.',
    pos: 'imenica, s.',
    note: 'turcizam',
  },
  kopno: {
    def: 'Dio Zemljine površine koji nije prekriven vodom.',
    pos: 'imenica, s.',
  },
  sarma: {
    def: 'Jelo od mljevenog mesa i riže umotanih u kiseli kupus ili lišće.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  balon: {
    def: 'Gumena opna napunjena zrakom ili gasom; letjelica na topli zrak.',
    pos: 'imenica, m.',
  },
  savez: {
    def: 'Udruženje radi zajedničkog cilja; sporazum ili zajednica država.',
    pos: 'imenica, m.',
  },
  aleja: {
    def: 'Put ili ulica s drvoredom s obje strane.',
    pos: 'imenica, ž.',
  },
  snaha: { def: 'Sinovljeva žena; i bratova žena.', pos: 'imenica, ž.' },
  trska: {
    def: 'Visoka močvarna biljka šuplje, čvrste stabljike (Phragmites).',
    pos: 'imenica, ž.',
  },
  teret: {
    def: 'Ono što se nosi ili prevozi; ono što opterećuje, breme.',
    pos: 'imenica, m.',
  },
  puǌač: {
    def: 'Uređaj za punjenje baterija, npr. mobitela ili laptopa.',
    pos: 'imenica, m.',
  },
  // WORDS[600–649]
  stvor: { def: 'Živo biće; stvorenje.', pos: 'imenica, m.' },
  kifla: {
    def: 'Pecivo u obliku polumjeseca ili savijenog roga.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  sanke: {
    def: 'Vozilo na klizačima za vožnju i spuštanje po snijegu.',
    pos: 'imenica, ž. (mn.)',
  },
  vekna: {
    def: 'Hljeb duguljastog oblika; štruca.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  talas: {
    def: 'Val na površini vode; nagli nalet ili porast (talas vrućine).',
    pos: 'imenica, m.',
  },
  obris: {
    def: 'Vanjska linija koja ocrtava oblik nečega; kontura.',
    pos: 'imenica, m.',
  },
  klica: {
    def: 'Zametak iz kojeg se razvija nova biljka; mikrob, uzročnik bolesti.',
    pos: 'imenica, ž.',
  },
  trend: {
    def: 'Opći smjer razvoja ili kretanja; trenutna moda.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  začin: {
    def: 'Dodatak koji jelu daje poseban ukus i miris.',
    pos: 'imenica, m.',
  },
  menza: {
    def: 'Restoran za studente, đake ili radnike s jeftinim obrocima.',
    pos: 'imenica, ž.',
  },
  super: {
    def: 'Izvrstan, odličan; vrhunski.',
    pos: 'pridjev',
    note: 'razgovorno',
  },
  sprat: { def: 'Svaki od nivoa zgrade iznad prizemlja.', pos: 'imenica, m.' },
  skrob: {
    def: 'Bijeli ugljikohidrat u prahu iz krompira, kukuruza i žitarica.',
    pos: 'imenica, m.',
  },
  karta: {
    def: 'Ulaznica za prevoz ili priredbu; mapa; list iz špila za igru.',
    pos: 'imenica, ž.',
  },
  udica: {
    def: 'Savijena oštra metalna kuka za lovljenje ribe.',
    pos: 'imenica, ž.',
  },
  detaǉ: { def: 'Sitan dio cjeline; pojedinost.', pos: 'imenica, m.' },
  krpeǉ: {
    def: 'Sitni paukoliki nametnik koji se prisiše na kožu i siše krv.',
    pos: 'imenica, m.',
  },
  iftar: {
    def: 'Večernji obrok kojim se u ramazanu prekida dnevni post.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  čopor: {
    def: 'Skupina divljih životinja koje žive i love zajedno (vukova, pasa).',
    pos: 'imenica, m.',
  },
  bager: {
    def: 'Građevinska mašina za kopanje i utovar zemlje.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  špica: {
    def: 'Vrijeme najveće gužve u saobraćaju; najavni dio filma ili emisije.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  iskra: {
    def: 'Sitna užarena čestica koja odleti iz vatre; električno pražnjenje.',
    pos: 'imenica, ž.',
  },
  povik: { def: 'Glasan, iznenadan uzvik; krik.', pos: 'imenica, m.' },
  freza: {
    def: 'Mašina s rotirajućim noževima za rahljenje zemlje ili glodanje metala.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  sapun: {
    def: 'Sredstvo za pranje koje se s vodom pjeni.',
    pos: 'imenica, m.',
  },
  sadǌa: { def: 'Sađenje biljaka; ono što je zasađeno.', pos: 'imenica, ž.' },
  otrov: {
    def: 'Materija koja oštećuje organizam ili izaziva smrt.',
    pos: 'imenica, m.',
  },
  korak: {
    def: 'Pokret nogom pri hodanju; postupak ili mjera u nekom nizu.',
    pos: 'imenica, m.',
  },
  mrkva: {
    def: 'Povrće s narandžastim, slatkastim jestivim korijenom.',
    pos: 'imenica, ž.',
  },
  seǉak: {
    def: 'Stanovnik sela koji se bavi zemljoradnjom.',
    pos: 'imenica, m.',
  },
  točak: {
    def: 'Okrugli dio vozila ili mašine koji se okreće oko osovine.',
    pos: 'imenica, m.',
  },
  guska: {
    def: 'Krupna domaća ili divlja vodena ptica dugog vrata.',
    pos: 'imenica, ž.',
  },
  kolor: {
    def: 'Boja; prikaz u bojama, nasuprot crno-bijelom.',
    pos: 'imenica, m.',
    note: 'razgovorno',
  },
  pokop: { def: 'Polaganje umrlog u grob; sahrana, ukop.', pos: 'imenica, m.' },
  jarak: {
    def: 'Uski iskopani kanal uz put ili njivu za odvod vode.',
    pos: 'imenica, m.',
  },
  klupa: {
    def: 'Dugo sjedalo za više osoba; školski sto za učenike.',
    pos: 'imenica, ž.',
  },
  čizme: {
    def: 'Visoka obuća koja prekriva stopalo i potkoljenicu.',
    pos: 'imenica, ž. (mn.)',
  },
  lopov: { def: 'Osoba koja krade; kradljivac.', pos: 'imenica, m.' },
  uzica: { def: 'Tanak konopac ili vrpca za vezivanje.', pos: 'imenica, ž.' },
  hašiš: {
    def: 'Opojna droga od smole indijske konoplje.',
    pos: 'imenica, m.',
  },
  sisar: {
    def: 'Kičmenjak čije ženke mladunčad hrane mlijekom.',
    pos: 'imenica, m.',
  },
  sabǉa: {
    def: 'Hladno oružje s dugim, zakrivljenim sječivom.',
    pos: 'imenica, ž.',
  },
  sonet: {
    def: 'Pjesma od četrnaest stihova: dva katrena i dvije tercine.',
    pos: 'imenica, m.',
  },
  kipar: {
    def: 'Umjetnik koji izrađuje kipove i skulpture; vajar.',
    pos: 'imenica, m.',
  },
  oseka: {
    def: 'Periodično povlačenje i opadanje nivoa mora; suprotno od plime.',
    pos: 'imenica, ž.',
  },
  sukob: {
    def: 'Borba ili sudar suprotstavljenih strana, mišljenja ili interesa.',
    pos: 'imenica, m.',
  },
  žbuka: {
    def: 'Smjesa kreča, pijeska i vode za oblaganje zidova; malter.',
    pos: 'imenica, ž.',
  },
  taban: {
    def: 'Donja strana stopala kojom se staje na tlo.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  plato: {
    def: 'Ravna uzvišena površina, zaravan; uređen ravan prostor ispred zgrade.',
    pos: 'imenica, m.',
  },
  // WORDS[650–699]
  osuda: {
    def: 'Sudska odluka o krivici i kazni; oštro neodobravanje.',
    pos: 'imenica, ž.',
  },
  gluma: {
    def: 'Umjetnost tumačenja uloga na sceni ili filmu; pretvaranje.',
    pos: 'imenica, ž.',
  },
  imela: {
    def: 'Zimzelena biljka nametnik koja raste na granama drveća (Viscum).',
    pos: 'imenica, ž.',
  },
  pažǌa: {
    def: 'Usmjerenost misli i čula na nešto; briga, obzir prema nekome.',
    pos: 'imenica, ž.',
  },
  hotel: {
    def: 'Objekat koji gostima uz plaćanje nudi smještaj i usluge.',
    pos: 'imenica, m.',
  },
  viski: {
    def: 'Žestoko alkoholno piće od fermentisanih i destilisanih žitarica.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  vrata: {
    def: 'Pokretno krilo kojim se zatvara ulaz u prostoriju ili objekat.',
    pos: 'imenica, s. (mn.)',
  },
  žudǌa: { def: 'Snažna želja ili čežnja za nečim.', pos: 'imenica, ž.' },
  tačka: {
    def: 'Sitan okrugao znak; interpunkcijski znak na kraju rečenice.',
    pos: 'imenica, ž.',
  },
  pekar: {
    def: 'Zanatlija koji peče i prodaje hljeb i peciva.',
    pos: 'imenica, m.',
  },
  leglo: {
    def: 'Mjesto gdje se životinje legu; mladunčad iz istog okota.',
    pos: 'imenica, s.',
  },
  zavoj: {
    def: 'Traka gaze za previjanje rane; okuka na putu.',
    pos: 'imenica, m.',
  },
  poziv: {
    def: 'Pozivanje, npr. telefonom ili pismom; zanimanje, profesija.',
    pos: 'imenica, m.',
  },
  šakal: {
    def: 'Divlja zvijer srodna psu i vuku, često strvinar (Canis aureus).',
    pos: 'imenica, m.',
  },
  žohar: {
    def: 'Insekt pljosnatog tijela, štetočina u kućama; bubašvaba.',
    pos: 'imenica, m.',
  },
  turbe: {
    def: 'Natkrivena grobnica, mauzolej uglednog muslimana, često uz džamiju.',
    pos: 'imenica, s.',
    note: 'turcizam',
  },
  stopa: {
    def: 'Donji dio noge na kojem se stoji; udio ili mjera (kamatna stopa).',
    pos: 'imenica, ž.',
  },
  ječam: {
    def: 'Žitarica od koje se pravi slad, krupa i stočna hrana.',
    pos: 'imenica, m.',
  },
  klima: {
    def: 'Dugoročne vremenske prilike nekog područja; klima-uređaj.',
    pos: 'imenica, ž.',
  },
  karat: {
    def: 'Jedinica mase dragog kamenja; mjera čistoće zlata.',
    pos: 'imenica, m.',
  },
  barij: {
    def: 'Mekani, srebrnobijeli zemnoalkalni metal, hemijski element (Ba).',
    pos: 'imenica, m.',
  },
  dojam: { def: 'Utisak koji neko ili nešto ostavlja.', pos: 'imenica, m.' },
  smola: {
    def: 'Ljepljiva tekućina koju luče četinari i drugo drveće.',
    pos: 'imenica, ž.',
  },
  sječa: { def: 'Obaranje i rezanje drveća u šumi.', pos: 'imenica, ž.' },
  fraza: {
    def: 'Ustaljen skup riječi; prazna, otrcana izjava.',
    pos: 'imenica, ž.',
  },
  tunel: {
    def: 'Podzemni prolaz kroz brdo ili ispod vode, za saobraćaj.',
    pos: 'imenica, m.',
  },
  kvrga: { def: 'Izbočina na drvetu ili tijelu; čvoruga.', pos: 'imenica, ž.' },
  užina: { def: 'Lagani obrok između glavnih obroka.', pos: 'imenica, ž.' },
  dioda: {
    def: 'Elektronski element koji propušta struju samo u jednom smjeru.',
    pos: 'imenica, ž.',
  },
  metla: {
    def: 'Pribor od snopa pruća ili vlakana na dršci za metenje.',
    pos: 'imenica, ž.',
  },
  robot: {
    def: 'Mašina koja samostalno obavlja poslove umjesto čovjeka.',
    pos: 'imenica, m.',
  },
  ibret: {
    def: 'Pouka, primjer drugima za opomenu; čudo za gledanje.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  srǆba: { def: 'Jaka ljutnja; bijes, gnjev.', pos: 'imenica, ž.' },
  sunet: {
    def: 'Obrezivanje muške djece kod muslimana; Poslanikova praksa (sunnet).',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  breza: {
    def: 'Listopadno drvo bijele kore i tankih grana (Betula).',
    pos: 'imenica, ž.',
  },
  mačka: {
    def: 'Domaća životinja mekog krzna koja lovi miševe.',
    pos: 'imenica, ž.',
  },
  ćošak: {
    def: 'Ugao prostorije, zgrade ili ulice.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  osvrt: {
    def: 'Kratak kritički prikaz ili razmatranje nečega.',
    pos: 'imenica, m.',
  },
  urlik: { def: 'Snažan, otegnut krik ili zavijanje.', pos: 'imenica, m.' },
  funta: {
    def: 'Novčana jedinica Velike Britanije; jedinica mase (oko 0,45 kg).',
    pos: 'imenica, ž.',
  },
  traka: {
    def: 'Dug, uzak komad tkanine, papira i sl.; dio ceste za jedan red vozila.',
    pos: 'imenica, ž.',
  },
  oklop: {
    def: 'Zaštitni metalni pokrov za tijelo ili vozilo; tvrda ljuska životinje.',
    pos: 'imenica, m.',
  },
  vosak: {
    def: 'Mekana, topljiva materija koju luče pčele; koristi se za svijeće.',
    pos: 'imenica, m.',
  },
  šerbe: {
    def: 'Šećerni sirup za zalijevanje kolača; slatko osvježavajuće piće.',
    pos: 'imenica, s.',
    note: 'turcizam',
  },
  ploča: {
    def: 'Ravan, tanak komad tvrdog materijala; gramofonski nosač zvuka.',
    pos: 'imenica, ž.',
  },
  klaun: {
    def: 'Cirkuski zabavljač šarenog kostima i našminkanog lica.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  aneks: {
    def: 'Dodatak ugovoru ili dokumentu; dograđeni dio zgrade.',
    pos: 'imenica, m.',
  },
  usjev: { def: 'Biljke posijane i uzgajane na njivi.', pos: 'imenica, m.' },
  tkivo: {
    def: 'Skup ćelija istog porijekla i funkcije u organizmu.',
    pos: 'imenica, s.',
  },
  hutba: {
    def: 'Propovijed koju imam drži u džamiji petkom i za bajram.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  // WORDS[700–749]
  duhan: {
    def: 'Biljka (Nicotiana) čiji se osušeni i prerađeni listovi puše.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  ništa: { def: 'Nijedna stvar; nimalo.', pos: 'zamjenica' },
  vrpca: {
    def: 'Uska traka od tkanine, papira i sl.; traka za snimanje.',
    pos: 'imenica, ž.',
  },
  kofer: {
    def: 'Torba tvrdih stranica s ručkom za stvari na putovanju.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  kefir: {
    def: 'Gust, kiselkast napitak od fermentisanog mlijeka.',
    pos: 'imenica, m.',
  },
  jahač: { def: 'Onaj ko jaše konja.', pos: 'imenica, m.' },
  bibac: {
    def: 'Mužjak ćurke; ćuran.',
    pos: 'imenica, m.',
    note: 'regionalizam',
  },
  ispad: {
    def: 'Neprimjereno, grubo ponašanje; nagli prekid rada (npr. struje).',
    pos: 'imenica, m.',
  },
  kokoš: {
    def: 'Domaća ptica koja se uzgaja zbog jaja i mesa.',
    pos: 'imenica, ž.',
  },
  regal: {
    def: 'Komad namještaja s policama i ormarićima uz zid.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  aloja: {
    def: 'Sukulentna biljka mesnatog lišća s ljekovitim sokom (Aloe).',
    pos: 'imenica, ž.',
  },
  kutak: {
    def: 'Mali, skroviti ugao; zaklonjeno, ugodno mjesto.',
    pos: 'imenica, m.',
    note: 'deminutiv',
  },
  žilet: { def: 'Tanka čelična oštrica za brijanje.', pos: 'imenica, m.' },
  banda: {
    def: 'Skupina razbojnika ili kriminalaca; družina nevaljalaca.',
    pos: 'imenica, ž.',
  },
  kulen: {
    def: 'Suha kobasica od svinjskog mesa začinjena ljutom paprikom.',
    pos: 'imenica, m.',
  },
  sofra: {
    def: 'Niska okrugla trpeza za kojom se jede sjedeći na podu.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  jasen: {
    def: 'Listopadno drvo tvrdog i elastičnog drveta (Fraxinus).',
    pos: 'imenica, m.',
  },
  bazen: {
    def: 'Ozidano udubljenje s vodom za plivanje; slivno područje rijeke.',
    pos: 'imenica, m.',
  },
  unuče: { def: 'Dijete nečijeg sina ili kćeri.', pos: 'imenica, s.' },
  krsta: {
    def: 'Donji dio leđa, gdje se kičma spaja s karlicom.',
    pos: 'imenica, ž. (mn.)',
  },
  hrvač: {
    def: 'Sportista koji u borbi nastoji oboriti protivnika na leđa.',
    pos: 'imenica, m.',
  },
  hurma: {
    def: 'Slatki, mesnati plod pustinjske palme (Phoenix dactylifera).',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  anoda: {
    def: 'Elektroda na kojoj se odvija oksidacija; suprotnost katodi.',
    pos: 'imenica, m.',
  },
  šaraf: {
    def: 'Vijak; metalni klin s navojem kojim se spajaju dijelovi.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  serum: {
    def: 'Bistri tekući dio krvi; ljekoviti pripravak s antitijelima.',
    pos: 'imenica, m.',
  },
  kalij: {
    def: 'Meki, srebrnasti alkalni metal, hemijski element (K).',
    pos: 'imenica, m.',
  },
  iskop: {
    def: 'Kopanje zemlje; jama ili mjesto nastalo kopanjem.',
    pos: 'imenica, m.',
  },
  nošǌa: {
    def: 'Odjeća karakteristična za neki narod, kraj ili doba.',
    pos: 'imenica, ž.',
  },
  lahor: { def: 'Lagan, ugodan vjetar; povjetarac.', pos: 'imenica, m.' },
  sfera: {
    def: 'Kugla; područje djelovanja ili interesa (npr. privatna sfera).',
    pos: 'imenica, ž.',
  },
  gamad: {
    def: 'Sitne štetne životinje, npr. uši i buhe; pogrdno i o ljudima.',
    pos: 'imenica, ž. (zbirno)',
  },
  futur: {
    def: 'Glagolsko vrijeme kojim se izriče buduća radnja.',
    pos: 'imenica, m.',
  },
  pedaǉ: {
    def: 'Poluga koja se pokreće nogom, npr. na biciklu ili u autu.',
    pos: 'imenica, m.',
  },
  grudi: {
    def: 'Prednji dio tijela između vrata i trbuha; prsa.',
    pos: 'imenica, ž. (mn.)',
  },
  brada: {
    def: 'Donji, isturen dio lica; dlake koje muškarcu rastu na licu.',
    pos: 'imenica, ž.',
  },
  zakup: {
    def: 'Uzimanje nečega na korištenje uz plaćanje; najam.',
    pos: 'imenica, m.',
  },
  pǉeva: {
    def: 'Ljuske i otpaci koji ostaju pri vršidbi žita.',
    pos: 'imenica, ž.',
  },
  surla: { def: 'Dugi, savitljivi nos slona.', pos: 'imenica, ž.' },
  kocka: {
    def: 'Tijelo sa šest jednakih kvadratnih strana; kockica za igru.',
    pos: 'imenica, ž.',
  },
  vijek: {
    def: 'Razdoblje od sto godina, stoljeće; trajanje života.',
    pos: 'imenica, m.',
  },
  rizik: {
    def: 'Mogućnost gubitka ili štete; opasnost na koju se pristaje.',
    pos: 'imenica, m.',
  },
  irvas: {
    def: 'Sjeverni jelen koji živi u arktičkim krajevima (Rangifer).',
    pos: 'imenica, m.',
  },
  menta: {
    def: 'Mirisna biljka osvježavajućeg ukusa; nana (Mentha).',
    pos: 'imenica, ž.',
  },
  mreža: {
    def: 'Pletivo od konca ili užeta s okcima; sistem povezanih dijelova.',
    pos: 'imenica, ž.',
  },
  mlada: { def: 'Djevojka na dan vjenčanja; nevjesta.', pos: 'imenica, ž.' },
  forma: {
    def: 'Oblik ili vanjski izgled nečega; tjelesna spremnost (biti u formi).',
    pos: 'imenica, ž.',
  },
  rolka: {
    def: 'Džemper ili majica s visokim, podvrnutim okovratnikom.',
    pos: 'imenica, ž.',
    note: 'razgovorno',
  },
  skica: {
    def: 'Brz, nedovršen crtež; prvi, grubi nacrt nečega.',
    pos: 'imenica, ž.',
  },
  kolač: {
    def: 'Slatko pečeno tijesto, često s filom ili kremom.',
    pos: 'imenica, m.',
  },
  // WORDS[750–799]
  krčma: {
    def: 'Jednostavna gostionica u kojoj se toči piće; birtija.',
    pos: 'imenica, ž.',
  },
  bajka: {
    def: 'Priča s čudesnim, nestvarnim događajima i likovima.',
    pos: 'imenica, ž.',
  },
  miris: { def: 'Ono što se osjeti čulom njuha.', pos: 'imenica, m.' },
  nanos: {
    def: 'Ono što nanese voda ili vjetar (pijesak, mulj, snijeg).',
    pos: 'imenica, m.',
  },
  zanos: {
    def: 'Stanje oduševljenja i ushićenja; ekstaza.',
    pos: 'imenica, m.',
  },
  akril: {
    def: 'Sintetički materijal od kojeg se prave vlakna, boje i plastika.',
    pos: 'imenica, m.',
  },
  igrač: { def: 'Osoba koja učestvuje u igri ili sportu.', pos: 'imenica, m.' },
  štuka: {
    def: 'Grabljiva slatkovodna riba izduženog tijela (Esox).',
    pos: 'imenica, ž.',
  },
  čučaǌ: {
    def: 'Položaj ili vježba sa savijenim koljenima i spuštenim tijelom.',
    pos: 'imenica, m.',
  },
  obiǉe: { def: 'Velika količina nečega; izobilje.', pos: 'imenica, s.' },
  volan: {
    def: 'Kolo kojim se upravlja vozilom; nabrani ukrasni porub na odjeći.',
    pos: 'imenica, m.',
  },
  ćurka: {
    def: 'Krupna domaća ptica, ženka ćurana (Meleagris).',
    pos: 'imenica, ž.',
  },
  okean: {
    def: 'Ogromna slana vodena površina između kontinenata.',
    pos: 'imenica, m.',
  },
  bonus: {
    def: 'Dodatak na redovnu platu ili nagradu; dodatna korist.',
    pos: 'imenica, m.',
  },
  kotač: {
    def: 'Okrugli dio koji se okreće oko osovine; točak.',
    pos: 'imenica, m.',
  },
  naboj: {
    def: 'Količina elektriciteta u nekom tijelu; unutrašnja napetost.',
    pos: 'imenica, m.',
  },
  dolma: {
    def: 'Povrće ili lišće punjeno mljevenim mesom i rižom.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  zgoda: {
    def: 'Zanimljiv ili neobičan događaj; pogodna prilika.',
    pos: 'imenica, ž.',
  },
  izmet: {
    def: 'Izbačeni ostaci probavljene hrane; fekalije.',
    pos: 'imenica, m.',
  },
  čičak: {
    def: 'Korovska biljka bodljikavih glavica koje se kače za odjeću (Arctium).',
    pos: 'imenica, m.',
  },
  sloga: {
    def: 'Jedinstvo i slaganje među ljudima; složnost.',
    pos: 'imenica, ž.',
  },
  zaova: {
    def: 'Muževa sestra, u odnosu na njegovu ženu.',
    pos: 'imenica, ž.',
  },
  bizon: {
    def: 'Krupno divlje govedo s grbom i gustim krznom.',
    pos: 'imenica, m.',
  },
  splet: {
    def: 'Isprepleten skup nečega; povezanost okolnosti (splet okolnosti).',
    pos: 'imenica, m.',
  },
  voćar: { def: 'Osoba koja uzgaja ili prodaje voće.', pos: 'imenica, m.' },
  odjel: {
    def: 'Dio ustanove, preduzeća ili prodavnice s posebnim zadatkom.',
    pos: 'imenica, m.',
  },
  skuša: {
    def: 'Morska riba plavkastih šara na leđima (Scomber).',
    pos: 'imenica, ž.',
  },
  sumǌa: {
    def: 'Nedostatak uvjerenosti; nepovjerenje prema nečemu ili nekome.',
    pos: 'imenica, ž.',
  },
  pepeo: { def: 'Sivi prah koji ostaje nakon gorenja.', pos: 'imenica, m.' },
  tumač: {
    def: 'Onaj ko objašnjava ili prevodi; prevodilac.',
    pos: 'imenica, m.',
  },
  posao: { def: 'Rad kojim se neko bavi; zaposlenje.', pos: 'imenica, m.' },
  neman: { def: 'Strašno, ogromno čudovište; zvijer.', pos: 'imenica, ž.' },
  komet: {
    def: 'Nebesko tijelo sa svijetlim repom koje kruži oko Sunca.',
    pos: 'imenica, m.',
  },
  kanap: {
    def: 'Tanko uže od upletenih vlakana; konopac.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  organ: {
    def: 'Dio tijela s određenom funkcijom; tijelo vlasti ili ustanove.',
    pos: 'imenica, m.',
  },
  šunka: {
    def: 'Usoljeno, sušeno ili kuhano meso od buta.',
    pos: 'imenica, ž.',
  },
  česma: {
    def: 'Javni izvor ili slavina s tekućom vodom.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  uhǉeb: {
    def: 'Osoba zaposlena po vezi, obično u javnoj službi, koja malo radi.',
    pos: 'imenica, m.',
    note: 'žargon, pogrdno',
  },
  start: {
    def: 'Početak trke ili takmičenja; polazak.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  zanat: {
    def: 'Zanimanje zasnovano na ručnom radu i vještini.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  tigaǌ: {
    def: 'Plitka posuda s drškom za prženje; tava.',
    pos: 'imenica, m.',
    note: 'regionalizam',
  },
  vrtić: {
    def: 'Ustanova za čuvanje i odgoj djece predškolskog uzrasta.',
    pos: 'imenica, m.',
  },
  ležaj: {
    def: 'Mjesto za spavanje ili ležanje; dio mašine u kojem se okreće osovina.',
    pos: 'imenica, m.',
  },
  kopǉe: {
    def: 'Oružje s dugom drškom i oštrim šiljkom; atletska sprava za bacanje.',
    pos: 'imenica, s.',
  },
  doček: {
    def: 'Svečano dočekivanje nekoga; proslava dolaska Nove godine.',
    pos: 'imenica, m.',
  },
  nemir: {
    def: 'Stanje uznemirenosti; nered i neslaganje (nemiri).',
    pos: 'imenica, m.',
  },
  arhiv: {
    def: 'Ustanova ili zbirka u kojoj se čuvaju stari dokumenti.',
    pos: 'imenica, m.',
  },
  majka: { def: 'Žena u odnosu na svoju djecu; mati.', pos: 'imenica, ž.' },
  oslić: {
    def: 'Morska riba bijelog mesa, srodna bakalaru (Merluccius).',
    pos: 'imenica, m.',
  },
  namet: {
    def: 'Obavezno davanje državi ili vlasti; porez, taksa.',
    pos: 'imenica, m.',
  },
  // WORDS[800–849]
  ikona: {
    def: 'Slika svetaca na drvetu; sličica na ekranu računara.',
    pos: 'imenica, ž.',
  },
  šutǌa: { def: 'Stanje kad se ne govori; tišina.', pos: 'imenica, ž.' },
  labud: { def: 'Velika bijela vodena ptica duga vrata.', pos: 'imenica, m.' },
  ručak: { def: 'Glavni dnevni obrok, obično oko podne.', pos: 'imenica, m.' },
  krmeǉ: { def: 'Sasušena izlučina u uglovima očiju.', pos: 'imenica, m.' },
  mašna: {
    def: 'Ukrasni čvor od trake s dvije petlje; leptir-mašna.',
    pos: 'imenica, ž.',
  },
  horor: {
    def: 'Žanr filma ili knjige koji izaziva strah; užas.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  dioba: { def: 'Dijeljenje nečega na dijelove; podjela.', pos: 'imenica, ž.' },
  kliše: {
    def: 'Otrcan, stalno ponavljan izraz ili postupak; šablon.',
    pos: 'imenica, m.',
  },
  ćilim: {
    def: 'Tkani vuneni prostirač s ukrasnim šarama.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  ideja: { def: 'Zamisao ili misao o nečemu; plan.', pos: 'imenica, ž.' },
  votka: {
    def: 'Jako bezbojno alkoholno piće, porijeklom iz istočne Evrope.',
    pos: 'imenica, ž.',
  },
  čemer: { def: 'Jaka gorčina; duboka tuga i jad.', pos: 'imenica, m.' },
  bakǉa: {
    def: 'Goruća svjetiljka na štapu koja se nosi u ruci.',
    pos: 'imenica, ž.',
  },
  lanac: {
    def: 'Niz metalnih karika spojenih jedna u drugu.',
    pos: 'imenica, m.',
  },
  okolo: { def: 'Sa svih strana, unaokolo; zaobilaznim putem.', pos: 'prilog' },
  nužda: {
    def: 'Prijeka potreba ili neizbježnost; teško stanje oskudice.',
    pos: 'imenica, ž.',
  },
  pravo: {
    def: 'Ono što nekome pripada po zakonu ili pravdi; nauka o zakonima.',
    pos: 'imenica, s.',
  },
  rever: {
    def: 'Prevrnuti dio prednje strane sakoa ili kaputa uz okovratnik.',
    pos: 'imenica, m.',
  },
  punđa: {
    def: 'Kosa skupljena i uvijena u čvor na potiljku ili tjemenu.',
    pos: 'imenica, ž.',
    note: 'hungarizam',
  },
  kušǌa: {
    def: 'Iskušenje; teška provjera nečije snage, volje ili vjere.',
    pos: 'imenica, ž.',
  },
  ruter: {
    def: 'Mrežni uređaj koji usmjerava podatke, npr. za internet.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  smoki: {
    def: 'Hrskave kukuruzne grickalice s ukusom kikirikija, po robnoj marci.',
    pos: 'imenica, m.',
    note: 'razgovorno',
  },
  pokoǉ: {
    def: 'Masovno, okrutno ubijanje ljudi ili životinja; masakr.',
    pos: 'imenica, m.',
  },
  imaǌe: {
    def: 'Ukupnost nečijih dobara; posjed sa zemljom i kućom.',
    pos: 'imenica, s.',
  },
  tajga: {
    def: 'Prostrana crnogorična šuma sjevernih krajeva Evrope, Azije i Amerike.',
    pos: 'imenica, ž.',
  },
  vagon: {
    def: 'Željeznička kola za prevoz putnika ili tereta.',
    pos: 'imenica, m.',
  },
  plata: {
    def: 'Novac koji radnik redovno prima za svoj rad.',
    pos: 'imenica, ž.',
  },
  griva: { def: 'Duga dlaka na vratu konja ili lava.', pos: 'imenica, ž.' },
  trzaj: { def: 'Nagli, kratki pokret; trzanje.', pos: 'imenica, m.' },
  paket: {
    def: 'Zamotana pošiljka ili roba; skup stvari koje idu zajedno.',
    pos: 'imenica, m.',
  },
  fitiǉ: {
    def: 'Upredeni konac koji gori u svijeći ili lampi; vrpca za paljenje eksploziva.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  mulat: {
    def: 'Osoba čiji je jedan roditelj bijelac, a drugi crnac.',
    pos: 'imenica, m.',
    note: 'zastarjelo',
  },
  drška: { def: 'Dio predmeta za koji se on drži rukom.', pos: 'imenica, ž.' },
  trasa: {
    def: 'Utvrđeni pravac kojim prolazi put, pruga ili cjevovod.',
    pos: 'imenica, ž.',
  },
  radar: {
    def: 'Uređaj koji pomoću radio-talasa otkriva udaljene predmete.',
    pos: 'imenica, m.',
  },
  zekat: {
    def: 'Obavezni dio imetka koji musliman godišnje daje siromašnima.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  saten: {
    def: 'Glatka, sjajna tkanina od svile ili sintetike.',
    pos: 'imenica, m.',
  },
  klasa: {
    def: 'Skupina istog ranga ili vrste; društveni sloj.',
    pos: 'imenica, ž.',
  },
  vjera: {
    def: 'Vjerovanje u Boga ili više sile; povjerenje u nekoga.',
    pos: 'imenica, ž.',
  },
  rašǉe: {
    def: 'Račvasta grana ili štap u obliku slova Y.',
    pos: 'imenica, ž. (mn.)',
  },
  jakna: {
    def: 'Kraći gornji kaput, obično s patentnim zatvaračem.',
    pos: 'imenica, ž.',
  },
  iznos: { def: 'Ukupna količina novca; svota.', pos: 'imenica, m.' },
  čavka: {
    def: 'Manja crna ptica iz porodice vrana, sivog potiljka.',
    pos: 'imenica, ž.',
  },
  sabur: {
    def: 'Strpljenje; mirno podnošenje nevolje.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  humor: {
    def: 'Sposobnost uočavanja i izražavanja smiješnog; šala.',
    pos: 'imenica, m.',
  },
  galeb: {
    def: 'Morska ptica bijelo-sivog perja i dugih krila.',
    pos: 'imenica, m.',
  },
  žaoka: {
    def: 'Šiljati organ pčela, osa i škorpija kojim ubadaju.',
    pos: 'imenica, ž.',
  },
  crkva: { def: 'Kršćanski hram; zajednica vjernika.', pos: 'imenica, ž.' },
  // WORDS[850–899]
  halka: {
    def: 'Metalni prsten ili karika; alka na vratima.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  perad: {
    def: 'Domaće ptice koje se uzgajaju (kokoši, patke, guske).',
    pos: 'imenica, ž. (zbirno)',
  },
  buǆak: {
    def: 'Skriveni ugao ili zakutak; zabačeno mjesto.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  tabla: {
    def: 'Ploča za pisanje u učionici; ploča s natpisom.',
    pos: 'imenica, ž.',
  },
  truba: {
    def: 'Limeni duvački instrument jakog, zvonkog zvuka.',
    pos: 'imenica, ž.',
  },
  čizma: {
    def: 'Visoka obuća koja pokriva i dio noge iznad gležnja.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  horoz: {
    def: 'Pijetao; okidač na pušci.',
    pos: 'imenica, m.',
    note: 'turcizam, regionalizam',
  },
  haber: {
    def: 'Vijest ili glas o nečemu („nemam habera”).',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  kreon: {
    def: 'Mekana olovka ili štapić u boji za crtanje; bojica.',
    pos: 'imenica, m.',
    note: 'razgovorno',
  },
  žabac: { def: 'Mužjak žabe.', pos: 'imenica, m.' },
  mango: {
    def: 'Tropsko drvo i njegov sočni, slatki žuto-narandžasti plod.',
    pos: 'imenica, m.',
  },
  ćumez: {
    def: 'Kokošinjac; trošna, mala kuća ili soba.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  utrka: { def: 'Takmičenje u brzini; trka.', pos: 'imenica, ž.' },
  tigar: {
    def: 'Velika azijska zvijer iz porodice mačaka, prugastog krzna.',
    pos: 'imenica, m.',
  },
  petǉa: {
    def: 'Omča ili zavoj na koncu ili užetu; zatvorena kružna putanja.',
    pos: 'imenica, ž.',
  },
  remen: {
    def: 'Traka od kože ili sličnog materijala; kaiš.',
    pos: 'imenica, m.',
  },
  pored: {
    def: 'Uz nešto, kraj nečega; osim toga (pored toga).',
    pos: 'prijedlog',
  },
  rudar: {
    def: 'Radnik koji vadi rudu ili ugalj iz rudnika.',
    pos: 'imenica, m.',
  },
  ćevap: {
    def: 'Mali valjčić od mljevenog mesa pečen na roštilju.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  pogon: {
    def: 'Ono što pokreće mašinu; dio fabrike u kojem se proizvodi.',
    pos: 'imenica, m.',
  },
  odjek: {
    def: 'Zvuk odbijen od prepreke koji se ponovo čuje; eho.',
    pos: 'imenica, m.',
  },
  nemoć: {
    def: 'Nedostatak snage ili mogućnosti da se nešto učini.',
    pos: 'imenica, ž.',
  },
  halva: {
    def: 'Slatkiš od brašna ili sezama, šećera ili meda i masla.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  jučer: { def: 'Na dan prije današnjeg.', pos: 'prilog' },
  voćka: {
    def: 'Drvo koje rađa voće; pojedinačni plod voća.',
    pos: 'imenica, ž.',
  },
  tenis: {
    def: 'Sport u kojem se reketima prebacuje loptica preko mreže.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  graǌe: {
    def: 'Odsječene ili otpale grane; mnoštvo grana.',
    pos: 'imenica, s. (zbirno)',
  },
  zijan: {
    def: 'Šteta, gubitak; ono što je uzalud propalo.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  gruda: {
    def: 'Zbijen komad snijega ili zemlje; grumen.',
    pos: 'imenica, ž.',
  },
  ponos: {
    def: 'Osjećaj vlastite vrijednosti; zadovoljstvo zbog postignuća.',
    pos: 'imenica, m.',
  },
  sukǌa: {
    def: 'Dio ženske odjeće koji visi od struka naniže.',
    pos: 'imenica, ž.',
  },
  domar: {
    def: 'Osoba koja se brine o održavanju zgrade, npr. škole.',
    pos: 'imenica, m.',
  },
  škola: {
    def: 'Ustanova u kojoj se izvodi nastava i stiče obrazovanje.',
    pos: 'imenica, ž.',
  },
  bačva: {
    def: 'Velika drvena posuda od dužica za vino ili rakiju; bure.',
    pos: 'imenica, ž.',
  },
  otkaz: { def: 'Raskid radnog odnosa ili ugovora.', pos: 'imenica, m.' },
  doseg: {
    def: 'Granica ili udaljenost do koje nešto seže; domet.',
    pos: 'imenica, m.',
  },
  ǉekar: { def: 'Osoba koja liječi bolesne; doktor.', pos: 'imenica, m.' },
  notar: {
    def: 'Pravnik ovlašten da sastavlja i ovjerava javne isprave i ugovore.',
    pos: 'imenica, m.',
  },
  poker: {
    def: 'Kartaška igra na sreću u kojoj se igra za uloge.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  podne: { def: 'Sredina dana, oko dvanaest sati.', pos: 'imenica, s.' },
  jutro: { def: 'Dio dana od svitanja do prijepodneva.', pos: 'imenica, s.' },
  fonem: {
    def: 'Najmanja glasovna jedinica koja razlikuje značenje riječi.',
    pos: 'imenica, m.',
  },
  košpa: {
    def: 'Tvrda sjemenka u sredini ploda; koštica.',
    pos: 'imenica, ž.',
    note: 'regionalizam',
  },
  sezam: {
    def: 'Biljka sitnih uljanih sjemenki koje se koriste u hrani.',
    pos: 'imenica, m.',
  },
  moral: {
    def: 'Skup načela o dobru i zlu; borbeni duh i raspoloženje.',
    pos: 'imenica, m.',
  },
  toner: {
    def: 'Prah u boji za laserske štampače i fotokopir aparate; kozmetička tekućina za lice.',
    pos: 'imenica, m.',
  },
  kopča: {
    def: 'Naprava za spajanje i pričvršćivanje dijelova odjeće, kaiša ili kose.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  pouka: {
    def: 'Poruka ili savjet koji se izvodi iz iskustva ili priče.',
    pos: 'imenica, ž.',
  },
  lijes: {
    def: 'Sanduk u koji se polaže umrli; mrtvački kovčeg.',
    pos: 'imenica, m.',
  },
  nišan: {
    def: 'Dio oružja za ciljanje; meta; muslimanski nadgrobni kamen.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  // WORDS[900–949]
  kafić: {
    def: 'Manji ugostiteljski objekat u kojem se služe kahva i pića.',
    pos: 'imenica, m.',
  },
  tipka: {
    def: 'Dio tastature ili uređaja koji se pritišće prstom.',
    pos: 'imenica, ž.',
  },
  češaǉ: {
    def: 'Pribor s nizom zubaca kojim se uređuje kosa.',
    pos: 'imenica, m.',
  },
  hatma: {
    def: "Učenje cijelog Kur'ana; dova koja se uči na njegovom završetku.",
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  okuka: { def: 'Zavoj ili krivina na putu ili rijeci.', pos: 'imenica, ž.' },
  sauna: {
    def: 'Prostorija s vrlo vrućim zrakom ili parom za znojenje.',
    pos: 'imenica, ž.',
  },
  batak: {
    def: 'Donji dio noge peradi, naročito kao jelo.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  pilav: {
    def: 'Jelo od gusto kuhane riže, često s mesom.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  cista: {
    def: 'Šupljina u tkivu ispunjena tekućinom i obavijena opnom.',
    pos: 'imenica, ž.',
  },
  ormar: {
    def: 'Komad namještaja s vratima i policama za odjeću i stvari.',
    pos: 'imenica, m.',
  },
  bazar: {
    def: 'Istočnjačka pijaca s radnjama; prodaja raznovrsne, često dobrotvorne robe.',
    pos: 'imenica, m.',
  },
  čepić: {
    def: 'Mali čep; lijek u obliku čepa koji se uvodi u tijelo.',
    pos: 'imenica, m.',
    note: 'deminutiv',
  },
  polen: {
    def: 'Sitni prah s prašnika cvijeta koji služi za oprašivanje.',
    pos: 'imenica, m.',
  },
  rafal: {
    def: 'Brza uzastopna paljba iz automatskog oružja; nagli udar vjetra.',
    pos: 'imenica, m.',
  },
  pacov: {
    def: 'Krupan glodar dugog repa, veći od miša (Rattus).',
    pos: 'imenica, m.',
  },
  smjer: {
    def: 'Pravac kretanja; usmjerenje u školovanju ili djelovanju.',
    pos: 'imenica, m.',
  },
  tarup: {
    def: 'Traktorski priključak koji usitnjava stabljike, travu i biljne ostatke.',
    pos: 'imenica, m.',
    note: 'žargon',
  },
  ǆoker: {
    def: 'Karta koja može zamijeniti bilo koju drugu; skriveni adut.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  jaran: {
    def: 'Prijatelj, drug.',
    pos: 'imenica, m.',
    note: 'turcizam, razgovorno',
  },
  narav: {
    def: 'Urođena ćud i karakter čovjeka; priroda.',
    pos: 'imenica, ž.',
  },
  sekta: {
    def: 'Zatvorena vjerska ili ideološka skupina odvojena od glavne zajednice.',
    pos: 'imenica, ž.',
  },
  fokus: {
    def: 'Središte pažnje ili zanimanja; žarište sočiva.',
    pos: 'imenica, m.',
  },
  kreja: {
    def: 'Šumska ptica šarena perja iz porodice vrana; šojka (Garrulus).',
    pos: 'imenica, ž.',
  },
  koǌak: {
    def: 'Žestoko piće od destiliranog vina, odležalo u hrastovim bačvama.',
    pos: 'imenica, m.',
  },
  slama: {
    def: 'Suhe stabljike žita koje ostanu nakon vršidbe.',
    pos: 'imenica, ž.',
  },
  fleka: {
    def: 'Mrlja na odjeći ili nekoj površini.',
    pos: 'imenica, ž.',
    note: 'germanizam, razgovorno',
  },
  bedem: {
    def: 'Debeo, visok zid koji štiti grad ili tvrđavu.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  truǌe: {
    def: 'Sitni otpaci slame, sijena ili drveta; trunčice.',
    pos: 'imenica, s. (zbirno)',
  },
  teror: {
    def: 'Nasilje i zastrašivanje radi sticanja ili održavanja vlasti.',
    pos: 'imenica, m.',
  },
  šešir: { def: 'Pokrivalo za glavu s obodom.', pos: 'imenica, m.' },
  krađa: {
    def: 'Uzimanje tuđe stvari bez dozvole vlasnika.',
    pos: 'imenica, ž.',
  },
  lokna: { def: 'Uvojak kose.', pos: 'imenica, ž.', note: 'germanizam' },
  demon: { def: 'Zli duh; đavo.', pos: 'imenica, m.' },
  istup: {
    def: 'Javni nastup ili izjava; napuštanje članstva u organizaciji.',
    pos: 'imenica, m.',
  },
  palež: {
    def: 'Namjerno paljenje kuća i imanja, naročito u ratu.',
    pos: 'imenica, m.',
  },
  slina: {
    def: 'Tekućina koju u ustima luče pljuvačne žlijezde; pljuvačka.',
    pos: 'imenica, ž.',
  },
  magma: {
    def: 'Užarena rastopljena stijena u unutrašnjosti Zemlje.',
    pos: 'imenica, ž.',
  },
  senat: {
    def: 'Gornji dom parlamenta u nekim državama; vijeće starog Rima.',
    pos: 'imenica, m.',
  },
  gulaš: {
    def: 'Gusto jelo od dinstanog mesa s lukom i paprikom.',
    pos: 'imenica, m.',
    note: 'hungarizam',
  },
  jamac: {
    def: 'Osoba koja odgovara za tuđi dug ili obavezu; garant, žirant.',
    pos: 'imenica, m.',
  },
  ukras: { def: 'Ono što služi za uljepšavanje nečega.', pos: 'imenica, m.' },
  nacrt: {
    def: 'Skica ili plan; prva, nekonačna verzija teksta.',
    pos: 'imenica, m.',
  },
  cesta: {
    def: 'Put s tvrdom podlogom za saobraćaj vozila.',
    pos: 'imenica, ž.',
  },
  kubik: {
    def: 'Kubni metar, naročito drva ili vode.',
    pos: 'imenica, m.',
    note: 'razgovorno',
  },
  taksa: {
    def: 'Novčana naknada propisana za neku službenu uslugu.',
    pos: 'imenica, ž.',
  },
  nabor: { def: 'Pregib ili bora na tkanini ili koži.', pos: 'imenica, m.' },
  polet: { def: 'Zanos i oduševljenje u radu; elan.', pos: 'imenica, m.' },
  forum: {
    def: 'Skup ili mjesto za javnu raspravu, i na internetu; rimski trg.',
    pos: 'imenica, m.',
  },
  metal: {
    def: 'Čvrsta, sjajna materija koja dobro provodi toplotu i struju.',
    pos: 'imenica, m.',
  },
  trbuh: {
    def: 'Prednji dio tijela između grudi i karlice; stomak.',
    pos: 'imenica, m.',
  },
  // WORDS[950–999]
  gazda: {
    def: 'Vlasnik, gospodar; poslodavac.',
    pos: 'imenica, m.',
    note: 'hungarizam',
  },
  motiv: {
    def: 'Razlog ili pobuda za neki postupak; tema umjetničkog djela.',
    pos: 'imenica, m.',
  },
  zaǉev: {
    def: 'Dio mora ili jezera koji se uvlači u kopno.',
    pos: 'imenica, m.',
  },
  strop: {
    def: 'Gornja unutrašnja površina prostorije; plafon.',
    pos: 'imenica, m.',
  },
  heroj: {
    def: 'Junak; osoba koja je učinila izuzetno hrabro djelo.',
    pos: 'imenica, m.',
  },
  zvono: {
    def: 'Šuplji metalni predmet koji zvoni pri udaru; uređaj za zvonjenje.',
    pos: 'imenica, s.',
  },
  astma: {
    def: 'Hronična bolest disajnih puteva s napadima otežanog disanja.',
    pos: 'imenica, ž.',
  },
  fikus: {
    def: 'Sobna biljka krupnih sjajnih listova iz roda smokava (Ficus).',
    pos: 'imenica, m.',
  },
  pijun: {
    def: 'Najslabija šahovska figura, pješak; onaj kojim drugi upravljaju.',
    pos: 'imenica, m.',
  },
  bakar: {
    def: 'Crvenkasti metal koji dobro provodi struju, hemijski element (Cu).',
    pos: 'imenica, m.',
  },
  zapad: { def: 'Strana svijeta na kojoj Sunce zalazi.', pos: 'imenica, m.' },
  tajna: {
    def: 'Ono što se krije od drugih i ne smije se otkriti.',
    pos: 'imenica, ž.',
  },
  gorje: {
    def: 'Niz povezanih planina; planinski predio.',
    pos: 'imenica, s.',
  },
  tabor: {
    def: 'Utvrđeni vojni logor; jedna od suprotstavljenih strana.',
    pos: 'imenica, m.',
  },
  mačak: { def: 'Mužjak mačke.', pos: 'imenica, m.' },
  žetva: {
    def: 'Košenje i skupljanje zrelog žita s polja.',
    pos: 'imenica, ž.',
  },
  napad: {
    def: 'Nasrtaj na nekoga ili nešto; navala u igri.',
    pos: 'imenica, m.',
  },
  pisar: { def: 'Službenik koji piše i prepisuje spise.', pos: 'imenica, m.' },
  otkup: {
    def: 'Kupovina proizvoda od proizvođača; plaćanje za oslobađanje nečega.',
    pos: 'imenica, m.',
  },
  logor: {
    def: 'Mjesto privremenog boravka pod šatorima; mjesto zatočenja ljudi.',
    pos: 'imenica, m.',
  },
  nagib: {
    def: 'Kosina; stepen odstupanja od vodoravnog položaja.',
    pos: 'imenica, m.',
  },
  selam: {
    def: 'Pozdrav, naročito muslimanski (selam alejkum).',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  mržǌa: {
    def: 'Snažno osjećanje neprijateljstva i odbojnosti prema nekome.',
    pos: 'imenica, ž.',
  },
  modul: {
    def: 'Samostalan, zamjenjiv dio nekog sistema, uređaja ili programa.',
    pos: 'imenica, m.',
  },
  omjer: {
    def: 'Odnos dviju veličina izražen njihovim količnikom.',
    pos: 'imenica, m.',
  },
  cigla: {
    def: 'Pečeni blok od gline za zidanje; opeka.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  rolat: {
    def: 'Kolač ili meso smotano u valjak s nadjevom.',
    pos: 'imenica, m.',
  },
  bašča: {
    def: 'Ograđeno zemljište uz kuću za povrće i cvijeće; bašta.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  pamuk: {
    def: 'Biljka čija se bijela vlakna koriste za predivo; ta vlakna.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  gusle: {
    def: 'Narodni gudački instrument s jednom žicom.',
    pos: 'imenica, ž. (mn.)',
  },
  mrgud: { def: 'Mrzovoljan, stalno namrgođen čovjek.', pos: 'imenica, m.' },
  fišek: {
    def: 'Papirna kesa u obliku korneta; metak, naboj.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  lokal: {
    def: 'Poslovni prostor za trgovinu ili ugostiteljstvo.',
    pos: 'imenica, m.',
  },
  dopis: {
    def: 'Službeno pismo upućeno ustanovi ili osobi.',
    pos: 'imenica, m.',
  },
  tikva: {
    def: 'Biljka puzavica s krupnim mesnatim plodom; šaljivo: glava.',
    pos: 'imenica, ž.',
  },
  ninǆa: {
    def: 'Japanski ratnik vješt u prikradanju, špijunaži i borilačkim vještinama.',
    pos: 'imenica, m.',
  },
  liker: {
    def: 'Slatko alkoholno piće s aromom voća ili bilja.',
    pos: 'imenica, m.',
  },
  šiǉak: {
    def: 'Oštar, zašiljen vrh; predmet s takvim vrhom.',
    pos: 'imenica, m.',
  },
  maska: { def: 'Pokrivalo koje skriva ili štiti lice.', pos: 'imenica, ž.' },
  taksi: {
    def: 'Automobil s vozačem koji prevozi putnike uz plaćanje.',
    pos: 'imenica, m.',
  },
  brava: {
    def: 'Naprava na vratima koja se zaključava ključem.',
    pos: 'imenica, ž.',
  },
  zakon: {
    def: 'Propis koji donosi parlament; pravilo kojem se nešto pokorava.',
    pos: 'imenica, m.',
  },
  doner: {
    def: 'Meso pečeno na uspravnom ražnju, služi se u lepinji.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  kojot: {
    def: 'Sjevernoamerička divlja zvijer srodna vuku (Canis latrans).',
    pos: 'imenica, m.',
  },
  poema: {
    def: 'Duža pjesma, obično lirsko-epskog karaktera.',
    pos: 'imenica, ž.',
  },
  mjera: {
    def: 'Jedinica za mjerenje veličine; postupak radi postizanja nekog cilja.',
    pos: 'imenica, ž.',
  },
  lager: {
    def: 'Skladište ili zaliha robe; kuglični ležaj u mašini.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  banka: {
    def: 'Finansijska ustanova koja čuva novac i daje kredite.',
    pos: 'imenica, ž.',
  },
  patos: {
    def: 'Pod u prostoriji; uzvišena, zanosna osjećajnost u izražavanju.',
    pos: 'imenica, m.',
  },
  // WORDS[1000–1049]
  akšam: {
    def: 'Vrijeme zalaska sunca, predvečerje; večernji namaz u to doba.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  ekran: {
    def: 'Površina uređaja na kojoj se prikazuje slika, npr. televizora ili računara.',
    pos: 'imenica, m.',
  },
  gusar: { def: 'Morski razbojnik; pirat.', pos: 'imenica, m.' },
  sahan: {
    def: 'Plitka bakrena posuda za pripremanje i služenje jela.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  spust: {
    def: 'Silazak niz strminu; brza skijaška disciplina niz padinu.',
    pos: 'imenica, m.',
  },
  kakao: {
    def: 'Prah od prženih sjemenki kakaovca; napitak od njega.',
    pos: 'imenica, m.',
  },
  gǉiva: {
    def: 'Organizam bez hlorofila s klobukom i stručkom; pečurka.',
    pos: 'imenica, ž.',
  },
  požar: {
    def: 'Velika vatra koja se nekontrolisano širi i uništava.',
    pos: 'imenica, m.',
  },
  vlast: {
    def: 'Pravo i moć upravljanja; organi koji upravljaju državom.',
    pos: 'imenica, ž.',
  },
  izbor: {
    def: 'Biranje između više mogućnosti; ono što je izabrano.',
    pos: 'imenica, m.',
  },
  avion: {
    def: 'Letjelica s krilima i motorom za prevoz putnika i tereta.',
    pos: 'imenica, m.',
  },
  filet: { def: 'Komad mesa ili ribe bez kostiju.', pos: 'imenica, m.' },
  pončo: {
    def: 'Ogrtač od komada tkanine s otvorom za glavu.',
    pos: 'imenica, m.',
  },
  butan: {
    def: 'Bezbojni zapaljivi gas koji se koristi kao gorivo u bocama.',
    pos: 'imenica, m.',
  },
  motel: {
    def: 'Hotel uz cestu namijenjen putnicima s automobilima.',
    pos: 'imenica, m.',
  },
  merak: {
    def: 'Užitak, uživanje u nečemu; jaka želja, strast.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  trafo: {
    def: 'Transformator ili trafostanica (skraćeno).',
    pos: 'imenica, m.',
    note: 'razgovorno',
  },
  crnac: {
    def: 'Pripadnik ljudi tamne puti, porijeklom iz podsaharske Afrike.',
    pos: 'imenica, m.',
  },
  dugme: {
    def: 'Mala pločica za zakopčavanje odjeće; tipka na uređaju.',
    pos: 'imenica, s.',
    note: 'turcizam',
  },
  ǌedra: {
    def: 'Grudi; prostor između grudi i odjeće.',
    pos: 'imenica, s. (mn.)',
  },
  orman: {
    def: 'Visok komad namještaja s vratima za čuvanje odjeće; ormar.',
    pos: 'imenica, m.',
  },
  scena: {
    def: 'Pozornica; dio predstave ili filma, prizor.',
    pos: 'imenica, ž.',
  },
  beton: {
    def: 'Građevinski materijal od cementa, pijeska, šljunka i vode koji se stvrdne.',
    pos: 'imenica, m.',
  },
  biǉeg: {
    def: 'Znak ili oznaka po kojoj se nešto raspoznaje; mladež na koži.',
    pos: 'imenica, m.',
  },
  život: {
    def: 'Postojanje živog bića od rođenja do smrti; način življenja.',
    pos: 'imenica, m.',
  },
  tučak: {
    def: 'Batić za usitnjavanje u avanu; ženski organ cvijeta.',
    pos: 'imenica, m.',
  },
  snaga: {
    def: 'Tjelesna ili duhovna moć; sposobnost da se nešto savlada.',
    pos: 'imenica, ž.',
  },
  urota: {
    def: 'Tajni dogovor više ljudi protiv nekoga ili protiv vlasti; zavjera.',
    pos: 'imenica, ž.',
  },
  spjev: {
    def: 'Duže pjesničko djelo u stihovima, epsko ili lirsko-epsko; poema.',
    pos: 'imenica, m.',
  },
  pauza: {
    def: 'Kratak prekid rada ili neke radnje radi odmora.',
    pos: 'imenica, ž.',
  },
  škrge: {
    def: 'Organi kojima ribe i neke druge vodene životinje dišu u vodi.',
    pos: 'imenica, ž. (mn.)',
  },
  galon: {
    def: 'Anglosaksonska mjera za zapreminu tekućine, oko 3,8 ili 4,5 litara.',
    pos: 'imenica, m.',
  },
  kruna: {
    def: 'Ukras na glavi vladara kao znak vlasti; novčana jedinica nekih zemalja.',
    pos: 'imenica, ž.',
  },
  kajak: {
    def: 'Uzak, lagan čamac koji se pokreće veslom s dvije lopatice.',
    pos: 'imenica, m.',
  },
  kalup: {
    def: 'Šuplji oblik u koji se izlijeva ili utiskuje materijal; uzorak, šablon.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  omlet: { def: 'Jelo od umućenih jaja ispečenih u tavi.', pos: 'imenica, m.' },
  sluga: {
    def: 'Osoba koja za platu služi u tuđoj kući ili gospodaru.',
    pos: 'imenica, m.',
  },
  sobar: {
    def: 'Radnik u hotelu koji sprema i održava sobe; lični sluga.',
    pos: 'imenica, m.',
  },
  mesar: {
    def: 'Osoba koja kolje stoku, siječe i prodaje meso; kasap.',
    pos: 'imenica, m.',
  },
  hrčak: {
    def: 'Mali glodar s obraznim kesicama, često kućni ljubimac.',
    pos: 'imenica, m.',
  },
  lokum: {
    def: 'Mekani slatkiš od šećera i škroba, posut šećerom u prahu; rahat-lokum.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  gǌida: {
    def: 'Jaje vaši prilijepljeno za dlaku ili kosu.',
    pos: 'imenica, ž.',
  },
  sreća: {
    def: 'Osjećaj potpunog zadovoljstva i radosti; povoljan splet okolnosti.',
    pos: 'imenica, ž.',
  },
  porok: {
    def: 'Loša, štetna navika ili sklonost, npr. kocka ili piće; mana.',
    pos: 'imenica, m.',
  },
  slava: {
    def: 'Velika poznatost i javno priznanje; pravoslavni porodični praznik svetitelja zaštitnika.',
    pos: 'imenica, ž.',
  },
  odvoz: {
    def: 'Odvoženje nečega s nekog mjesta, npr. smeća ili robe.',
    pos: 'imenica, m.',
  },
  rukav: {
    def: 'Dio odjeće koji obavija ruku; krak ili ogranak rijeke.',
    pos: 'imenica, m.',
  },
  dativ: {
    def: 'Treći padež; odgovara na pitanja kome? čemu?',
    pos: 'imenica, m.',
  },
  kuhar: {
    def: 'Osoba kojoj je zanimanje pripremanje jela.',
    pos: 'imenica, m.',
  },
  divan: {
    def: 'Prekrasan, čudesno lijep; kao imenica: niska sofa bez naslona.',
    pos: 'pridjev',
  },
  // WORDS[1050–1099]
  istok: { def: 'Strana svijeta na kojoj izlazi Sunce.', pos: 'imenica, m.' },
  uskrs: {
    def: 'Kršćanski praznik kojim se slavi Isusovo uskrsnuće.',
    pos: 'imenica, m.',
  },
  bubaǌ: {
    def: 'Udaraljka od šupljeg okvira preko kojeg je nategnuta koža.',
    pos: 'imenica, m.',
  },
  gavez: {
    def: 'Ljekovita biljka krupnih dlakavih listova i debelog korijena (Symphytum).',
    pos: 'imenica, m.',
  },
  losos: {
    def: 'Krupna riba ružičastog mesa koja se mrijesti u rijekama.',
    pos: 'imenica, m.',
  },
  dukat: {
    def: 'Stari zlatni novac, često nošen kao nakit; zlatnik.',
    pos: 'imenica, m.',
  },
  nešto: {
    def: 'Neka stvar koja se ne imenuje određeno; malo, donekle.',
    pos: 'zamjenica',
  },
  pruga: {
    def: 'Uska traka druge boje na površini; željeznički kolosijek.',
    pos: 'imenica, ž.',
  },
  lovor: {
    def: 'Zimzeleno mediteransko drvo mirisnog lišća koje se koristi kao začin (Laurus).',
    pos: 'imenica, m.',
  },
  rahat: {
    def: 'Miran, spokojan i bezbrižan; udoban.',
    pos: 'pridjev',
    note: 'turcizam',
  },
  ugled: {
    def: 'Poštovanje i dobro mišljenje koje drugi imaju o nekome.',
    pos: 'imenica, m.',
  },
  mural: {
    def: 'Velika slika naslikana direktno na zidu ili fasadi.',
    pos: 'imenica, m.',
  },
  narod: {
    def: 'Zajednica ljudi istog porijekla, jezika i kulture; puk, stanovništvo.',
    pos: 'imenica, m.',
  },
  žalba: {
    def: 'Pravni prigovor na odluku upućen višoj instanci; jadanje, tužba.',
    pos: 'imenica, ž.',
  },
  rizla: {
    def: 'Tanki papirić za ručno motanje cigareta.',
    pos: 'imenica, ž.',
    note: 'razgovorno',
  },
  autor: {
    def: 'Onaj ko je stvorio neko djelo; pisac, tvorac.',
    pos: 'imenica, m.',
  },
  feǌer: {
    def: 'Prenosiva svjetiljka zaštićena staklom, na petrolej ili svijeću.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  sepsa: {
    def: 'Teško stanje kada se infekcija proširi krvlju po organizmu; trovanje krvi.',
    pos: 'imenica, ž.',
  },
  korpa: {
    def: 'Pletena posuda s drškom za nošenje stvari; koš.',
    pos: 'imenica, ž.',
  },
  baron: {
    def: 'Plemićka titula niža od grofa; moćnik u nekoj oblasti.',
    pos: 'imenica, m.',
  },
  uspon: {
    def: 'Penjanje ili kretanje naviše; napredovanje.',
    pos: 'imenica, m.',
  },
  pasuǉ: {
    def: 'Mahunarka čija se zrna kuhaju kao jelo; grah.',
    pos: 'imenica, m.',
  },
  delta: {
    def: 'Razgranato ušće rijeke s više rukavaca; četvrto slovo grčkog alfabeta.',
    pos: 'imenica, ž.',
  },
  dućan: {
    def: 'Manja radnja u kojoj se prodaje roba; prodavnica.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  frtaǉ: {
    def: 'Četvrtina nečega, npr. četvrt sata ili kilograma.',
    pos: 'imenica, m.',
    note: 'germanizam, razgovorno',
  },
  retro: {
    def: 'Koji oponaša ili podsjeća na stil prošlih vremena.',
    pos: 'pridjev',
  },
  cifra: { def: 'Znak kojim se piše broj; brojka, iznos.', pos: 'imenica, ž.' },
  sepet: {
    def: 'Pletena korpa ili koš od pruća.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  lažov: { def: 'Osoba koja često laže; lažljivac.', pos: 'imenica, m.' },
  govor: {
    def: 'Sposobnost izražavanja riječima; javno obraćanje slušaocima.',
    pos: 'imenica, m.',
  },
  hvala: {
    def: 'Riječ kojom se izražava zahvalnost; pohvala.',
    pos: 'imenica, ž.',
  },
  čigra: {
    def: 'Igračka koja se vrti na šiljku, zvrk; ptica srodna galebu (Sterna).',
    pos: 'imenica, ž.',
  },
  rende: {
    def: 'Kuhinjska sprava za ribanje povrća i sira; ribež.',
    pos: 'imenica, s.',
    note: 'turcizam',
  },
  deblo: {
    def: 'Glavni drvenasti dio stabla od korijena do krošnje.',
    pos: 'imenica, s.',
  },
  pečat: {
    def: 'Predmet za otiskivanje službenog znaka; otisak tog znaka.',
    pos: 'imenica, m.',
  },
  strah: {
    def: 'Osjećaj nelagode i uznemirenosti pred opasnošću.',
    pos: 'imenica, m.',
  },
  tetak: {
    def: 'Muž tetke, tj. očeve ili majčine sestre.',
    pos: 'imenica, m.',
  },
  skela: {
    def: 'Privremena konstrukcija za rad na visini; plovilo za prijevoz preko rijeke.',
    pos: 'imenica, ž.',
  },
  marka: {
    def: 'Novčana jedinica BiH (KM); poštanska marka ili zaštićeni naziv proizvoda.',
    pos: 'imenica, ž.',
  },
  griǌe: {
    def: 'Sitni paučnjaci, često nametnici i uzročnici alergija.',
    pos: 'imenica, ž. (mn.)',
  },
  idila: {
    def: 'Stanje spokoja, sklada i sreće; pjesma o mirnom seoskom životu.',
    pos: 'imenica, ž.',
  },
  biser: {
    def: 'Sjajna okrugla tvorevina u školjki, cijenjena kao nakit.',
    pos: 'imenica, m.',
  },
  vatra: {
    def: 'Plamen i toplota koji nastaju gorenjem; požar.',
    pos: 'imenica, ž.',
  },
  baška: {
    def: 'Posebno, odvojeno; osim toga, pored toga.',
    pos: 'prilog',
    note: 'turcizam',
  },
  splav: {
    def: 'Plovilo od međusobno povezanih balvana ili dasaka.',
    pos: 'imenica, ž.',
  },
  okvir: {
    def: 'Rub u koji se nešto umeće, npr. slika; granice nečega.',
    pos: 'imenica, m.',
  },
  žamor: {
    def: 'Tihi, nejasni zvuk mnogih glasova istovremeno.',
    pos: 'imenica, m.',
  },
  sreda: {
    def: 'Treći dan u sedmici, između utorka i četvrtka (ijek. srijeda).',
    pos: 'imenica, ž.',
    note: 'ekavski oblik',
  },
  misao: {
    def: 'Ono što se zamisli ili pomisli; ideja, zamisao.',
    pos: 'imenica, ž.',
  },
  // WORDS[1100–1149]
  žeton: {
    def: 'Pločica koja zamjenjuje novac u automatima i igrama.',
    pos: 'imenica, m.',
  },
  melek: {
    def: 'Anđeo, u islamskom vjerovanju; dobra, nevina osoba.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  jetra: {
    def: 'Velika žlijezda u trbuhu koja prečišćava krv i luči žuč.',
    pos: 'imenica, ž.',
  },
  virus: {
    def: 'Sićušni uzročnik zaraze koji se razmnožava u živim ćelijama; štetni računarski program.',
    pos: 'imenica, m.',
  },
  jufka: {
    def: 'Tanko razvučen list tijesta za pite i baklavu; kora.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  flota: {
    def: 'Skup brodova jedne države ili kompanije; mornarica.',
    pos: 'imenica, ž.',
  },
  strug: {
    def: 'Mašina koja obrađuje drvo ili metal dok se predmet okreće.',
    pos: 'imenica, m.',
  },
  lopta: {
    def: 'Okrugao predmet, obično napunjen zrakom, za igru i sport.',
    pos: 'imenica, ž.',
  },
  momak: { def: 'Mlad, neoženjen muškarac; mladić.', pos: 'imenica, m.' },
  nauka: {
    def: 'Sistematsko znanje stečeno istraživanjem; pouka.',
    pos: 'imenica, ž.',
  },
  garda: {
    def: 'Elitna vojna jedinica, izvorno tjelesna straža vladara.',
    pos: 'imenica, ž.',
  },
  perla: {
    def: 'Mala šuplja kuglica koja se niže na konac za nakit.',
    pos: 'imenica, ž.',
  },
  kupus: {
    def: 'Povrće s krupnom glavicom od zbijenih listova.',
    pos: 'imenica, m.',
  },
  gajba: {
    def: 'Sanduk od letvica ili plastike za voće, povrće ili flaše.',
    pos: 'imenica, ž.',
  },
  umǌak: {
    def: 'Posljednji kutnjak koji izraste u odrasloj dobi; zub mudrosti.',
    pos: 'imenica, m.',
  },
  zglob: {
    def: 'Pokretni spoj dviju ili više kostiju; spoj dijelova mašine.',
    pos: 'imenica, m.',
  },
  pupak: {
    def: 'Udubljenje na sredini trbuha, ostatak pupčane vrpce.',
    pos: 'imenica, m.',
  },
  građa: {
    def: 'Materijal od kojeg se nešto gradi; sastav ili struktura nečega.',
    pos: 'imenica, ž.',
  },
  napon: {
    def: 'Razlika električnih potencijala, mjeri se u voltima; naprezanje.',
    pos: 'imenica, m.',
  },
  koala: {
    def: 'Australski tobolčar sličan medvjediću, hrani se eukaliptusom.',
    pos: 'imenica, ž.',
  },
  hafiz: {
    def: 'Osoba koja zna cijeli Kur’an napamet.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  derbi: {
    def: 'Utakmica velikih rivala, naročito iz istog grada.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  zamka: {
    def: 'Naprava za hvatanje životinja; podvala, klopka.',
    pos: 'imenica, ž.',
  },
  rasad: {
    def: 'Mlade biljke uzgojene za presađivanje; sadnice.',
    pos: 'imenica, m.',
  },
  perje: {
    def: 'Pokrivač ptičjeg tijela; sva pera zajedno.',
    pos: 'imenica, s. (zbirno)',
  },
  uslov: {
    def: 'Okolnost od koje zavisi nešto drugo; pretpostavka, zahtjev.',
    pos: 'imenica, m.',
  },
  pista: {
    def: 'Staza za polijetanje i slijetanje aviona; trkačka ili plesna staza.',
    pos: 'imenica, ž.',
  },
  bašta: {
    def: 'Ograđen prostor uz kuću za cvijeće ili povrće; terasa kafića.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  etika: {
    def: 'Filozofska nauka o moralu; skup moralnih načela.',
    pos: 'imenica, ž.',
  },
  grozd: {
    def: 'Plodovi zbijeni na zajedničkoj peteljci, naročito grožđe.',
    pos: 'imenica, m.',
  },
  halal: {
    def: 'Vjerski dozvoljen (u islamu), naročito o hrani — suprotno od haram; oprošten.',
    pos: 'pridjev',
    note: 'turcizam',
  },
  šator: {
    def: 'Prenosivo sklonište od platna razapetog na motkama i užadima.',
    pos: 'imenica, m.',
  },
  kotur: {
    def: 'Okrugao predmet u obliku točka; kolut, namotaj.',
    pos: 'imenica, m.',
  },
  potok: { def: 'Mali prirodni vodeni tok.', pos: 'imenica, m.' },
  pasoš: {
    def: 'Lični dokument za putovanje u inostranstvo.',
    pos: 'imenica, m.',
  },
  vozač: { def: 'Osoba koja upravlja motornim vozilom.', pos: 'imenica, m.' },
  civil: {
    def: 'Osoba koja nije pripadnik vojske ili policije.',
    pos: 'imenica, m.',
  },
  ugriz: {
    def: 'Stiskanje zubima; rana ili trag koji pritom ostane.',
    pos: 'imenica, m.',
  },
  sjena: {
    def: 'Taman obris koji nastaje kad tijelo zaklanja svjetlost; hlad.',
    pos: 'imenica, ž.',
  },
  kvarc: {
    def: 'Tvrd, često proziran mineral, glavni sastojak pijeska.',
    pos: 'imenica, m.',
  },
  pegla: {
    def: 'Kućni aparat kojim se toplotom ravna zgužvana odjeća.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  vezir: {
    def: 'Visoki državni dostojanstvenik, ministar u Osmanskom carstvu.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  akter: {
    def: 'Učesnik ili nosilac neke radnje ili događaja.',
    pos: 'imenica, m.',
  },
  gozba: {
    def: 'Svečan i obilan obrok za veći broj gostiju.',
    pos: 'imenica, ž.',
  },
  motka: {
    def: 'Dugačak, tanak komad drveta; štap, prut.',
    pos: 'imenica, ž.',
  },
  špajz: {
    def: 'Mala prostorija za čuvanje namirnica; ostava.',
    pos: 'imenica, m.',
    note: 'germanizam, razgovorno',
  },
  pjega: { def: 'Sitna smeđa mrljica na koži; mrlja.', pos: 'imenica, ž.' },
  smrča: {
    def: 'Visoko četinarsko drvo kratkih iglica i visećih šišarki (Picea).',
    pos: 'imenica, ž.',
  },
  zalet: {
    def: 'Brzo trčanje prije skoka ili udarca; polet.',
    pos: 'imenica, m.',
  },
  novac: {
    def: 'Sredstvo plaćanja u obliku kovanica i novčanica; pare.',
    pos: 'imenica, m.',
  },
  // WORDS[1150–1199]
  izvod: {
    def: 'Službeni izvadak iz evidencije, npr. matične knjige ili banke; derivacija.',
    pos: 'imenica, m.',
  },
  varoš: {
    def: 'Grad ili gradsko naselje; trgovački i zanatski dio grada.',
    pos: 'imenica, ž.',
    note: 'hungarizam',
  },
  ložač: {
    def: 'Radnik koji loži vatru u peći ili kotlu, npr. na lokomotivi.',
    pos: 'imenica, m.',
  },
  štand: {
    def: 'Prodajno mjesto ili tezga na sajmu ili pijaci.',
    pos: 'imenica, m.',
    note: 'germanizam',
  },
  danas: { def: 'Na današnji dan; u sadašnje vrijeme.', pos: 'prilog' },
  limar: {
    def: 'Zanatlija koji obrađuje lim, npr. pravi oluke i krovne obloge.',
    pos: 'imenica, m.',
  },
  etaža: { def: 'Sprat zgrade ili stana; nivo.', pos: 'imenica, ž.' },
  šarža: {
    def: 'Količina proizvedena u jednom procesu, serija; čin, položaj.',
    pos: 'imenica, ž.',
  },
  dinar: {
    def: 'Novčana jedinica Srbije, nekada i Jugoslavije.',
    pos: 'imenica, m.',
  },
  šamar: {
    def: 'Udarac otvorenim dlanom po licu; pljuska.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  junac: {
    def: 'Hrabar čovjek, heroj; mlado muško govedo.',
    pos: 'imenica, m.',
  },
  prsti: {
    def: 'Pokretni završni dijelovi šake i stopala (mn. od prst).',
    pos: 'imenica, m. (mn.)',
  },
  aorta: {
    def: 'Glavna arterija koja iz srca raznosi krv po tijelu.',
    pos: 'imenica, ž.',
  },
  torba: {
    def: 'Vreća od platna, kože ili plastike s ručkama za nošenje.',
    pos: 'imenica, ž.',
    note: 'turcizam',
  },
  kupon: {
    def: 'Odrezak koji daje pravo na popust ili nagradu; listić za klađenje.',
    pos: 'imenica, m.',
  },
  zahod: { def: 'Prostorija za obavljanje nužde; toalet.', pos: 'imenica, m.' },
  busen: {
    def: 'Komad zemlje obrastao travom zajedno s korijenjem.',
    pos: 'imenica, m.',
  },
  uzvik: {
    def: 'Nagli, glasni povik; vrsta riječi koja izražava osjećaje.',
    pos: 'imenica, m.',
  },
  suǆuk: {
    def: 'Sušena kobasica od govedine, začinjena bijelim lukom.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  etapa: {
    def: 'Dio puta ili trke između dvije tačke; faza, stadij.',
    pos: 'imenica, ž.',
  },
  ručka: {
    def: 'Dio predmeta za koji se hvata rukom; drška.',
    pos: 'imenica, ž.',
  },
  pojas: {
    def: 'Traka koja se nosi oko struka; zona, područje.',
    pos: 'imenica, m.',
  },
  zdaǌe: {
    def: 'Velika, obično reprezentativna građevina; zgrada.',
    pos: 'imenica, s.',
  },
  firma: {
    def: 'Preduzeće koje se bavi nekom privrednom djelatnošću.',
    pos: 'imenica, ž.',
  },
  modem: {
    def: 'Uređaj koji povezuje računar s internetom ili telefonskom mrežom.',
    pos: 'imenica, m.',
  },
  sifon: {
    def: 'Boca s gaziranom vodom pod pritiskom; odvodna cijev u obliku slova U.',
    pos: 'imenica, m.',
  },
  paklo: {
    def: 'Kutija ili paketić cigareta, duhana i sl.',
    pos: 'imenica, s.',
    note: 'germanizam, razgovorno',
  },
  unija: {
    def: 'Savez država ili organizacija, npr. Evropska unija.',
    pos: 'imenica, ž.',
  },
  ruglo: {
    def: 'Ono što je predmet poruge; sramota, bruka.',
    pos: 'imenica, s.',
  },
  držač: {
    def: 'Predmet ili dio koji nešto drži ili pridržava.',
    pos: 'imenica, m.',
  },
  ǉutǌa: {
    def: 'Osjećaj srdžbe i nezadovoljstva prema nekome ili nečemu.',
    pos: 'imenica, ž.',
  },
  atlas: {
    def: 'Knjiga geografskih karata; sjajna svilena tkanina.',
    pos: 'imenica, m.',
  },
  molba: {
    def: 'Usmeni ili pisani zahtjev kojim se nešto traži.',
    pos: 'imenica, ž.',
  },
  višǌa: {
    def: 'Voćka i njen kiselkasti tamnocrveni plod sličan trešnji.',
    pos: 'imenica, ž.',
  },
  model: {
    def: 'Uzor ili umanjena izvedba nečega; osoba koja pozira.',
    pos: 'imenica, m.',
  },
  lasta: { def: 'Ptica selica rašljasta repa; lastavica.', pos: 'imenica, ž.' },
  priča: {
    def: 'Kazivanje o nekom događaju; kratko prozno djelo.',
    pos: 'imenica, ž.',
  },
  felga: {
    def: 'Metalni obruč točka na koji se navlači guma; naplatak.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  palma: {
    def: 'Tropsko drvo visokog stabla bez grana s krošnjom velikih listova.',
    pos: 'imenica, ž.',
  },
  disko: {
    def: 'Plesna muzika popularna 1970-ih; diskoteka.',
    pos: 'imenica, m.',
  },
  presa: {
    def: 'Mašina koja pritiskom sabija, oblikuje ili cijedi materijal.',
    pos: 'imenica, ž.',
  },
  svađa: {
    def: 'Žestoka prepirka praćena vikom i uvredama.',
    pos: 'imenica, ž.',
  },
  oprez: {
    def: 'Pažnja i obazrivost radi izbjegavanja opasnosti ili greške.',
    pos: 'imenica, m.',
  },
  ibrik: {
    def: 'Metalna posuda uskog grla s drškom i poklopcem, za vodu.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  ǌuška: {
    def: 'Prednji dio glave životinje s nosom i ustima; gubica.',
    pos: 'imenica, ž.',
  },
  konak: {
    def: 'Noćenje, prenoćište; nekad sjedište visokog osmanskog službenika.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  ulica: { def: 'Put u naselju omeđen kućama i zgradama.', pos: 'imenica, ž.' },
  vepar: { def: 'Mužjak divlje ili domaće svinje.', pos: 'imenica, m.' },
  oblog: {
    def: 'Mokra ili topla tkanina koja se stavlja na bolno mjesto; kompresa.',
    pos: 'imenica, m.',
  },
  badem: {
    def: 'Drvo i njegov jestivi plod s jezgrom u tvrdoj ljusci.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  // WORDS[1200–1249]
  špiǉa: {
    def: 'Prirodna podzemna šupljina u stijenama; pećina.',
    pos: 'imenica, ž.',
  },
  kamen: {
    def: 'Tvrda mineralna materija od koje su građene stijene; komad stijene.',
    pos: 'imenica, m.',
  },
  naziv: {
    def: 'Riječ ili izraz kojim se nešto označava; ime.',
    pos: 'imenica, m.',
  },
  hasta: {
    def: 'Bolestan, slab i onemoćao.',
    pos: 'pridjev',
    note: 'turcizam',
  },
  jedro: {
    def: 'Platno razapeto na jarbolu koje vjetrom pokreće plovilo.',
    pos: 'imenica, s.',
  },
  pomoć: {
    def: 'Podrška ili usluga koja se pruža nekome u potrebi.',
    pos: 'imenica, ž.',
  },
  princ: {
    def: 'Sin vladara ili muški član vladarske porodice; kraljević.',
    pos: 'imenica, m.',
  },
  račun: {
    def: 'Dokument s iznosom koji treba platiti; računanje.',
    pos: 'imenica, m.',
  },
  božić: {
    def: 'Kršćanski praznik rođenja Isusa (25. decembra, kod pravoslavnih 7. januara).',
    pos: 'imenica, m.',
  },
  biber: {
    def: 'Ljuti začin od sušenih, mljevenih zrna tropske biljke (Piper).',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  bista: {
    def: 'Kip koji prikazuje glavu i gornji dio grudi.',
    pos: 'imenica, ž.',
  },
  kolaž: {
    def: 'Slika sastavljena od zalijepljenih komadića papira, fotografija i sl.',
    pos: 'imenica, m.',
  },
  heǉda: {
    def: 'Biljka čije se trouglasto zrno melje u brašno (Fagopyrum).',
    pos: 'imenica, ž.',
  },
  žrtva: {
    def: 'Onaj ko strada ili pati; ono čega se neko odriče radi drugog.',
    pos: 'imenica, ž.',
  },
  žubor: { def: 'Tiho, ugodno šuštanje vode koja teče.', pos: 'imenica, m.' },
  biǉka: {
    def: 'Živo biće ukorijenjeno u tlu koje hranu stvara iz svjetlosti.',
    pos: 'imenica, ž.',
  },
  bodǉa: {
    def: 'Tvrd, šiljat izraštaj na biljci ili životinji, npr. kod ježa.',
    pos: 'imenica, ž.',
  },
  harfa: {
    def: 'Veliki trouglasti žičani instrument na kojem se svira prstima.',
    pos: 'imenica, ž.',
  },
  trema: {
    def: 'Nervoza i strah pred javni nastup ili ispit.',
    pos: 'imenica, ž.',
  },
  okret: {
    def: 'Pokret kojim se neko ili nešto okreće; zaokret.',
    pos: 'imenica, m.',
  },
  alibi: {
    def: 'Dokaz da osumnjičeni nije bio na mjestu zločina.',
    pos: 'imenica, m.',
  },
  sutra: {
    def: 'Narednog dana, poslije današnjeg; u budućnosti.',
    pos: 'prilog',
  },
  pomak: {
    def: 'Malo pomjeranje s mjesta; napredak, promjena nabolje.',
    pos: 'imenica, m.',
  },
  dunum: {
    def: 'Mjera za površinu zemljišta od 1.000 kvadratnih metara.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  konac: {
    def: 'Tanka nit za šivanje; kraj, svršetak („konac djelo krasi”).',
    pos: 'imenica, m.',
  },
  barel: {
    def: 'Mjerna jedinica za naftu od oko 159 litara; bure.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  napor: {
    def: 'Uložena snaga i trud; zamor koji iz toga proizlazi.',
    pos: 'imenica, m.',
  },
  blato: { def: 'Raskvašena, ljepljiva zemlja.', pos: 'imenica, s.' },
  zloba: { def: 'Želja da se drugome naudi; pakost.', pos: 'imenica, ž.' },
  zraka: {
    def: 'Uzak snop svjetlosti; u geometriji polupravac.',
    pos: 'imenica, ž.',
  },
  skala: {
    def: 'Niz podioka ili stepena za mjerenje; niz tonova u muzici.',
    pos: 'imenica, ž.',
  },
  kadet: {
    def: 'Pitomac vojne škole; mladi sportista između pionira i juniora.',
    pos: 'imenica, m.',
  },
  pazuh: {
    def: 'Udubljenje ispod ramena, između nadlaktice i grudnog koša.',
    pos: 'imenica, m.',
  },
  roman: {
    def: 'Duže prozno književno djelo s razgranatom radnjom.',
    pos: 'imenica, m.',
  },
  pršut: {
    def: 'Usoljen i sušen, često dimljen but, jede se tanko narezan.',
    pos: 'imenica, m.',
  },
  pasiv: {
    def: 'Glagolsko stanje u kojem subjekt trpi radnju; trpno stanje.',
    pos: 'imenica, m.',
  },
  drama: {
    def: 'Književno djelo pisano za izvođenje na sceni; napet, uzbudljiv događaj.',
    pos: 'imenica, ž.',
  },
  nagon: {
    def: 'Urođena pobuda koja usmjerava ponašanje; instinkt.',
    pos: 'imenica, m.',
  },
  borac: {
    def: 'Onaj ko se bori, npr. vojnik ili sportista.',
    pos: 'imenica, m.',
  },
  jelka: {
    def: 'Zimzeleno četinarsko drvo, jela; okićeno novogodišnje drvce.',
    pos: 'imenica, ž.',
  },
  skver: {
    def: 'Mali gradski park ili trg sa zelenilom.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  humus: {
    def: 'Plodni gornji sloj tla od istrunulih biljaka; namaz od slanutka.',
    pos: 'imenica, m.',
  },
  javor: {
    def: 'Listopadno drvo urezanih, dlanastih listova (Acer).',
    pos: 'imenica, m.',
  },
  izgon: {
    def: 'Prisilno protjerivanje nekoga iz zemlje ili sredine.',
    pos: 'imenica, m.',
  },
  barut: {
    def: 'Eksplozivna smjesa za punjenje metaka i mina.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  golub: {
    def: 'Ptica sitne glave i kratkog kljuna, česta u gradovima.',
    pos: 'imenica, m.',
  },
  težǌa: {
    def: 'Snažna želja i nastojanje da se nešto postigne.',
    pos: 'imenica, ž.',
  },
  olovo: {
    def: 'Težak, mekan sivi metal, hemijski element (Pb).',
    pos: 'imenica, s.',
  },
  bodve: {
    def: 'Ribarsko koplje s više zubaca za lov ribe; osti.',
    pos: 'imenica, ž. (mn.)',
    note: 'regionalizam',
  },
  // WORDS[1250–1299]
  nafta: {
    def: 'Zapaljiva fosilna tekućina iz zemlje; razgovorno i dizel-gorivo.',
    pos: 'imenica, ž.',
  },
  mašta: {
    def: 'Sposobnost zamišljanja onoga čega nema; fantazija.',
    pos: 'imenica, ž.',
  },
  rođak: {
    def: 'Član šire porodice, osoba u krvnom srodstvu.',
    pos: 'imenica, m.',
  },
  čudak: {
    def: 'Osoba neobičnih navika i ponašanja; osobenjak.',
    pos: 'imenica, m.',
  },
  vakuf: {
    def: 'Imovina trajno darovana za vjerske ili dobrotvorne svrhe u islamu.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  uzgoj: { def: 'Gajenje biljaka ili životinja.', pos: 'imenica, m.' },
  pluća: {
    def: 'Parni organ za disanje smješten u grudnom košu.',
    pos: 'imenica, s. (mn.)',
  },
  kalem: {
    def: 'Mladica koja se usađuje na drugu biljku radi oplemenjivanja; špula za konac.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  sajla: {
    def: 'Čelično uže od spletenih žica.',
    pos: 'imenica, ž.',
    note: 'germanizam',
  },
  reǉef: {
    def: 'Oblik zemljine površine; skulptura izbočena iz ravne podloge.',
    pos: 'imenica, m.',
  },
  dajǆa: { def: 'Majčin brat; ujak.', pos: 'imenica, m.', note: 'turcizam' },
  kadar: {
    def: 'Neprekinut filmski snimak; stručno osoblje neke ustanove.',
    pos: 'imenica, m.',
  },
  sudar: {
    def: 'Snažan udar dvaju vozila ili tijela jednog u drugo.',
    pos: 'imenica, m.',
  },
  bomba: {
    def: 'Eksplozivna naprava koja se baca ili postavlja.',
    pos: 'imenica, ž.',
  },
  zavod: {
    def: 'Javna ustanova za određenu djelatnost, npr. zavod za zapošljavanje.',
    pos: 'imenica, m.',
  },
  krkan: {
    def: 'Grub, neotesan i primitivan čovjek; prostak.',
    pos: 'imenica, m.',
    note: 'razgovorno, pogrdno',
  },
  jelen: {
    def: 'Krupan šumski preživar s razgranatim rogovima.',
    pos: 'imenica, m.',
  },
  čoban: {
    def: 'Pastir koji čuva ovce ili drugu stoku.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  proha: {
    def: 'Hljeb ili pogača od kukuruznog brašna; proja.',
    pos: 'imenica, ž.',
    note: 'regionalizam',
  },
  odbor: {
    def: 'Grupa ljudi izabrana da vodi ili rješava određene poslove.',
    pos: 'imenica, m.',
  },
  drača: {
    def: 'Trnovit grm (Paliurus); općenito bodljikavo raslinje, trnje.',
    pos: 'imenica, ž.',
  },
  toraǌ: {
    def: 'Visoka, uska građevina ili dio zgrade; kula.',
    pos: 'imenica, m.',
  },
  odnos: {
    def: 'Veza ili način povezanosti među ljudima ili stvarima.',
    pos: 'imenica, m.',
  },
  krmak: {
    def: 'Mužjak domaće svinje; pogrdno: čovjek lošeg karaktera.',
    pos: 'imenica, m.',
  },
  ishod: {
    def: 'Krajnji rezultat nekog događaja ili postupka.',
    pos: 'imenica, m.',
  },
  žiteǉ: { def: 'Stanovnik nekog mjesta ili kraja.', pos: 'imenica, m.' },
  islam: {
    def: 'Monoteistička vjera zasnovana na Kur’anu i učenju poslanika Muhammeda.',
    pos: 'imenica, m.',
  },
  borba: {
    def: 'Sukob u kojem se protivnici nastoje savladati; napor da se nešto postigne.',
    pos: 'imenica, ž.',
  },
  dekan: {
    def: 'Rukovodilac fakulteta u sastavu univerziteta.',
    pos: 'imenica, m.',
  },
  hošaf: {
    def: 'Kompot od suhog voća, najčešće šljiva, jabuka ili krušaka.',
    pos: 'imenica, m.',
    note: 'turcizam',
  },
  tužba: {
    def: 'Zahtjev upućen sudu radi zaštite nekog prava.',
    pos: 'imenica, ž.',
  },
  himna: {
    def: 'Svečana pjesma u slavu države, ideje ili božanstva.',
    pos: 'imenica, ž.',
  },
  šansa: {
    def: 'Mogućnost ili prilika da se nešto ostvari.',
    pos: 'imenica, ž.',
    note: 'galicizam',
  },
  dogma: {
    def: 'Učenje koje se prihvata kao neupitna istina, bez preispitivanja.',
    pos: 'imenica, ž.',
  },
  reuma: {
    def: 'Bolno oboljenje zglobova i mišića; reumatizam.',
    pos: 'imenica, ž.',
    note: 'razgovorno',
  },
  vlaga: {
    def: 'Voda ili vodena para prisutna u zraku, tlu ili predmetu.',
    pos: 'imenica, ž.',
  },
  vrsta: {
    def: 'Skupina bića ili stvari istih osobina; tip, sorta.',
    pos: 'imenica, ž.',
  },
  manir: {
    def: 'Način ponašanja ili izražavanja; ustaljen stil.',
    pos: 'imenica, m.',
    note: 'galicizam',
  },
  udjel: {
    def: 'Dio koji nekome pripada u zajedničkom; učešće, udio.',
    pos: 'imenica, m.',
  },
  lista: {
    def: 'Popis imena ili stavki poredanih jedno ispod drugog; spisak.',
    pos: 'imenica, ž.',
  },
  nepce: { def: 'Gornji svod usne šupljine.', pos: 'imenica, s.' },
  pilić: { def: 'Mladunče kokoši; pile.', pos: 'imenica, m.' },
  bitka: {
    def: 'Veći oružani sukob vojski na jednom mjestu.',
    pos: 'imenica, ž.',
  },
  luđak: {
    def: 'Duševno poremećena osoba; neko ko se ponaša nerazumno.',
    pos: 'imenica, m.',
    note: 'često pogrdno',
  },
  ćorak: {
    def: 'Metak bez zrna, slijepi metak; promašen pokušaj.',
    pos: 'imenica, m.',
    note: 'turcizam, razgovorno',
  },
  fioka: {
    def: 'Izvlačna kutija u stolu ili ormaru; ladica.',
    pos: 'imenica, ž.',
  },
  tegla: {
    def: 'Staklena posuda širokog otvora, npr. za zimnicu.',
    pos: 'imenica, ž.',
  },
  lišće: {
    def: 'Listovi drveća i biljaka uzeti zajedno.',
    pos: 'imenica, s. (zbirno)',
  },
  smiǉe: {
    def: 'Mirisna biljka sitnih žutih cvjetova koji ne venu (Helichrysum).',
    pos: 'imenica, s.',
  },
  // WORDS[1300–1349]
  rulet: {
    def: 'Igra na sreću s kuglicom na okretnom kolu s brojevima.',
    pos: 'imenica, m.',
  },
  najam: {
    def: 'Korištenje tuđe stvari ili prostora uz plaćanje; zakup.',
    pos: 'imenica, m.',
  },
  sjeme: {
    def: 'Dio biljke iz kojeg nastaje nova biljka.',
    pos: 'imenica, s.',
  },
  sklek: {
    def: 'Vježba spuštanja i podizanja tijela oslonjenog na dlanove i prste.',
    pos: 'imenica, m.',
  },
  trkač: {
    def: 'Sportista koji se takmiči u trčanju; onaj koji trči.',
    pos: 'imenica, m.',
  },
  riječ: {
    def: 'Glas ili skup glasova s određenim značenjem; ono što je rečeno.',
    pos: 'imenica, ž.',
  },
  sabor: {
    def: 'Skupština ili veliki skup; narodno okupljanje uz veselje.',
    pos: 'imenica, m.',
  },
  povod: {
    def: 'Neposredan razlog ili prilika zbog koje se nešto desi.',
    pos: 'imenica, m.',
  },
  pelet: {
    def: 'Sabijeni valjčići od piljevine koji se koriste kao gorivo.',
    pos: 'imenica, m.',
    note: 'anglicizam',
  },
  zajam: {
    def: 'Novac dat na korištenje uz obavezu vraćanja; kredit.',
    pos: 'imenica, m.',
  },
  rasol: {
    def: 'Slana tekućina u kojoj se kiseli kupus; salamura.',
    pos: 'imenica, m.',
  },
  kosti: {
    def: 'Tvrdi dijelovi tijela koji zajedno čine kostur (mn. od kost).',
    pos: 'imenica, ž. (mn.)',
  },
  davež: {
    def: 'Dosadna osoba ili priča koja gnjavi; gnjavaža.',
    pos: 'imenica, m.',
    note: 'razgovorno',
  },
  šerif: {
    def: 'Izabrani policijski starješina okruga u SAD-u.',
    pos: 'imenica, m.',
  },
  torzo: {
    def: 'Trup ljudskog tijela bez glave i udova, naročito kao skulptura.',
    pos: 'imenica, m.',
  },
  ženka: { def: 'Jedinka ženskog spola kod životinja.', pos: 'imenica, ž.' },
  atest: {
    def: 'Službena potvrda o kvalitetu ili ispravnosti proizvoda.',
    pos: 'imenica, m.',
  },
  kolac: {
    def: 'Zašiljen drveni stup koji se zabija u zemlju.',
    pos: 'imenica, m.',
  },
  minus: {
    def: 'Znak oduzimanja (−); manjak ili gubitak.',
    pos: 'imenica, m.',
  },
}
