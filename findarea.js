(async function () {
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            let timePassed = 0;
            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                } else if (timePassed > timeout) {
                    clearInterval(interval);
                    reject(`Timeout: 找不到元素 ${selector}`);
                }
                timePassed += 200;
            }, 200);
        });
    }

    if (typeof $ === 'undefined') {
        const jq = document.createElement('script');
        jq.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        document.head.appendChild(jq);
        await new Promise(r => setTimeout(r, 1500));
    }

    let distUses = [
        "乙種工業區", "人行步道用地", "人行專用步道用地", "公園用地", "文大用地", "文小用地",
        "文中用地", "加油站專用區", "市場用地", "住宅區", "住宅區(特)", "車站專用區",
        "兒童遊樂場用地", "宗教專用區", "雨水下水道用地", "保存區", "高壓線接地站用地",
        "停車場用地", "商業區", "排水溝用地", "第一種住宅區", "第一種住宅區(附)",
        "第二種住宅區", "第三種住宅區", "園道用地", "農會專用區", "道路用地", "電信專用區",
        "綠地用地", "機關用地", "灌溉溝渠用地"
    ];

    // 讀取 localStorage 當前進度（如果存在）
    let findareaLog = JSON.parse(localStorage.getItem("findareaLog") || "{}");
    let currentIndex = findareaLog.lastIndex || 0;
    let actionLog = findareaLog.log || [];

    // 設定都市計畫區為「02 八德(八德地區)」
    await waitForElement('#ddlConditionCityplan');
    $('#ddlConditionCityplan').val("02,01").trigger("chosen:updated").change();
    console.log("✅ 已設定都市計畫區：02 八德(八德地區)");

    // 取得分區選單與按鈕
    const distSelect = await waitForElement('#ddlCityplanConditionDistUse');
    const button = await waitForElement('.btn-distuse-region');

    function updateLog(index) {
        const distName = distUses[index];
        actionLog.push(distName);
        const logObj = {
            lastIndex: index,
            log: actionLog
        };
        localStorage.setItem("findareaLog", JSON.stringify(logObj));
        console.log(`📝 已記錄進度：第 ${index + 1} 項「${distName}」`);
    }

    function setNextDistUse(index) {
        if (index >= distUses.length) {
            alert("🎉 所有使用分區已完成！");
            return;
        }

        const distName = distUses[index];
        const option = $(`#ddlCityplanConditionDistUse option:contains("${distName}")`);
        if (option.length === 0) {
            alert(`❌ 找不到選項: ${distName}`);
            return;
        }

        $('#ddlCityplanConditionDistUse')
            .val(option.val())
            .trigger('chosen:updated')
            .change();

        console.log(`🔄 已選擇使用分區：${distName}`);

        setTimeout(() => {
            $('.btn-distuse-region').click();
            console.log(`📌 已點擊「顯示使用分區圖」`);
            updateLog(index);
        }, 1000);
    }

    // 鍵盤 N 可切換下一項
    $(document).keydown(function(e){
        if (e.key.toUpperCase() === "N") {
            currentIndex++;
            setNextDistUse(currentIndex);
        }
    });

    // 執行初始
    setTimeout(() => {
        setNextDistUse(currentIndex);
    }, 1500);
})();
