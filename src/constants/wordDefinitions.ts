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
 * STATUS: 10 sample entries below for style review. Not exported anywhere yet.
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
    def: 'Rijetka, vodenasta juha, najčešće mesna ili od povrća.',
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
  'potez': { def: 'Pojedinačni pokret ili postupak, npr. u igri ili pregovorima.', pos: 'imenica, m.' },
  'šǉaka': { def: 'Tvrdi otpadni ostatak od sagorijevanja uglja ili topljenja rude; troska.', pos: 'imenica, ž.' },
  'mazga': { def: 'Domaća životinja nastala križanjem magarca i kobile.', pos: 'imenica, ž.' },
  'feder': { def: 'Opruga; savitljiv metalni dio koji se vraća u prvobitni oblik.', pos: 'imenica, m.', note: 'germanizam' },
  'odraz': { def: 'Slika koja nastaje odbijanjem svjetlosti, npr. u ogledalu; odsjaj.', pos: 'imenica, m.' },
  'skije': { def: 'Par dugih, uskih dasaka za klizanje po snijegu.', pos: 'imenica, ž. (mn.)' },
  'audio': { def: 'Ono što se odnosi na zvuk te njegovo snimanje i reprodukciju.', note: 'pridjevski / prefiks' },
  'znaǌe': { def: 'Ukupnost onoga što neko zna; spoznaja stečena učenjem.', pos: 'imenica, s.' },
  'ribež': { def: 'Kuhinjska sprava s oštrim rupicama za ribanje sira ili povrća.', pos: 'imenica, m.' },
  'čekić': { def: 'Alat s teškom glavom za udaranje i zabijanje eksera.', pos: 'imenica, m.' },
  'glina': { def: 'Mekana, plastična zemlja za grnčariju i izradu cigle.', pos: 'imenica, ž.' },
  'prvak': { def: 'Onaj ko je prvi; pobjednik takmičenja, šampion.', pos: 'imenica, m.' },
  'svrha': { def: 'Cilj ili namjera radi koje se nešto čini.', pos: 'imenica, ž.' },
  'cijev': { def: 'Šuplje, izduženo tijelo kroz koje protiče tekućina ili plin.', pos: 'imenica, ž.' },
  'bluza': { def: 'Lagana ženska košulja ili gornji dio odjeće.', pos: 'imenica, ž.' },
  'hefta': { def: 'Sedmica; period od sedam dana.', pos: 'imenica, ž.', note: 'turcizam' },
  'ragbi': { def: 'Timski sport s jajolikom loptom koja se nosi i dodaje rukama.', pos: 'imenica, m.', note: 'anglicizam' },
  'konop': { def: 'Debelo uže od upletenih vlakana.', pos: 'imenica, m.' },
  'ideal': { def: 'Savršen uzor ili cilj kojem se teži.', pos: 'imenica, m.' },
  'zamak': { def: 'Utvrđena srednjovjekovna građevina; dvorac.', pos: 'imenica, m.' },
  'gesta': { def: 'Pokret ruke ili tijela koji nešto izražava; kretnja.', pos: 'imenica, ž.' },
  'berba': { def: 'Skupljanje zrelih plodova, naročito grožđa.', pos: 'imenica, ž.' },
  'ǆemre': { def: 'Razdoblja zatopljenja krajem zime, prema narodnom vjerovanju.', pos: 'imenica, s. (mn.)', note: 'turcizam, narodni običaj' },
  'pakao': { def: 'Mjesto vječne patnje i kazne u vjerskim predstavama; suprotno od raja.', pos: 'imenica, m.' },
  'kǌiga': { def: 'Skup uvezanih listova s tekstom za čitanje.', pos: 'imenica, ž.' },
  'dubak': { def: 'Okvir na kotačićima u kojem dijete uči hodati; hodalica.', pos: 'imenica, m.' },
  'moler': { def: 'Zanatlija koji boji zidove i prostorije; soboslikar.', pos: 'imenica, m.', note: 'germanizam' },
  'tarot': { def: 'Špil posebnih karata koji se koristi za proricanje.', pos: 'imenica, m.' },
  'nosač': { def: 'Onaj ili ono što nešto nosi ili podupire; držač.', pos: 'imenica, m.' },
  'krema': { def: 'Gusta, maziva smjesa, kozmetička ili slastičarska.', pos: 'imenica, ž.' },
}
