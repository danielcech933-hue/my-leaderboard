export type Question = { id:number; category:string; question:string; options:string[]; answer:number; difficulty:number; hint?:string };
export const QUESTIONS: Question[] = [
  {
    "id": 1,
    "category": "geografie",
    "question": "Které město je hlavním městem Austrálie?",
    "options": [
      "Sydney",
      "Melbourne",
      "Canberra",
      "Perth"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Hlavní město neleží na pobřeží."
  },
  {
    "id": 2,
    "category": "historie",
    "question": "Ve kterém roce padla Berlínská zeď?",
    "options": [
      "1987",
      "1989",
      "1991",
      "1993"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Událost se odehrála na podzim."
  },
  {
    "id": 3,
    "category": "věda",
    "question": "Jaký chemický symbol má zlato?",
    "options": [
      "Ag",
      "Gd",
      "Au",
      "Go"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Pochází z latinského názvu aurum."
  },
  {
    "id": 4,
    "category": "kultura",
    "question": "Kdo napsal román Babička?",
    "options": [
      "Karolína Světlá",
      "Božena Němcová",
      "Eliška Krásnohorská",
      "Marie Majerová"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Česká spisovatelka 19. století."
  },
  {
    "id": 5,
    "category": "sport",
    "question": "Kolik hráčů jednoho týmu je na hřišti při fotbalovém zápase?",
    "options": [
      "9",
      "10",
      "11",
      "12"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Brankář se počítá."
  },
  {
    "id": 6,
    "category": "příroda",
    "question": "Který savec klade vejce?",
    "options": [
      "Netopýr",
      "Ježura",
      "Vydra",
      "Lenochod"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Žije v Austrálii."
  },
  {
    "id": 7,
    "category": "technologie",
    "question": "Co znamená zkratka CPU?",
    "options": [
      "Central Processing Unit",
      "Computer Personal Utility",
      "Core Program Upload",
      "Central Power User"
    ],
    "answer": 0,
    "difficulty": 1,
    "hint": "Hlavní výpočetní jednotka."
  },
  {
    "id": 8,
    "category": "finance",
    "question": "Co je akcie?",
    "options": [
      "Podíl ve společnosti",
      "Druh dluhopisu",
      "Bankovní poplatek",
      "Měna"
    ],
    "answer": 0,
    "difficulty": 1,
    "hint": "Představuje vlastnický podíl."
  },
  {
    "id": 9,
    "category": "geografie",
    "question": "Která řeka protéká Prahou?",
    "options": [
      "Labe",
      "Morava",
      "Vltava",
      "Odra"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Teče také Českým Krumlovem."
  },
  {
    "id": 10,
    "category": "historie",
    "question": "Kdo byl prvním prezidentem Československa?",
    "options": [
      "Edvard Beneš",
      "Tomáš Garrigue Masaryk",
      "Milan Rastislav Štefánik",
      "Klement Gottwald"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Říkalo se mu prezident Osvoboditel."
  },
  {
    "id": 11,
    "category": "věda",
    "question": "Kolik kostí má přibližně dospělý člověk?",
    "options": [
      "106",
      "206",
      "306",
      "406"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Počet je o něco přes dvě stovky."
  },
  {
    "id": 12,
    "category": "kultura",
    "question": "Kdo složil symfonii Z Nového světa?",
    "options": [
      "Bedřich Smetana",
      "Antonín Dvořák",
      "Leo Janáček",
      "Bohuslav Martinů"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Český skladatel, který působil v USA."
  },
  {
    "id": 13,
    "category": "sport",
    "question": "Která země vyhrála první mistrovství světa ve fotbale v roce 1930?",
    "options": [
      "Brazílie",
      "Itálie",
      "Uruguay",
      "Argentina"
    ],
    "answer": 2,
    "difficulty": 2,
    "hint": "Turnaj hostila tato jihoamerická země."
  },
  {
    "id": 14,
    "category": "příroda",
    "question": "Jaký plyn rostliny přijímají při fotosyntéze?",
    "options": [
      "Kyslík",
      "Dusík",
      "Oxid uhličitý",
      "Vodík"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Jeho vzorec je CO₂."
  },
  {
    "id": 15,
    "category": "technologie",
    "question": "Která společnost vyvinula operační systém Android?",
    "options": [
      "Apple",
      "Google",
      "IBM",
      "Nokia"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Provozuje také obchod Google Play."
  },
  {
    "id": 16,
    "category": "finance",
    "question": "Co obvykle znamená zkratka IPO?",
    "options": [
      "První veřejná nabídka akcií",
      "Mezinárodní platební operace",
      "Index cen obchodů",
      "Investiční pojistná opce"
    ],
    "answer": 0,
    "difficulty": 2,
    "hint": "Firma poprvé nabídne akcie veřejnosti."
  },
  {
    "id": 17,
    "category": "geografie",
    "question": "Který stát má největší rozlohu na světě?",
    "options": [
      "Kanada",
      "Čína",
      "USA",
      "Rusko"
    ],
    "answer": 3,
    "difficulty": 1,
    "hint": "Leží v Evropě i Asii."
  },
  {
    "id": 18,
    "category": "historie",
    "question": "Která civilizace postavila Machu Picchu?",
    "options": [
      "Mayové",
      "Inkové",
      "Aztékové",
      "Olmékové"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Jejich říše měla centrum v oblasti dnešního Peru."
  },
  {
    "id": 19,
    "category": "věda",
    "question": "Jaká je chemická značka sodíku?",
    "options": [
      "S",
      "So",
      "Na",
      "Sd"
    ],
    "answer": 2,
    "difficulty": 2,
    "hint": "Pochází z latinského natrium."
  },
  {
    "id": 20,
    "category": "kultura",
    "question": "Který český spisovatel vytvořil postavu Švejka?",
    "options": [
      "Karel Čapek",
      "Jaroslav Hašek",
      "Josef Škvorecký",
      "Václav Havel"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Postava pochází ze satirického románu o první světové válce."
  },
  {
    "id": 21,
    "category": "sport",
    "question": "Kolik kruhů je v olympijském symbolu?",
    "options": [
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Symbolizují spojení pěti kontinentů."
  },
  {
    "id": 22,
    "category": "příroda",
    "question": "Které zvíře je největší žijící suchozemský savec?",
    "options": [
      "Nosorožec bílý",
      "Hroch",
      "Slon africký",
      "Žirafa"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Má velké uši a chobot."
  },
  {
    "id": 23,
    "category": "technologie",
    "question": "Co označuje zkratka URL?",
    "options": [
      "Uniform Resource Locator",
      "Universal Reading Link",
      "User Routing Language",
      "Unified Reference List"
    ],
    "answer": 0,
    "difficulty": 2,
    "hint": "Je to adresa webového zdroje."
  },
  {
    "id": 24,
    "category": "finance",
    "question": "Co je inflace?",
    "options": [
      "Pokles nezaměstnanosti",
      "Růst obecné cenové hladiny",
      "Růst hodnoty měny",
      "Pokles úrokových sazeb"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Za stejné peníze si koupíš méně."
  },
  {
    "id": 25,
    "category": "geografie",
    "question": "Na kterém kontinentu leží poušť Atacama?",
    "options": [
      "Afrika",
      "Asie",
      "Jižní Amerika",
      "Austrálie"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Nachází se v Chile."
  },
  {
    "id": 26,
    "category": "historie",
    "question": "Která událost je spojena s rokem 1215 a Anglií?",
    "options": [
      "Bitva u Hastingsu",
      "Podepsání Magny charty",
      "Začátek stoleté války",
      "Válka růží"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Dokument omezil moc panovníka."
  },
  {
    "id": 27,
    "category": "věda",
    "question": "Jaká část buňky obsahuje většinu genetické informace u člověka?",
    "options": [
      "Ribozom",
      "Jádro",
      "Cytoplazma",
      "Membrána"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Je ohraničena jadernou membránou."
  },
  {
    "id": 28,
    "category": "kultura",
    "question": "Kdo namaloval obraz Mona Lisa?",
    "options": [
      "Michelangelo",
      "Rafael",
      "Leonardo da Vinci",
      "Caravaggio"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Renesanční umělec a vynálezce."
  },
  {
    "id": 29,
    "category": "sport",
    "question": "Ve kterém sportu se používá pojem birdie?",
    "options": [
      "Tenis",
      "Golf",
      "Badminton",
      "Kriket"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Výsledek o jednu ránu pod par."
  },
  {
    "id": 30,
    "category": "příroda",
    "question": "Jak se nazývá proces, při kterém voda přechází z kapaliny na plyn?",
    "options": [
      "Kondenzace",
      "Sublimace",
      "Vypařování",
      "Tání"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Děje se například při zahřívání."
  },
  {
    "id": 31,
    "category": "technologie",
    "question": "Který jazyk se běžně používá pro stylování webových stránek?",
    "options": [
      "HTML",
      "CSS",
      "SQL",
      "Python"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Určuje barvy, rozměry a rozložení."
  },
  {
    "id": 32,
    "category": "finance",
    "question": "Co je diverzifikace portfolia?",
    "options": [
      "Nákup jediné akcie",
      "Rozložení investic mezi více aktiv",
      "Prodej všech dluhopisů",
      "Půjčka na investice"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Nesázíš vše na jednu kartu."
  },
  {
    "id": 33,
    "category": "geografie",
    "question": "Které moře omývá pobřeží Chorvatska?",
    "options": [
      "Černé",
      "Jaderské",
      "Egejské",
      "Baltské"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Nachází se mezi Itálií a Balkánem."
  },
  {
    "id": 34,
    "category": "historie",
    "question": "Který panovník je spojen s vydáním Zlaté buly sicilské pro české země?",
    "options": [
      "Karel IV.",
      "Přemysl Otakar I.",
      "Václav II.",
      "Jiří z Poděbrad"
    ],
    "answer": 1,
    "difficulty": 3,
    "hint": "Dokument vydal Fridrich II. roku 1212."
  },
  {
    "id": 35,
    "category": "věda",
    "question": "Jaká je přibližná rychlost světla ve vakuu?",
    "options": [
      "30 000 km/s",
      "150 000 km/s",
      "300 000 km/s",
      "1 000 000 km/s"
    ],
    "answer": 2,
    "difficulty": 2,
    "hint": "Přibližně 3 × 10⁵ km/s."
  },
  {
    "id": 36,
    "category": "kultura",
    "question": "Který skladatel napsal operu Prodaná nevěsta?",
    "options": [
      "Antonín Dvořák",
      "Bedřich Smetana",
      "Zdeněk Fibich",
      "Josef Suk"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Jeho další dílo je Má vlast."
  },
  {
    "id": 37,
    "category": "sport",
    "question": "Jak dlouhý je standardní maraton?",
    "options": [
      "21,1 km",
      "40 km",
      "42,195 km",
      "50 km"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Více než 42 kilometrů."
  },
  {
    "id": 38,
    "category": "příroda",
    "question": "Která planeta sluneční soustavy má největší průměr?",
    "options": [
      "Saturn",
      "Jupiter",
      "Neptun",
      "Uran"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Je to plynný obr s Velkou rudou skvrnou."
  },
  {
    "id": 39,
    "category": "technologie",
    "question": "Co je phishing?",
    "options": [
      "Typ šifrování",
      "Podvodné vylákání citlivých údajů",
      "Záložní kopie dat",
      "Síťový protokol"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Útočník často napodobuje důvěryhodnou instituci."
  },
  {
    "id": 40,
    "category": "finance",
    "question": "Co vyjadřuje dividendový výnos?",
    "options": [
      "Dividendový příjem vůči ceně akcie",
      "Celkové tržby firmy",
      "Poměr dluhu k aktivům",
      "Růst HDP"
    ],
    "answer": 0,
    "difficulty": 3,
    "hint": "Porovnává dividendu s tržní cenou akcie."
  },
  {
    "id": 41,
    "category": "geografie",
    "question": "Který průliv odděluje Evropu a Afriku?",
    "options": [
      "Bospor",
      "Gibraltarský průliv",
      "Doverský průliv",
      "Beringův průliv"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Nachází se mezi Španělskem a Marokem."
  },
  {
    "id": 42,
    "category": "historie",
    "question": "Kdo byl britskou královnou během většiny druhé světové války?",
    "options": [
      "Viktorie",
      "Alžběta II.",
      "Alžběta I.",
      "Marie Stuartovna"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Na trůn nastoupila až v roce 1952; během války byla princeznou."
  },
  {
    "id": 43,
    "category": "věda",
    "question": "Jaký je nejlehčí chemický prvek?",
    "options": [
      "Helium",
      "Vodík",
      "Lithium",
      "Kyslík"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Má protonové číslo 1."
  },
  {
    "id": 44,
    "category": "kultura",
    "question": "Který film získal Oscara za nejlepší film na 1. ročníku cen v roce 1929?",
    "options": [
      "Wings",
      "The Jazz Singer",
      "Metropolis",
      "Sunrise"
    ],
    "answer": 0,
    "difficulty": 3,
    "hint": "Němý film z prostředí první světové války."
  },
  {
    "id": 45,
    "category": "sport",
    "question": "Ve kterém roce se konaly první moderní olympijské hry?",
    "options": [
      "1888",
      "1896",
      "1900",
      "1904"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Hostily je Athény."
  },
  {
    "id": 46,
    "category": "příroda",
    "question": "Jak se nazývá věda zabývající se houbami?",
    "options": [
      "Botanika",
      "Mykologie",
      "Entomologie",
      "Herpetologie"
    ],
    "answer": 1,
    "difficulty": 3,
    "hint": "Z řeckého slova mykes."
  },
  {
    "id": 47,
    "category": "technologie",
    "question": "K čemu slouží DNS?",
    "options": [
      "Převádí doménová jména na IP adresy",
      "Zrychluje procesor",
      "Šifruje obrazovku",
      "Spravuje napájení"
    ],
    "answer": 0,
    "difficulty": 3,
    "hint": "Funguje jako telefonní seznam internetu."
  },
  {
    "id": 48,
    "category": "finance",
    "question": "Jaký je rozdíl mezi dluhopisem a akcií?",
    "options": [
      "Dluhopis je úvěrový cenný papír, akcie představuje podíl",
      "Není mezi nimi rozdíl",
      "Akcie má vždy pevný úrok",
      "Dluhopis dává hlasovací práva"
    ],
    "answer": 0,
    "difficulty": 3,
    "hint": "Držitel dluhopisu je věřitel, akcionář spoluvlastník."
  }
];
