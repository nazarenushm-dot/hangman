// ============================================================
//  HERBIE HANGMAN — word list and trivia
//  Edit freely! Each word needs: word, category, clue.
//  Clues should be vague — they're the "hint" players earn.
// ============================================================

const WORDS = [
  // ---- Buildings & places ----
  { word: "LOVE LIBRARY",        category: "Building", clue: "Quiet floors, late nights, and a name that sounds romantic." },
  { word: "NEBRASKA UNION",      category: "Building", clue: "City Campus's living room — food, meetings and a place to nap." },
  { word: "MEMORIAL STADIUM",    category: "Place",    clue: "On fall Saturdays it becomes one of the state's biggest 'cities.'" },
  { word: "PINNACLE BANK ARENA", category: "Place",    clue: "A downtown home court that opened in 2013." },
  { word: "DEVANEY CENTER",      category: "Building", clue: "Named for a coach, but these days it's all about digs and kills." },
  { word: "HAYMARKET",           category: "Place",    clue: "Brick streets and restaurants just west of campus." },
  { word: "EAST CAMPUS",         category: "Place",    clue: "Greener, quieter, and a shuttle ride away." },
  { word: "DAIRY STORE",         category: "Place",    clue: "A sweet scoop made by the university itself." },
  { word: "SHELDON",             category: "Building", clue: "A travertine landmark full of paintings and sculpture." },
  { word: "MORRILL HALL",        category: "Building", clue: "A very large, very old resident stands guard out front." },
  { word: "ANDERSEN HALL",       category: "Building", clue: "Where future reporters (maybe even ours) take class." },
  { word: "LIED CENTER",         category: "Building", clue: "Touring shows play here — and no, it doesn't rhyme with 'fried.'" },
  { word: "INNOVATION CAMPUS",   category: "Place",    clue: "Used to host the state fair; now it hosts startups and research." },
  { word: "CAMPUS REC",          category: "Place",    clue: "Climbing wall, pools and pickup games." },
  { word: "SELLECK",             category: "Building", clue: "An old-school residence hall built around a quad." },
  { word: "ABEL HALL",           category: "Building", clue: "A tall residence hall with a twin-ish partner next door." },
  { word: "RAIKES SCHOOL",       category: "Place",    clue: "An honors program where code meets business." },
  { word: "THE RAILYARD",        category: "Place",    clue: "Downtown hangout built around one very big screen." },

  // ---- Traditions, terms & slang ----
  { word: "RUNZA",               category: "Term",     clue: "A bread pocket that every Nebraskan has opinions about." },
  { word: "BIG RED",             category: "Term",     clue: "Two words, one color, a whole state." },
  { word: "SEA OF RED",          category: "Term",     clue: "What the stands look like from the press box." },
  { word: "GO BIG RED",          category: "Term",     clue: "Three words you'll hear at every game (and the grocery store)." },
  { word: "TUNNEL WALK",         category: "Tradition",clue: "Synth music starts and goosebumps follow." },
  { word: "BLACKSHIRTS",         category: "Term",     clue: "An honor earned on defense, not a dress code." },
  { word: "CORNHUSKERS",         category: "Term",     clue: "The full name, not the short one." },
  { word: "SELLOUT STREAK",      category: "Tradition",clue: "Something the stadium has kept going since the Kennedy years." },
  { word: "HERBIE HUSKER",       category: "Mascot",   clue: "You're looking at him." },
  { word: "LIL RED",             category: "Mascot",   clue: "A sidekick who's mostly air." },
  { word: "SCARLET AND CREAM",   category: "Term",     clue: "The official answer to 'what are the school colors?'" },
  { word: "O STREET",            category: "Place",    clue: "A single letter names this long Lincoln road." },
  { word: "MYRED",               category: "Term",     clue: "Where you go to register for classes and panic about grades." },
  { word: "CANVAS",              category: "Term",     clue: "Assignments, due dates and that one discussion post." },
  { word: "NCARD",               category: "Term",     clue: "ID, meal plan and door key in one piece of plastic." },
  { word: "STARTRAN",            category: "Term",     clue: "Your ride around Lincoln that isn't your own car." },
  { word: "BIG TEN",             category: "Term",     clue: "A conference whose name stopped matching its member count a long time ago." },
  { word: "DEAD WEEK",           category: "Term",     clue: "Sounds grim. It's just the stretch before finals." },
  { word: "HUSKER NATION",       category: "Term",     clue: "Everyone in red, everywhere." },
  { word: "HOMECOMING",          category: "Tradition",clue: "A fall week of parades, alumni and royalty." },
  { word: "VOLLEYBALL DAY",      category: "Tradition",clue: "A world record crowd for a sport usually played indoors." },
  { word: "VALENTINOS",          category: "Term",     clue: "A Lincoln-born pizza buffet." },

  // ---- People ----
  { word: "TOM OSBORNE",         category: "Person",   clue: "Three national titles from the sideline, then a trip to Congress." },
  { word: "JOHN COOK",           category: "Person",   clue: "Built a volleyball dynasty with four national titles." },
];

// Trivia: the FIRST answer is always the correct one (it gets shuffled in-game).
const TRIVIA = [
  { q: "In what year was the University of Nebraska founded?", a: ["1869", "1889", "1901", "1854"] },
  { q: "How many national championships did Tom Osborne win as head football coach?", a: ["3", "1", "2", "5"] },
  { q: "In what year did Nebraska officially join the Big Ten?", a: ["2011", "2008", "2013", "2004"] },
  { q: "Which conference was Nebraska in right before the Big Ten?", a: ["Big 12", "Big Eight", "Pac-12", "Mountain West"] },
  { q: "What song plays during the Tunnel Walk?", a: ["\"Sirius\" by The Alan Parsons Project", "\"Thunderstruck\" by AC/DC", "\"Kernkraft 400\" by Zombie Nation", "\"Seven Nation Army\" by The White Stripes"] },
  { q: "About how many fans attended Volleyball Day in Nebraska in 2023?", a: ["92,000", "65,000", "78,000", "110,000"] },
  { q: "Which Husker won the Heisman Trophy in 2001?", a: ["Eric Crouch", "Mike Rozier", "Johnny Rodgers", "Tommie Frazier"] },
  { q: "Johnny Rodgers won the Heisman Trophy in which year?", a: ["1972", "1983", "1965", "1995"] },
  { q: "What is the nickname of the mammoth at Morrill Hall?", a: ["Archie", "Manny", "Big Mo", "Woolly Willie"] },
  { q: "What are UNL's official colors?", a: ["Scarlet and cream", "Red and white", "Crimson and gold", "Red and black"] },
  { q: "Memorial Stadium's sellout streak started in which year?", a: ["1962", "1978", "1951", "1970"] },
  { q: "Nebraska won its first NCAA volleyball national title in which year?", a: ["1995", "2000", "1986", "2006"] },
  { q: "The Daily Nebraskan has been the student voice of UNL since which year?", a: ["1901", "1925", "1888", "1946"] },
  { q: "What statue stands on top of the Nebraska State Capitol?", a: ["The Sower", "The Pioneer", "The Husker", "The Plainsman"] },
  { q: "Which architect designed the Sheldon Museum of Art?", a: ["Philip Johnson", "Frank Lloyd Wright", "I. M. Pei", "Mies van der Rohe"] },
  { q: "How do you pronounce \"Lied\" in Lied Center?", a: ["Leed", "Lyed", "Lid", "Layd"] },
  { q: "The Raikes School combines computer science with what?", a: ["Management", "Engineering", "Journalism", "Economics"] },
  { q: "Lil' Red first appeared in which decade?", a: ["1990s", "1970s", "1980s", "2000s"] },
  { q: "Who was hired as Nebraska's head football coach in November 2022?", a: ["Matt Rhule", "Scott Frost", "Mike Riley", "Bo Pelini"] },
  { q: "Who succeeded John Cook as Nebraska's head volleyball coach in 2025?", a: ["Dani Busboom Kelly", "Jordan Larson", "Lauren Cook", "Kelly Hunter"] },
  { q: "Which college is housed in Andersen Hall?", a: ["Journalism and Mass Communications", "Business", "Engineering", "Fine and Performing Arts"] },
  { q: "Nebraska Innovation Campus was built on the former site of what?", a: ["The State Fair grounds", "A railroad yard", "An Air Force base", "A cornfield owned by the university"] },
  { q: "Bob Devaney won national titles as a coach in which sport?", a: ["Football", "Basketball", "Wrestling", "Volleyball"] },
  { q: "Before \"Cornhuskers,\" Nebraska teams were once called the what?", a: ["Bugeaters", "Prairie Dogs", "Sodbusters", "Pioneers"] },
  { q: "How many national championships has Husker football claimed?", a: ["5", "3", "4", "7"] },
  { q: "Who became Nebraska's head men's basketball coach in 2019?", a: ["Fred Hoiberg", "Tim Miles", "Doc Sadler", "Danny Nee"] },
  { q: "Who has coached Nebraska women's basketball since 2016?", a: ["Amy Williams", "Connie Yori", "Dawn Staley", "Lisa Bluder"] },
  { q: "Memorial Stadium holds roughly how many fans?", a: ["85,000", "65,000", "100,000", "72,000"] },
  { q: "What is Nebraska's state motto?", a: ["Equality Before the Law", "The Good Life", "Where Opportunity Grows", "Big Red Country"] },
  { q: "Which Husker won the Heisman Trophy in 1983?", a: ["Mike Rozier", "Turner Gill", "Irving Fryar", "Eric Crouch"] },
];
