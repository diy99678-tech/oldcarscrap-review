// Sentence pools. Rule: a sentence may only state what the customer ticked
// (vehicle, condition, a good or a bad point, the stars). No invented details.
// Sentences carry no final punctuation; the generator adds it.
// Placeholders: {gaadi} = the vehicle, {biz} = the business, {place} = Indore / Dhar Road.

// masc: Hindi treats truck / heavy vehicle as masculine ("mera truck ... ho gaya tha"),
// car / bus / gaadi as feminine. Masculine vehicles open with OPENERS_M; the other pools
// only use {gaadi} where the gender does not show ("truck ka sahi daam mila").
export const VEHICLE = {
  car: { masc: false, words: ["car", "gaadi"] },
  bus: { masc: false, words: ["bus", "gaadi"] },
  truck: { masc: true, words: ["truck", "gaadi"] },
  heavy: { masc: true, words: ["heavy vehicle", "gaadi"] },
};

export const OPENERS = {
  old15: [
    "meri {gaadi} 15 saal se upar ki ho gayi thi",
    "{gaadi} 15 saal purani ho chuki thi isliye scrap karwana tha",
    "15 saal poore ho gaye the {gaadi} ke, ab chalana allowed nahi tha",
    "hamari {gaadi} ki age 15 saal cross ho gayi thi",
    "15 saal wale rule ki wajah se {gaadi} scrap karni thi",
    "{gaadi} ka 15 saal ho gaya tha, road pe chala nahi sakte the",
    "purani 15 saal wali {gaadi} thi, scrap ke alawa koi option nahi tha",
  ],
  accident: [
    "accident ke baad {gaadi} repair ke layak nahi bachi thi",
    "accident wali {gaadi} thi, samajh nahi aa raha tha kya karein",
    "accident ke baad se {gaadi} bas khadi thi",
    "{gaadi} accident me kaafi damage ho gayi thi",
    "accident hui {gaadi} ko scrap me dena tha",
    "damage {gaadi} thi accident wali, isliye scrap ka socha",
  ],
  broken: [
    "{gaadi} kaafi time se band padi thi",
    "kharab {gaadi} thi, kisi kaam ki nahi rahi thi",
    "band padi {gaadi} ne bas jagah gher rakhi thi",
    "{gaadi} chal nahi rahi thi, kab se khadi thi",
    "kharab padi {gaadi} ka kuch karna tha",
    "{gaadi} lambe time se kharab thi",
  ],
  plain: [
    "apni purani {gaadi} scrap karwani thi",
    "{gaadi} scrap me deni thi",
    "purani {gaadi} scrap ke liye di thi",
    "{gaadi} scrap karwane ke liye contact kiya tha",
    "scrap ke liye {gaadi} di thi {biz} ko",
    "{place} me {gaadi} scrap karwani thi",
  ],
};

// Same situations for a masculine vehicle; {vahan} = "truck" / the model the customer typed.
export const OPENERS_M = {
  old15: [
    "mera {vahan} 15 saal se upar ka ho gaya tha",
    "{vahan} 15 saal purana ho chuka tha isliye scrap karwana tha",
    "15 saal poore ho gaye the {vahan} ke, ab chalana allowed nahi tha",
    "15 saal wale rule ki wajah se {vahan} scrap karna tha",
    "purana 15 saal wala {vahan} tha, scrap ke alawa koi option nahi tha",
  ],
  accident: [
    "accident ke baad {vahan} repair ke layak nahi bacha tha",
    "accident wala {vahan} tha, samajh nahi aa raha tha kya karein",
    "accident ke baad se {vahan} bas khada tha",
    "{vahan} accident me kaafi damage ho gaya tha",
  ],
  broken: [
    "{vahan} kaafi time se band pada tha",
    "kharab {vahan} tha, kisi kaam ka nahi raha tha",
    "band pade {vahan} ne bas jagah gher rakhi thi",
    "{vahan} lambe time se kharab tha",
  ],
  plain: [
    "apna purana {vahan} scrap karwana tha",
    "{vahan} scrap me dena tha",
    "purana {vahan} scrap ke liye diya tha",
    "{vahan} scrap karwane ke liye contact kiya tha",
    "{place} me {vahan} scrap karwana tha",
  ],
};

// Optional middle line naming the business.
export const BIZ_LINES = [
  "{biz} ko call kiya",
  "{biz} se baat ki",
  "{biz} ka number mila to call kar liya",
  "{biz} se kaam karwaya",
  "{biz} ko contact kiya",
];

export const GOOD = {
  pickup: [
    "ghar se hi {gaadi} utha ke le gaye, pickup ka koi charge nahi liya",
    "pickup free tha aur time pe aa gaye",
    "khud le jaane ki zarurat nahi padi, team ghar aa ke le gayi",
    "free pickup wali baat sach me sahi nikli",
    "pickup ke liye alag se paisa nahi maanga",
    "jo time bola tha usi time pickup ke liye aa gaye",
    "ghar ke bahar se hi pickup ho gaya",
    "pickup ki tension hi nahi leni padi",
  ],
  rate: [
    "rate sahi diya",
    "jo rate phone pe bataya wahi diya, baad me koi kat-kat nahi",
    "price ko le ke koi chik-chik nahi hui",
    "rate fair tha",
    "rate pe koi ghuma-phira ke baat nahi ki",
    "{gaadi} ka sahi daam mila",
    "rate jo bola wahi mila",
    "rate bhi theek mila",
  ],
  payment: [
    "payment turant mil gaya",
    "paise wahi ke wahi de diye, koi wait nahi",
    "payment me koi der nahi hui",
    "{gaadi} uthate hi payment ho gaya",
    "payment haath ke haath ho gaya",
    "paise ke liye ek baar bhi follow up nahi karna pada",
    "payment same time pe clear",
  ],
  paperwork: [
    "RC cancel ka kaam bhi inhone hi karwa diya",
    "scrap certificate (CD) bhi mil gaya, ab koi tension nahi",
    "paperwork ka sara jhanjhat inhone sambhal liya",
    "RC cancel aur certificate dono ka process aasaan raha",
    "documents ka kaam clear tha, CD haath me mil gaya",
    "RTO ke chakkar nahi kaatne pade",
    "RC cancel aur CD ka kaam bina tension ke ho gaya",
  ],
  staff: [
    "staff ka behaviour accha tha",
    "team ne achhe se baat ki, sab samjha diya",
    "phone pe bhi aaram se baat karte hain",
    "team polite thi",
    "saare sawal ka seedha jawab diya",
    "baat karne ka tareeka accha laga",
    "bande sahi the, koi jaldbaazi nahi",
  ],
  fast: [
    "kaam jaldi ho gaya",
    "zyada time nahi laga, kaam fataafat ho gaya",
    "koi lamba process nahi, simple tha",
    "ek call kiya aur baaki sab inhone dekh liya",
    "pura process smooth aur jaldi",
    "time waste nahi hua",
  ],
};

export const BAD = {
  pickup_late: [
    "pickup ke liye bola tha par time pe nahi aaye",
    "pickup me kaafi der hui",
    "pickup ke liye baar baar yaad dilana pada",
    "pickup ka time aage badhate rahe",
  ],
  rate_low: [
    "rate expectation se kam mila",
    "phone pe jo rate bataya tha usse kam diya",
    "rate thoda aur sahi ho sakta tha",
    "rate pe baad me kat-kat ki",
  ],
  payment_late: [
    "payment me der hui",
    "paise ke liye wait karna pada",
    "payment ke liye follow up karna pada",
  ],
  paper_late: [
    "RC cancel aur certificate me kaafi time laga",
    "CD milne me der hui",
    "paperwork ka update time pe nahi mila",
  ],
  staff_bad: [
    "baat karne ka tareeka theek nahi laga",
    "staff ka behaviour aur accha ho sakta tha",
    "sawal puchne pe seedha jawab nahi mila",
  ],
  calls: [
    "baar baar call karna pada",
    "phone kam uthate hain",
    "update ke liye khud call karna padta tha",
  ],
};

// 3-star reviews put the bad points after the good ones with one of these.
export const BUT = ["par", "lekin", "bas", "haan,"];

// Merge two sentences into one.
export const JOIN = [", aur ", " aur ", ", ", " - ", ", saath hi "];

export const CLOSERS = {
  5: [
    "recommend karunga",
    "jinko bhi purani gaadi scrap karwani ho, inse baat kar lo",
    "overall badiya experience",
    "thank you {biz}",
    "{place} me scrap ke liye sahi jagah hai",
    "bina tension ke kaam ho gaya, thanks",
    "ekdum sahi service",
    "full satisfied",
    "trusted log hain",
    "aage bhi zarurat padi to inhi ko bulaunga",
    "badiya kaam {biz}",
    "sabko suggest karunga",
    "bharose layak log",
    "dil se thanks",
    "khush hu service se",
    "paisa vasool service",
  ],
  4: [
    "overall accha experience raha",
    "sahi kaam kiya",
    "accha laga deal karke",
    "recommend kar sakte hain",
    "kaam sahi tarike se hua",
    "theek service, thanks {biz}",
  ],
  3: [
    "theek-thaak experience raha",
    "kaam ho gaya, par improve kar sakte hain",
    "average raha",
    "chalo kaam to ho gaya",
  ],
  2: [
    "improve karne ki zarurat hai",
    "expectation se kam raha experience",
    "aur behtar ho sakta tha",
  ],
  1: [
    "accha experience nahi raha",
    "sudhar ki bahut zarurat hai",
    "bilkul satisfied nahi hu",
  ],
};

// Used when the customer ticked no points at all.
export const GENERAL = {
  pos: [
    "sab kuch smoothly ho gaya", "koi problem nahi aayi", "kaam bilkul sahi hua", "process easy tha",
    "jaisa bola waisa hi kiya", "koi jhanjhat nahi hua", "pura kaam bina dikkat ke ho gaya",
    "shuru se end tak sab clear tha", "kahin koi chhupa hua charge nahi tha", "seedha aur saaf kaam",
    "ek baar me kaam ho gaya", "bahut aasaan laga pura process", "koi bhaag-daud nahi karni padi",
    "kaam ekdum professional tarike se hua", "jo bola wo kiya",
  ],
  mid: [
    "kaam ho gaya, theek tha", "thik-thak raha sab", "kuch cheezein sahi thi, kuch nahi",
    "na zyada accha na bura", "kaam to hua par thoda time laga", "chalo jaise taise ho gaya",
  ],
  neg: [
    "experience accha nahi raha", "kaam me dikkat aayi", "jaisa socha tha waisa nahi hua",
    "jo bola tha waisa nahi hua", "bahut pareshani hui", "process me kaafi dikkat aayi",
  ],
};

// Spellings people actually type. One choice per review keeps a "writer" consistent.
export const SPELLINGS = {
  bahut: ["bahut", "bohot", "bahot", "bht"],
  accha: ["accha", "acha", "achha"],
  achhe: ["achhe", "acche", "ache"],
  theek: ["theek", "thik"],
  nahi: ["nahi", "nhi", "nahin"],
  kaafi: ["kaafi", "kafi"],
  zarurat: ["zarurat", "jarurat", "zaroorat"],
  badiya: ["badiya", "badhiya", "bdiya"],
  thanks: ["thanks", "thank you", "thnx", "thanku"],
  tension: ["tension", "tension", "tension", "tention"],
};

export const EMOJI = ["👍", "🙏", "👌", "💯", "👍👍"];
