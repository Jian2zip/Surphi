/*
 * Surphi｜性哲學關係圖譜
 * 時期與文本資料。
 *
 * 收錄規則：以原典為骨架，加上少數高影響力的期刊論文（kind: "論文"）。
 * lens: true 表示「以今日研究重讀某時期」的論文，不放進時間長廊。
 * 研究論文書目於 2026-11-08 以 Crossref 核對；cites 為當日 Crossref 被引次數。
 * 原典附標準引用位置（Stephanus、Bekker、AA 等）與公開全文連結（若有）。
 * 導讀文字為本站撰寫的摘要與詮釋，不是原文翻譯。
 */

const CROSSREF_CHECKED = "2026-11-08";

const ERAS = [
  {
    id: "greek",
    no: "01",
    name: "古希臘：愛欲的階梯",
    orig: "Classical Greece · erōs and aphrodisia",
    span: "前 4 世紀",
    color: "#f2352a",
    pos: { x: 14, y: 28 },
    intro:
      "古希臘沒有現代意義上的「性」（sexuality），他們談的是「愛欲」（erōs）與「快感」（aphrodisia）。核心問題不是「什麼樣的性才正常」，而是一個自由的男性公民如何不被慾望支配。柏拉圖把愛欲變成通往美與真理的階梯；亞里斯多德則把快感放進節制與友愛的倫理學裡。",
    legacy:
      "基督教神學吸收了柏拉圖的「上升」與亞里斯多德的「自然目的」；兩千多年後，傅柯《快感的享用》又回到這裡，尋找一種不以禁令為中心的倫理。",
    concepts: [
      ["愛欲", "erōs"],
      ["快感", "aphrodisia"],
      ["節制", "sōphrosynē"],
      ["友愛", "philia"]
    ]
  },
  {
    id: "hellenistic",
    no: "02",
    name: "希臘化與羅馬：快感的治理",
    orig: "Hellenistic and Roman philosophy",
    span: "前 3 世紀–1 世紀",
    color: "#ff8a3d",
    pos: { x: 30, y: 72 },
    intro:
      "亞歷山大大帝之後，城邦政治衰落，哲學轉向「如何過好個人的一生」。伊比鳩魯學派與斯多葛學派都把哲學當作治療靈魂的藥：性與愛情被看成可能擾亂心靈平靜的力量，需要被理解、節制與安排。羅馬斯多葛學者更把性限制在婚姻與生育之內。",
    legacy:
      "傅柯《性史》第三卷《自我的照顧》專門分析這個時期，認為基督教的性道德並非憑空出現，而是在希臘化與羅馬的「自我技術」之上，加上了新的意義。",
    concepts: [
      ["心靈平靜", "ataraxia"],
      ["自我的照顧", "epimeleia heautou"],
      ["自制", "enkrateia"],
      ["自然", "physis / natura"]
    ]
  },
  {
    id: "christian",
    no: "03",
    name: "基督教與中世紀：慾望、罪與自然",
    orig: "Christianity and the Middle Ages",
    span: "4–13 世紀",
    color: "#b02a6b",
    pos: { x: 44, y: 24 },
    intro:
      "基督教把性的問題從「如何節制快感」轉向「慾望本身的罪性」。奧古斯丁把不受意志控制的情慾視為原罪的印記，影響西方超過一千年；中世紀的愛情書信與經院哲學，則在這個框架內部激烈辯論愛、婚姻與「自然」。阿奎那以亞里斯多德的目的論，系統化了「合乎自然／違反自然」的區分。",
    legacy:
      "「違反自然的罪」經由教會法與世俗法律，延續到近代對同性性行為的刑罰；傅柯則把告解制度視為現代「說出性的真相」的源頭之一。",
    concepts: [
      ["情慾", "concupiscentia / libido"],
      ["原罪", "peccatum originale"],
      ["自然法", "lex naturalis"],
      ["告解", "confessio"]
    ]
  },
  {
    id: "enlightenment",
    no: "04",
    name: "啟蒙：自然、理性與自由",
    orig: "The Enlightenment",
    span: "1762–1797",
    color: "#d99a2b",
    pos: { x: 60, y: 70 },
    intro:
      "十八世紀，「自然」與「理性」取代神學，成為討論性的基礎，卻導向截然不同的結論：盧梭以自然之名鞏固兩性分工，狄德羅以自然之名批判基督教禁慾，沃斯通克拉夫特以理性之名要求女性平等，康德以理性之名把性限制在婚姻之內，薩德則把理性與自然推到極端，得出最駭人的結論。",
    legacy:
      "拉岡把康德與薩德並置，成為二十世紀思考「法則與慾望」的經典課題；康德的「物化」分析則在當代女性主義（努斯鮑姆、麥金儂）中復活。",
    concepts: [
      ["自然", "nature"],
      ["理性", "raison / Vernunft"],
      ["物化", "objectification"],
      ["兩性互補", "complementarity"]
    ]
  },
  {
    id: "nineteenth",
    no: "05",
    name: "19 世紀：意志、烏托邦與性科學",
    orig: "The nineteenth century",
    span: "1816–1886",
    color: "#8c867c",
    pos: { x: 75, y: 28 },
    intro:
      "十九世紀出現了三種全新的談性方式：烏托邦社會主義想像一個解放情慾的未來社會；叔本華的形上學把性愛解釋為盲目「生存意志」的計謀；醫學與精神病學則把性變成可以分類、可以診斷的對象。最後這一種，正是傅柯所說現代「性」誕生的地方。",
    legacy:
      "叔本華的意志形上學經尼采傳到佛洛伊德；克拉夫特—埃賓的分類學則被傅柯《知識的意志》當作「性科學」的代表加以分析。",
    concepts: [
      ["生存意志", "Wille zum Leben"],
      ["情慾吸引", "attraction passionnée"],
      ["性變態", "Perversion"],
      ["性科學", "scientia sexualis"]
    ]
  },
  {
    id: "twentieth",
    no: "06",
    name: "二十世紀：越界與權力",
    orig: "Twentieth-century French thought",
    span: "1957–1984",
    color: "#e98aa0",
    pos: { x: 86, y: 70 },
    intro:
      "二十世紀中葉的法國，性重新成為哲學的核心問題，但不再是道德問題。巴塔耶把情色理解為對禁忌的越界、與死亡和神聖相連的經驗；拉岡把康德與薩德並置，揭示道德法則與「享樂」的共謀；傅柯則徹底翻轉提問方式：與其問性如何被壓抑，不如問現代社會為什麼如此熱衷於談論性。",
    legacy:
      "傅柯之後，性被理解為權力、知識與主體形成的場域，直接開啟了性別研究與酷兒理論。這條線在本站的「歐陸哲學 1990–2020s」專區繼續發展。",
    concepts: [
      ["越界", "transgression"],
      ["情色", "érotisme"],
      ["享樂", "jouissance"],
      ["性經驗部署", "dispositif de sexualité"]
    ]
  }
];

/* 時期之間的承繼與斷裂（圖譜連線） */
const ERA_LINKS = [
  {
    from: "greek",
    to: "hellenistic",
    text: "希臘化學派繼承了柏拉圖與亞里斯多德的節制倫理，但把焦點從城邦公民轉向個人的心靈平靜。"
  },
  {
    from: "greek",
    to: "christian",
    text: "奧古斯丁經由新柏拉圖主義吸收了柏拉圖的「上升」；阿奎那則以亞里斯多德的自然目的論建立性倫理。"
  },
  {
    from: "hellenistic",
    to: "christian",
    text: "穆索尼烏斯等羅馬斯多葛學者「性只為生育」的主張，與早期教父的婚姻倫理幾乎一致。"
  },
  {
    from: "christian",
    to: "enlightenment",
    text: "啟蒙思想家以「自然」與「理性」取代神學，但康德的婚姻論等結論仍與基督教相近；狄德羅與薩德則正面攻擊基督教道德。"
  },
  {
    from: "enlightenment",
    to: "nineteenth",
    text: "盧梭的兩性互補論塑造了十九世紀的性別分工；康德之後的意志哲學，到了叔本華變成盲目的生存意志。"
  },
  {
    from: "enlightenment",
    to: "twentieth",
    text: "薩德被巴塔耶與拉岡重新閱讀；拉岡〈康德與薩德〉把兩位啟蒙人物並置。"
  },
  {
    from: "nineteenth",
    to: "twentieth",
    text: "傅柯《知識的意志》以十九世紀的性科學為主要分析對象，論證現代「性」是被生產出來的。"
  },
  {
    from: "christian",
    to: "twentieth",
    text: "傅柯認為，現代性科學要求「說出性的真相」，源頭可以追溯到基督教的告解制度。"
  },
  {
    from: "twentieth",
    to: "greek",
    text: "傅柯《快感的享用》回到古希臘，尋找一種不以禁令為中心的快感倫理。"
  }
];

const TEXTS = [
  /* ───────── 01 古希臘 ───────── */
  {
    id: "plato-symposium",
    era: "greek",
    kind: "原典",
    author: { zh: "柏拉圖", orig: "Plato" },
    year: -380,
    date: "約前 385–370 年",
    title: { orig: "Symposion (Symposium)", zh: "《會飲篇》" },
    ref: "Symposium 172a–223d（Stephanus 頁碼）",
    note: "公開全文為 Benjamin Jowett 英譯。",
    url: "https://www.gutenberg.org/ebooks/1600",
    question: "「愛欲」究竟是什麼？它愛的是某一個人，還是某種更高的東西？",
    points: [
      "一場酒宴上，六位講者輪流讚美愛神 Erōs。喜劇作家阿里斯托芬講了著名的神話：人原本是圓形的雙體人，分成男男、女女、男女三種，被宙斯劈成兩半後，愛就是尋找「另一半」的渴望。",
      "蘇格拉底轉述女祭司狄奧蒂瑪的教導：愛欲不是神，而是介於有死與不死之間的「精靈」；它渴望「永遠擁有美好」，因此想要「在美之中生育」——身體上生育子女，或靈魂上生育德性與思想。",
      "「愛的階梯」：從愛一個美的身體，到愛所有美的身體、美的靈魂、美的制度與知識，最後瞥見「美本身」。",
      "最後醉醺醺闖入的亞西比德讚美蘇格拉底，卻抱怨他拒絕自己的追求，讓整部對話留下張力：哲學的上升，是否犧牲了對具體個人的愛？"
    ],
    concepts: [
      ["愛欲", "erōs"],
      ["愛的階梯", "the ladder of love"],
      ["在美之中生育", "tokos en kalōi"],
      ["美本身", "auto to kalon"]
    ],
    impact:
      "西方愛情哲學的源頭。「柏拉圖式愛情」一詞由此而來，雖然意思已被大幅簡化；基督教神祕主義、文藝復興的費奇諾，以及佛洛伊德的「昇華」概念，都一再回到這部對話。",
    links: [
      { id: "plato-phaedrus", type: "同一主題" },
      { id: "nussbaum-1979", type: "研究詮釋" },
      { id: "foucault-1984", type: "後世重讀" }
    ]
  },
  {
    id: "plato-phaedrus",
    era: "greek",
    kind: "原典",
    author: { zh: "柏拉圖", orig: "Plato" },
    year: -370,
    date: "約前 370 年",
    title: { orig: "Phaidros (Phaedrus)", zh: "《斐德羅篇》" },
    ref: "Phaedrus 227a–279c（Stephanus 頁碼）",
    note: "公開全文為 Benjamin Jowett 英譯。",
    url: "https://www.gutenberg.org/ebooks/1636",
    question: "被愛欲沖昏頭的「瘋狂」，一定是壞事嗎？",
    points: [
      "對話開頭，斐德羅朗讀演說家呂西亞斯的講稿：少年應該把恩惠給「不愛他的人」，因為戀愛中的人失去理智。蘇格拉底先模仿這種說法，隨即後悔，改作一篇「翻案詩」。",
      "他主張有一種來自神的「瘋狂」，是人所能得到的最好禮物，愛欲就是其中之一。",
      "著名的靈魂馬車比喻：靈魂像一位御者駕著兩匹馬，一匹高貴、一匹放縱。看見所愛者的美，會喚起靈魂對天上「美」的回憶，讓靈魂重新長出翅膀。",
      "愛者與被愛者若能在節制中一起追求智慧，就能共同向上；放縱的那匹馬，則會把他們拉向單純的肉體滿足。"
    ],
    concepts: [
      ["神聖的瘋狂", "theia mania"],
      ["靈魂馬車", "the charioteer"],
      ["回憶", "anamnēsis"],
      ["翅膀", "pteron"]
    ],
    impact:
      "「御者與兩匹馬」成為西方以理性駕馭慾望的經典意象，影響了基督教的靈肉之爭，也是後來討論「激情有沒有價值」時反覆引用的段落。",
    links: [{ id: "plato-symposium", type: "同一主題" }]
  },
  {
    id: "aristotle-ne",
    era: "greek",
    kind: "原典",
    author: { zh: "亞里斯多德", orig: "Aristotle" },
    year: -340,
    date: "約前 4 世紀中葉",
    title: { orig: "Ēthika Nikomacheia (Nicomachean Ethics)", zh: "《尼各馬可倫理學》" },
    ref: "卷 III.10–12（節制）、卷 VII（不自制）、卷 VIII–IX（友愛）；Bekker 1117b–1119b、1145a–1152a、1155a–1172a",
    note: "公開全文為 F. H. Peters 英譯。",
    url: "https://www.gutenberg.org/ebooks/8438",
    question: "快感本身是壞的嗎？一個好人該怎麼面對身體的慾望？",
    points: [
      "亞里斯多德認為德性是過與不及之間的「中道」。在觸覺與味覺的快感上，過度是「放縱」，不足是罕見的「麻木」，中道則是「節制」。",
      "節制的人不是沒有慾望，而是以恰當的方式、在恰當的時機、對恰當的對象享受快感；缺少快感時，他也不會過度痛苦。",
      "他區分「不自制」（akrasia）與放縱：不自制的人知道什麼是對的，卻被慾望拖走，事後後悔；放縱的人則根本認為追求快感就是對的。",
      "討論友愛時，他把基於快感的友愛（常見於年輕人與戀人）列為最不穩定的一種，以德性為基礎的友愛才最持久。"
    ],
    concepts: [
      ["節制", "sōphrosynē"],
      ["不自制", "akrasia"],
      ["中道", "mesotēs"],
      ["友愛", "philia"]
    ],
    impact:
      "「快感需要被理性安排，但本身不是罪」的立場，經阿奎那吸收進天主教的自然法倫理學；akrasia 至今仍是行動哲學的核心問題。",
    links: [{ id: "aquinas-st", type: "後世吸收" }]
  },
  {
    id: "nussbaum-1979",
    era: "greek",
    kind: "論文",
    lens: true,
    author: { zh: "努斯鮑姆", orig: "Martha C. Nussbaum" },
    year: 1979,
    date: "1979 年",
    title: {
      orig: "The Speech of Alcibiades: A Reading of Plato's Symposium",
      zh: "〈亞西比德的演說：重讀柏拉圖《會飲篇》〉"
    },
    ref: "Philosophy and Literature 3, no. 2 (1979): 131–172",
    note: "後來擴寫為《善的脆弱性》（1986）第六章。",
    doi: "10.1353/phl.1979.0024",
    cites: 37,
    question: "狄奧蒂瑪要我們從愛某一個人，上升到愛「美本身」；但這樣的愛，是否失去了對一個獨一無二的人的愛？",
    points: [
      "努斯鮑姆主張，《會飲篇》並不是單純贊同狄奧蒂瑪；柏拉圖刻意讓亞西比德在最後登場，呈現另一種同樣有力的愛。",
      "亞西比德的愛，是對「這一個人」（蘇格拉底）具體而無法替代的激情。這種愛帶來獨特的知識，也帶來脆弱與痛苦。",
      "狄奧蒂瑪的上升之路則提供安全與穩定：如果愛的是可以互相比較、互相替換的「美」，就不會被某一個人傷害。",
      "柏拉圖讓讀者看見這兩種愛之間的真實取捨，而不是替讀者做出選擇。"
    ],
    concepts: [
      ["個人之愛", "love of the individual"],
      ["可共量性", "commensurability"],
      ["脆弱性", "vulnerability"],
      ["運氣", "tuchē"]
    ],
    impact:
      "當代英語世界詮釋《會飲篇》最有影響力的論文之一，也開啟了「哲學與文學」的研究取徑。Crossref 的被引數偏低，主要是因為多數引用指向它擴寫後的專書。",
    links: [{ id: "plato-symposium", type: "詮釋對象" }]
  },

  /* ───────── 02 希臘化與羅馬 ───────── */
  {
    id: "epicurus",
    era: "hellenistic",
    kind: "原典",
    author: { zh: "伊比鳩魯", orig: "Epicurus" },
    year: -300,
    date: "約前 300 年",
    title: { orig: "Letter to Menoeceus and related testimonies", zh: "《致美諾寇的信》與相關記載" },
    ref: "第歐根尼·拉爾修《名哲言行錄》X.118、122–135；《梵蒂岡語錄》51",
    note: "公開全文為 R. D. Hicks 英譯《名哲言行錄》卷十。",
    url: "https://en.wikisource.org/wiki/Lives_of_the_Eminent_Philosophers/Book_X",
    question: "如果人生的目的是快樂，為什麼伊比鳩魯對性這麼冷淡？",
    points: [
      "伊比鳩魯主張快樂是善，但他說的快樂是「身體無痛苦、靈魂無紛擾」，不是放縱。最好的快樂是平靜，而不是刺激。",
      "他把慾望分成三種：自然且必要的（如吃喝）、自然但非必要的、既不自然也不必要的（如名聲）。性慾通常被歸為第二種：可以滿足，但不必追求。",
      "據第歐根尼·拉爾修記載，伊比鳩魯學派認為「性交從未讓人得益，沒有傷害人就已經很幸運了」，智者也不應該墜入情網。"
    ],
    concepts: [
      ["心靈平靜", "ataraxia"],
      ["無痛", "aponia"],
      ["慾望的分類", "classification of desires"],
      ["快樂主義", "hedonism"]
    ],
    impact:
      "這種「為了快樂而節制快樂」的計算，是西方快樂主義的原型。它後來常被誤讀成縱慾哲學，反而說明了「快樂」與「性」在西方思想中如何被混為一談。",
    links: [{ id: "lucretius", type: "學派傳承" }]
  },
  {
    id: "lucretius",
    era: "hellenistic",
    kind: "原典",
    author: { zh: "盧克萊修", orig: "Lucretius" },
    year: -55,
    date: "約前 55 年",
    title: { orig: "De rerum natura, Book IV", zh: "《物性論》卷四" },
    ref: "De rerum natura IV.1030–1287",
    note: "公開全文為 H. A. J. Munro 英譯。",
    url: "https://www.gutenberg.org/ebooks/785",
    question: "戀愛到底是什麼？為什麼它讓人這麼痛苦？",
    points: [
      "這部以拉丁詩寫成的伊比鳩魯主義長詩，在第四卷結尾以近乎醫學的方式解釋性慾：身體成熟後產生的「種子」受到美的形象刺激，想要射向引起它的人。",
      "盧克萊修區分「維納斯」（性）與「愛情」：前者是自然的身體需要，後者卻像一種病。戀人永遠無法真正「擁有」對方，只會越來越飢渴。",
      "他建議用一般的性滿足來化解執念，並嘲諷戀人如何把對方的缺點美化成優點。",
      "但他也承認，在相互的快樂與長久相處中，即使是平凡的人也能被愛。"
    ],
    concepts: [
      ["維納斯", "Venus"],
      ["愛情的傷口", "vulnus amoris"],
      ["擬像", "simulacra"],
      ["習慣", "consuetudo"]
    ],
    impact:
      "西方思想中「愛是一種病」最尖銳的哲學表述。全詩在 1417 年被重新發現後，它的唯物論影響了蒙田與啟蒙時代的唯物論者。",
    links: [{ id: "epicurus", type: "學派傳承" }]
  },
  {
    id: "musonius",
    era: "hellenistic",
    kind: "原典",
    author: { zh: "穆索尼烏斯·魯弗斯", orig: "Musonius Rufus" },
    year: 80,
    date: "1 世紀後半",
    title: { orig: "Lectures XII–XIV (On Sexual Indulgence; On Marriage)", zh: "〈論性的放縱〉與論婚姻講稿" },
    ref: "講稿 XII–XIV；Cora E. Lutz, “Musonius Rufus: The Roman Socrates,” Yale Classical Studies 10 (1947)",
    note: "講稿由學生記錄、以希臘文流傳；目前沒有可靠的公開全文版本。",
    url: null,
    question: "斯多葛哲學家如何回答「什麼樣的性是正當的」？",
    points: [
      "穆索尼烏斯是愛比克泰德的老師。他主張只有在婚姻中、以生育為目的的性才是正當的；即使在婚姻中，只為快樂而發生的性也不恰當。",
      "他反對當時社會普遍接受的雙重標準：如果男主人與女奴發生關係被視為無害，那麼女主人與男奴發生關係也該同理；既然後者被認為可恥，前者同樣可恥。",
      "他也主張女性應該學習哲學，婚姻的核心是夫妻之間的「生活共同體」與相互照顧。"
    ],
    concepts: [
      ["自制", "enkrateia"],
      ["婚姻共同體", "koinōnia"],
      ["生育", "procreation"],
      ["雙重標準", "double standard"]
    ],
    impact:
      "這套「性只為生育、男女同守貞潔」的倫理，與早期基督教教父的論述幾乎一致，是理解基督教性道德從何而來的關鍵文本；傅柯在《自我的照顧》中以他為婚姻倫理「強化」的代表。",
    links: [{ id: "augustine-civdei", type: "相近立場" }]
  },

  /* ───────── 03 基督教與中世紀 ───────── */
  {
    id: "augustine-confessions",
    era: "christian",
    kind: "原典",
    author: { zh: "奧古斯丁", orig: "Augustine of Hippo" },
    year: 398,
    date: "397–400 年",
    title: { orig: "Confessiones", zh: "《懺悔錄》" },
    ref: "卷 VI.15、卷 VIII（特別是 VIII.5.10–12.30）",
    note: "公開全文為 New Advent 收錄的英譯，連結為第八卷。",
    url: "https://www.newadvent.org/fathers/110108.htm",
    question: "為什麼一個人明明想要改變，意志卻無法服從自己？",
    points: [
      "《懺悔錄》是西方第一部深入內心的自傳。奧古斯丁回顧年輕時的情慾、與同居伴侶多年的關係，以及為了一門合適的婚事而被迫送走她的痛苦。",
      "第八卷描述他皈依前的掙扎：「求你賜我貞潔，但不是現在。」他發現自己彷彿有「兩個意志」，舊的習慣像鎖鏈一樣拴住新的意志。",
      "這種「意志的分裂」是他的核心洞見：問題不只在身體，而在於意志本身已經受傷，無法完全服從自己。",
      "在米蘭的花園裡，他聽見「拿起來讀」的聲音，讀到保羅書信「不可荒宴醉酒，不可好色邪蕩」，從此決定守貞。"
    ],
    concepts: [
      ["分裂的意志", "voluntas divisa"],
      ["習慣", "consuetudo"],
      ["情慾", "concupiscentia"],
      ["皈依", "conversio"]
    ],
    impact:
      "它把性的問題「內在化」為意志與自我的問題，深刻塑造了西方的自我意識與罪感文化；也是傅柯晚期研究（《性史》第四卷《肉體的告白》）的核心對象。",
    links: [{ id: "augustine-civdei", type: "同一作者" }]
  },
  {
    id: "augustine-civdei",
    era: "christian",
    kind: "原典",
    author: { zh: "奧古斯丁", orig: "Augustine of Hippo" },
    year: 419,
    date: "約 418–420 年",
    title: { orig: "De civitate Dei, Book XIV", zh: "《上帝之城》卷十四" },
    ref: "De civitate Dei XIV.15–26",
    note: "公開全文為 New Advent 收錄的英譯。",
    url: "https://www.newadvent.org/fathers/120114.htm",
    question: "如果人類沒有犯罪，伊甸園裡的性會是什麼樣子？",
    points: [
      "奧古斯丁認為性與婚姻本身是善的，是上帝創造的一部分。問題在於墮落之後出現的「情慾」（libido）：身體的性反應不再聽從意志的指揮。",
      "他把這種「不由自主」看成對原罪的懲罰：人違背了上帝，身體也就違背了人。羞恥感正是由此而來。",
      "他推想，在樂園裡，亞當與夏娃可以像控制手腳一樣，以意志平靜地完成生育，沒有失控的激情。",
      "因此婚姻中的性雖然正當，卻總帶著「罪的痕跡」。這成為後來教會婚姻神學的基礎。"
    ],
    concepts: [
      ["情慾", "libido"],
      ["原罪", "peccatum originale"],
      ["意志", "voluntas"],
      ["羞恥", "pudor"]
    ],
    impact:
      "這套「性本身是善、情慾帶著罪」的雙重立場，主導了西方基督教近千年的性倫理，是研究西方性觀念史時繞不開的文本。",
    links: [
      { id: "augustine-confessions", type: "同一作者" },
      { id: "musonius", type: "相近立場" },
      { id: "aquinas-st", type: "後世系統化" }
    ]
  },
  {
    id: "heloise-abelard",
    era: "christian",
    kind: "原典",
    author: { zh: "哀綠綺思與阿伯拉", orig: "Héloïse & Peter Abelard" },
    year: 1135,
    date: "約 1132–1138 年",
    title: { orig: "Epistolae (The Letters of Abelard and Heloise)", zh: "《書信集》" },
    ref: "阿伯拉〈劫餘錄〉（Historia calamitatum）與哀綠綺思致阿伯拉的第一、二封信",
    note: "書信真偽曾有學術爭論，目前多數學者接受其真實性。公開全文為早期英譯。",
    url: "https://www.gutenberg.org/ebooks/35977",
    question: "如果愛是純粹的，婚姻會讓它變得不純粹嗎？",
    points: [
      "經院哲學家阿伯拉與學生哀綠綺思相戀、生子並祕密結婚，後來阿伯拉遭女方叔父派人閹割，兩人分別進入修道院。多年後，他們以書信回顧這段關係。",
      "哀綠綺思當初反對結婚。她寫道，「妻子」之名或許更神聖，但她寧可被稱為阿伯拉的「情人」，因為無私的愛不應被婚姻的利益與義務綁住。",
      "成為修女院長後，她坦承自己仍懷念過去的歡愉，連在彌撒中也無法擺脫；她拒絕假裝悔改，認為上帝看的是內心的意圖，而不是外在的行為。",
      "阿伯拉則試圖把兩人的愛轉化為對上帝的愛，兩種愛的觀念在信中形成張力。"
    ],
    concepts: [
      ["意圖", "intentio"],
      ["婚姻", "matrimonium"],
      ["情人", "amica"],
      ["無私的愛", "disinterested love"]
    ],
    impact:
      "中世紀最著名的愛情書信，常被視為「浪漫愛」與「良心倫理」的早期表述；哀綠綺思對婚姻的批判與阿伯拉的「意圖倫理學」，至今仍在倫理學與女性主義研究中被討論。",
    links: [{ id: "aquinas-st", type: "同一時代" }]
  },
  {
    id: "aquinas-st",
    era: "christian",
    kind: "原典",
    author: { zh: "阿奎那", orig: "Thomas Aquinas" },
    year: 1271,
    date: "約 1271–1272 年",
    title: { orig: "Summa Theologiae II-II, qq. 153–154", zh: "《神學大全》第二集第二部第 153–154 題" },
    ref: "ST II-II q.153（論色慾）、q.154（論色慾的種類）",
    note: "公開全文為 New Advent 收錄的英譯，連結為第 153 題。",
    url: "https://www.newadvent.org/summa/3153.htm",
    warning: "本篇涉及把同性性行為列為罪的歷史觀點，導讀僅作思想史說明。",
    question: "什麼樣的性行為是罪？判斷的標準是什麼？",
    points: [
      "阿奎那把亞里斯多德的目的論帶進神學：每一種身體功能都有它的自然目的，性的目的是生育與養育後代。",
      "「色慾」（luxuria）就是違反理性秩序地使用性：不在婚姻之中，或不以生育為導向。他列出色慾的六個種類，其中「違反自然的罪」最為嚴重。",
      "違反自然的罪，指所有不可能導向生育的性行為（如自慰、同性性行為）。他認為這些罪比通姦甚至強暴更重，因為冒犯的是上帝所設的自然秩序本身。",
      "他也承認，婚姻中的快感本身不是罪，只要它服從於正當的目的。"
    ],
    concepts: [
      ["色慾", "luxuria"],
      ["自然法", "lex naturalis"],
      ["違反自然的罪", "vitium contra naturam"],
      ["目的", "finis"]
    ],
    impact:
      "「合乎自然／違反自然」的區分成為天主教性倫理的核心，也透過世俗法律影響了數百年的雞姦罪立法，因此是當代性別與酷兒理論的重要批判對象。",
    links: [
      { id: "aristotle-ne", type: "思想資源" },
      { id: "augustine-civdei", type: "神學傳統" }
    ]
  },

  /* ───────── 04 啟蒙 ───────── */
  {
    id: "rousseau-emile",
    era: "enlightenment",
    kind: "原典",
    author: { zh: "盧梭", orig: "Jean-Jacques Rousseau" },
    year: 1762,
    date: "1762 年",
    title: { orig: "Émile, ou De l'éducation, Livre V", zh: "《愛彌兒》卷五" },
    ref: "卷五〈蘇菲，或女人〉",
    note: "公開全文為 Barbara Foxley 英譯。",
    url: "https://www.gutenberg.org/ebooks/5427",
    question: "男人與女人應該接受同樣的教育嗎？",
    points: [
      "《愛彌兒》前四卷描述如何依「自然」教育一個男孩；第五卷則為他設計理想的妻子蘇菲。",
      "盧梭主張兩性作為「人」是相同的，但在性上「互補」：男人主動而強壯，女人被動而柔弱。女人的整個教育，都應該以取悅男人、對男人有用為目標。",
      "他認為女性的羞恥心與矜持是自然賦予的，是調節男性慾望的力量；女人透過讓男人渴望她而統治男人。",
      "這套「自然的兩性差異」論，為十九世紀的「分離領域」意識形態提供了哲學依據。"
    ],
    concepts: [
      ["自然", "nature"],
      ["互補", "complementarity"],
      ["羞恥心", "pudeur"],
      ["分離領域", "separate spheres"]
    ],
    impact:
      "近代性別意識形態最有影響力的哲學表述之一，也因此成為女性主義的頭號批判對象：三十年後，沃斯通克拉夫特專門在書中逐段反駁。",
    links: [{ id: "wollstonecraft", type: "被反駁" }]
  },
  {
    id: "diderot-supplement",
    era: "enlightenment",
    kind: "原典",
    author: { zh: "狄德羅", orig: "Denis Diderot" },
    year: 1772,
    date: "1772 年寫成，1796 年出版",
    title: { orig: "Supplément au voyage de Bougainville", zh: "《布干維爾遊記補遺》" },
    ref: "全文（對話體，共五章）",
    note: "公開全文為法文維基文庫版。",
    url: "https://fr.wikisource.org/wiki/Suppl%C3%A9ment_au_voyage_de_Bougainville",
    question: "如果有一個沒有基督教的社會，那裡的性道德會是什麼樣子？",
    points: [
      "1771 年，布干維爾出版環球航行記，描述大溪地人對性的開放。狄德羅以此為材料，寫成一部哲學對話。",
      "書中的大溪地老人斥責歐洲人帶來了私有財產、嫉妒與性病；大溪地人奧魯則和隨船神父辯論：為什麼在「自然」中無害的事，到了歐洲就被說成罪？",
      "狄德羅認為基督教的性道德違反自然，因而製造出偽善、罪惡感與痛苦；文明社會的自然法、民法與宗教法互相衝突，讓人無所適從。",
      "但他筆下的大溪地仍以「生育」作為衡量性行為的標準，也是一種歐洲人投射出來的理想化想像。"
    ],
    concepts: [
      ["自然法", "loi de nature"],
      ["三重法典", "les trois codes"],
      ["高貴的野蠻人", "bon sauvage"],
      ["偽善", "hypocrisie"]
    ],
    impact:
      "啟蒙時代批判基督教性道德最大膽的文本之一，狄德羅生前沒有出版。它也是後殖民研究分析「歐洲如何把他者想像成性的天堂」的經典案例。",
    links: [{ id: "sade-boudoir", type: "同代對照" }]
  },
  {
    id: "wollstonecraft",
    era: "enlightenment",
    kind: "原典",
    author: { zh: "沃斯通克拉夫特", orig: "Mary Wollstonecraft" },
    year: 1792,
    date: "1792 年",
    title: { orig: "A Vindication of the Rights of Woman", zh: "《為女權辯護》" },
    ref: "特別是第 5 章第 1 節（批判盧梭）",
    note: null,
    url: "https://www.gutenberg.org/ebooks/3420",
    question: "女人的「柔弱」與「取悅男人」，是天性，還是被教出來的？",
    points: [
      "她把啟蒙的理性平等原則貫徹到底：如果德性來自理性，女人就必須和男人一樣接受理性的教育，而不只是學習如何取悅。",
      "第五章逐段駁斥盧梭筆下的蘇菲：女性的嬌弱、虛榮與狡猾不是天性，而是被剝奪教育與經濟獨立的結果。",
      "她批評把婚姻建立在性吸引力上：激情必然消退，只有以友誼與相互尊重為基礎的婚姻才能長久；女人不應被當成感官享樂的對象。",
      "她也要求男性同樣守貞，反對性道德的雙重標準。"
    ],
    concepts: [
      ["理性", "reason"],
      ["教育", "education"],
      ["婚姻作為友誼", "marriage as friendship"],
      ["雙重標準", "double standard"]
    ],
    impact:
      "現代女性主義的奠基文本。她對「女人被教育成性對象」的分析，預示了兩百年後關於物化與性別建構的討論。",
    links: [
      { id: "rousseau-emile", type: "反駁" },
      { id: "nussbaum-1995", type: "遙相呼應" }
    ]
  },
  {
    id: "sade-boudoir",
    era: "enlightenment",
    kind: "原典",
    author: { zh: "薩德", orig: "Marquis de Sade" },
    year: 1795,
    date: "1795 年",
    title: { orig: "La Philosophie dans le boudoir", zh: "《閨房哲學》" },
    ref: "全書，特別是第五對話中的小冊〈法國人，若想成為共和主義者，再加把勁！〉",
    note: "公開全文為法文維基文庫版。",
    url: "https://fr.wikisource.org/wiki/La_Philosophie_dans_le_boudoir",
    warning: "原書含大量性暴力描寫；導讀只討論其哲學論證。",
    question: "如果把「自然」當作唯一標準，道德還剩下什麼？",
    points: [
      "全書以對話體寫成：兩名放蕩者對一位少女進行「哲學教育」，要她拋棄宗教、羞恥與憐憫。性場景與長篇哲學論述交錯出現。",
      "薩德的唯物論認為，自然只追求運動與毀滅，不認識善惡；既然殘酷與毀滅也存在於自然之中，道德就只是人為的偏見。",
      "書中插入一篇著名的小冊〈法國人，若想成為共和主義者，再加把勁！〉：革命後的共和國取消了宗教，也應該取消對通姦、亂倫與雞姦的懲罰，甚至主張每個人都有權要求享用他人的身體。",
      "這個「享樂的權利」，把啟蒙的自由與自然邏輯推到令人不安的極端。"
    ],
    concepts: [
      ["放蕩者", "libertin"],
      ["自然", "nature"],
      ["冷漠", "apathie"],
      ["享樂的權利", "droit de jouissance"]
    ],
    impact:
      "薩德長期被禁，二十世紀卻被巴塔耶、阿多諾與霍克海默、波娃（〈必須焚毀薩德嗎？〉）與拉岡一再重讀，成為追問「啟蒙理性是否隱含暴力」的關鍵案例。",
    links: [
      { id: "kant-ethics", type: "被並置" },
      { id: "lacan-1963", type: "後世重讀" },
      { id: "bataille-erotisme", type: "後世重讀" }
    ]
  },
  {
    id: "kant-ethics",
    era: "enlightenment",
    kind: "原典",
    author: { zh: "康德", orig: "Immanuel Kant" },
    year: 1797,
    date: "1784–1797 年",
    title: {
      orig: "Vorlesung über Ethik (Collins) & Die Metaphysik der Sitten, §§24–27",
      zh: "《倫理學講義》與《道德形上學》§24–27"
    },
    ref: "Collins 倫理學講義筆記（1784–85），AA 27:384–392；《道德形上學・法權論》§24–27，AA 6:277–280",
    note: "公開全文為《道德形上學》德文學院版（AA 6:277 起）；倫理學講義目前沒有公開的可靠全文。",
    url: "https://www.korpora.org/kant/aa06/277.html",
    question: "性慾為什麼會威脅人的尊嚴？",
    points: [
      "康德道德哲學的核心是：永遠不可只把人當作工具。他在倫理學講義中指出，性慾的特殊之處在於它渴望的不是對方這個「人」，而是對方的身體；慾望滿足之後，對方就像「被吸乾的檸檬」一樣被拋棄。",
      "因此，性慾本身就傾向把人貶為「物」，也就是今天所說的「物化」。",
      "唯一的出路是婚姻：雙方把自身完整地交給對方、終身互相擁有。在這種對等的「互相占有」中，每個人透過擁有對方而重新取回自己。",
      "《道德形上學》因此把婚姻定義為一種法律關係：「兩個不同性別的人，為了終身互相占有彼此的性屬性而結合。」"
    ],
    concepts: [
      ["人格", "Person"],
      ["物", "Sache"],
      ["互相占有", "wechselseitiger Besitz"],
      ["婚姻權", "Eherecht"]
    ],
    impact:
      "這段分析常被嘲笑過於冷酷，卻在二十世紀末被女性主義重新發現：努斯鮑姆指出，麥金儂與德沃金的物化論與康德驚人地相近。拉岡則把他和薩德並置。",
    links: [
      { id: "sade-boudoir", type: "被並置" },
      { id: "nussbaum-1995", type: "研究詮釋" },
      { id: "lacan-1963", type: "後世重讀" }
    ]
  },
  {
    id: "nussbaum-1995",
    era: "enlightenment",
    kind: "論文",
    lens: true,
    author: { zh: "努斯鮑姆", orig: "Martha C. Nussbaum" },
    year: 1995,
    date: "1995 年",
    title: { orig: "Objectification", zh: "〈物化〉" },
    ref: "Philosophy & Public Affairs 24, no. 4 (1995): 249–291",
    note: null,
    doi: "10.1111/j.1088-4963.1995.tb00032.x",
    cites: 749,
    question: "「物化」這個詞被大量使用，但把人當作物，究竟是什麼意思？它一定是錯的嗎？",
    points: [
      "努斯鮑姆把「物化」拆成七種方式：工具化、否認自主、否認能動性、可替換性、可侵犯性、所有權，以及否認主體性。",
      "她分析康德、麥金儂與德沃金，指出三者都認為性慾本身傾向物化，結論驚人地相似。",
      "但她主張物化的對錯取決於脈絡：在平等、相互尊重的關係中，某些形式的物化（例如暫時把自己交給對方）甚至可以是美好的；關鍵在於這段關係是否以對方的整體人格為背景。",
      "她以勞倫斯等人的文學作品與《花花公子》等色情文本對照分析，說明同一種描寫在不同脈絡中的意義差異。"
    ],
    concepts: [
      ["物化", "objectification"],
      ["工具化", "instrumentality"],
      ["自主", "autonomy"],
      ["脈絡", "context"]
    ],
    impact:
      "Crossref 被引七百餘次，是當代分析「物化」最常被引用的論文，奠定了性倫理、女性主義哲學與色情研究討論物化的基本框架。",
    links: [
      { id: "kant-ethics", type: "詮釋對象" },
      { id: "wollstonecraft", type: "遙相呼應" }
    ]
  },

  /* ───────── 05 19 世紀 ───────── */
  {
    id: "fourier",
    era: "nineteenth",
    kind: "原典",
    author: { zh: "傅立葉", orig: "Charles Fourier" },
    year: 1817,
    date: "約 1816–1818 年寫成，1967 年出版",
    title: { orig: "Le Nouveau Monde amoureux", zh: "《愛情新世界》" },
    ref: "手稿，1967 年由 Simone Debout 編輯出版",
    note: "沒有公開全文。",
    url: null,
    question: "一個好的社會，應該壓抑情慾，還是組織情慾？",
    points: [
      "烏托邦社會主義者傅立葉認為，人的各種情慾都是上帝賦予的；文明的錯誤在於壓抑它們，壓抑才是罪惡與痛苦的來源。",
      "他設計名為「法郎吉」（phalange）的共同體，讓每個人的情慾彼此搭配、互相滿足，他稱之為「情慾吸引」。",
      "在這部生前沒有出版的手稿中，他主張社會應提供「性的最低保障」，確保每個人，包括年老與不受青睞的人，都能得到性與愛的滿足；他也肯定多元的性偏好。",
      "他嚴厲批評一夫一妻制的婚姻，認為它是女性受奴役與普遍偽善的根源。"
    ],
    concepts: [
      ["情慾吸引", "attraction passionnée"],
      ["法郎吉", "phalange"],
      ["性的最低保障", "minimum sexuel"],
      ["文明", "civilisation"]
    ],
    impact:
      "手稿因內容大膽被他的追隨者壓下，直到 1967 年才出版，正好趕上六八學運與性解放運動。他被視為「性解放」思想最早的先驅之一，布勒東等超現實主義者也深受吸引。",
    links: [{ id: "diderot-supplement", type: "遙相呼應" }]
  },
  {
    id: "schopenhauer",
    era: "nineteenth",
    kind: "原典",
    author: { zh: "叔本華", orig: "Arthur Schopenhauer" },
    year: 1844,
    date: "1844 年",
    title: {
      orig: "Metaphysik der Geschlechtsliebe (Die Welt als Wille und Vorstellung II, Kap. 44)",
      zh: "〈性愛的形上學〉"
    },
    ref: "《作為意志與表象的世界》第二卷第 44 章",
    note: "公開全文為 Haldane 與 Kemp 英譯第三冊（第 44 章）。",
    url: "https://www.gutenberg.org/ebooks/40868",
    question: "戀愛中的人以為自己在追求幸福，其實是誰在主導？",
    points: [
      "叔本華認為世界的本質是盲目、永不滿足的「生存意志」。性慾是這個意志最強烈的表現，他甚至稱生殖器為「意志的焦點」。",
      "戀愛的狂熱其實是物種的計謀：個人以為自己愛上一個獨特的人，實際上是「物種的守護神」在挑選最適合生出下一代的組合。",
      "因此愛情的悲劇在於：為了物種而結合的戀人，往往並不適合一起生活；慾望滿足之後，個人只會覺得被欺騙。",
      "他把性愛看成痛苦輪迴的根源，唯一的出路是否定意志，例如禁慾。"
    ],
    concepts: [
      ["生存意志", "Wille zum Leben"],
      ["物種的守護神", "Genius der Gattung"],
      ["幻象", "Wahn"],
      ["意志的否定", "Verneinung des Willens"]
    ],
    impact:
      "第一位把性愛放在形上學核心的大哲學家。達爾文在《人類的由來》中引用過這一章；他「無意識的慾望主導意識」的分析經尼采傳到佛洛伊德，佛洛伊德也承認叔本華是精神分析的先驅。",
    links: [{ id: "kant-ethics", type: "思想背景" }]
  },
  {
    id: "krafft-ebing",
    era: "nineteenth",
    kind: "原典",
    author: { zh: "克拉夫特—埃賓", orig: "Richard von Krafft-Ebing" },
    year: 1886,
    date: "1886 年",
    title: { orig: "Psychopathia Sexualis", zh: "《性精神病態》" },
    ref: "初版 1886 年，作者生前持續增訂",
    note: "公開全文為第 12 版英譯。",
    url: "https://www.gutenberg.org/ebooks/64931",
    warning: "原書以病理化的語言描述性少數；導讀僅作歷史分析。",
    question: "性是在什麼時候，從「罪」變成了「病」？",
    points: [
      "這位奧地利精神科醫師收集了數百個病例，把各種不以生育為導向的性慾分類為「性變態」，並創造或推廣了「受虐狂」（以馬索克命名）與「虐待狂」（以薩德命名）等詞。",
      "他把同性戀描述為「反常的性感覺」，主要看作先天的退化或疾病，而不是道德墮落。",
      "這個轉變有兩面：一方面，性少數從「罪人」變成「病人」，部分醫師據此主張廢除刑罰；另一方面，它建立了由醫學判定「正常／不正常」的新權力。",
      "本書在他生前多次增訂，病例越來越多，其中不少來自讀者主動寫信描述自己的經驗。"
    ],
    concepts: [
      ["性變態", "Perversion"],
      ["虐待狂", "Sadismus"],
      ["受虐狂", "Masochismus"],
      ["反常的性感覺", "conträre Sexualempfindung"]
    ],
    impact:
      "現代「性科學」的奠基之作，「虐待狂」「受虐狂」等詞從此進入日常語言。傅柯在《知識的意志》中以這類分類為例，說明十九世紀並不是壓抑性，而是大量生產關於性的知識。",
    links: [
      { id: "sade-boudoir", type: "命名來源" },
      { id: "foucault-1976", type: "被分析" }
    ]
  },

  /* ───────── 06 二十世紀 ───────── */
  {
    id: "bataille-erotisme",
    era: "twentieth",
    kind: "原典",
    author: { zh: "巴塔耶", orig: "Georges Bataille" },
    year: 1957,
    date: "1957 年",
    title: { orig: "L'Érotisme", zh: "《情色論》" },
    ref: "特別是導論與第一部〈禁忌與越界〉",
    note: "沒有公開全文。",
    url: null,
    question: "人類的性為什麼和動物不同？為什麼情色總是和死亡、禁忌糾纏在一起？",
    points: [
      "巴塔耶開篇就說：情色是「對生命的肯定，直到死亡之中」。人是「不連續」的個體，情色讓人短暫體驗到與他人、與世界的「連續性」，就像死亡一樣消解自我的邊界。",
      "人類社會建立在「禁忌」之上：針對死亡與性的禁忌，讓人脫離動物性，建立起勞動與理性的世界。",
      "但禁忌不只是為了被遵守。「越界」並不取消禁忌，反而完成它：正因為有禁忌，越界才有強烈的意義。情色、節慶與獻祭，都是這種被規範的越界。",
      "因此他把情色與宗教的「神聖」經驗相連，而不是與道德或生物學相連。"
    ],
    concepts: [
      ["情色", "érotisme"],
      ["連續性／不連續性", "continuité / discontinuité"],
      ["禁忌", "interdit"],
      ["越界", "transgression"]
    ],
    impact:
      "他把性從道德與生物學中解放出來，視為人類學與存在經驗的核心；傅柯、布朗修、德希達都深受影響。巴塔耶過世後，傅柯在《批評》的紀念專號寫下〈踰越序言〉向他致敬。",
    links: [
      { id: "sade-boudoir", type: "重讀對象" },
      { id: "foucault-1963", type: "被致敬" }
    ]
  },
  {
    id: "foucault-1963",
    era: "twentieth",
    kind: "論文",
    author: { zh: "傅柯", orig: "Michel Foucault" },
    year: 1963,
    date: "1963 年",
    title: { orig: "Préface à la transgression", zh: "〈踰越序言〉" },
    ref: "Critique 195–196（1963 年 8–9 月，巴塔耶紀念專號）：751–770",
    note: "後收入《言與文》（Dits et écrits）第一卷；英譯 “A Preface to Transgression” 收於 Language, Counter-Memory, Practice（1977）。沒有 DOI。",
    url: null,
    question: "在「上帝已死」之後，越界還有意義嗎？性在現代思想中扮演什麼角色？",
    points: [
      "人們常以為，在當代經驗中性終於找回了它「自然的真相」。傅柯卻認為，性在現代被推向語言與意識的極限，與「上帝之死」緊密相連：上帝死後，性成為少數僅存的絕對界限之一。",
      "他重讀巴塔耶：越界不是善惡對立中的「惡」，也不是摧毀界限，而是像夜裡的一道閃電，在跨越界限的瞬間照亮界限本身。",
      "他把越界稱為一種「非實證的肯定」，並主張哲學需要找到新的語言，才能說出這種經驗。"
    ],
    concepts: [
      ["越界", "transgression"],
      ["界限", "limite"],
      ["上帝之死", "mort de Dieu"],
      ["非實證的肯定", "affirmation non positive"]
    ],
    impact:
      "傅柯早期「文學—哲學」時期的代表作，也是理解他後來《性史》的伏筆：十三年後，他轉而質疑「性是人的祕密真相」這個假設本身。",
    links: [
      { id: "bataille-erotisme", type: "致敬對象" },
      { id: "foucault-1976", type: "後續轉向" }
    ]
  },
  {
    id: "lacan-1963",
    era: "twentieth",
    kind: "論文",
    author: { zh: "拉岡", orig: "Jacques Lacan" },
    year: 1963,
    date: "1963 年",
    title: { orig: "Kant avec Sade", zh: "〈康德與薩德〉" },
    ref: "Critique 191（1963 年 4 月）；英譯 “Kant with Sade,” trans. James B. Swenson Jr., October 51 (1989): 55–75",
    note: "原為薩德《閨房哲學》新版的序言，後刊於《批評》，再收入《文集》（Écrits, 1966）。DOI 為 October 英譯版。",
    doi: "10.2307/778891",
    cites: 76,
    question: "康德的道德法則與薩德的享樂法則，有沒有可能是同一回事？",
    points: [
      "這篇文章原本是為《閨房哲學》寫的序言。拉岡大膽主張：《閨房哲學》比康德的《實踐理性批判》晚八年，卻「完成」了它，說出了它的真相。",
      "康德要求道德法則排除一切感性的、「病理的」動機；薩德的放蕩者同樣冷漠無情地服從一條普遍法則：「我有權享用你的身體，任何人都可以這樣對我說。」",
      "兩者共享同一個結構：一個無條件、超越個人好惡的法則，要求主體為它犧牲快樂乃至生命。拉岡由此揭示道德與「享樂」（jouissance）的隱密共謀。",
      "他也指出，薩德的幻想需要一個「永遠受苦卻不會死」的受害者，暴露了慾望本身的結構。"
    ],
    concepts: [
      ["享樂", "jouissance"],
      ["道德法則", "loi morale"],
      ["大他者", "grand Autre"],
      ["幻想", "fantasme"]
    ],
    impact:
      "精神分析與道德哲學交會最著名的文本之一，常與阿多諾、霍克海默《啟蒙辯證法》中論薩德的章節並列，成為「啟蒙理性陰暗面」的經典論述；紀傑克、祖潘契奇等人一再延伸。",
    links: [
      { id: "kant-ethics", type: "分析對象" },
      { id: "sade-boudoir", type: "分析對象" }
    ]
  },
  {
    id: "foucault-1976",
    era: "twentieth",
    kind: "原典",
    author: { zh: "傅柯", orig: "Michel Foucault" },
    year: 1976,
    date: "1976 年",
    title: { orig: "Histoire de la sexualité I : La Volonté de savoir", zh: "《性史》第一卷《知識的意志》" },
    ref: "全書，特別是第二部〈壓抑假說〉與第五部〈死亡權與管理生命的權力〉",
    note: "沒有公開全文。",
    url: null,
    question: "我們真的生活在一個壓抑性的社會嗎？",
    points: [
      "傅柯質疑「壓抑假說」：一般認為維多利亞時代以來性被壓抑，我們必須解放它。他反問：為什麼三個世紀以來，人們從告解、醫學、教育到精神分析，前所未有地大量談論性？",
      "他區分東方與古代的「情色藝術」與西方的「性科學」：西方把性變成必須被說出、被檢查、被解碼的「真相」，源頭可追溯到基督教的告解。",
      "現代權力不只說「不」，也是生產性的：「性經驗部署」製造出歇斯底里的女人、手淫的兒童、控制生育的夫妻與變態的成人等形象。",
      "書末提出「生命權力」：現代權力的目標是管理人口的生命，而性正好位在個人身體與人口調節的交會點上。"
    ],
    concepts: [
      ["壓抑假說", "hypothèse répressive"],
      ["性經驗部署", "dispositif de sexualité"],
      ["性科學", "scientia sexualis"],
      ["生命權力", "bio-pouvoir"]
    ],
    impact:
      "二十世紀後半影響最深遠的人文社會科學著作之一，徹底改變了性、權力與知識的研究方式；「生命政治」的概念在本站歐陸專區的〈生命政治〉一章繼續發展。",
    links: [
      { id: "krafft-ebing", type: "分析對象" },
      { id: "foucault-1963", type: "早期思路" },
      { id: "foucault-1984", type: "後續轉向" }
    ]
  },
  {
    id: "foucault-1984",
    era: "twentieth",
    kind: "原典",
    author: { zh: "傅柯", orig: "Michel Foucault" },
    year: 1984,
    date: "1984 年",
    title: { orig: "Histoire de la sexualité II : L'Usage des plaisirs", zh: "《性史》第二卷《快感的享用》" },
    ref: "全書，含導論與飲食、家政、性愛、真愛四部",
    note: "沒有公開全文。",
    url: null,
    question: "如果不以禁令為中心，一種關於快感的倫理會是什麼樣子？",
    points: [
      "第一卷出版八年後，傅柯大幅調整寫作計畫，回到古希臘，研究人如何把自己構成「慾望的主體」。",
      "他發現古希臘的性道德不是一套普遍的禁令，而是自由男性公民的「自我實踐」：如何適度地「使用」快感，是一種「生存美學」。",
      "他分析飲食、家政、少年之愛與哲學中的「真愛」四個領域，指出問題的焦點是「主動／被動」與「節制／過度」，而不是對象的性別。",
      "這種倫理只屬於少數自由男性。傅柯並不主張回到古希臘，而是藉由對照，讓我們看見現代「性」概念本身的歷史性。"
    ],
    concepts: [
      ["快感", "aphrodisia"],
      ["使用", "chrēsis"],
      ["自我技術", "techniques de soi"],
      ["生存美學", "esthétique de l'existence"]
    ],
    impact:
      "改變了古典學與性史研究，激發大量關於古希臘「性」的研究；它與第三卷《自我的照顧》共同構成傅柯晚期的「倫理轉向」。兩卷在 1984 年夏天出版，傅柯不久後過世。",
    links: [
      { id: "plato-symposium", type: "重讀對象" },
      { id: "foucault-1976", type: "前作" }
    ]
  }
];
