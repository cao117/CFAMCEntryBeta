/**
 * CSV处理脚本
 * 负责处理表单数据的CSV导出和导入功能
 */

/**
 * 保存临时CSV，不进行验证
 * @returns {boolean} 始终返回false，阻止表单默认提交行为
 */
function saveToTempCSV() {
    let csvContent = "";

    // 捕获展会信息
    const showDate = document.getElementById('showDate').value;
    const clubName = document.getElementById('clubName').value;
    const masterClerkName = document.getElementById('masterClerkName').value;
    const numberOfJudges = document.getElementById('numberOfJudges').value;

    // 将展会信息添加到CSV内容
    csvContent += `Show Date,${showDate}\r\n`;
    csvContent += `Club Name,${clubName}\r\n`;
    csvContent += `Master Clerk Name,${masterClerkName}\r\n`;
    csvContent += `Number of Judges,${numberOfJudges}\r\n`;
    csvContent += "\r\n"; // 添加空行分隔各部分

    // 获取裁判信息数据
    const judgeRows = document.getElementById('judgeInfoTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    let judgeData = 'Judge Name,Judge Acronym,Ring Type\n'; // 添加裁判数据的标题行
    for (let row of judgeRows) {
        const judgeName = row.getElementsByTagName('td')[1].querySelector('input').value || ''; // 如果为空则使用空字符串
        const judgeAcronym = row.getElementsByTagName('td')[2].querySelector('input').value || ''; // 如果为空则使用空字符串
        const ringType = row.getElementsByTagName('td')[3].querySelector('select').value || ''; // 如果为空则使用空字符串
        judgeData += `${judgeName},${judgeAcronym},${ringType}\n`;  // 添加每个裁判的数据
    }
    csvContent += judgeData;
    csvContent += "\r\n"; // 添加空行分隔各部分

    // 各个表格的ID列表
    let tableIds = ["championshipTable", "kittenTable", "premiershipTable"];
    let allRowData = []; // 存储所有行数据的数组

    tableIds.forEach((tableId) => {
        console.log(`开始处理表格: ${tableId}`);
        let table = document.getElementById(tableId);
        if (table) {
            let rows = table.querySelectorAll("tr");

            // 遍历每一行
            rows.forEach((row, rowIndex) => {
                let cols = row.querySelectorAll("td");
                let rowData = []; // 在循环内初始化rowData

                // 遍历每一列
                cols.forEach((col, colIndex) => {
                    let input = col.querySelector('input');
                    if (input) {
                        rowData.push(input.value);
                    } else {
                        rowData.push(col.innerText);
                    }
                });

                // 合并行数据并添加到CSV内容
                csvContent += rowData.join(",") + "\r\n";
                console.log(`表格 ${tableId} 行 ${rowIndex}: ${rowData.join(",")}`);

                // 将行数据存储在allRowData中
                allRowData.push(rowData);
            });

            // 在CSV中添加空行以分隔表格
            csvContent += "\r\n";
            console.log(`表格 ${tableId} 处理完成，添加空行`);
        } else {
            // 即使没有数据也添加表格标题
            csvContent += "Ring #,Judge,Type,1,2,3,4,5,6,7,8,9,10,11*,12*,13*,14*,15*,Best CH,2nd CH,3rd CH,4th CH,5th CH,Best LH CH,2nd LH CH,3rd LH CH,4th LH CH,5th LH CH,Best SH CH,2nd SH CH,3rd SH CH,4th SH CH,5th SH CH\r\n\r\n";
            console.log(`表格 ${tableId} 不存在，添加默认标题`);
        }
    });

    // 创建链接下载CSV文件，文件名中包含俱乐部名称和日期时间
    // 处理俱乐部名称，移除特殊字符，替换空格为下划线
    const safeClubName = clubName.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
    
    // 使用getDateStr函数获取日期时间字符串，格式为YYYYMMDDSS
    const dateTimeStr = getDateStr();
    
    // 组合文件名
    let fileName = `${safeClubName}_${dateTimeStr}_Temp.csv`;

    download(csvContent, fileName, 'text/csv');
    return false; // 阻止表单默认提交行为
}

/**
 * 生成最终CSV文件，执行完整验证
 * @returns {boolean} 验证通过返回true，否则返回false
 */
function generateFinalCSV() {
    // 验证所有表单数据
    if (!validateAndNavigate()) {
        return false;
    }
    
    let csvContent = "";

    // 捕获展会信息
    const showDate = document.getElementById('showDate').value;
    const clubName = document.getElementById('clubName').value;
    const masterClerkName = document.getElementById('masterClerkName').value;
    const numberOfJudges = document.getElementById('numberOfJudges').value;

    // 将展会信息添加到CSV内容
    csvContent += `Show Date,${showDate}\r\n`;
    csvContent += `Club Name,${clubName}\r\n`;
    csvContent += `Master Clerk Name,${masterClerkName}\r\n`;
    csvContent += `Number of Judges,${numberOfJudges}\r\n`;
    csvContent += "\r\n"; // 添加空行分隔各部分

    // 获取裁判信息数据
    const judgeRows = document.getElementById('judgeInfoTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    let judgeData = 'Judge Name,Judge Acronym,Ring Type\n'; // 添加裁判数据的标题行
    for (let row of judgeRows) {
        const judgeName = row.getElementsByTagName('td')[1].querySelector('input').value;
        const judgeAcronym = row.getElementsByTagName('td')[2].querySelector('input').value;
        const ringType = row.getElementsByTagName('td')[3].querySelector('select').value;
        judgeData += `${judgeName},${judgeAcronym},${ringType}\n`;  // 添加每个裁判的数据
    }
    csvContent += judgeData;
    csvContent += "\r\n"; // 添加空行分隔各部分

    // 各个表格的ID列表
    let tableIds = ["championshipTable", "kittenTable", "premiershipTable"];
    let allRowData = []; // 存储所有行数据的数组

    tableIds.forEach((tableId) => {
        console.log(`开始处理表格: ${tableId}`);
        let table = document.getElementById(tableId);
        if (table) {
            let rows = table.querySelectorAll("tr");

            // 遍历每一行
            rows.forEach((row, rowIndex) => {
                let cols = row.querySelectorAll("td");
                let rowData = []; // 在循环内初始化rowData

                // 遍历每一列
                cols.forEach((col, colIndex) => {
                    let input = col.querySelector('input');
                    if (input) {
                        rowData.push(input.value);
                    } else {
                        rowData.push(col.innerText);
                    }
                });

                // 合并行数据并添加到CSV内容
                csvContent += rowData.join(",") + "\r\n";
                console.log(`表格 ${tableId} 行 ${rowIndex}: ${rowData.join(",")}`);

                // 将行数据存储在allRowData中
                allRowData.push(rowData);
            });

            // 在CSV中添加空行以分隔表格
            csvContent += "\r\n";
            console.log(`表格 ${tableId} 处理完成，添加空行`);
        } else {
            // 即使没有数据也添加表格标题
            csvContent += "Ring #,Judge,Type,1,2,3,4,5,6,7,8,9,10,11*,12*,13*,14*,15*,Best CH,2nd CH,3rd CH,4th CH,5th CH,Best LH CH,2nd LH CH,3rd LH CH,4th LH CH,5th LH CH,Best SH CH,2nd SH CH,3rd SH CH,4th SH CH,5th SH CH\r\n\r\n";
            console.log(`表格 ${tableId} 不存在，添加默认标题`);
        }
    });

    // 创建链接下载CSV文件，文件名中包含俱乐部名称和日期时间
    // 处理俱乐部名称，移除特殊字符，替换空格为下划线
    const safeClubName = clubName.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
    
    // 使用getDateStr函数获取日期时间字符串，格式为YYYYMMDDSS
    const dateTimeStr = getDateStr();
    
    // 组合文件名
    let fileName = `${safeClubName}_${dateTimeStr}_Final.csv`;

    download(csvContent, fileName, 'text/csv');
    return false; // 阻止表单默认提交行为
}

/**
 * 完整验证表单并跳转到错误位置
 * @returns {boolean} 验证通过返回true，否则返回false
 */
function validateAndNavigate() {
    // 验证基本信息
    const showDate = document.getElementById('showDate').value;
    if (!showDate) {
        switchTab('general');
        alert('请输入Show Date');
        document.getElementById('showDate').focus();
        return false;
    }
    
    const clubName = document.getElementById('clubName').value;
    if (!clubName) {
        switchTab('general');
        alert('请输入Club Name');
        document.getElementById('clubName').focus();
        return false;
    }
    
    if (clubName.length > 255) {
        switchTab('general');
        alert('Club Name不能超过255个字符');
        document.getElementById('clubName').focus();
        return false;
    }
    
    const masterClerkName = document.getElementById('masterClerkName').value;
    if (!masterClerkName) {
        switchTab('general');
        alert('请输入Master Clerk Name');
        document.getElementById('masterClerkName').focus();
        return false;
    }
    
    if (masterClerkName.length > 120) {
        switchTab('general');
        alert('Master Clerk Name不能超过120个字符');
        document.getElementById('masterClerkName').focus();
        return false;
    }
    
    const numberOfJudges = document.getElementById('numberOfJudges').value;
    if (!numberOfJudges || numberOfJudges <= 0) {
        switchTab('general');
        alert('请设置裁判数量');
        document.getElementById('numberOfJudges').focus();
        return false;
    }
    
    // 验证裁判信息
    const judgeInfoTable = document.getElementById('judgeInfoTable').getElementsByTagName('tbody')[0];
    const judgeRows = judgeInfoTable.getElementsByTagName('tr');
    for (let i = 0; i < judgeRows.length; i++) {
        const judgeName = judgeRows[i].getElementsByTagName('td')[1].querySelector('input').value;
        if (!judgeName) {
            switchTab('general');
            alert(`请输入第${i+1}个裁判的姓名`);
            judgeRows[i].getElementsByTagName('td')[1].querySelector('input').focus();
            return false;
        }
        
        if (judgeName.length > 120) {
            switchTab('general');
            alert(`第${i+1}个裁判的姓名不能超过120个字符`);
            judgeRows[i].getElementsByTagName('td')[1].querySelector('input').focus();
            return false;
        }
        
        // 验证裁判缩写
        const judgeAcronym = judgeRows[i].getElementsByTagName('td')[2].querySelector('input').value;
        if (!judgeAcronym) {
            switchTab('general');
            alert(`请输入第${i+1}个裁判的缩写`);
            judgeRows[i].getElementsByTagName('td')[2].querySelector('input').focus();
            return false;
        }
        
        if (judgeAcronym.length > 6) {
            switchTab('general');
            alert(`第${i+1}个裁判的缩写不能超过6个字符`);
            judgeRows[i].getElementsByTagName('td')[2].querySelector('input').focus();
            return false;
        }
    }
    
    // 验证Championship表格数据
    const championshipTableBody = document.getElementById('championshipTableBody');
    if (!validateTableData(championshipTableBody, 'championship')) {
        return false;
    }
    
    // 验证Kitten表格数据
    const kittenTableBody = document.getElementById('kittenTableBody');
    if (!validateTableData(kittenTableBody, 'kitten')) {
        return false;
    }
    
    // 验证Premiership表格数据
    const premiershipTableBody = document.getElementById('premiershipTableBody');
    if (!validateTableData(premiershipTableBody, 'premiership')) {
        return false;
    }
    
    return true;
}

/**
 * 验证特定表格的数据
 * @param {HTMLElement} tableBody - 表格体元素
 * @param {string} tabId - 表格所在的标签页ID
 * @returns {boolean} 验证通过返回true，否则返回false
 */
function validateTableData(tableBody, tabId) {
    const rows = tableBody.getElementsByTagName('tr');
    
    // 对每列(每个组别)进行验证
    // 首先确定列数
    if (rows.length < 3) return true; // 表格还没有生成，跳过验证
    
    const judgeColumns = rows[0].querySelectorAll('input').length;
    console.log(`验证${tabId}表格，共有${judgeColumns}列数据`);
    
    // 对每一列进行验证
    for (let col = 0; col < judgeColumns; col++) {
        // 获取该列所有值
        const colValues = [];
        const ringNumber = rows[0].querySelectorAll('input')[col].value;
        const judgeName = rows[1].querySelectorAll('input')[col].value;
        const ringType = rows[2].querySelectorAll('input')[col].value;
        
        // 只验证有环号和裁判的列
        if (!ringNumber || !judgeName) continue;
        
        console.log(`验证第${col+1}列 (环号:${ringNumber}, 裁判:${judgeName}, 类型:${ringType})`);
        
        // 获取1-15名的输入值
        for (let i = 3; i <= 17; i++) {
            if (i < rows.length) {
                const inputs = rows[i].querySelectorAll('input');
                if (inputs.length > col) {
                    const input = inputs[col];
                    const value = input.value.trim();
                    
                    colValues.push({
                        row: i,
                        element: input,
                        value: value,
                        position: i - 2 // 对应的排名(1-15)
                    });
                }
            }
        }
        
        // 验证该列的输入值
        if (!validateColumn(colValues, tabId, col, ringNumber, judgeName)) {
            return false;
        }
        
        // 验证决赛猫的数据
        if (tabId === 'championship') {
            // 验证Best CH系列 (行18-22)
            const bestCHValues = collectFinalsValues(rows, col, 18, 22);
            if (!validateFinalsGroup(bestCHValues, tabId, col, ringNumber, judgeName, 'Best CH')) {
                return false;
            }
            
            // 验证Best LH CH系列 (行23-27)
            const bestLHValues = collectFinalsValues(rows, col, 23, 27);
            if (!validateFinalsGroup(bestLHValues, tabId, col, ringNumber, judgeName, 'Best LH CH')) {
                return false;
            }
            
            // 验证Best SH CH系列 (行28-32)
            const bestSHValues = collectFinalsValues(rows, col, 28, 32);
            if (!validateFinalsGroup(bestSHValues, tabId, col, ringNumber, judgeName, 'Best SH CH')) {
                return false;
            }
        }
        
        if (tabId === 'premiership') {
            // 验证Best PR系列 (行18-20)
            const bestPRValues = collectFinalsValues(rows, col, 18, 20);
            if (!validateFinalsGroup(bestPRValues, tabId, col, ringNumber, judgeName, 'Best PR')) {
                return false;
            }
            
            // 验证Best LH PR系列 (行21-23)
            const bestLHPRValues = collectFinalsValues(rows, col, 21, 23);
            if (!validateFinalsGroup(bestLHPRValues, tabId, col, ringNumber, judgeName, 'Best LH PR')) {
                return false;
            }
            
            // 验证Best SH PR系列 (行24-26)
            const bestSHPRValues = collectFinalsValues(rows, col, 24, 26);
            if (!validateFinalsGroup(bestSHPRValues, tabId, col, ringNumber, judgeName, 'Best SH PR')) {
                return false;
            }
        }
    }
    
    return true;
}

/**
 * 收集决赛猫的数据
 * @param {HTMLCollection} rows - 表格行集合
 * @param {number} col - 列索引
 * @param {number} startRow - 起始行索引
 * @param {number} endRow - 结束行索引
 * @returns {Array} 含有决赛猫数据的数组
 */
function collectFinalsValues(rows, col, startRow, endRow) {
    const values = [];
    
    for (let i = startRow; i <= endRow; i++) {
        if (i < rows.length) {
            const inputs = rows[i].querySelectorAll('input');
            if (inputs.length > col) {
                const input = inputs[col];
                const value = input.value.trim();
                
                values.push({
                    row: i,
                    element: input,
                    value: value,
                    position: i - startRow + 1 // 在此组中的位置
                });
            }
        }
    }
    
    return values;
}

/**
 * 验证决赛猫数据组
 * @param {Array} values - 需验证的值数组
 * @param {string} tabId - 表格所在的标签页ID
 * @param {number} colIndex - 列索引
 * @param {string} ringNumber - 环号
 * @param {string} judgeName - 裁判名称
 * @param {string} groupName - 组名称（如"Best CH"）
 * @returns {boolean} 验证通过返回true，否则返回false
 */
function validateFinalsGroup(values, tabId, colIndex, ringNumber, judgeName, groupName) {
    const usedNumbers = new Set(); // 记录已使用的数字
    
    // 检查输入顺序和值
    for (let i = 0; i < values.length; i++) {
        const valueObj = values[i];
        const value = valueObj.value.toLowerCase();
        
        // 跳过空值
        if (!value) continue;
        
        // 允许输入"void"(不区分大小写)
        if (value === 'void') continue;
        
        // 验证是否是1-450之间的整数
        if (!/^\d+$/.test(value)) {
            switchTab(tabId);
            alert(`环号${ringNumber}(${judgeName})的${groupName}第${valueObj.position}名输入值"${value}"必须是1-450之间的整数或void`);
            highlightElement(valueObj.element);
            return false;
        }
        
        const numValue = parseInt(value, 10);
        if (numValue < 1 || numValue > 450) {
            switchTab(tabId);
            alert(`环号${ringNumber}(${judgeName})的${groupName}第${valueObj.position}名输入值${numValue}必须在1-450之间`);
            highlightElement(valueObj.element);
            return false;
        }
        
        // 检查前面的排名是否有值
        for (let j = 0; j < i; j++) {
            if (!values[j].value) {
                switchTab(tabId);
                alert(`环号${ringNumber}(${judgeName})的${groupName}第${valueObj.position}名有值，但第${j+1}名为空，请按顺序填写`);
                highlightElement(values[j].element);
                return false;
            }
        }
        
        // 检查重复数字
        if (usedNumbers.has(numValue)) {
            switchTab(tabId);
            alert(`环号${ringNumber}(${judgeName})的${groupName}第${valueObj.position}名输入值${numValue}在${groupName}组中已使用过，不能重复`);
            highlightElement(valueObj.element);
            return false;
        }
        
        // 添加到已使用集合
        usedNumbers.add(numValue);
    }
    
    return true;
}

/**
 * 验证一列数据
 * @param {Array} values - 列中的值及其元素信息
 * @param {string} tabId - 表格所在的标签页ID
 * @param {number} colIndex - 列索引
 * @param {string} ringNumber - 该列的环号
 * @param {string} judgeName - 该列的裁判名
 * @returns {boolean} 验证通过返回true，否则返回false
 */
function validateColumn(values, tabId, colIndex, ringNumber, judgeName) {
    const usedNumbers = new Set(); // 记录已使用的数字
    
    // 检查输入顺序和值
    for (let i = 0; i < values.length; i++) {
        const valueObj = values[i];
        const value = valueObj.value.toLowerCase();
        
        // 跳过空值
        if (!value) continue;
        
        // 允许输入"void"(不区分大小写)
        if (value === 'void') continue;
        
        // 验证是否是1-450之间的整数
        if (!/^\d+$/.test(value)) {
            switchTab(tabId);
            alert(`环号${ringNumber}(${judgeName})的第${valueObj.position}名输入值"${value}"必须是1-450之间的整数或void`);
            highlightElement(valueObj.element);
            return false;
        }
        
        const numValue = parseInt(value, 10);
        if (numValue < 1 || numValue > 450) {
            switchTab(tabId);
            alert(`环号${ringNumber}(${judgeName})的第${valueObj.position}名输入值${numValue}必须在1-450之间`);
            highlightElement(valueObj.element);
            return false;
        }
        
        // 检查前面的排名是否有值
        for (let j = 0; j < i; j++) {
            if (!values[j].value) {
                switchTab(tabId);
                alert(`环号${ringNumber}(${judgeName})的第${valueObj.position}名有值，但第${values[j].position}名为空，请按顺序填写`);
                highlightElement(values[j].element);
                return false;
            }
        }
        
        // 检查重复数字
        if (usedNumbers.has(numValue)) {
            switchTab(tabId);
            alert(`环号${ringNumber}(${judgeName})的第${valueObj.position}名输入值${numValue}已经在前面使用过，不能重复`);
            highlightElement(valueObj.element);
            return false;
        }
        
        // 添加到已使用集合
        usedNumbers.add(numValue);
    }
    
    return true;
}

/**
 * 高亮显示错误元素
 * @param {HTMLElement} element - 需要高亮的元素
 */
function highlightElement(element) {
    // 保存原始样式
    const originalBackgroundColor = element.style.backgroundColor;
    const originalBorder = element.style.border;
    
    // 应用高亮样式
    element.style.backgroundColor = '#ffcccc';
    element.style.border = '2px solid red';
    
    // 3秒后恢复原样
    setTimeout(function() {
        element.style.backgroundColor = originalBackgroundColor;
        element.style.border = originalBorder;
    }, 3000);
    
    // 确保元素在视口中可见
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * 下载文件的辅助函数
 * @param {string} content - 文件内容
 * @param {string} fileName - 文件名
 * @param {string} mimeType - MIME类型
 */
function download(content, fileName, mimeType) {
    var a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if (navigator.msSaveBlob) { // IE10
        navigator.msSaveBlob(new Blob([content], {
            type: mimeType
        }), fileName);
    } else if (URL && 'download' in a) { //html5 A[download]
        a.href = URL.createObjectURL(new Blob([content], {
            type: mimeType
        }));
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // 只支持此MIME类型
    }
}

/**
 * 从CSV文件恢复数据
 */
function restoreFromCSV() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.onchange = function(e) {
        if (!e.target.files || e.target.files.length === 0) {
            console.log("没有选择文件");
            return;
        }
        
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            try {
                console.log("开始处理CSV文件...");
                const content = event.target.result;
                const rows = content.split("\n");
                console.log(`CSV文件总行数: ${rows.length}`);

                // 清空所有现有内容
                clearAllContent();

                // 1. 解析基本信息（前4行）
                if (rows.length < 5) {
                    throw new Error("CSV文件格式不正确：缺少基本信息行");
                }

                const showDateInfo = rows[0].split(',');
                const clubNameInfo = rows[1].split(',');
                const masterClerkNameInfo = rows[2].split(',');
                const numberOfJudgesInfo = rows[3].split(',');
                
                console.log("基本信息解析:");
                console.log(`Show Date: ${showDateInfo[1]}`);
                console.log(`Club Name: ${clubNameInfo[1]}`);
                console.log(`Master Clerk Name: ${masterClerkNameInfo[1]}`);
                console.log(`Number of Judges: ${numberOfJudgesInfo[1]}`);
                
                // 设置基本信息
                // 处理日期格式，确保适合HTML date input
                let showDateValue = showDateInfo[1] ? showDateInfo[1].trim() : '';
                // 如果需要转换日期格式，可以在这里进行处理
                document.getElementById('showDate').value = showDateValue;
                document.getElementById('clubName').value = clubNameInfo[1] ? clubNameInfo[1].trim() : '';
                document.getElementById('masterClerkName').value = masterClerkNameInfo[1] ? masterClerkNameInfo[1].trim() : '';
                document.getElementById('numberOfJudges').value = numberOfJudgesInfo[1] ? numberOfJudgesInfo[1].trim() : '';
                
                // 更新裁判行数
                updateJudgeInformation();
                
                // 确保表头正确显示
                const judgeCount = parseInt(numberOfJudgesInfo[1]) || 0;
                const judgeInfoTableHead = document.getElementById('judgeInfoTableHead');
                if (judgeCount > 0) {
                    judgeInfoTableHead.style.display = 'table-header-group';
                } else {
                    judgeInfoTableHead.style.display = 'none';
                }
                
                // 等待DOM更新完成后再继续处理
                setTimeout(() => {
                    try {
                        // 2. 解析裁判信息
                        if (rows.length < 7) {
                            throw new Error("CSV文件格式不正确：缺少裁判信息行");
                        }
                        
                        let currentRow = 6; // 从第7行开始（标题行"Judge Name,Judge Acronym,Ring Type"之后）
                        const judgeInfoTable = document.getElementById('judgeInfoTable').getElementsByTagName('tbody')[0];
                        const judgeRows = judgeInfoTable.getElementsByTagName('tr');
                        let judgeIndex = 0;
                        
                        console.log("开始解析裁判信息...");
                        console.log(`裁判行总数: ${judgeRows.length}`);
                        
                        // 读取裁判信息，直到遇到空行
                        while (currentRow < rows.length && rows[currentRow].trim() !== '' && judgeIndex < judgeRows.length) {
                            console.log(`处理裁判行 ${currentRow}: ${rows[currentRow]}`);
                            const judgeData = rows[currentRow].split(',');
                            
                            if (judgeData.length >= 3) {
                                const judgeName = judgeData[0] ? judgeData[0].trim() : '';
                                const judgeAcronym = judgeData[1] ? judgeData[1].trim() : '';
                                const ringType = judgeData[2] ? judgeData[2].trim() : 'Allbreed';
                                
                                console.log(`裁判 ${judgeIndex + 1}: 名字="${judgeName}", 缩写="${judgeAcronym}", 类型="${ringType}"`);
                                
                                // 填充裁判信息
                                if (judgeIndex < judgeRows.length) {
                                    const judgeRow = judgeRows[judgeIndex];
                                    const nameInput = judgeRow.getElementsByTagName('td')[1].querySelector('input');
                                    const acronymInput = judgeRow.getElementsByTagName('td')[2].querySelector('input');
                                    const typeSelect = judgeRow.getElementsByTagName('td')[3].querySelector('select');
                                    
                                    if (nameInput) nameInput.value = judgeName;
                                    if (acronymInput) acronymInput.value = judgeAcronym;
                                    if (typeSelect) typeSelect.value = ringType;
                                    
                                    judgeIndex++;
                                }
                            }
                            currentRow++;
                        }
                        
                        console.log(`总共解析了 ${judgeIndex} 个裁判信息`);
                        
                        // 应用裁判信息到其他表格，在填充表格数据前调用
                        fillBaseInfo();
                        
                        // 3. 跳过空行，定位到表格数据
                        while (currentRow < rows.length && rows[currentRow].trim() === '') {
                            currentRow++; // 跳过所有空行
                        }
                        
                        console.log(`表格数据开始于行: ${currentRow}`);
                        
                        // 定义表格处理顺序和对应的表格体元素
                        const tableOrder = [
                            {
                                id: 'championshipTableBody',
                                element: document.getElementById('championshipTableBody')
                            },
                            {
                                id: 'kittenTableBody',
                                element: document.getElementById('kittenTableBody')
                            },
                            {
                                id: 'premiershipTableBody',
                                element: document.getElementById('premiershipTableBody')
                            }
                        ];
                        
                        // 依次处理每个表格
                        for (const tableInfo of tableOrder) {
                            const tableBody = tableInfo.element;
                            if (!tableBody) {
                                console.error(`找不到表格元素 ${tableInfo.id}`);
                                continue;
                            }
                            
                            const tableRows = tableBody.getElementsByTagName('tr');
                            console.log(`表格 ${tableInfo.id} 有 ${tableRows.length} 行`);
                            let tableIndex = 0;
                            
                            console.log(`处理表格 ${tableInfo.id}, 从CSV行 ${currentRow} 开始, 表格总行数 ${tableRows.length}`);
                            
                            // 处理当前表格的所有行
                            while (currentRow < rows.length && rows[currentRow].trim() !== '' && tableIndex < tableRows.length) {
                                const rowData = rows[currentRow].split(',');
                                const tableRow = tableRows[tableIndex];
                                const inputs = tableRow.querySelectorAll('input');
                                
                                console.log(`处理表格行 ${tableIndex}(${tableRow ? tableRow.innerText.substring(0, 10) : 'undefined'}), CSV行 ${currentRow}, 数据长度: ${rowData.length}, 输入框数量: ${inputs.length}`);
                                
                                // 处理每一行数据
                                if (inputs.length > 0 && rowData.length > 1) {
                                    for (let i = 0; i < inputs.length && i + 1 < rowData.length; i++) {
                                        const csvValue = rowData[i + 1] ? rowData[i + 1].trim() : '';
                                        inputs[i].value = csvValue;
                                    }
                                }
                                
                                tableIndex++;
                                currentRow++;
                            }
                            
                            console.log(`表格 ${tableInfo.id} 处理完成，共处理 ${tableIndex} 行`);
                            
                            // 跳过空行，准备处理下一个表格
                            while (currentRow < rows.length && rows[currentRow].trim() === '') {
                                currentRow++;
                            }
                        }
                        
                        console.log("CSV文件恢复完成！");
                    } catch (innerError) {
                        console.error('CSV处理错误:', innerError);
                        alert('CSV文件处理过程中出错。详细错误: ' + innerError.message);
                    }
                }, 500); // 给DOM更新一些时间
                
            } catch (error) {
                console.error('CSV解析错误:', error);
                alert('CSV文件格式错误，无法恢复数据。请确保使用从本应用程序导出的CSV文件。\n\n详细错误: ' + error.message);
            }
        };

        reader.onerror = function(event) {
            console.error("文件读取错误:", event);
            alert("文件读取错误，无法处理CSV文件。");
        };

        reader.readAsText(file);
    };

    input.click();  // 触发文件上传提示
}

/**
 * 清除所有内容，用于恢复CSV前准备
 */
function clearAllContent() {
    // 清除基本信息字段
    document.getElementById('showDate').value = '';
    document.getElementById('clubName').value = '';
    document.getElementById('masterClerkName').value = '';
    document.getElementById('numberOfJudges').value = '';

    // 清除裁判信息表
    const judgeInfoTable = document.getElementById('judgeInfoTable').getElementsByTagName('tbody')[0]; 
    judgeInfoTable.innerHTML = '';

    // 清除冠军组、幼猫组和绝育组表格
    document.getElementById('championshipTableBody').innerHTML = '';
    document.getElementById('kittenTableBody').innerHTML = '';
    document.getElementById('premiershipTableBody').innerHTML = '';
}

/**
 * 表格输入框验证函数
 * 当输入框失去焦点时调用
 * @param {Event} event - blur事件对象
 */
function validateInputOnBlur(event) {
    const input = event.target;
    const value = input.value.trim().toLowerCase();
    
    // 重置样式
    input.style.backgroundColor = '';
    input.title = '';
    
    // 跳过空值
    if (!value) return;
    
    // 如果值是"void"，则直接通过验证
    if (value === 'void') return;
    
    // 验证是否是1-450之间的整数
    if (!/^\d+$/.test(value)) {
        input.style.backgroundColor = '#ffcccc';
        input.title = "输入值必须是1-450之间的整数或void";
        return;
    }
    
    const numValue = parseInt(value, 10);
    if (numValue < 1 || numValue > 450) {
        input.style.backgroundColor = '#ffcccc';
        input.title = "输入值必须在1-450之间";
        return;
    }
    
    // 找到当前单元格所在的表格、行和列
    const cell = input.closest('td');
    const row = cell.parentElement;
    const table = row.closest('table');
    const tbody = table.querySelector('tbody');
    const rows = tbody.getElementsByTagName('tr');
    
    // 找出当前列的索引（正确计算索引，考虑第一列是标题列）
    const cells = row.getElementsByTagName('td');
    let colIndex = 0;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i] === cell) {
            colIndex = i - 1; // 减1是因为第一列是标题列
            break;
        }
    }
    
    if (colIndex < 0) return; // 如果是标题列，则不进行验证
    
    // 获取环号和裁判名称
    const ringNumber = rows[0].querySelectorAll('input')[colIndex]?.value || '';
    const judgeName = rows[1].querySelectorAll('input')[colIndex]?.value || '';
    
    // 只验证有环号和裁判的列
    if (!ringNumber || !judgeName) return;
    
    // 找出当前行在表格中的索引
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i] === row) {
            rowIndex = i;
            break;
        }
    }
    
    // 检查是正常比赛行（3-17）还是决赛行
    if (rowIndex >= 3 && rowIndex <= 17) {
        // 1-15名的输入验证
        
        // 检查前面的排名是否有值
        for (let i = 3; i < rowIndex; i++) {
            const prevInput = rows[i].querySelectorAll('input')[colIndex];
            if (!prevInput || !prevInput.value.trim()) {
                input.style.backgroundColor = '#ffcccc';
                input.title = `第${rowIndex-2}名有值，但第${i-2}名为空，请按顺序填写`;
                return;
            }
        }
        
        // 收集当前列中的所有数字以检查重复
        const usedNumbers = new Set();
        for (let i = 3; i <= 17 && i < rows.length; i++) {
            if (i === rowIndex) continue; // 跳过当前行
            
            const otherInput = rows[i].querySelectorAll('input')[colIndex];
            if (otherInput) {
                const otherValue = otherInput.value.trim().toLowerCase();
                if (otherValue && otherValue !== 'void' && /^\d+$/.test(otherValue)) {
                    const otherNumValue = parseInt(otherValue, 10);
                    usedNumbers.add(otherNumValue);
                }
            }
        }
        
        // 检查当前数字是否重复
        if (usedNumbers.has(numValue)) {
            input.style.backgroundColor = '#ffcccc';
            input.title = `输入值${numValue}已经在其他行使用过，不能重复`;
            return;
        }
    } else {
        // 决赛行验证
        let groupStartRow = -1;
        let groupEndRow = -1;
        let groupName = '';
        
        // 打印调试信息
        console.log(`验证决赛行: 表格ID=${table.id}, 行=${rowIndex}`);
        if (table.closest('table')) {
            console.log(`表格父元素ID=${table.closest('table').id}`);
        }

        // 首先获取真实的表格ID
        let realTableId = '';
        if (table.id) {
            realTableId = table.id;
        } else if (table.closest('table') && table.closest('table').id) {
            realTableId = table.closest('table').id;
        } else if (tbody && tbody.id) {
            realTableId = tbody.id.replace('Body', '');
        }

        console.log(`确定的表格ID: ${realTableId}`);

        // 检查是哪个决赛组
        if (realTableId.includes('championship')) {
            console.log('匹配到冠军组表格');
            if (rowIndex >= 18 && rowIndex <= 22) {
                groupStartRow = 18;
                groupEndRow = 22;
                groupName = 'Best CH';
                console.log('匹配到Best CH组');
            } else if (rowIndex >= 23 && rowIndex <= 27) {
                groupStartRow = 23;
                groupEndRow = 27;
                groupName = 'Best LH CH';
                console.log('匹配到Best LH CH组');
            } else if (rowIndex >= 28 && rowIndex <= 32) {
                groupStartRow = 28;
                groupEndRow = 32;
                groupName = 'Best SH CH';
                console.log('匹配到Best SH CH组');
            }
        } else if (realTableId.includes('premiership')) {
            console.log('匹配到绝育组表格');
            if (rowIndex >= 18 && rowIndex <= 20) {
                groupStartRow = 18;
                groupEndRow = 20;
                groupName = 'Best PR';
                console.log('匹配到Best PR组');
            } else if (rowIndex >= 21 && rowIndex <= 23) {
                groupStartRow = 21;
                groupEndRow = 23;
                groupName = 'Best LH PR';
                console.log('匹配到Best LH PR组');
            } else if (rowIndex >= 24 && rowIndex <= 26) {
                groupStartRow = 24;
                groupEndRow = 26;
                groupName = 'Best SH PR';
                console.log('匹配到Best SH PR组');
            }
        }
        
        if (groupStartRow !== -1) {
            // 检查前面的排名是否有值
            const position = rowIndex - groupStartRow + 1;
            for (let i = groupStartRow; i < rowIndex; i++) {
                const prevInput = rows[i].querySelectorAll('input')[colIndex];
                if (!prevInput || !prevInput.value.trim()) {
                    input.style.backgroundColor = '#ffcccc';
                    input.title = `${groupName}第${position}名有值，但第${i-groupStartRow+1}名为空，请按顺序填写`;
                    return;
                }
            }
            
            // 收集该组中的所有数字以检查重复
            const usedNumbers = new Set();
            for (let i = groupStartRow; i <= groupEndRow && i < rows.length; i++) {
                if (i === rowIndex) continue; // 跳过当前行
                
                const otherInput = rows[i].querySelectorAll('input')[colIndex];
                if (otherInput) {
                    const otherValue = otherInput.value.trim().toLowerCase();
                    if (otherValue && otherValue !== 'void' && /^\d+$/.test(otherValue)) {
                        const otherNumValue = parseInt(otherValue, 10);
                        usedNumbers.add(otherNumValue);
                    }
                }
            }
            
            // 检查当前数字是否重复
            if (usedNumbers.has(numValue)) {
                input.style.backgroundColor = '#ffcccc';
                input.title = `输入值${numValue}在${groupName}组中已使用过，不能重复`;
                return;
            }
        }
    }
}

/**
 * 为所有表格的输入框添加blur事件监听器
 */
function setupInputValidation() {
    const tables = ["championshipTableBody", "kittenTableBody", "premiershipTableBody"];
    let totalInputs = 0;
    
    console.log("设置输入验证监听器...");
    
    tables.forEach(tableId => {
        const tableBody = document.getElementById(tableId);
        if (tableBody) {
            const rows = tableBody.getElementsByTagName('tr');
            console.log(`表格 ${tableId} 有 ${rows.length} 行`);
            
            let tableInputs = 0;
            
            // 从第4行开始(索引3)到第18行(索引17)，这些是猫ID的输入行
            for (let i = 3; i < rows.length; i++) {
                // 为所有输入框添加验证，包括1-15名和决赛行
                const inputs = rows[i].querySelectorAll('input');
                for (let j = 0; j < inputs.length; j++) {
                    // 移除旧的事件监听器（避免重复）
                    inputs[j].removeEventListener('blur', validateInputOnBlur);
                    // 添加新的事件监听器
                    inputs[j].addEventListener('blur', validateInputOnBlur);
                    tableInputs++;
                    
                    // 添加一个自定义属性，用于标记已添加事件监听器
                    inputs[j].setAttribute('data-has-validator', 'true');
                    
                    // 添加调试事件输出
                    inputs[j].addEventListener('focus', function() {
                        console.log(`输入框获得焦点: 行=${i}, 列=${j}`);
                    });
                }
            }
            
            console.log(`已为表格 ${tableId} 的 ${tableInputs} 个输入框添加验证`);
            totalInputs += tableInputs;
        } else {
            console.log(`找不到表格 ${tableId}`);
        }
    });
    
    console.log(`总共为 ${totalInputs} 个输入框添加了验证监听器`);
    
    // 手动触发一次表单验证检查
    checkAllValidations();
}

/**
 * 检查所有已添加验证的输入框
 */
function checkAllValidations() {
    const tables = ["championshipTableBody", "kittenTableBody", "premiershipTableBody"];
    let validInputs = 0;
    
    tables.forEach(tableId => {
        const tableBody = document.getElementById(tableId);
        if (tableBody) {
            const validatedInputs = tableBody.querySelectorAll('input[data-has-validator="true"]');
            validInputs += validatedInputs.length;
        }
    });
    
    console.log(`验证检查: 找到 ${validInputs} 个已添加验证的输入框`);
}

/**
 * 在DOM加载完成后设置输入验证
 */
document.addEventListener('DOMContentLoaded', function() {
    setupInputValidation();
    
    // 当表格更新时重新设置验证
    document.addEventListener('tableUpdated', function() {
        setupInputValidation();
    });
});

// 创建自定义事件，用于在表格更新后重新设置验证
const tableUpdatedEvent = new Event('tableUpdated');

// 修改fillBaseInfo函数，在表格填充完成后触发自定义事件
function fillBaseInfo() {
    // ... existing code ...
    
    // 在函数最后触发表格更新事件
    document.dispatchEvent(tableUpdatedEvent);
}

// 修改updateJudgeInformation函数，在表格更新后触发自定义事件
function updateJudgeInformation() {
    // ... existing code ...
    
    // 在函数最后触发表格更新事件
    setTimeout(function() {
        document.dispatchEvent(tableUpdatedEvent);
    }, 100);
}

/**
 * 生成冠军组、幼猫组和绝育组表格的行
 * @param {HTMLElement} tableBody - 表格体元素
 * @param {number} rows - 行数
 * @param {Array} rowHeaders - 行标题数组
 * @param {number} totalColumns - 总列数
 */
function generateTableRows(tableBody, rows, rowHeaders, totalColumns) {
    // 清空表格内容
    tableBody.innerHTML = '';
    console.log(`为 ${tableBody.id} 生成 ${rows} 行，${totalColumns} 列`);
    
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        
        // Row header in the first column
        const headerCell = document.createElement('td');
        headerCell.textContent = rowHeaders[i];
        row.appendChild(headerCell);

        // Add dynamic columns for the judges and type
        for (let j = 0; j < totalColumns; j++) {
            const judgeCell = document.createElement('td');
            const judgeInput = document.createElement('input');
            judgeInput.type = 'text';
            judgeInput.setAttribute('data-col', j);
            judgeInput.setAttribute('data-row', i);
            
            switch (headerCell.textContent) {
                case 'Ring #':
                    judgeInput.classList.add('ring' + j);
                    break;
                case 'Judge':
                    judgeInput.classList.add('judge' + j);
                    break;
                case 'Type':
                    judgeInput.classList.add('type' + j);
                    break;
            }
            
            // 为所有输入框添加blur事件监听器，包括1-15名和决赛行
            judgeInput.addEventListener('blur', function(e) {
                console.log(`输入框失去焦点: 表格=${tableBody.id}, 行=${i}, 列=${j}, 值=${this.value}`);
                validateInputOnBlur(e);
            });
            judgeInput.setAttribute('data-has-validator', 'true');
            
            judgeCell.appendChild(judgeInput);
            row.appendChild(judgeCell);
        }

        tableBody.appendChild(row);
    }
    
    console.log(`${tableBody.id} 表格生成完成`);
    
    // 触发自定义事件，通知表格已更新
    document.dispatchEvent(tableUpdatedEvent);
}
