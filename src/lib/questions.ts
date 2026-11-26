/* eslint-disable prettier/prettier */
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
  },
  {
    "id": 49,
    "category": "geografie",
    "question": "Jaké je hlavní město Islandu?",
    "options": [
      "Oslo",
      "Reykjavík",
      "Helsinky",
      "Nuuk"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Leží na jihozápadním pobřeží ostrova."
  },
  {
    "id": 50,
    "category": "geografie",
    "question": "Který oceán je rozlohou největší?",
    "options": [
      "Atlantský",
      "Indický",
      "Tichý",
      "Severní ledový"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Odděluje Asii a Austrálii od Ameriky."
  },
  {
    "id": 51,
    "category": "geografie",
    "question": "Kterým státem protéká řeka Ebro?",
    "options": [
      "Portugalsko",
      "Španělsko",
      "Francie",
      "Itálie"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Vlévá se do Středozemního moře."
  },
  {
    "id": 52,
    "category": "geografie",
    "question": "Jaké je hlavní město Kanady?",
    "options": [
      "Toronto",
      "Vancouver",
      "Ottawa",
      "Montreal"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Leží v provincii Ontario."
  },
  {
    "id": 53,
    "category": "geografie",
    "question": "Na kterém kontinentu se rozkládají Andy?",
    "options": [
      "Afrika",
      "Asie",
      "Jižní Amerika",
      "Evropa"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Táhnou se podél západního pobřeží kontinentu."
  },
  {
    "id": 54,
    "category": "geografie",
    "question": "Která země má tvar ostrova ve tvaru boty?",
    "options": [
      "Řecko",
      "Itálie",
      "Španělsko",
      "Chorvatsko"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Její hlavní město je Řím."
  },
  {
    "id": 55,
    "category": "geografie",
    "question": "Jak se jmenuje nejvyšší hora Afriky?",
    "options": [
      "Mount Kenya",
      "Kilimandžáro",
      "Atlas",
      "Ras Dašen"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Leží v Tanzanii."
  },
  {
    "id": 56,
    "category": "geografie",
    "question": "Do kterého moře ústí Dunaj?",
    "options": [
      "Jaderské",
      "Černé",
      "Baltské",
      "Rudé"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Nachází se mezi Evropou a Malou Asií."
  },
  {
    "id": 57,
    "category": "geografie",
    "question": "Které je nejhlubší jezero světa?",
    "options": [
      "Tanganika",
      "Kaspické moře",
      "Bajkal",
      "Hořejší jezero"
    ],
    "answer": 2,
    "difficulty": 2,
    "hint": "Leží na Sibiři."
  },
  {
    "id": 58,
    "category": "geografie",
    "question": "Jaké je hlavní město Japonska?",
    "options": [
      "Kjóto",
      "Ósaka",
      "Tokio",
      "Nagoja"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Je to jedna z největších metropolitních oblastí světa."
  },
  {
    "id": 59,
    "category": "geografie",
    "question": "Který stát leží na Pyrenejském poloostrově?",
    "options": [
      "Rumunsko",
      "Portugalsko",
      "Polsko",
      "Norsko"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Sdílí poloostrov se Španělskem."
  },
  {
    "id": 60,
    "category": "geografie",
    "question": "Která poušť je největší horkou pouští světa?",
    "options": [
      "Gobi",
      "Kalahari",
      "Sahara",
      "Atacama"
    ],
    "answer": 2,
    "difficulty": 2,
    "hint": "Rozkládá se v severní Africe."
  },
  {
    "id": 61,
    "category": "geografie",
    "question": "Která země má hlavní město Bern?",
    "options": [
      "Rakousko",
      "Švýcarsko",
      "Belgie",
      "Lucembursko"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Je známá kantony a Alpami."
  },
  {
    "id": 62,
    "category": "historie",
    "question": "Ve kterém roce proběhla bitva u Hastingsu?",
    "options": [
      "955",
      "1066",
      "1212",
      "1415"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Normané tehdy porazili anglosaské vojsko."
  },
  {
    "id": 63,
    "category": "historie",
    "question": "Kdo je tradičně spojován s vynálezem knihtisku v Evropě?",
    "options": [
      "Leonardo da Vinci",
      "Johannes Gutenberg",
      "Galileo Galilei",
      "Isaac Newton"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Jeho jméno nese slavná bible vytištěná kolem roku 1455."
  },
  {
    "id": 64,
    "category": "historie",
    "question": "Ve kterém roce začala Francouzská revoluce?",
    "options": [
      "1776",
      "1789",
      "1815",
      "1848"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Symbolem začátku bylo dobytí Bastily."
  },
  {
    "id": 65,
    "category": "historie",
    "question": "Jaké město bylo hlavním městem Byzantské říše?",
    "options": [
      "Řím",
      "Athény",
      "Konstantinopol",
      "Alexandrie"
    ],
    "answer": 2,
    "difficulty": 3,
    "hint": "Dnes se jmenuje Istanbul."
  },
  {
    "id": 66,
    "category": "historie",
    "question": "Kdo byl prvním českým dědičným králem?",
    "options": [
      "Karel IV.",
      "Přemysl Otakar I.",
      "Václav II.",
      "Jiří z Poděbrad"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Královský titul potvrdila Zlatá bula sicilská."
  },
  {
    "id": 67,
    "category": "historie",
    "question": "V kterém roce přistáli lidé poprvé na Měsíci?",
    "options": [
      "1957",
      "1961",
      "1969",
      "1972"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Mise Apollo 11."
  },
  {
    "id": 68,
    "category": "historie",
    "question": "Která panovnice byla známá jako Panna orleánská?",
    "options": [
      "Marie Terezie",
      "Jana z Arku",
      "Alžběta I.",
      "Kateřina Veliká"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Pomohla Francouzům během stoleté války."
  },
  {
    "id": 69,
    "category": "historie",
    "question": "Ve které dnešní zemi vznikla renesance?",
    "options": [
      "Francie",
      "Itálie",
      "Německo",
      "Anglie"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Významnými centry byly Florencie a Řím."
  },
  {
    "id": 70,
    "category": "historie",
    "question": "Kdo byl římským bohem války?",
    "options": [
      "Merkur",
      "Mars",
      "Neptun",
      "Vulkán"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Jeho řeckým protějškem byl Áres."
  },
  {
    "id": 71,
    "category": "historie",
    "question": "Která loď se potopila při své první plavbě v roce 1912?",
    "options": [
      "Lusitania",
      "Titanic",
      "Britannic",
      "Bismarck"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Narazila do ledovce v severním Atlantiku."
  },
  {
    "id": 72,
    "category": "historie",
    "question": "Kdo byl prvním císařem sjednocené Číny?",
    "options": [
      "Konfucius",
      "Čchin Š'-chuang-ti",
      "Kublaj-chán",
      "Sun Jat-sen"
    ],
    "answer": 1,
    "difficulty": 3,
    "hint": "Je spojován s terakotovou armádou."
  },
  {
    "id": 73,
    "category": "historie",
    "question": "Který dokument vyhlásil nezávislost USA v roce 1776?",
    "options": [
      "Listina práv",
      "Deklarace nezávislosti",
      "Ústava USA",
      "Magna charta"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Byl přijat 4. července."
  },
  {
    "id": 74,
    "category": "historie",
    "question": "Které město zničil výbuch Vesuvu v roce 79 n. l.?",
    "options": [
      "Sparta",
      "Pompeje",
      "Kartágo",
      "Trója"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Ruiny leží nedaleko Neapole."
  },
  {
    "id": 75,
    "category": "věda",
    "question": "Jaké pH má čistá voda při pokojové teplotě přibližně?",
    "options": [
      "2",
      "5",
      "7",
      "10"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Je považována za neutrální."
  },
  {
    "id": 76,
    "category": "věda",
    "question": "Jaký je chemický vzorec vody?",
    "options": [
      "CO₂",
      "H₂O",
      "O₂",
      "NaCl"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Molekulu tvoří dva atomy vodíku a jeden kyslíku."
  },
  {
    "id": 77,
    "category": "věda",
    "question": "Jak se nazývá přirozená družice Země?",
    "options": [
      "Mars",
      "Měsíc",
      "Titan",
      "Europa"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Je viditelná na noční obloze."
  },
  {
    "id": 78,
    "category": "věda",
    "question": "Kdo formuloval zákon všeobecné gravitace?",
    "options": [
      "Albert Einstein",
      "Isaac Newton",
      "Nikola Tesla",
      "Niels Bohr"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Anglický fyzik spojovaný s jablkem."
  },
  {
    "id": 79,
    "category": "věda",
    "question": "Jaký tvar má molekula DNA?",
    "options": [
      "Jednoduchá přímka",
      "Dvojitá šroubovice",
      "Krychle",
      "Kruh bez spirály"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Tvoří ji dva komplementární řetězce."
  },
  {
    "id": 80,
    "category": "věda",
    "question": "Kdo je spojován s vytvořením periodické tabulky prvků?",
    "options": [
      "Marie Curie-Skłodowská",
      "Dmitrij Mendělejev",
      "Louis Pasteur",
      "Robert Boyle"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Ruský chemik seřadil prvky podle vlastností."
  },
  {
    "id": 81,
    "category": "věda",
    "question": "Jaká je jednotka elektrického proudu v soustavě SI?",
    "options": [
      "Volt",
      "Watt",
      "Ampér",
      "Ohm"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Značí se písmenem A."
  },
  {
    "id": 82,
    "category": "věda",
    "question": "Který orgán lidského těla produkuje inzulin?",
    "options": [
      "Játra",
      "Slinivka břišní",
      "Ledviny",
      "Slezina"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Hormon pomáhá regulovat hladinu krevního cukru."
  },
  {
    "id": 83,
    "category": "věda",
    "question": "Kolik planet má Sluneční soustava?",
    "options": [
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Pluto je dnes klasifikováno jako trpasličí planeta."
  },
  {
    "id": 84,
    "category": "věda",
    "question": "Jak se nazývá přeměna pevné látky přímo na plyn?",
    "options": [
      "Kondenzace",
      "Sublimace",
      "Tuhnutí",
      "Tání"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Příkladem je postupné mizení suchého ledu."
  },
  {
    "id": 85,
    "category": "věda",
    "question": "Jaká je nejmenší jednotka chemického prvku, která si zachovává jeho vlastnosti?",
    "options": [
      "Molekula",
      "Atom",
      "Buňka",
      "Ion"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Skládá se z jádra a elektronového obalu."
  },
  {
    "id": 86,
    "category": "věda",
    "question": "Který vitamín si tělo vytváří v kůži působením slunečního záření?",
    "options": [
      "Vitamín A",
      "Vitamín C",
      "Vitamín D",
      "Vitamín K"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Je důležitý pro zdraví kostí."
  },
  {
    "id": 87,
    "category": "věda",
    "question": "Jak se nazývá vědní obor zabývající se zemětřesením?",
    "options": [
      "Meteorologie",
      "Seismologie",
      "Oceanografie",
      "Genetika"
    ],
    "answer": 1,
    "difficulty": 3,
    "hint": "Studuje šíření seismických vln."
  },
  {
    "id": 88,
    "category": "kultura",
    "question": "Kdo napsal tragédii Hamlet?",
    "options": [
      "Charles Dickens",
      "William Shakespeare",
      "Oscar Wilde",
      "George Orwell"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Anglický dramatik z období renesance."
  },
  {
    "id": 89,
    "category": "kultura",
    "question": "Kdo je autorem knihy Malý princ?",
    "options": [
      "Jules Verne",
      "Antoine de Saint-Exupéry",
      "Victor Hugo",
      "Albert Camus"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Francouzský spisovatel a pilot."
  },
  {
    "id": 90,
    "category": "kultura",
    "question": "Kdo namaloval obraz Hvězdná noc?",
    "options": [
      "Claude Monet",
      "Vincent van Gogh",
      "Pablo Picasso",
      "Salvador Dalí"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Postimpresionistický malíř z Nizozemska."
  },
  {
    "id": 91,
    "category": "kultura",
    "question": "Který český skladatel složil cyklus Má vlast?",
    "options": [
      "Antonín Dvořák",
      "Bedřich Smetana",
      "Josef Suk",
      "Bohuslav Martinů"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Obsahuje symfonickou báseň Vltava."
  },
  {
    "id": 92,
    "category": "kultura",
    "question": "Kdo napsal román 1984?",
    "options": [
      "Aldous Huxley",
      "George Orwell",
      "Ray Bradbury",
      "H. G. Wells"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Dystopie popisuje totalitní režim a Velkého bratra."
  },
  {
    "id": 93,
    "category": "kultura",
    "question": "Který architektonický sloh je typický lomeným obloukem?",
    "options": [
      "Románský",
      "Gotický",
      "Barokní",
      "Secesní"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Najdeme jej na katedrálách."
  },
  {
    "id": 94,
    "category": "kultura",
    "question": "Ve kterém městě se nachází galerie Louvre?",
    "options": [
      "Londýn",
      "Paříž",
      "Madrid",
      "Florencie"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Muzeum sídlí v bývalém královském paláci."
  },
  {
    "id": 95,
    "category": "kultura",
    "question": "Kdo napsal román Vojna a mír?",
    "options": [
      "Fjodor Dostojevskij",
      "Lev Nikolajevič Tolstoj",
      "Anton Čechov",
      "Ivan Turgeněv"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Ruský autor zachytil napoleonské války."
  },
  {
    "id": 96,
    "category": "kultura",
    "question": "Který hudební nástroj má obvykle 88 kláves?",
    "options": [
      "Varhany",
      "Klavír",
      "Akordeon",
      "Cembalo"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Má černé a bílé klávesy."
  },
  {
    "id": 97,
    "category": "kultura",
    "question": "Kdo režíroval filmový snímek Občan Kane?",
    "options": [
      "Alfred Hitchcock",
      "Orson Welles",
      "Stanley Kubrick",
      "Billy Wilder"
    ],
    "answer": 1,
    "difficulty": 3,
    "hint": "Film z roku 1941 je často řazen mezi nejvýznamnější v historii."
  },
  {
    "id": 98,
    "category": "kultura",
    "question": "Které město je spojeno s operním domem La Scala?",
    "options": [
      "Vídeň",
      "Milán",
      "Benátky",
      "Neapol"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Leží v severní Itálii."
  },
  {
    "id": 99,
    "category": "kultura",
    "question": "Který český výtvarník je známý secesními plakáty?",
    "options": [
      "Alfons Mucha",
      "Josef Lada",
      "František Kupka",
      "Mikoláš Aleš"
    ],
    "answer": 0,
    "difficulty": 1,
    "hint": "Jeho styl je známý dekorativními ženskými postavami."
  },
  {
    "id": 100,
    "category": "kultura",
    "question": "Jak se nazývá báseň o čtrnácti verších s tradiční strukturou?",
    "options": [
      "Haiku",
      "Sonet",
      "Balada",
      "Óda"
    ],
    "answer": 1,
    "difficulty": 3,
    "hint": "Často se skládá ze dvou čtyřverší a dvou trojverší."
  },
  {
    "id": 101,
    "category": "sport",
    "question": "Kolik hráčů jednoho týmu je na hřišti v basketbalu?",
    "options": [
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Na palubovce je současně pět hráčů."
  },
  {
    "id": 102,
    "category": "sport",
    "question": "Na jakém povrchu se tradičně hraje tenisový turnaj Roland-Garros?",
    "options": [
      "Tráva",
      "Tvrdý povrch",
      "Antuka",
      "Dřevo"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Je to oranžovočervený povrch."
  },
  {
    "id": 103,
    "category": "sport",
    "question": "Kolik hráčů jednoho hokejového týmu bývá na ledě včetně brankáře?",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Pět hráčů v poli a jeden brankář."
  },
  {
    "id": 104,
    "category": "sport",
    "question": "Ve kterém sportu se závodí na Tour de France?",
    "options": [
      "Běh",
      "Cyklistika",
      "Lyžování",
      "Automobilové závody"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Jde o etapový závod na kole."
  },
  {
    "id": 105,
    "category": "sport",
    "question": "Kolik setů musí muž vyhrát v běžném grandslamovém tenisovém zápase?",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": 2,
    "difficulty": 2,
    "hint": "Hraje se na tři vítězné sety."
  },
  {
    "id": 106,
    "category": "sport",
    "question": "Který sportovec je známý přezdívkou The Greatest a byl legendou boxu?",
    "options": [
      "Mike Tyson",
      "Muhammad Ali",
      "Joe Frazier",
      "Rocky Marciano"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Boxoval také pod jménem Cassius Clay."
  },
  {
    "id": 107,
    "category": "sport",
    "question": "Jaká je standardní délka olympijského bazénu?",
    "options": [
      "25 m",
      "33 m",
      "50 m",
      "100 m"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Používá se pro dlouhý bazén."
  },
  {
    "id": 108,
    "category": "sport",
    "question": "Která země je tradičně spojována se vznikem juda?",
    "options": [
      "Čína",
      "Japonsko",
      "Korea",
      "Thajsko"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Zakladatelem byl Džigoró Kanó."
  },
  {
    "id": 109,
    "category": "sport",
    "question": "Kolik bodů má touchdown v americkém fotbale před následným pokusem?",
    "options": [
      "3",
      "5",
      "6",
      "7"
    ],
    "answer": 2,
    "difficulty": 3,
    "hint": "Skórující tým pak může získat další bod či dva."
  },
  {
    "id": 110,
    "category": "sport",
    "question": "Ve kterém sportu se používá puk?",
    "options": [
      "Lakros",
      "Lední hokej",
      "Florbal",
      "Pozemní hokej"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Hraje se na ledě s hokejkami."
  },
  {
    "id": 111,
    "category": "sport",
    "question": "Který turnaj tvoří s Wimbledonem tenisovou grandslamovou čtveřici?",
    "options": [
      "Davis Cup",
      "US Open",
      "Laver Cup",
      "Hopman Cup"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Koná se v New Yorku."
  },
  {
    "id": 112,
    "category": "sport",
    "question": "Jak se nazývá šachová situace, kdy král nemá legální tah a není v šachu?",
    "options": [
      "Mat",
      "Pat",
      "Rošáda",
      "Vidlička"
    ],
    "answer": 1,
    "difficulty": 3,
    "hint": "Partie končí remízou."
  },
  {
    "id": 113,
    "category": "sport",
    "question": "Který atletický běh se běží na 110 metrů s překážkami v mužské kategorii?",
    "options": [
      "Sprint",
      "Překážkový běh",
      "Steeplechase",
      "Štafeta"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Závodníci překonávají deset překážek."
  },
  {
    "id": 114,
    "category": "příroda",
    "question": "Které zvíře je největším žijícím živočichem?",
    "options": [
      "Slon africký",
      "Žralok bílý",
      "Plejtvák obrovský",
      "Žirafa"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Je to mořský savec."
  },
  {
    "id": 115,
    "category": "příroda",
    "question": "Který z uvedených živočichů je pták, přestože nelétá?",
    "options": [
      "Netopýr",
      "Tučňák",
      "Veverka",
      "Létající ryba"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Výborně plave a žije převážně na jižní polokouli."
  },
  {
    "id": 116,
    "category": "příroda",
    "question": "Čím se živí koala převážně?",
    "options": [
      "Bambusem",
      "Eukalyptovými listy",
      "Hmyzem",
      "Rybami"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Žije v Austrálii."
  },
  {
    "id": 117,
    "category": "příroda",
    "question": "Která skupina živočichů prochází proměnou z pulce v dospělce?",
    "options": [
      "Plazi",
      "Obojživelníci",
      "Savci",
      "Ptáci"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Typickým příkladem je žába."
  },
  {
    "id": 118,
    "category": "příroda",
    "question": "Jak se nazývá největší deštný prales světa?",
    "options": [
      "Kongo",
      "Amazonie",
      "Borneo",
      "Daintree"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Rozkládá se především v Jižní Americe."
  },
  {
    "id": 119,
    "category": "příroda",
    "question": "Která část rostliny obvykle přijímá vodu z půdy?",
    "options": [
      "Květ",
      "List",
      "Kořen",
      "Stonek"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Zajišťuje také ukotvení rostliny."
  },
  {
    "id": 120,
    "category": "příroda",
    "question": "Který savec je známý echolokací a schopností orientace pomocí zvuků?",
    "options": [
      "Delfín",
      "Jelen",
      "Kůň",
      "Panda"
    ],
    "answer": 0,
    "difficulty": 2,
    "hint": "Využívá odrazy zvukových vln."
  },
  {
    "id": 121,
    "category": "příroda",
    "question": "Jak se nazývá sezónní přesun ptáků do teplejších oblastí?",
    "options": [
      "Hibernace",
      "Migrace",
      "Mimikry",
      "Metamorfóza"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Například čápi odlétají na jih."
  },
  {
    "id": 122,
    "category": "příroda",
    "question": "Který strom produkuje žaludy?",
    "options": [
      "Buk",
      "Dub",
      "Javor",
      "Bříza"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Jeho plodem je žalud."
  },
  {
    "id": 123,
    "category": "příroda",
    "question": "Jak se nazývá věda o hmyzu?",
    "options": [
      "Ornitologie",
      "Entomologie",
      "Ichtyologie",
      "Botanika"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Zkoumá například motýly a brouky."
  },
  {
    "id": 124,
    "category": "příroda",
    "question": "Která planeta je známá výrazným systémem prstenců?",
    "options": [
      "Mars",
      "Saturn",
      "Merkur",
      "Venuše"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Jeho prstence tvoří led a kamenné částice."
  },
  {
    "id": 125,
    "category": "příroda",
    "question": "Který oceán je domovem Velkého bariérového útesu?",
    "options": [
      "Atlantský",
      "Tichý",
      "Indický",
      "Jižní"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Útes leží u pobřeží Austrálie."
  },
  {
    "id": 126,
    "category": "příroda",
    "question": "Jak se nazývá proces, při kterém živočichové ukládají energii do zimního spánku?",
    "options": [
      "Migrace",
      "Hibernace",
      "Fotosyntéza",
      "Osmóza"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Typicky jej využívají někteří savci."
  },
  {
    "id": 127,
    "category": "technologie",
    "question": "Co znamená zkratka HTTP?",
    "options": [
      "HyperText Transfer Protocol",
      "High Tech Text Program",
      "Host Transfer Terminal Process",
      "Hyperlink Text Tool"
    ],
    "answer": 0,
    "difficulty": 2,
    "hint": "Používá se při přenosu webových stránek."
  },
  {
    "id": 128,
    "category": "technologie",
    "question": "Jaká číselná soustava používá pouze číslice 0 a 1?",
    "options": [
      "Desítková",
      "Osmičková",
      "Dvojková",
      "Šestnáctková"
    ],
    "answer": 2,
    "difficulty": 1,
    "hint": "Je základem digitální elektroniky."
  },
  {
    "id": 129,
    "category": "technologie",
    "question": "Co je RAM v počítači?",
    "options": [
      "Trvalé úložiště",
      "Operační paměť",
      "Grafická karta",
      "Napájecí zdroj"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Uchovává dočasná data při běhu programů."
  },
  {
    "id": 130,
    "category": "technologie",
    "question": "K čemu slouží QR kód?",
    "options": [
      "Komprimuje video",
      "Ukládá strojově čitelné informace",
      "Chrání Wi-Fi",
      "Měří rychlost internetu"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Lze jej načíst fotoaparátem telefonu."
  },
  {
    "id": 131,
    "category": "technologie",
    "question": "Která z možností je operační systém?",
    "options": [
      "Python",
      "Linux",
      "HTML",
      "SQL"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Jeho distribuce se používají na počítačích i serverech."
  },
  {
    "id": 132,
    "category": "technologie",
    "question": "Co označuje zkratka AI v technologii?",
    "options": [
      "Automated Internet",
      "Artificial Intelligence",
      "Analog Input",
      "Active Interface"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Česky umělá inteligence."
  },
  {
    "id": 133,
    "category": "technologie",
    "question": "Která firma vyvíjí procesory řady Ryzen?",
    "options": [
      "Intel",
      "AMD",
      "NVIDIA",
      "Qualcomm"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Je významným výrobcem procesorů a grafických čipů."
  },
  {
    "id": 134,
    "category": "technologie",
    "question": "Co je open-source software?",
    "options": [
      "Software bez grafiky",
      "Software s veřejně dostupným zdrojovým kódem",
      "Software jen pro firmy",
      "Software bez licence"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Uživatelé mohou za podmínek licence kód studovat a upravovat."
  },
  {
    "id": 135,
    "category": "technologie",
    "question": "Jaký účel má firewall?",
    "options": [
      "Zrychluje monitor",
      "Filtruje síťový provoz podle pravidel",
      "Zvětšuje RAM",
      "Zálohuje fotografie"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Pomáhá chránit síť před nežádoucím přístupem."
  },
  {
    "id": 136,
    "category": "technologie",
    "question": "K čemu slouží šifrování dat?",
    "options": [
      "Zmenšení souboru",
      "Ochrana čitelnosti dat bez klíče",
      "Zrychlení procesoru",
      "Odstranění metadat"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Bez správného klíče nelze obsah snadno přečíst."
  },
  {
    "id": 137,
    "category": "technologie",
    "question": "Který jazyk se často používá pro dotazování v relačních databázích?",
    "options": [
      "CSS",
      "SQL",
      "SVG",
      "Bash"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Jeho název znamená Structured Query Language."
  },
  {
    "id": 138,
    "category": "technologie",
    "question": "Co je cloud computing?",
    "options": [
      "Výpočet na grafické kartě",
      "Využívání vzdálených výpočetních a úložných služeb přes síť",
      "Lokální tisk dokumentů",
      "Záloha na CD"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Typicky využívá servery dostupné přes internet."
  },
  {
    "id": 139,
    "category": "finance",
    "question": "Která instituce určuje měnovou politiku eurozóny?",
    "options": [
      "Evropská centrální banka",
      "Světová banka",
      "Evropská investiční banka",
      "Evropský parlament"
    ],
    "answer": 0,
    "difficulty": 2,
    "hint": "Její sídlo je ve Frankfurtu nad Mohanem."
  },
  {
    "id": 140,
    "category": "finance",
    "question": "Jak se jmenuje centrální banka České republiky?",
    "options": [
      "Česká spořitelna",
      "Česká národní banka",
      "Ministerstvo financí",
      "Komerční banka"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Zkratka názvu jsou tři písmena."
  },
  {
    "id": 141,
    "category": "finance",
    "question": "Co je složené úročení?",
    "options": [
      "Úrok se počítá jen z původního vkladu",
      "Úrok se počítá i z dříve připsaných úroků",
      "Úrok se nikdy nepřipisuje",
      "Úrok se odečítá od jistiny"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Efekt se často označuje jako úročení úroků."
  },
  {
    "id": 142,
    "category": "finance",
    "question": "Co označuje likvidita aktiva?",
    "options": [
      "Jeho rizikovost",
      "Jak snadno jej lze směnit za peníze bez výrazné ztráty hodnoty",
      "Jeho daňovou sazbu",
      "Roční výnos"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Hotovost je velmi likvidní."
  },
  {
    "id": 143,
    "category": "finance",
    "question": "Jak se označuje trh, na kterém ceny obecně dlouhodobě rostou?",
    "options": [
      "Medvědí trh",
      "Býčí trh",
      "Boční trh",
      "Primární trh"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Anglicky se mu říká bull market."
  },
  {
    "id": 144,
    "category": "finance",
    "question": "Co je ETF?",
    "options": [
      "Burzovně obchodovaný fond",
      "Druh bankovního účtu",
      "Daňový formulář",
      "Pojištění vkladů"
    ],
    "answer": 0,
    "difficulty": 1,
    "hint": "Jeho podíly se obchodují na burze."
  },
  {
    "id": 145,
    "category": "finance",
    "question": "Co představuje kupon u běžného dluhopisu?",
    "options": [
      "Pravidelnou úrokovou platbu",
      "Poplatek za nákup akcie",
      "Daň z dividend",
      "Splatnost jistiny"
    ],
    "answer": 0,
    "difficulty": 2,
    "hint": "Emitent jej vyplácí držiteli podle podmínek dluhopisu."
  },
  {
    "id": 146,
    "category": "finance",
    "question": "Co je hrubý domácí produkt (HDP)?",
    "options": [
      "Celkový státní dluh",
      "Hodnota finálních statků a služeb vyrobených v ekonomice za období",
      "Počet zaměstnaných osob",
      "Roční rozpočet vlády"
    ],
    "answer": 1,
    "difficulty": 2,
    "hint": "Často se používá k měření velikosti ekonomiky."
  },
  {
    "id": 147,
    "category": "finance",
    "question": "Co znamená, že je měna apreciující?",
    "options": [
      "Její hodnota vůči jiné měně roste",
      "Její hodnota vůči jiné měně klesá",
      "Je zrušena centrální bankou",
      "Má pevnou hodnotu vůči zlatu"
    ],
    "answer": 0,
    "difficulty": 3,
    "hint": "Jde o posilování měnového kurzu."
  },
  {
    "id": 148,
    "category": "finance",
    "question": "Co je spread při obchodování?",
    "options": [
      "Rozdíl mezi nákupní a prodejní cenou",
      "Roční dividenda",
      "Daň z kapitálového zisku",
      "Objem hotovosti na účtu"
    ],
    "answer": 0,
    "difficulty": 2,
    "hint": "Bývá měřen jako rozdíl mezi bid a ask."
  },
  {
    "id": 149,
    "category": "finance",
    "question": "Který ukazatel vyjadřuje poměr ceny akcie k zisku na akcii?",
    "options": [
      "P/E",
      "ROE",
      "GDP",
      "CPI"
    ],
    "answer": 0,
    "difficulty": 3,
    "hint": "Zkratka znamená price-to-earnings ratio."
  },
  {
    "id": 150,
    "category": "finance",
    "question": "Co je státní rozpočet?",
    "options": [
      "Soupis všech soukromých účtů",
      "Plán příjmů a výdajů státu na určité období",
      "Seznam firem obchodovaných na burze",
      "Souhrn devizových rezerv bank"
    ],
    "answer": 1,
    "difficulty": 1,
    "hint": "Obvykle se sestavuje na jeden rozpočtový rok."
  }
];
