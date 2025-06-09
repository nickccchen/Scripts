let distUses = [
  "乙種工業區", "人行步道用地", "人行專用步道用地", "公園用地", "文大用地", "文小用地",
  "文中用地", "加油站專用區", "市場用地", "住宅區", "住宅區(特)", "車站專用區",
  "兒童遊樂場用地", "宗教專用區", "雨水下水道用地", "保存區", "高壓線接地站用地",
  "停車場用地", "商業區", "排水溝用地", "第一種住宅區", "第一種住宅區(附)",
  "第二種住宅區", "第三種住宅區", "園道用地", "農會專用區", "道路用地", "電信專用區",
  "綠地用地", "機關用地", "灌溉溝渠用地"
];

let currentIndex = 0;
let stopFlag = false;

function focusOnLatestPathGraphic() {
  const path = document.querySelector("#mapMain_graphics_layer path");
  if (path) {
    path.scrollIntoView({ behavior: "smooth", block: "center" });
    console.log("🎯 聚焦到 path 成功！");
  } else {
    console.warn("⚠️ 未找到 path，略過聚焦");
  }
}

function updateLog(index, name) {
  let log = JSON.parse(localStorage.getItem("focusareaLog") || "{}");
  log.lastIndex = index;
  log.records = log.records || [];
  log.records.push(name);
  localStorage.setItem("focusareaLog", JSON.stringify(log));
}

function setNextDistUse(index) {
  if (stopFlag) return;
  if (index >= distUses.length) {
    alert("🎉 所有使用分區已完成！");
    return;
  }

  const distName = distUses[index];
  const select = $("#ddlCityplanConditionDistUse");
  const option = select.find(`option:contains("${distName}")`);

  if (option.length === 0) {
    console.warn(`❌ 無此選項: ${distName}，自動略過`);
    currentIndex++;
    setTimeout(() => setNextDistUse(currentIndex), 1000);
    return;
  }

  select.val(option.val()).trigger("chosen:updated").change();
  console.log(`✅ 已選擇分區：${distName}`);

  setTimeout(() => {
    $(".btn-distuse-region").click();
    console.log(`📌 已點擊顯示按鈕`);

    setTimeout(() => {
      focusOnLatestPathGraphic();
      updateLog(index, distName);
    }, 1500);
  }, 800);
}

// 按 N 下一筆
$(document).keydown(function (e) {
  if (e.key === "Escape") {
    stopFlag = true;
    alert("🛑 已手動中止流程");
  }
  if (e.key.toUpperCase() === "N") {
    currentIndex++;
    setNextDistUse(currentIndex);
  }
});

// 啟動：等待頁面準備完
$(document).ready(function () {
  setTimeout(() => {
    setNextDistUse(currentIndex);
  }, 1500);
});

