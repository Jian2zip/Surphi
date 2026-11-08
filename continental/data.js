/*
 * Surphi｜歐陸哲學 1990–2020s
 * 思潮與期刊論文資料。
 *
 * 選文規則：只收期刊論文（含期刊刊出的譯文），出版於 1990–2021 年。
 * 書目於 2026-11-06 以 Crossref API 與出版者頁面核對；
 * cites 為當日 Crossref is-referenced-by-count，沒有 DOI 者為 null。
 * 導讀文字為本站撰寫的摘要與詮釋，不是原文翻譯。
 */

const CROSSREF_CHECKED = "2026-11-06";

const THEMES = [
  {
    id: "deconstruction",
    no: "01",
    name: "解構的倫理—政治轉向",
    orig: "The ethico-political turn of deconstruction",
    span: "1990–2002",
    color: "#f2352a",
    pos: { x: 14, y: 36 },
    intro:
      "1980 年代末，解構常被批評只是文字遊戲，對倫理與政治無話可說。1989 年德希達在卡多索法學院演講〈法律的力量〉，把焦點轉向正義、法律與暴力；此後「好客」「寬恕」「將臨的民主」「動物」成為他晚期的核心題目。這條線告訴我們：解構不是相對主義，而是對「無法被計算之物」的責任。",
    legacy:
      "它直接滋養了阿岡本與艾斯波西托的生命政治、巴特勒的展演理論，以及德希達的學生史蒂格勒與馬拉布的技術哲學與可塑性哲學。",
    concepts: [
      ["不可決定性", "indécidabilité"],
      ["正義", "justice"],
      ["好客", "hospitalité"],
      ["動物問題", "la question de l'animal"]
    ]
  },
  {
    id: "biopolitics",
    no: "02",
    name: "從規訓到控制：生命政治的延伸",
    orig: "Biopolitics after Foucault",
    span: "1992–2020",
    color: "#b02a6b",
    pos: { x: 40, y: 14 },
    intro:
      "傅柯在 1970 年代提出「生命政治」：現代權力不只懲罰，更管理人口的出生、健康與死亡。傅柯 1984 年過世後，這個概念在 1990 年代被重新點燃，並分成三個方向：德勒茲看見數位時代的「控制」，阿岡本把它推向主權與「赤裸生命」，艾斯波西托則以「免疫」重新解釋。2020 年的新冠疫情讓這場辯論突然變成公共議題。",
    legacy:
      "姆本貝的「死亡政治」把它帶進殖民史；洪席耶則以「歧見」反駁阿岡本，讓生命政治與政治哲學正面交鋒。",
    concepts: [
      ["生命政治", "biopolitique"],
      ["控制社會", "sociétés de contrôle"],
      ["赤裸生命", "nuda vita"],
      ["免疫範式", "paradigma immunitario"]
    ]
  },
  {
    id: "political",
    no: "03",
    name: "政治的回歸：普遍性、爭勝與平等",
    orig: "The return of the political",
    span: "1997–2008",
    color: "#d99a2b",
    pos: { x: 42, y: 50 },
    intro:
      "冷戰結束後，「歷史終結」與「第三條路」的共識政治盛行，彷彿政治只剩下管理與協商。一群深受拉岡、阿圖塞與後結構主義影響的思想家反過來主張：政治的本質是衝突、斷裂，以及平等突然被說出口的時刻。他們把真正的「政治」與日常的行政管理區分開來。",
    legacy:
      "這條線在 2008 年金融危機前後深刻影響了激進左翼、社會運動研究與民粹主義理論。",
    concepts: [
      ["後政治", "post-politics"],
      ["爭勝", "agonism"],
      ["歧見", "dissensus"],
      ["事件", "événement"]
    ]
  },
  {
    id: "matter",
    no: "04",
    name: "性別、身體與新唯物論",
    orig: "Gender, bodies and new materialisms",
    span: "1997–2019",
    color: "#e98aa0",
    pos: { x: 25, y: 80 },
    intro:
      "1990 年巴特勒的《性別麻煩》把性別理解為一再重複的「展演」，開啟了酷兒理論。到了 2000 年代，學者開始追問：如果一切都是話語建構，那麼身體、物質與非人事物在哪裡？「新唯物論」與「後人類主義」因此興起，把物質本身看成會主動「做事」的力量。",
    legacy:
      "這條線從「語言轉向」走到「物質轉向」，也把交織性、種族與動物納入思考，並與思辨實在論、人類世辯論彼此交錯。",
    concepts: [
      ["展演性", "performativity"],
      ["能動實在論", "agential realism"],
      ["物的力量", "thing-power"],
      ["後人類", "posthuman"]
    ]
  },
  {
    id: "realism",
    no: "05",
    name: "思辨實在論與物的轉向",
    orig: "Speculative realism and the turn to objects",
    span: "2004–2007",
    color: "#8c867c",
    pos: { x: 61, y: 74 },
    intro:
      "從康德以來，歐陸哲學大多預設：我們只能認識「對我們而言」的世界，觸及不到世界本身。2007 年倫敦金匠學院的一場工作坊，讓梅亞蘇、哈曼、布拉西耶與格蘭特被並稱為「思辨實在論」：他們拒絕這種「相關主義」，主張哲學應該重新思考獨立於人類的實在。拉圖 2004 年的論文則從科學研究的角度，發出了類似的警告。",
    legacy:
      "物導向本體論後來影響建築、藝術理論、文學批評與生態思想，也和新唯物論共享「物的轉向」。",
    concepts: [
      ["相關主義", "corrélationisme"],
      ["關切之事", "matters of concern"],
      ["物導向本體論", "object-oriented ontology"],
      ["偶然性的必然", "nécessité de la contingence"]
    ]
  },
  {
    id: "decolonial",
    no: "06",
    name: "殖民性與死亡政治",
    orig: "Coloniality and necropolitics",
    span: "2000–2021",
    color: "#ff8a3d",
    pos: { x: 67, y: 27 },
    intro:
      "歐陸哲學長期把「現代性」當成歐洲內部的故事。拉丁美洲的去殖民思想與非洲的後殖民理論則指出：現代性與殖民同時誕生，「種族」是現代權力的根基。他們大量借用傅柯、海德格、列維納斯與阿岡本，同時也質問這些歐洲哲學看不見的地方，讓歐陸理論被「去中心化」。",
    legacy:
      "「殖民性」與「死亡政治」成為分析邊境、監獄、戰爭、疫情與氣候災難的通用詞彙。",
    concepts: [
      ["權力殖民性", "colonialidad del poder"],
      ["死亡政治", "nécropolitique"],
      ["存在的殖民性", "coloniality of being"],
      ["呼吸權", "droit à la respiration"]
    ]
  },
  {
    id: "anthropocene",
    no: "07",
    name: "人類世與技術",
    orig: "The Anthropocene and technics",
    span: "2009–2017",
    color: "#7f8f3a",
    pos: { x: 87, y: 54 },
    intro:
      "2000 年代以後，氣候危機與數位技術成為哲學無法迴避的兩大課題。「人類世」意味著人類已經成為一股地質力量，迫使哲學重新思考歷史、自然與人類的關係；德希達的學生史蒂格勒與馬拉布，以及曾在史蒂格勒研究機構工作的香港哲學家許煜，則把技術問題拉回哲學的核心。",
    legacy:
      "這條線把歐陸哲學推向神經科學、人類學、媒體研究與環境人文學，也讓非西方的技術思想進入討論核心。",
    concepts: [
      ["人類世", "Anthropocene"],
      ["藥", "pharmakon"],
      ["宇宙技術", "cosmotechnics"],
      ["可塑性", "plasticité"]
    ]
  }
];

/* 思潮之間的衍伸關係（圖譜連線） */
const THEME_LINKS = [
  {
    from: "deconstruction",
    to: "biopolitics",
    text: "阿岡本與艾斯波西托都在和德希達對話：前者重讀班雅明〈暴力批判〉與法律的暴力，後者把德希達晚期的「自體免疫」發展成免疫範式。"
  },
  {
    from: "deconstruction",
    to: "matter",
    text: "巴特勒的展演性借自德希達的「可重複性」（itérabilité）；德希達的動物論則是後人類主義批判人類中心的重要起點。"
  },
  {
    from: "deconstruction",
    to: "anthropocene",
    text: "史蒂格勒與馬拉布都是德希達的學生；史蒂格勒的技術「藥理學」直接改寫自德希達對柏拉圖 pharmakon 的解讀。"
  },
  {
    from: "biopolitics",
    to: "political",
    text: "洪席耶〈誰是人權的主體？〉正面反駁阿岡本：被排除者不是只能等待的赤裸生命，而是能夠發動歧見的政治主體。"
  },
  {
    from: "biopolitics",
    to: "decolonial",
    text: "姆本貝把傅柯的生命權力與阿岡本的例外狀態帶進種植園與殖民地，提出「死亡政治」。"
  },
  {
    from: "political",
    to: "matter",
    text: "1997 年紀傑克批評多元文化主義、巴特勒為酷兒政治辯護，構成「文化左派 vs. 經濟左派」的同一場辯論。"
  },
  {
    from: "realism",
    to: "matter",
    text: "拉圖的「行動者」、班奈特的「物的力量」與哈曼的物導向本體論，共享讓非人事物重新登場的「物的轉向」。"
  },
  {
    from: "realism",
    to: "anthropocene",
    text: "拉圖對批判的反省以氣候科學遭到質疑為起點，後來成為人類世思想的重要聲音。"
  },
  {
    from: "decolonial",
    to: "anthropocene",
    text: "查卡拉巴提從後殖民史學走向人類世；許煜則以非西方的「宇宙技術」回應全球技術同質化。"
  },
  {
    from: "matter",
    to: "anthropocene",
    text: "後人類主義與新唯物論把物種界線、生態與技術問題帶進人文學，為人類世辯論提供概念工具。"
  }
];

const PAPERS = [
  /* ───────── 01 解構的倫理—政治轉向 ───────── */
  {
    id: "derrida-1990",
    theme: "deconstruction",
    author: { zh: "德希達", orig: "Jacques Derrida" },
    year: 1990,
    title: {
      orig: "Force of Law: The “Mystical Foundation of Authority”",
      zh: "〈法律的力量：「權威的神祕基礎」〉"
    },
    venue: "Cardozo Law Review 11, no. 5–6 (1990): 920–1045",
    note: "Mary Quaintance 英譯；1989 年卡多索法學院研討會「解構與正義的可能性」主題演講。",
    doi: null,
    url: "https://larc.cardozo.yu.edu/clr/vol11/iss5/2/",
    cites: null,
    question: "法律的權威從哪裡來？如果每一部法律都源於一次「創立法律」的暴力行為，那麼正義與法律是同一回事嗎？",
    points: [
      "法律（droit）必須仰賴「力量」才能被執行，而創立法律的那一刻，本身無法用既有的法律來證成。這就是德希達借自蒙田與巴斯卡所說的權威的「神祕基礎」。",
      "因此法律可以被解構，「正義」卻不可被解構：正義是對每一個獨特個案的無限責任，永遠無法被規則完全計算。",
      "法官必須既遵守規則、又在每次判決中重新發明規則。這種「不可決定性」不會讓人癱瘓，反而是做出負責任決定的前提。",
      "文章後半細讀班雅明〈暴力批判〉，討論「立法的暴力」與「護法的暴力」如何彼此滲透。"
    ],
    concepts: [
      ["不可決定性", "undecidability"],
      ["正義", "justice"],
      ["權威的神祕基礎", "fondement mystique de l'autorité"],
      ["暴力", "Gewalt"]
    ],
    impact:
      "這篇長文被視為解構「倫理—政治轉向」的標誌，開啟了法律與文學、批判法學的大量研究。阿岡本在《神聖人》與《例外狀態》中討論班雅明與「法的力量」時，正是在與這篇文章對話。",
    links: [{ id: "agamben-1995", type: "後續對話" }]
  },
  {
    id: "derrida-2002",
    theme: "deconstruction",
    author: { zh: "德希達", orig: "Jacques Derrida" },
    year: 2002,
    title: {
      orig: "The Animal That Therefore I Am (More to Follow)",
      zh: "〈因此我所是（所追隨）的動物（待續）〉"
    },
    venue: "Critical Inquiry 28, no. 2 (2002): 369–418",
    note: "David Wills 英譯；原為 1997 年瑟里西研討會演講。法文 je suis 同時有「我是」與「我追隨」兩義。",
    doi: "10.1086/449046",
    cites: 640,
    question: "當一隻貓看著赤裸的我時，「誰」在看？哲學為什麼總是用單數的「動物」，把無數不同的生命歸成同一類？",
    points: [
      "德希達從被自家的貓注視、因而感到羞恥的經驗出發，指出從笛卡兒、康德、海德格到列維納斯、拉岡，西方哲學一直以「動物缺少某種能力」（語言、理性、對死亡的意識）來界定人。",
      "「動物」這個單數總稱本身就是一種暴力。他造了新詞 animot（諧音複數的 animaux 與「字詞」mot），提醒我們生命的多樣性。",
      "他回到邊沁的提問：關鍵不是「牠們能否說話」，而是「牠們能否受苦」。受苦是一種「無能為力的能力」，構成我們與動物共享的有限性。",
      "他也嚴厲批評近兩百年來工業化對待動物的方式，認為這是前所未有的暴力。"
    ],
    concepts: [
      ["animot", "animot"],
      ["人／動物界線", "human/animal divide"],
      ["受苦", "souffrance"],
      ["被注視", "être vu"]
    ],
    impact:
      "公認為「動物轉向」與動物研究的奠基文本之一，Crossref 被引六百餘次。後人類主義（布拉伊多蒂）與新唯物論對人類中心的批判，都把它當作重要起點。",
    links: [{ id: "braidotti-2019", type: "後續延伸" }]
  },

  /* ───────── 02 生命政治 ───────── */
  {
    id: "deleuze-1992",
    theme: "biopolitics",
    author: { zh: "德勒茲", orig: "Gilles Deleuze" },
    year: 1992,
    title: {
      orig: "Postscript on the Societies of Control",
      zh: "〈控制社會後記〉"
    },
    venue: "October 59 (1992): 3–7",
    note: "法文原文 1990 年刊於 L'Autre journal，後收入《協商》（Pourparlers）。",
    doi: null,
    url: "https://www.jstor.org/stable/778828",
    cites: null,
    question: "傅柯描述的學校、工廠、醫院、監獄等「封閉空間」正在全面危機中，取而代之的是什麼樣的權力？",
    points: [
      "規訓社會像「模具」：人從一個封閉機構走到下一個，每次重新開始。控制社會則像「調變」（modulation）：權力是一張不斷自我變形的篩網，連續、沒有終點。",
      "規訓社會用簽名與編號辨識人，控制社會用「密碼」決定你能不能進入。個體（individu）變成「可分體」（dividuel），人群被拆解成樣本、數據與市場。",
      "企業取代工廠，終身學習取代畢業考試，負債取代禁閉。象徵動物從規訓社會的「鼴鼠」換成控制社會的「蛇」。",
      "文末提醒：重點不是懷念舊制度，而是尋找新的抵抗武器。"
    ],
    concepts: [
      ["控制社會", "sociétés de contrôle"],
      ["調變", "modulation"],
      ["可分體", "dividuel"],
      ["密碼", "chiffre"]
    ],
    impact:
      "全文只有五頁，卻成為監控研究、數位媒體理論與平台資本主義批判最常回溯的出發點之一。演算法治理研究、史蒂格勒的「精神權力」都延續這篇的診斷。",
    links: [{ id: "stiegler-2011", type: "後續延伸" }]
  },
  {
    id: "agamben-1995",
    theme: "biopolitics",
    author: { zh: "阿岡本", orig: "Giorgio Agamben" },
    year: 1995,
    title: { orig: "We Refugees", zh: "〈我們難民〉" },
    venue: "Symposium: A Quarterly Journal in Modern Literatures 49, no. 2 (1995): 114–119",
    note: "Michael Rocke 英譯；標題呼應鄂蘭 1943 年的同名文章。",
    doi: "10.1080/00397709.1995.10733798",
    cites: 96,
    question: "在一個以民族國家為單位的世界裡，難民為什麼是最令人不安的形象？",
    points: [
      "延續鄂蘭的觀察：人權原本應該保障「單純的人」，但一個人一旦失去公民身分，實際上就失去了一切權利。",
      "民族國家建立在「出生＝國族」的連結上。難民打斷了這條連結，暴露出主權運作的隱藏機制。",
      "因此難民不是邊緣問題，而是「我們這個時代唯一可以想像的政治主體形象」。我們應該以難民、而不是公民為起點，重新思考政治。",
      "他想像以「共處同一地域、彼此互為流亡」的政治共同體，取代國界分明的民族國家，並以耶路撒冷為例。"
    ],
    concepts: [
      ["難民", "rifugiato"],
      ["赤裸生命", "nuda vita"],
      ["出生與國族", "nascita / nazione"],
      ["人權的弔詭", "paradox of human rights"]
    ],
    impact:
      "與同年出版的專書《神聖人》一起，把「赤裸生命」「例外狀態」帶進難民研究、移民政策與人權批判。洪席耶 2004 年的〈誰是人權的主體？〉就是針對這條思路的反駁。",
    links: [
      { id: "derrida-1990", type: "對話對象" },
      { id: "ranciere-2004", type: "被反駁" },
      { id: "mbembe-2003", type: "後續延伸" },
      { id: "agamben-2020", type: "後續延伸" }
    ]
  },
  {
    id: "esposito-2013",
    theme: "biopolitics",
    author: { zh: "艾斯波西托", orig: "Roberto Esposito" },
    year: 2013,
    title: { orig: "Community, Immunity, Biopolitics", zh: "〈共同體、免疫、生命政治〉" },
    venue: "Angelaki 18, no. 3 (2013): 83–90",
    note: "Zakiya Hanafi 英譯。",
    doi: "10.1080/0969725X.2013.834666",
    cites: 100,
    question: "「共同體」與「免疫」在字源上都來自拉丁文 munus（禮物、義務），這透露了現代政治的什麼祕密？",
    points: [
      "communitas 是一起承擔 munus（相互的贈予與義務）的人；immunitas 則是被免除這項義務的人。共同體與免疫是同一枚硬幣的兩面。",
      "現代性可以理解為一個「免疫化」的過程：主權、財產、個人自由等制度，都在保護生命不受他者「感染」。",
      "免疫一旦過度，就會反過來攻擊自身，也就是「自體免疫」。納粹的生命政治正是這種邏輯的極端案例。",
      "他主張一種「肯定的生命政治」：不再是凌駕於生命之上的政治，而是屬於生命本身的政治。"
    ],
    concepts: [
      ["munus", "munus"],
      ["免疫範式", "paradigma immunitario"],
      ["自體免疫", "autoimmunità"],
      ["肯定的生命政治", "biopolitica affermativa"]
    ],
    impact:
      "這篇短文濃縮了他的「共同體三部曲」（Communitas、Immunitas、Bios）。免疫範式被大量用於全球衛生、邊境與安全研究，並在 2020 年疫情期間成為核心詞彙；它也呼應德希達晚期的「自體免疫」概念。",
    links: [
      { id: "agamben-1995", type: "同一論域" },
      { id: "agamben-2020", type: "後續對話" }
    ]
  },
  {
    id: "agamben-2020",
    theme: "biopolitics",
    author: { zh: "阿岡本", orig: "Giorgio Agamben" },
    year: 2020,
    title: { orig: "The Invention of an Epidemic", zh: "〈一場流行病的發明〉" },
    venue: "European Journal of Psychoanalysis, “Coronavirus and Philosophers” (February–May 2020)",
    note: "義大利文原文 2020 年 2 月 26 日首發，英譯收入《歐洲精神分析期刊》的「冠狀病毒與哲學家」論壇專輯。屬於期刊論壇短文。",
    doi: null,
    url: "https://www.journal-psychoanalysis.eu/articles/coronavirus-and-philosophers/",
    cites: null,
    question: "義大利政府因新冠疫情採取的緊急措施，是否正在把「例外狀態」變成常態？",
    points: [
      "阿岡本引用義大利國家研究委員會（CNR）當時的說法，認為疫情被誇大，政府的緊急措施「不成比例」。",
      "他主張：恐怖主義作為例外的理由已經用盡，「流行病」提供了擴張例外狀態的新藉口；而社會上普遍的不安全感，讓人們願意接受對自由的限制。",
      "這篇短文延續他自《神聖人》以來的論點：現代政治傾向把生命化約為需要被管理的「赤裸生命」。",
      "（發表後的論戰）南希隨即以〈病毒性的例外〉回應，提醒病毒是真實的；艾斯波西托也批評他把一切都化約成例外狀態。"
    ],
    concepts: [
      ["例外狀態", "stato di eccezione"],
      ["緊急措施", "misure di emergenza"],
      ["生物安全", "biosicurezza"],
      ["赤裸生命", "nuda vita"]
    ],
    impact:
      "引發哲學界罕見的公開論戰（南希、艾斯波西托、Benvenuto、德維維迪與莫漢等），成為疫情時代討論生命政治時繞不過的文本，也讓許多學者反思：理論該如何面對真實的公共衛生危機。",
    links: [
      { id: "agamben-1995", type: "延續" },
      { id: "esposito-2013", type: "對話對象" },
      { id: "mbembe-2021", type: "同期回應" }
    ]
  },

  /* ───────── 03 政治的回歸 ───────── */
  {
    id: "zizek-1997",
    theme: "political",
    author: { zh: "紀傑克", orig: "Slavoj Žižek" },
    year: 1997,
    title: {
      orig: "Multiculturalism, or, the Cultural Logic of Multinational Capitalism",
      zh: "〈多元文化主義，或跨國資本主義的文化邏輯〉"
    },
    venue: "New Left Review I/225 (1997): 28–51",
    note: "標題改寫自詹明信〈後現代主義，或晚期資本主義的文化邏輯〉。",
    doi: "10.64590/gzu",
    cites: 44,
    question: "尊重差異、包容多元的自由主義多元文化主義，真的是對抗資本主義的進步立場嗎？",
    points: [
      "紀傑克認為，多元文化主義正是全球資本主義最理想的意識形態形式。",
      "多元文化主義者站在一個「空洞的普遍位置」俯視各種在地文化，就像殖民者看待被殖民者。這是一種「保持距離的種族主義」。",
      "身分政治把社會衝突轉化為「承認」與「包容」的文化問題，結果讓資本主義本身變得看不見，政治也被「去政治化」了。",
      "他呼籲重新奪回「普遍性」：真正的政治，是被排除的部分以普遍之名發聲。"
    ],
    concepts: [
      ["後政治", "post-politics"],
      ["去政治化", "depoliticization"],
      ["保持距離的種族主義", "racism with a distance"],
      ["具體的普遍性", "concrete universality"]
    ],
    impact:
      "這篇與巴特勒同年的〈僅僅是文化的〉共同構成 1990 年代末「文化左派 vs. 經濟左派」的大辯論，也是紀傑克「後政治」批判的代表作。",
    links: [
      { id: "butler-1997", type: "同期辯論" },
      { id: "badiou-2008", type: "思想盟友" }
    ]
  },
  {
    id: "mouffe-1999",
    theme: "political",
    author: { zh: "穆芙", orig: "Chantal Mouffe" },
    year: 1999,
    title: {
      orig: "Deliberative Democracy or Agonistic Pluralism?",
      zh: "〈審議式民主，還是爭勝的多元主義？〉"
    },
    venue: "Social Research 66, no. 3 (1999): 745–758",
    note: null,
    doi: null,
    url: "https://philarchive.org/rec/MOUDDO",
    cites: null,
    question: "民主政治的目標，應該是透過理性討論達成共識嗎？",
    points: [
      "她批評羅爾斯與哈伯瑪斯代表的審議式民主：以「理性共識」作為正當性的基礎，等於把無法消除的衝突推出公共領域。",
      "借用施密特與維根斯坦，她主張「對抗」是政治無法根除的維度；任何共識都建立在某種排除之上。",
      "民主的任務不是消滅衝突，而是把「敵人」轉化為「對手」：承認對方存在的正當性，在共同的民主原則下激烈競爭。這就是「爭勝」。",
      "當左右政黨都趨向中間、政治只剩共識時，被壓抑的政治激情會轉向極右民粹與本質主義的認同。"
    ],
    concepts: [
      ["爭勝主義", "agonism"],
      ["對抗", "antagonism"],
      ["對手／敵人", "adversary / enemy"],
      ["霸權", "hegemony"]
    ],
    impact:
      "「爭勝民主」成為審議民主之外最重要的民主理論之一，深刻影響政治理論、都市規劃與藝術行動主義。她關於「後政治共識會餵養右翼民粹」的預警，在 2010 年代被大量引用。",
    links: [{ id: "ranciere-2004", type: "同一論域" }]
  },
  {
    id: "ranciere-2004",
    theme: "political",
    author: { zh: "洪席耶", orig: "Jacques Rancière" },
    year: 2004,
    title: { orig: "Who Is the Subject of the Rights of Man?", zh: "〈誰是人權的主體？〉" },
    venue: "South Atlantic Quarterly 103, no. 2–3 (2004): 297–310",
    note: null,
    doi: "10.1215/00382876-103-2-3-297",
    cites: 472,
    question: "如果人權只屬於已經享有權利的公民，或只屬於一無所有的赤裸生命，那人權還有意義嗎？",
    points: [
      "他同時回應鄂蘭與阿岡本：鄂蘭認為人權要麼屬於沒有權利的人（等於無用），要麼屬於已有權利的公民（等於同義反覆）；阿岡本則把這個困境推向赤裸生命與集中營。",
      "洪席耶認為兩者都把政治「去政治化」了，把它化約成一種無法擺脫的本體論命運。",
      "他的答案：人權的主體，是那些「擁有自己沒有的權利，而沒有自己擁有的權利」的人。法國大革命時，女性主義者古熱說「女人既然有權上斷頭台，就有權上講台」，政治就在這種援引紙上平等的行動中發生。",
      "這種「歧見」是把兩個世界放進同一個世界的行動。"
    ],
    concepts: [
      ["歧見", "dissensus"],
      ["治安", "la police"],
      ["無分者之分", "la part des sans-part"],
      ["主體化", "subjectivation"]
    ],
    impact:
      "這篇是理解洪席耶政治哲學最簡潔的入口，也是對阿岡本生命政治最有力的批評之一，廣泛用於人權理論、難民研究與社會運動研究。",
    links: [
      { id: "agamben-1995", type: "反駁" },
      { id: "mouffe-1999", type: "同一論域" }
    ]
  },
  {
    id: "badiou-2008",
    theme: "political",
    author: { zh: "巴迪烏", orig: "Alain Badiou" },
    year: 2008,
    title: { orig: "The Communist Hypothesis", zh: "〈共產主義假說〉" },
    venue: "New Left Review 49 (2008): 29–42",
    note: "改寫自他 2007 年的小書《薩科吉是什麼的名字？》。",
    doi: "10.64590/3ds",
    cites: 18,
    question: "在蘇聯解體、「共產主義」幾乎等於失敗與災難之後，這個詞還能代表什麼？",
    points: [
      "從 2007 年薩科吉當選法國總統出發，巴迪烏認為左右兩派的議會政治共享同一個前提：沒有其他可能。",
      "他區分作為國家形式的共產主義，與作為「理念」的共產主義。後者是一個「假說」：平等的集體組織是可能的，私有財產與國家並不是永恆的。",
      "歷史上有兩個序列：從 1792 年到 1871 年巴黎公社（假說被提出），從 1917 年到 1976 年（嘗試以政黨與國家實現假說）。兩者都以失敗告終，但失敗本身就是假說歷史的一部分。",
      "我們今天處在新的「間隔期」，任務是在政黨國家形式之外，開啟假說的第三個序列。"
    ],
    concepts: [
      ["共產主義理念", "l'idée du communisme"],
      ["事件", "événement"],
      ["忠誠", "fidélité"],
      ["真理程序", "procédure de vérité"]
    ],
    impact:
      "這篇文章促成 2009 年在倫敦柏貝克學院舉行的「論共產主義理念」研討會（由巴迪烏與紀傑克召集），帶動 2010 年代激進左翼的「共產主義轉向」，也是理解巴迪烏「事件」哲學如何落到政治的入門文本。",
    links: [{ id: "zizek-1997", type: "思想盟友" }]
  },

  /* ───────── 04 性別、身體與新唯物論 ───────── */
  {
    id: "butler-1997",
    theme: "matter",
    author: { zh: "巴特勒", orig: "Judith Butler" },
    year: 1997,
    title: { orig: "Merely Cultural", zh: "〈僅僅是文化的〉" },
    venue: "Social Text 52/53 (1997): 265–277",
    note: "隔年另刊於 New Left Review I/227（1998）。",
    doi: "10.2307/466744",
    cites: 333,
    question: "酷兒與性少數運動只是「文化」議題，跟經濟正義無關嗎？",
    points: [
      "這篇回應當時部分左派的指責：新社會運動（尤其酷兒政治）讓左派分裂，只關心身分與承認。",
      "巴特勒重讀馬克思與恩格斯：家庭與性的再生產，本來就是生產方式的一部分。異性戀規範如何組織親屬、繼承與勞動分工，本身就是政治經濟問題。",
      "她也批評弗雷澤把「再分配」與「承認」分開的做法：把性壓迫歸為「僅僅是文化的」承認問題，低估了它的物質性。",
      "結論：左派的團結不應以壓抑差異的「統一」為前提，而要在衝突中形成聯盟。"
    ],
    concepts: [
      ["展演性", "performativity"],
      ["異性戀規範", "heteronormativity"],
      ["再分配／承認", "redistribution / recognition"],
      ["聯盟政治", "coalitional politics"]
    ],
    impact:
      "與弗雷澤刊於同期的回應〈異性戀主義、錯誤承認與資本主義〉構成著名的「巴特勒—弗雷澤辯論」，至今仍是酷兒馬克思主義與社會再生產理論的討論起點。",
    links: [
      { id: "zizek-1997", type: "同期辯論" },
      { id: "barad-2003", type: "後續延伸" }
    ]
  },
  {
    id: "barad-2003",
    theme: "matter",
    author: { zh: "巴拉德", orig: "Karen Barad" },
    year: 2003,
    title: {
      orig: "Posthumanist Performativity: Toward an Understanding of How Matter Comes to Matter",
      zh: "〈後人類的展演性：理解物質如何變得重要〉"
    },
    venue: "Signs: Journal of Women in Culture and Society 28, no. 3 (2003): 801–831",
    note: "標題的 matter 同時有「物質」與「要緊」兩義。",
    doi: "10.1086/345321",
    cites: 4837,
    question: "如果展演性不只屬於語言與話語，物質本身也能「展演」嗎？",
    points: [
      "文章開頭直言：「語言被賦予了太多權力。」在語言轉向、文化轉向之後，唯一似乎不再重要的，就是物質。",
      "她結合量子物理學家波耳、傅柯與巴特勒，提出「能動實在論」：世界不是由事先存在的獨立物體構成，而是由不斷「內部互動」（intra-action）的「現象」構成。",
      "測量儀器與被測對象之間的界線不是事先給定的，而是在實踐中透過「能動切割」產生的。",
      "因此展演性必須「後人類化」：人類與非人類、話語與物質，共同參與世界的生成。"
    ],
    concepts: [
      ["能動實在論", "agential realism"],
      ["內部互動", "intra-action"],
      ["能動切割", "agential cut"],
      ["物質—話語", "material-discursive"]
    ],
    impact:
      "Crossref 被引超過四千八百次，是新唯物論女性主義最具影響力的論文。intra-action 等詞彙廣泛進入科學與技術研究、教育學與藝術理論；後來擴寫為專書《與宇宙半途相遇》（2007）。",
    links: [
      { id: "butler-1997", type: "延伸巴特勒" },
      { id: "bennett-2004", type: "同一轉向" },
      { id: "puar-2012", type: "後續對話" }
    ]
  },
  {
    id: "bennett-2004",
    theme: "matter",
    author: { zh: "班奈特", orig: "Jane Bennett" },
    year: 2004,
    title: {
      orig: "The Force of Things: Steps toward an Ecology of Matter",
      zh: "〈物的力量：邁向物質的生態學〉"
    },
    venue: "Political Theory 32, no. 3 (2004): 347–372",
    note: null,
    doi: "10.1177/0090591703260853",
    cites: 604,
    question: "排水溝裡的一堆雜物（手套、花粉、死老鼠、瓶蓋），能讓我們重新思考政治嗎？",
    points: [
      "班奈特想替非人事物的生命力、任性與頑抗找到哲學語言，她稱之為「物的力量」（thing-power）：物不只是被動的對象，也具有讓人改變的能力。",
      "她援引盧克萊修、史賓諾莎、德勒茲與拉圖，描繪一種「活潑物質的唯物論」，並讓它與馬克思的歷史唯物論、女性主義與文化研究的身體唯物論對話。",
      "她坦承這是一個「思辨的存有論故事」：一次刻意大膽的嘗試，想描繪流過人、也穿透人的非人性。",
      "如果承認物質的能動性，倫理與政治就不再只是人與人之間的事；消費、廢棄物與生態，都是人與非人共同組成的問題。"
    ],
    concepts: [
      ["物的力量", "thing-power"],
      ["活力唯物論", "vital materialism"],
      ["集合體", "assemblage"],
      ["努力", "conatus"]
    ],
    impact:
      "這篇是她 2010 年專書《活力物質》的雛形，該書 Crossref 被引近萬次。她讓新唯物論進入政治理論與環境人文學，也與拉圖、哈曼的物導向思考形成對話。",
    links: [
      { id: "latour-2004", type: "思想資源" },
      { id: "barad-2003", type: "同一轉向" },
      { id: "harman-2007", type: "對話對象" }
    ]
  },
  {
    id: "puar-2012",
    theme: "matter",
    author: { zh: "普亞", orig: "Jasbir K. Puar" },
    year: 2012,
    title: {
      orig: "“I would rather be a cyborg than a goddess”: Becoming-Intersectional in Assemblage Theory",
      zh: "〈「我寧願當賽博格，也不當女神」：集合體理論中的生成—交織〉"
    },
    venue: "philoSOPHIA 2, no. 1 (2012): 49–66",
    note: "標題出自哈洛威〈賽博格宣言〉的最後一句。",
    doi: "10.1353/phi.2012.a486621",
    cites: 586,
    question: "思考種族、性別與身體時，「交織性」與德勒茲式的「集合體」，哪一個框架比較合適？",
    points: [
      "普亞比較兩種框架：交織性（源自克倫肖等黑人女性主義者）強調身分範疇的交會；集合體則強調流動、情動與非人的力量。",
      "她指出交織性可能被制度化成一張把人歸檔的「網格」，反而把身分固定下來；但集合體理論也可能忽略種族與殖民的歷史。",
      "她不主張二選一，而是讓兩者「生成—交織」：既看身分的結構，也看身體、情動與物質如何不斷重組。"
    ],
    concepts: [
      ["交織性", "intersectionality"],
      ["集合體", "assemblage"],
      ["情動", "affect"],
      ["生成", "becoming"]
    ],
    impact:
      "這篇是酷兒理論、新唯物論與批判種族研究交會處最常被引用的文本之一，把德勒茲哲學與黑人女性主義接上了線。",
    links: [
      { id: "barad-2003", type: "對話對象" },
      { id: "bennett-2004", type: "同一論域" }
    ]
  },
  {
    id: "braidotti-2019",
    theme: "matter",
    author: { zh: "布拉伊多蒂", orig: "Rosi Braidotti" },
    year: 2019,
    title: {
      orig: "A Theoretical Framework for the Critical Posthumanities",
      zh: "〈批判後人文學的理論框架〉"
    },
    venue: "Theory, Culture & Society 36, no. 6 (2019): 31–61",
    note: "2018 年線上先行刊出。",
    doi: "10.1177/0263276418771486",
    cites: 776,
    question: "一個「後人類」的認知主體該如何定義？她的知識如何可信、又如何負起倫理責任？",
    points: [
      "她把「批判後人文學」定位為兩股力量的匯流：後人文主義（批判以歐洲白人男性為標準的普遍「人」）與後人類中心主義（批判人類物種的例外地位）。",
      "她的概念基礎是一種新史賓諾莎主義的一元論：基進的內在性，也就是有智能、會自我組織的物質優先。",
      "因此認知主體不只是超越的意識，而是關係性的、具身的、嵌入環境的、有情動且必須負責的存在。",
      "由此導出兩條連續體：「身心連續」（身體有腦、心靈有身）與「自然文化連續」（naturecultural、humanimal 的跨越連結），並討論它們對當代研究型大學的意義。"
    ],
    concepts: [
      ["後人類境況", "posthuman condition"],
      ["基進內在性", "radical immanence"],
      ["自然文化", "naturecultures"],
      ["肯定的倫理", "affirmative ethics"]
    ],
    impact:
      "這篇系統化了「批判後人文學」這個新興領域，Crossref 被引近八百次，影響數位人文、環境人文與醫療人文。她的口號「我們身處其中，但我們並非同一」也成為她 2020 年疫情文章的標題。",
    links: [
      { id: "derrida-2002", type: "思想資源" },
      { id: "barad-2003", type: "同一轉向" }
    ]
  },

  /* ───────── 05 思辨實在論 ───────── */
  {
    id: "latour-2004",
    theme: "realism",
    author: { zh: "拉圖", orig: "Bruno Latour" },
    year: 2004,
    title: {
      orig: "Why Has Critique Run out of Steam? From Matters of Fact to Matters of Concern",
      zh: "〈批判為何失去動力？從「事實之事」到「關切之事」〉"
    },
    venue: "Critical Inquiry 30, no. 2 (2004): 225–248",
    note: null,
    doi: "10.1086/421123",
    cites: 3679,
    question: "當氣候變遷否認者與陰謀論者都學會了「事實是被建構的」這套說法，批判理論還站得住腳嗎？",
    points: [
      "拉圖坦承他的不安：社會建構論原本用來揭穿權力，如今卻被用來懷疑全球暖化的科學共識。",
      "他認為批判犯了雙重錯誤：一邊說別人相信的東西只是「物神」，一邊又把自己相信的社會力量當成不容質疑的硬事實。",
      "出路不是回到天真的「事實之事」（matters of fact），而是轉向「關切之事」（matters of concern）：把事物理解為許多人與非人聚集在一起、需要被照料的「物」（借自海德格的 Ding）。",
      "批判者的任務不是揭穿，而是「聚集」：提供讓眾多參與者能夠集會的場所。"
    ],
    concepts: [
      ["事實之事", "matters of fact"],
      ["關切之事", "matters of concern"],
      ["物", "Ding / thing"],
      ["行動者網絡", "actor-network"]
    ],
    impact:
      "人文社會科學引用最多的論文之一（Crossref 被引超過三千六百次），被視為「後批判」轉向的起點，並與新唯物論、思辨實在論與科學技術研究形成廣泛共鳴。",
    links: [
      { id: "bennett-2004", type: "後續延伸" },
      { id: "harman-2007", type: "對話對象" },
      { id: "chakrabarty-2009", type: "同一關切" }
    ]
  },
  {
    id: "meillassoux-2007",
    theme: "realism",
    author: { zh: "梅亞蘇", orig: "Quentin Meillassoux" },
    year: 2007,
    title: { orig: "Potentiality and Virtuality", zh: "〈潛能與虛擬〉" },
    venue: "Collapse II (2007): 55–81",
    note: "Robin Mackay 英譯；《崩塌》第二期即「思辨實在論」專輯。",
    doi: null,
    url: "https://philarchive.org/rec/MEIPAV",
    cites: null,
    question: "如果自然法則本身沒有必然性、可以毫無理由地改變，為什麼我們看到的世界如此穩定？",
    points: [
      "延續《有限性之後》（2006）：梅亞蘇批判「相關主義」，也就是主張我們只能觸及思想與存在的相互關係，觸及不到獨立實在的立場。",
      "他重新處理休謨的因果問題：與其證明自然法則是必然的，不如接受法則本身是偶然的。唯一必然的，是「偶然性的必然」。",
      "反對者會說：如果法則隨時可能改變，按照機率世界早就混亂不堪。他回應：這個推論預設「所有可能性的全體」可以被計算，但康托爾的超限集合論顯示，可能性的全體無法被整體化。",
      "因此他區分「潛能」（在既定可能性集合中的選項）與「虛擬」（沒有事先給定集合、真正嶄新事物的湧現）。"
    ],
    concepts: [
      ["相關主義", "corrélationisme"],
      ["偶然性的必然", "nécessité de la contingence"],
      ["超限", "transfini"],
      ["虛擬", "virtualité"]
    ],
    impact:
      "與《有限性之後》共同奠定思辨實在論的論證核心，「相關主義」一詞迅速成為整個運動的通用術語；刊登它的《崩塌》第二期也被視為思辨實在論的創始文獻。",
    links: [{ id: "harman-2007", type: "同期同刊" }]
  },
  {
    id: "harman-2007",
    theme: "realism",
    author: { zh: "哈曼", orig: "Graham Harman" },
    year: 2007,
    title: { orig: "On Vicarious Causation", zh: "〈論替代因果〉" },
    venue: "Collapse II (2007): 187–221",
    note: null,
    doi: null,
    url: "https://fount.aucegypt.edu/faculty_book_chapters/766",
    cites: null,
    question: "如果物與物之間永遠無法真正接觸，因果作用是怎麼發生的？",
    points: [
      "哈曼的「物導向本體論」從海德格的工具分析出發：每個物都有一個不被任何關係窮盡、向後「退隱」的核心。這不只對人類如此，物與物之間也一樣；火燃燒棉花時，也觸及不到棉花的全部。",
      "那麼因果如何可能？他提出「替代因果」：物之間不是直接作用，而是透過「感官物」，在某個中介的「內部」間接相遇。",
      "他區分「實在物」與「感官物」、「實在性質」與「感官性質」，並主張哲學應該恢復被近代科學排除的美學維度，因為因果與美學都涉及間接的「誘惑」（allure）。"
    ],
    concepts: [
      ["物導向本體論", "object-oriented ontology"],
      ["退隱", "withdrawal"],
      ["替代因果", "vicarious causation"],
      ["誘惑", "allure"]
    ],
    impact:
      "物導向本體論最常被引用的論證之一。OOO 後來對建築、藝術理論、文學批評（如哈曼 2012 年〈精緻的破錘子〉）與莫頓的生態思想產生廣泛影響。",
    links: [
      { id: "meillassoux-2007", type: "同期同刊" },
      { id: "latour-2004", type: "對話對象" },
      { id: "bennett-2004", type: "對話對象" }
    ]
  },

  /* ───────── 06 殖民性與死亡政治 ───────── */
  {
    id: "quijano-2000",
    theme: "decolonial",
    author: { zh: "奎哈諾", orig: "Aníbal Quijano" },
    year: 2000,
    title: {
      orig: "Coloniality of Power and Eurocentrism in Latin America",
      zh: "〈拉丁美洲的權力殖民性與歐洲中心主義〉"
    },
    venue: "International Sociology 15, no. 2 (2000): 215–232",
    note: "同年另有擴充版刊於 Nepantla: Views from South 1, no. 3。",
    doi: "10.1177/0268580900015002005",
    cites: 2464,
    question: "拉丁美洲的殖民統治早已結束，為什麼殖民的權力結構仍然存在？",
    points: [
      "奎哈諾認為全球化是一個過程的頂點：這個過程從美洲被「建構」、以歐洲為中心的殖民／現代世界權力形成時就開始了。",
      "這套權力的基礎之一，是以「種族」為依據的人口分類。種族是一個表達殖民經驗的心智建構，被用來組織全球的勞動分工：誰當奴隸、誰當農奴、誰拿工資。",
      "殖民主義（政治統治）可以結束，但「殖民性」（種族化的權力、知識與勞動模式）會延續到獨立後的國家與今天的全球資本主義。",
      "歐洲中心主義是這套權力特有的理性：把歐洲描繪成歷史的終點與普遍標準，把其他人放進「過去」與「傳統」。"
    ],
    concepts: [
      ["權力殖民性", "colonialidad del poder"],
      ["種族", "raza"],
      ["歐洲中心主義", "eurocentrismo"],
      ["現代性／殖民性", "modernity / coloniality"]
    ],
    impact:
      "去殖民研究的奠基文本之一，Crossref 被引兩千四百餘次。「殖民性」概念經米尼奧羅、馬爾多納多—托雷斯等人發展為「現代性／殖民性／去殖民性」研究群。",
    links: [{ id: "maldonado-torres-2007", type: "後續延伸" }]
  },
  {
    id: "mbembe-2003",
    theme: "decolonial",
    author: { zh: "姆本貝", orig: "Achille Mbembe" },
    year: 2003,
    title: { orig: "Necropolitics", zh: "〈死亡政治〉" },
    venue: "Public Culture 15, no. 1 (2003): 11–40",
    note: "Libby Meintjes 英譯；2019 年擴寫為同名專書。",
    doi: "10.1215/08992363-15-1-11",
    cites: 5307,
    question: "傅柯說現代權力是「使人活」的生命權力；但在殖民地、種植園與占領區，權力看起來更像是在決定誰該死。",
    points: [
      "姆本貝從傅柯的生命權力、阿岡本的例外狀態、巴塔耶的死亡與耗費，以及黑格爾的主奴辯證出發，指出這些理論都不足以描述殖民經驗。",
      "他提出「死亡政治」：主權最終的表現，是決定誰可以活、誰必須死。",
      "這種權力創造出「死亡世界」：大量人口被迫活在「活死人」的狀態裡。",
      "例證包括種植園奴隸制、南非種族隔離、巴勒斯坦占領區的「垂直主權」，以及當代非洲的戰爭機器。"
    ],
    concepts: [
      ["死亡政治", "necropolitics"],
      ["死亡權力", "necropower"],
      ["死亡世界", "death-worlds"],
      ["例外狀態", "state of exception"]
    ],
    impact:
      "本專區 Crossref 被引次數最高的論文（五千三百餘次）。「死亡政治」迅速成為人文社會科學的通用詞彙，用來分析邊境、監獄、戰爭、疫情與氣候災難。",
    links: [
      { id: "agamben-1995", type: "思想資源" },
      { id: "mbembe-2021", type: "後續延伸" }
    ]
  },
  {
    id: "maldonado-torres-2007",
    theme: "decolonial",
    author: { zh: "馬爾多納多—托雷斯", orig: "Nelson Maldonado-Torres" },
    year: 2007,
    title: {
      orig: "On the Coloniality of Being: Contributions to the Development of a Concept",
      zh: "〈論存在的殖民性：一個概念的發展〉"
    },
    venue: "Cultural Studies 21, no. 2–3 (2007): 240–270",
    note: "刊於《文化研究》「全球化與去殖民選項」特刊，同期有米尼奧羅〈脫鉤〉與奎哈諾〈殖民性與現代性／理性〉。",
    doi: "10.1080/09502380601162548",
    cites: 2328,
    question: "海德格追問「存在」，列維納斯追問「他者」，但他們看見被殖民者的存在處境了嗎？",
    points: [
      "在奎哈諾的「權力殖民性」之外，馬爾多納多—托雷斯提出「存在的殖民性」：殖民不只組織勞動與知識，也塑造了人的存在經驗本身。",
      "他把笛卡兒的「我思故我在」對照於更早的「我征服」（ego conquiro，借自杜塞爾），指出現代主體的自信，建立在對他人的征服之上。",
      "他提出「厭人的懷疑論」：懷疑被殖民者是否真的是完整的人；以及「戰爭的非倫理」：殖民把戰爭狀態變成日常。",
      "他主張從法農與列維納斯出發，走向「去殖民轉向」。"
    ],
    concepts: [
      ["存在的殖民性", "coloniality of being"],
      ["我征服", "ego conquiro"],
      ["厭人的懷疑論", "misanthropic skepticism"],
      ["去殖民轉向", "decolonial turn"]
    ],
    impact:
      "Crossref 被引兩千三百餘次，被視為把去殖民理論與歐陸現象學、存在哲學接上的關鍵文本。",
    links: [{ id: "quijano-2000", type: "延伸奎哈諾" }]
  },
  {
    id: "mbembe-2021",
    theme: "decolonial",
    author: { zh: "姆本貝", orig: "Achille Mbembe" },
    year: 2021,
    title: { orig: "The Universal Right to Breathe", zh: "〈普遍的呼吸權〉" },
    venue: "Critical Inquiry 47, no. S2 (2021): S58–S62",
    note: "Carolyn Shread 英譯；法文原文 2020 年刊於 AOC，收入《批判探究》疫情專輯。",
    doi: "10.1086/711437",
    cites: 131,
    question: "當病毒攻擊的是呼吸，而許多人早已因汙染、貧窮與暴力而無法順暢呼吸時，「呼吸」能否成為一種普遍權利？",
    points: [
      "寫於疫情初期，姆本貝指出：早在這個病毒出現之前，人類就已經面臨窒息的威脅。他甚至追問：地球是否正逼近一個二氧化碳多於可呼吸氧氣的臨界點？",
      "疫情讓所有人同時感受到身體的脆弱與彼此的依存，卻也再次暴露誰的生命被優先保護。",
      "他主張呼吸不只是生物現象，而是我們「共同擁有」的東西；呼吸權沒有根基，卻是我們的共同基礎，無法被任何人占為己有。",
      "因此呼吸權不是某國公民的權利，而是在地球上生活的原初權利，屬於「地球居住者的普遍共同體，人類與非人類皆然」。"
    ],
    concepts: [
      ["呼吸權", "droit à la respiration"],
      ["共有", "the in-common"],
      ["地球居住者", "earthly inhabitants"],
      ["死亡政治", "necropolitics"]
    ],
    impact:
      "把死亡政治延伸到生態與疫情，在 2020 年後的環境正義、種族研究與醫療人類學中被廣泛引用。",
    links: [
      { id: "mbembe-2003", type: "延續" },
      { id: "agamben-2020", type: "同期回應" }
    ]
  },

  /* ───────── 07 人類世與技術 ───────── */
  {
    id: "chakrabarty-2009",
    theme: "anthropocene",
    author: { zh: "查卡拉巴提", orig: "Dipesh Chakrabarty" },
    year: 2009,
    title: { orig: "The Climate of History: Four Theses", zh: "〈歷史的氣候：四個論題〉" },
    venue: "Critical Inquiry 35, no. 2 (2009): 197–222",
    note: null,
    doi: "10.1086/596640",
    cites: 2401,
    question: "當人類成為改變地球氣候的「地質營力」，自然史與人類史的區分還能成立嗎？",
    points: [
      "論題一：人為造成的氣候變遷，使自然史與人類史之間由來已久的人文主義區分崩解。",
      "論題二：人類作為地質力量的「人類世」觀念，嚴重限制了以現代性與全球化為主軸的人文歷史敘事。",
      "論題三：人類世的地質假說，要求我們讓資本的全球史與人類的「物種史」彼此對話。",
      "論題四：物種史與資本史的交錯，是在探測歷史理解的極限。我們無法把自己「經驗」為一個物種，他稱之為一種「負面的普遍史」。"
    ],
    concepts: [
      ["人類世", "Anthropocene"],
      ["物種", "species"],
      ["地質營力", "geological agent"],
      ["負面的普遍史", "negative universal history"]
    ],
    impact:
      "人文學界討論人類世最重要的起點論文（Crossref 被引兩千四百餘次），開啟了環境人文學。馬拉布 2017 年的〈歷史的大腦〉直接回應這篇。",
    links: [
      { id: "malabou-2017", type: "被回應" },
      { id: "latour-2004", type: "同一關切" }
    ]
  },
  {
    id: "stiegler-2011",
    theme: "anthropocene",
    author: { zh: "史蒂格勒", orig: "Bernard Stiegler" },
    year: 2011,
    title: {
      orig: "Pharmacology of Desire: Drive-based Capitalism and Libidinal Dis-economy",
      zh: "〈慾望的藥理學：驅力資本主義與力比多失序經濟〉"
    },
    venue: "New Formations 72 (2011): 150–161",
    note: "Daniel Ross 英譯。",
    doi: "10.3898/NEWF.72.12.2011",
    cites: 47,
    question: "為什麼消費社會讓我們越來越難真正地「慾望」？",
    points: [
      "史蒂格勒延續德希達的 pharmakon（藥）：技術既是毒藥也是解藥。人從一開始就是技術性的存在，記憶被外化在工具、文字與媒體之中。",
      "「慾望」是理解經濟學與精神分析關係的關鍵，因為兩者都涉及社會與心理的「投注」。",
      "今天組織這兩種經濟的，與其說是傅柯的生命權力，不如說是「精神權力」（psychopower）：專門設計來控制消費行為的技術，打斷了慾望一向仰賴的代間傳承迴路。",
      "結果是消費從「慾望」退化成「驅力」，形成摧毀力比多的「失序經濟」；投資端也同樣短期化。出路是一種「藥理學」：發明新的技術實踐，讓技術重新培養照護與投入。"
    ],
    concepts: [
      ["藥", "pharmakon"],
      ["精神權力", "psychopouvoir"],
      ["驅力／慾望", "pulsion / désir"],
      ["力比多經濟", "économie libidinale"]
    ],
    impact:
      "濃縮了他 2000 年代後期對消費資本主義的批判，影響數位媒體研究、注意力經濟與平台批判。他的《技術與時間》（1994 年起）是歐陸技術哲學的核心著作。",
    links: [
      { id: "deleuze-1992", type: "延伸德勒茲" },
      { id: "hui-2017", type: "後續延伸" }
    ]
  },
  {
    id: "hui-2017",
    theme: "anthropocene",
    author: { zh: "許煜", orig: "Yuk Hui" },
    year: 2017,
    title: {
      orig: "On Cosmotechnics: For a Renewed Relation between Technology and Nature in the Anthropocene",
      zh: "〈論宇宙技術：在人類世重建技術與自然的關係〉"
    },
    venue: "Techné: Research in Philosophy and Technology 21, no. 2–3 (2017): 319–341",
    note: null,
    doi: "10.5840/techne201711876",
    cites: 34,
    question: "在人類世，技術與自然的關係該如何重新建立？「技術」真的只有一種嗎？",
    points: [
      "許煜把問題放進人類學的「本體論轉向」：這股思潮試圖超越被視為現代性危機的「自然／文化」二元論，並追問非人類如何參與政治。",
      "他把這種人類學嘗試，與法國技術哲學家西蒙東的工作對照：西蒙東想克服的是「文化／技術」的對立，並認為這個對立源自十八世紀末現代性的技術斷裂。",
      "他主張讓「自然人類學」（以德斯寇拉為代表）與「技術哲學」（以西蒙東為代表）對話，才能構想技術與自然的新關係。",
      "「宇宙技術」是開啟這場對話的方式：技術總是以某種方式統一宇宙秩序與道德秩序，因此不同文化有不同的技術；他後來稱之為「技術多樣性」。"
    ],
    concepts: [
      ["宇宙技術", "cosmotechnics"],
      ["本體論轉向", "ontological turn"],
      ["技術性", "technicité"],
      ["技術多樣性", "technodiversity"]
    ],
    impact:
      "這篇論文把《論中國的技術問題》（2016）的核心概念帶進國際技術哲學期刊，讓「宇宙技術」成為 2010 年代後期最受討論的技術哲學概念之一，也讓非西方思想進入歐陸技術哲學的核心。",
    links: [{ id: "stiegler-2011", type: "思想資源" }]
  },
  {
    id: "malabou-2017",
    theme: "anthropocene",
    author: { zh: "馬拉布", orig: "Catherine Malabou" },
    year: 2017,
    title: {
      orig: "The Brain of History, or, The Mentality of the Anthropocene",
      zh: "〈歷史的大腦，或人類世的心態〉"
    },
    venue: "South Atlantic Quarterly 116, no. 1 (2017): 39–53",
    note: null,
    doi: "10.1215/00382876-3749304",
    cites: 24,
    question: "人類世的「人類」為什麼同時是負責任的歷史主體，又是無意識、不反思的自然力量？",
    points: [
      "馬拉布點出人類世之「人」的雙重性：查卡拉巴提把人類看成一股地質力量，是「沒有存在的主體性」；歷史學家斯梅爾則把人類看成「成癮的大腦」，是情緒化、依賴性的生物與象徵存在。",
      "這兩種歷史觀都隱含在今天對「生態」的重新定義之中，卻彼此對立。",
      "她的折衷方案是重讀布勞岱爾與年鑑學派的「心態」（mentalité）概念：心態位在無機物與神經之間，能夠填補兩種歷史觀之間的空缺。",
      "這也延續了她自己的「可塑性」哲學：大腦本身就是生物與歷史交會之處。"
    ],
    concepts: [
      ["心態", "mentalité"],
      ["可塑性", "plasticité"],
      ["神經歷史", "neurohistory"],
      ["地質營力", "geological force"]
    ],
    impact:
      "把德希達學生的可塑性哲學帶進人類世辯論，是歐陸哲學、神經科學與環境人文學交會的代表文本。",
    links: [{ id: "chakrabarty-2009", type: "回應" }]
  }
];

/* 四個十年的發展敘事（時間軸下方） */
const DECADES = [
  {
    id: "1990s",
    label: "1990 年代",
    from: 1990,
    to: 1999,
    title: "解構轉向倫理，傅柯的遺產被重新點燃",
    text: "德希達把解構帶向法律與正義；德勒茲與阿岡本重新打開生命政治的問題；冷戰結束後的共識政治中，紀傑克、巴特勒與穆芙重新追問：什麼才是「政治」？"
  },
  {
    id: "2000s",
    label: "2000 年代",
    from: 2000,
    to: 2009,
    title: "從話語到物質，從歐洲到殖民地",
    text: "巴拉德、班奈特與拉圖把物質與非人事物帶回哲學；思辨實在論挑戰康德以來的相關主義；奎哈諾與姆本貝揭示現代性的殖民根基；查卡拉巴提則提出人類世對歷史學的挑戰。"
  },
  {
    id: "2010s",
    label: "2010 年代",
    from: 2010,
    to: 2019,
    title: "技術、免疫與後人類",
    text: "史蒂格勒與許煜把技術放回哲學核心；艾斯波西托以免疫範式重寫生命政治；普亞與布拉伊多蒂把交織性與後人類帶進新唯物論；馬拉布以「心態」回應人類世。"
  },
  {
    id: "2020s",
    label: "2020 年代",
    from: 2020,
    to: 2029,
    title: "疫情中的哲學",
    text: "新冠疫情讓生命政治成為公共辯論：阿岡本對例外狀態的批判引發論戰，姆本貝則提出「普遍的呼吸權」，把死亡政治延伸到生態危機。"
  }
];
