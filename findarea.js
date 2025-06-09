let distUses = [
  "乙種工業區", "人行步道用地", "人行專用步道用地", "公園用地", "文大用地", "文小用地",
  "文中用地", "加油站專用區", "市場用地", "住宅區", "住宅區(特)", "車站專用區",
  "兒童遊樂場用地", "宗教專用區", "雨水下水道用地", "保存區", "高壓線接地站用地",
  "停車場用地", "商業區", "排水溝用地", "第一種住宅區", "第一種住宅區(附)",
  "第二種住宅區", "第三種住宅區", "園道用地", "農會專用區", "道路用地", "電信專用區",
  "綠地用地", "機關用地", "灌溉溝渠用地"
];

let currentIndex = 0;
let distSelect = $('#ddlCityplanConditionDistUse');
let button = $('.btn-ditsuse-region');

function setNextDistUse(index) {
    if (index >= distUses.length) {
        alert("🎉 所有使用分區已完成！");
        return;
    }

    let distName = distUses[index];
    let option = distSelect.find(`option:contains("${distName}")`);

    if (option.length === 0) {
        console.error(`❌ 找不到選項: ${distName}`);
        alert(`❌ 找不到選項: ${distName}`);
        return;
    }

    distSelect.val(option.val()).trigger("chosen:updated").change();
    console.log(`✅ 已選擇使用分區：${distName}`);

    setTimeout(() => {
        button.click();
        console.log(`📌 已點擊「顯示使用分區圖」按鈕`);
    }, 800);
}

// 按 N 進行下一個分區切換
$(document).keydown(function(e){
    if (e.key.toUpperCase() === "N") {
        currentIndex++;
        setNextDistUse(currentIndex);
    }
});

// 初始載入第一個分區
$(document).ready(function(){
    setTimeout(() => {
        setNextDistUse(currentIndex);
    }, 2000);
});
