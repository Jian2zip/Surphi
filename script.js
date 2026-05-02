const nodeData = {
  classical: {
    title: "柏拉圖",
    summary: "愛欲被視為可以導向更高真理的力量，性尚未成為獨立的解放主題。",
    flow: [
      ["Origin", "欲望被提升為追求美與真理的階梯。"],
      ["Legacy", "為後來『性應服從更高價值』的觀念奠基。"]
    ],
    branches: ["branch-classical"],
    step: 0
  },
  aristotle: {
    title: "亞里斯多德",
    summary: "性的理解更貼近自然、功能與目的論，秩序感進一步被鞏固。",
    flow: [
      ["Nature", "身體與倫理被放進目的結構裡理解。"],
      ["Legacy", "性的正當性被綁定於自然功能與社會秩序。"]
    ],
    branches: ["branch-classical"],
    step: 0
  },
  theology: {
    title: "奧古斯丁 / 阿奎那",
    summary: "神學把性快感放進節制、婚姻與生殖的框架中，使性成為必須被管理的問題。",
    flow: [
      ["Theology", "欲望被視為可能偏離德性的危險力量。"],
      ["Legacy", "這種框架成為後來越界思想反抗的背景。"]
    ],
    branches: ["branch-classical"],
    step: 0
  },
  sade: {
    title: "薩德侯爵",
    summary: "薩德打破了古典與神學對性的限制，將欲望、暴力與越界推到理性難以收束的地帶。",
    flow: [
      ["Break", "把欲望從德性與生殖目的中粗暴抽離。"],
      ["Shock", "讓性成為直接挑戰道德與法律的力量。"],
      ["Influence", "為巴塔耶式的越界思想打開哲學裂口。"]
    ],
    branches: ["branch-classical", "branch-sade", "branch-cross"],
    step: 1
  },
  bataille: {
    title: "喬治・巴塔耶",
    summary: "巴塔耶把情色變成存在經驗，讓禁忌、死亡、耗費與神聖進入性哲學。",
    flow: [
      ["Threshold", "情色被視為觸碰邊界的特殊狀態。"],
      ["Excess", "越界不是偶發事件，而是人的深層衝動。"],
      ["Influence", "他的思路把性帶向更深的反秩序經驗。"]
    ],
    branches: ["branch-classical", "branch-bataille", "branch-cross"],
    step: 2
  },
  foucault: {
    title: "米歇爾・傅柯",
    summary: "傅柯將問題轉成話語與權力如何生產性，讓性不只屬於身體，也屬於治理與主體形成。",
    flow: [
      ["Shift", "不再只問欲望是什麼，而是問社會如何談論與管理它。"],
      ["Power", "性被嵌入知識、規訓與生物政治的網絡。"],
      ["Afterlife", "當代性別與酷兒理論多從這裡繼續延伸。"]
    ],
    branches: ["branch-sade", "branch-bataille", "branch-forward", "branch-cross"],
    step: 3
  },
  contemporary: {
    title: "當代性 / 性別理論",
    summary: "傅柯之後，性被理解為牽涉身份、規範、制度與主體性的複合場域。",
    flow: [
      ["Extension", "性哲學與性別理論、酷兒理論、身體政治開始交錯。"],
      ["Question", "核心問題變成誰能定義正常、誰被命名、誰被排除。"]
    ],
    branches: ["branch-forward", "branch-cross"],
    step: 3
  }
};

const detailTitle = document.getElementById("detailTitle");
const detailSummary = document.getElementById("detailSummary");
const detailFlow = document.getElementById("detailFlow");
const nodes = [...document.querySelectorAll(".tree-node")];
const branches = [...document.querySelectorAll(".branch")];
const flowSteps = [...document.querySelectorAll(".flow-step")];
const focusButtons = [...document.querySelectorAll("[data-focus]")];
const revealTargets = document.querySelectorAll(".reveal");

function updateDetail(nodeKey) {
  const data = nodeData[nodeKey];
  if (!data) return;

  detailTitle.textContent = data.title;
  detailSummary.textContent = data.summary;
  detailFlow.innerHTML = "";

  data.flow.forEach(([label, text], index) => {
    const chip = document.createElement("div");
    chip.className = "flow-chip";
    chip.style.animationDelay = `${index * 120}ms`;
    chip.innerHTML = `<small>${label}</small>${text}`;
    detailFlow.appendChild(chip);
  });

  nodes.forEach((node) => {
    node.classList.toggle("active", node.dataset.node === nodeKey);
  });

  branches.forEach((branch) => {
    const isActive = data.branches.some((name) => branch.classList.contains(name));
    branch.classList.toggle("is-active", isActive);
  });

  flowSteps.forEach((step, index) => {
    step.classList.toggle("active", index === data.step);
  });
}

nodes.forEach((node) => {
  node.addEventListener("click", () => updateDetail(node.dataset.node));
});

focusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.focus === "classical" ? "classical" : button.dataset.focus;
    updateDetail(key);
    document.getElementById("tree").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

revealTargets.forEach((target) => observer.observe(target));

updateDetail("sade");
