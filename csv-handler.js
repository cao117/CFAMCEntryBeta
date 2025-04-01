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
        const judgeName = row.getElementsByTagName('td')[1].querySelector('input').value;
        const judgeAcronym = row.getElementsByTagName('td')[2].querySelector('input').value;
        const ringType = row.getElementsByTagName('td')[3].querySelector('select').value;
        judgeData += `${judgeName},${judgeAcronym},${ringType}\n`;  // 添加每个裁判的数据
    }
    csvContent += judgeData;
    csvContent += "\r\n"; // 添加空行分隔各部分

    // 各个表格的ID列表
    let tableIds = ["championshipTable", "kittenTable", "premiershipTable"];
    let allRowData = [];

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
                    // 检查是否是Championship表格中的1-15名行
                    const isChampionshipTable = tableId === 'championshipTable';
                    const isPremiershipTable = tableId === 'premiershipTable';
                    const isTop15Row = (isChampionshipTable && rowIndex >= 3 && rowIndex <= 17) || 
                                      (isPremiershipTable && rowIndex >= 3 && rowIndex <= 17);
                    
                    if (isTop15Row) {
                        // 处理复合控件：猫编号和状态
                        const container = col.querySelector('.input-select-container');
                        if (container) {
                            const catNumberInput = container.querySelector('.cat-number-input');
                            const statusSelect = container.querySelector('.cat-status-select');
                            
                            // 如果猫编号存在，则格式为: 编号[状态] 如: 123[GC] 或 123[GP]
                            if (catNumberInput && catNumberInput.value) {
                                const catNumber = catNumberInput.value.trim();
                                const status = statusSelect ? statusSelect.value : (isChampionshipTable ? 'GC' : 'GP');
                                rowData.push(`${catNumber}[${status}]`);
                            } else {
                                // 如果没有输入猫编号，则只保存状态，用于CSV恢复时判断
                                const status = statusSelect ? statusSelect.value : (isChampionshipTable ? 'GC' : 'GP');
                                rowData.push(`[${status}]`);
                            }
                        } else {
                            // 如果未找到复合控件，则尝试读取普通输入框
                            let input = col.querySelector('input');
                            if (input) {
                                rowData.push(input.value);
                            } else {
                                rowData.push(col.innerText);
                            }
                        }
                    } else {
                        // 处理普通单元格
                        let input = col.querySelector('input');
                        if (input) {
                            rowData.push(input.value);
                        } else {
                            rowData.push(col.innerText);
                        }
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
    let allRowData = [];

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
                    // 检查是否是Championship表格中的1-15名行
                    const isChampionshipTable = tableId === 'championshipTable';
                    const isPremiershipTable = tableId === 'premiershipTable';
                    const isTop15Row = (isChampionshipTable && rowIndex >= 3 && rowIndex <= 17) || 
                                      (isPremiershipTable && rowIndex >= 3 && rowIndex <= 17);
                    
                    if (isTop15Row) {
                        // 处理复合控件：猫编号和状态
                        const container = col.querySelector('.input-select-container');
                        if (container) {
                            const catNumberInput = container.querySelector('.cat-number-input');
                            const statusSelect = container.querySelector('.cat-status-select');
                            
                            // 如果猫编号存在，则格式为: 编号[状态] 如: 123[GC] 或 123[GP]
                            if (catNumberInput && catNumberInput.value) {
                                const catNumber = catNumberInput.value.trim();
                                const status = statusSelect ? statusSelect.value : (isChampionshipTable ? 'GC' : 'GP');
                                rowData.push(`${catNumber}[${status}]`);
                            } else {
                                // 如果没有输入猫编号，则只保存状态，用于CSV恢复时判断
                                const status = statusSelect ? statusSelect.value : (isChampionshipTable ? 'GC' : 'GP');
                                rowData.push(`[${status}]`);
                            }
                        } else {
                            // 如果未找到复合控件，则尝试读取普通输入框
                            let input = col.querySelector('input');
                            if (input) {
                                rowData.push(input.value);
                            } else {
                                rowData.push(col.innerText);
                            }
                        }
                    } else {
                        // 处理普通单元格
                        let input = col.querySelector('input');
                        if (input) {
                            rowData.push(input.value);
                        } else {
                            rowData.push(col.innerText);
                        }
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
        alert('Please Enter Show Date');
        document.getElementById('showDate').focus();
        return false;
    }
    
    const clubName = document.getElementById('clubName').value;
    if (!clubName) {
        switchTab('general');
        alert('Please Enter Club Name');
        document.getElementById('clubName').focus();
        return false;
    }
    
    if (clubName.length > 255) {
        switchTab('general');
        alert('Club Name Cannot Exceed 255 Characters');
        document.getElementById('clubName').focus();
        return false;
    }
    
    const masterClerkName = document.getElementById('masterClerkName').value;
    if (!masterClerkName) {
        switchTab('general');
        alert('Please Enter Master Clerk Name');
        document.getElementById('masterClerkName').focus();
        return false;
    }
    
    if (masterClerkName.length > 120) {
        switchTab('general');
        alert('Master Clerk Name Cannot Exceed 120 Characters');
        document.getElementById('masterClerkName').focus();
        return false;
    }
    
    const numberOfJudges = document.getElementById('numberOfJudges').value;
    if (!numberOfJudges || numberOfJudges <= 0) {
        switchTab('general');
        alert('Please Set # of Judges');
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
            alert(`Please Enter Name of  Judge #${i+1}`);
            judgeRows[i].getElementsByTagName('td')[1].querySelector('input').focus();
            return false;
        }
        
        if (judgeName.length > 120) {
            switchTab('general');
            alert(`Name of Judge #${i+1} Cannot Exceed 120 Characters`);
            judgeRows[i].getElementsByTagName('td')[1].querySelector('input').focus();
            return false;
        }
        
        // 验证裁判缩写
        const judgeAcronym = judgeRows[i].getElementsByTagName('td')[2].querySelector('input').value;
        if (!judgeAcronym) {
            switchTab('general');
            alert(`Please Enter Acronym of Judge #${i+1}`);
            judgeRows[i].getElementsByTagName('td')[2].querySelector('input').focus();
            return false;
        }
        
        if (judgeAcronym.length > 6) {
            switchTab('general');
            alert(`Acronym of Judge #${i+1} Cannot Exceed 6 Characters`);
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
 * 验证表格数据
 * @param {HTMLElement} tableBody - 表格体元素
 * @param {string} tabId - 表格ID
 * @returns {boolean} 验证通过返回true，否则返回false
 */
function validateTableData(tableBody, tabId) {
    const rows = tableBody.getElementsByTagName('tr');
    
    // 获取judgeColumns，判断有多少列数据(不包括第一列标题列)
    const firstRow = rows[0];
    const judgeColumns = firstRow ? firstRow.getElementsByTagName('td').length - 1 : 0;
    
    console.log(`验证表格 ${tabId}，列数: ${judgeColumns}`);
    
    // 验证每一列
    for (let col = 0; col < judgeColumns; col++) {
        // 获取该列所有值
        const columnValues = [];
        // 从第4行开始(索引3)，获取1-15名的猫的数据
        for (let row = 3; row <= 17 && row < rows.length; row++) {
            let input;
            let value = '';
            
            // 检查是否是复合控件
            const isChampionshipTable = tabId === 'championship';
            const isPremiershipTable = tabId === 'premiership';
            const isTop15Row = (isChampionshipTable || isPremiershipTable) && row >= 3 && row <= 17;
            
            if (isTop15Row) {
                // 获取单元格
                const cell = rows[row].getElementsByTagName('td')[col + 1]; // +1 因为第一列是标题列
                if (!cell) continue;
                
                // 检查是否是复合控件
                const container = cell.querySelector('.input-select-container');
                if (container) {
                    input = container.querySelector('.cat-number-input');
                    value = input ? input.value.trim() : '';
                } else {
                    input = cell.querySelector('input');
                    value = input ? input.value.trim() : '';
                }
            } else {
                const inputs = rows[row].querySelectorAll('input');
                if (inputs.length > col) {
                    input = inputs[col];
                    value = input.value.trim();
                }
            }
            
            columnValues.push({
                row: row,
                element: input,
                value: value,
                position: row - 2 // 对应的排名(1-15)
            });
        }
        
        // 获取环号和裁判名称
        const ringNumber = rows[0].querySelectorAll('input')[col]?.value || col + 1;
        const judgeName = rows[1].querySelectorAll('input')[col]?.value || '';
        
        // 验证该列的所有1-15名值
        if (!validateColumn(columnValues, tabId, col, ringNumber, judgeName)) {
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
            
            // 获取第3行的Ring Type
            const ringTypeCell = rows[2].getElementsByTagName('td')[col + 1]; // +1 因为第一列是标题列
            
            // 从输入框而不是从单元格文本中获取Ring Type
            if (ringTypeCell) {
                const ringTypeInput = ringTypeCell.querySelector('input');
                if (ringTypeInput) {
                    ringType = ringTypeInput.value.trim();
                }
            }
            
            // 只有在Ring Type为Allbreed时进行CH猫的关系验证
            if (ringType === 'Allbreed') {

                // 获取Top 15中的CH猫和Best CH/LH CH/SH CH系列的猫
                const top15CHCats = collectTop15CHCats(rows, col);
                
                // 验证Best CH系列与Top 15中CH猫的关系
                if (!validateBestCHWithTop15(top15CHCats, bestCHValues, ringNumber, judgeName)) {
                    return false;
                }
                
                // 验证Best LH CH和Best SH CH与Best CH的关系
                if (!validateLHSHWithBestCH(bestCHValues, bestLHValues, bestSHValues, ringNumber, judgeName)) {
                    return false;
                }
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
            // 获取单元格
            const cell = rows[i].getElementsByTagName('td')[col + 1]; // +1 因为第一列是标题
            if (!cell) continue;
            
            let input, value;
            
            // 检查是否是复合控件
            const container = cell.querySelector('.input-select-container');
            if (container) {
                input = container.querySelector('.cat-number-input');
                value = input ? input.value.trim() : '';
            } else {
                // 传统的单一输入框
                input = cell.querySelector('input');
                value = input ? input.value.trim() : '';
            }
            
            values.push({
                row: i,
                element: input,
                value: value,
                position: i - startRow + 1 // 在此组中的位置
            });
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
            alert(`Cat # Entered for Ring #${ringNumber} Under Judge (${judgeName}) Group #${groupName} Position #${valueObj.position} was "${value}", but It Must be a Number Between 1-450 or void`);
            highlightElement(valueObj.element);
            return false;
        }
        
        const numValue = parseInt(value, 10);
        if (numValue < 1 || numValue > 450) {
            switchTab(tabId);
            alert(`Cat # Entered for Ring #${ringNumber} Under Judge (${judgeName}) Group #${groupName} Position #${valueObj.position} was "${value}", but It Must be a Number between 1-450`);
            highlightElement(valueObj.element);
            return false;
        }
        
        // 检查前面的排名是否有值
        for (let j = 0; j < i; j++) {
            if (!values[j].value) {
                switchTab(tabId);
                alert(`Cat # Entered for Ring#${ringNumber} Under Judge (${judgeName}) Group #${groupName} Position #${valueObj.position} , but Previous Row #${j+1} was empty, Please Complete`);
                highlightElement(values[j].element);
                return false;
            }
        }
        
        // 检查重复数字
        if (usedNumbers.has(numValue)) {
            switchTab(tabId);
            alert(`Duplicate Cat #  ${numValue} was Entered for Ring #${ringNumber} Under Judge(${judgeName}) Group #${groupName} Postion #${valueObj.position}`);
            highlightElement(valueObj.element);
            return false;
        }
        
        // 添加到已使用集合
        usedNumbers.add(numValue);
    }
    
    return true;
}

/**
 * 验证所有表格中的列
 * @param {Array} values - 单元格值集合
 * @param {string} tabId - 表格ID
 * @param {number} colIndex - 列索引
 * @param {string} ringNumber - 环号
 * @param {string} judgeName - 裁判名称
 * @returns {boolean} 验证通过返回true，否则返回false
 */
function validateColumn(values, tabId, colIndex, ringNumber, judgeName) {
    // 跳过所有空值或值为void的行
    const nonEmptyValues = values.filter(valueObj => valueObj.value && valueObj.value.toLowerCase() !== 'void');
    if (nonEmptyValues.length === 0) {
        return true; // 全部为空或void，验证通过
    }
    
    // 验证数值（必须是1-450之间的整数）
    const usedNumbers = new Set();
    for (const valueObj of nonEmptyValues) {
        const value = valueObj.value.trim().toLowerCase();
        if (!/^\d+$/.test(value)) {
            switchTab(tabId);
            alert(`Invalid Number "${value}" for Ring #${ringNumber} Under Judge (${judgeName}) Position #${valueObj.position}`);
            highlightElement(valueObj.element);
            return false;
        }
        
        const numValue = parseInt(value, 10);
        if (numValue < 1 || numValue > 450) {
            switchTab(tabId);
            alert(`Cat # ${numValue} is Out of Range (1-450) for Ring #${ringNumber} Under Judge (${judgeName}) Position #${valueObj.position}`);
            highlightElement(valueObj.element);
            return false;
        }
        
        // 检查重复数字
        if (usedNumbers.has(numValue)) {
            switchTab(tabId);
            alert(`Duplicate Cat # ${numValue} for Ring #${ringNumber} Under Judge (${judgeName}) Postition #${valueObj.position}`);
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
                                
                                console.log(`处理表格行 ${tableIndex}(${tableRow ? tableRow.innerText.substring(0, 10) : 'undefined'}), CSV行 ${currentRow}, 数据长度: ${rowData.length}`);
                                
                                // 检查是否是Championship表格的1-15名行(索引3-17)
                                const isChampionshipTable = tableInfo.id === 'championshipTableBody';
                                const isPremiershipTable = tableInfo.id === 'premiershipTableBody';
                                const isTop15Row = (isChampionshipTable && tableIndex >= 3 && tableIndex <= 17) ||
                                                 (isPremiershipTable && tableIndex >= 3 && tableIndex <= 17);
                                
                                if (isTop15Row) {
                                    // 处理带状态的复合控件
                                    for (let i = 0; i < rowData.length - 1; i++) {
                                        const csvValue = rowData[i + 1] ? rowData[i + 1].trim() : '';
                                        
                                        // 查找对应单元格中的复合控件
                                        const td = tableRow.getElementsByTagName('td')[i + 1];
                                        if (!td) continue;
                                        
                                        const container = td.querySelector('.input-select-container');
                                        if (container) {
                                            const catNumberInput = container.querySelector('.cat-number-input');
                                            const statusSelect = container.querySelector('.cat-status-select');
                                            
                                            if (catNumberInput && statusSelect) {
                                                // 尝试解析格式为 "123[GC]" 或 "[GC]" 或 "123[GP]" 或 "[GP]" 的数据
                                                const matchResult = csvValue.match(/^(\d+)?\[([A-Z]+)\]$/);
                                                if (matchResult) {
                                                    // 有匹配结果
                                                    const catNumber = matchResult[1] || ''; // 可能为undefined
                                                    const status = matchResult[2] || '';  // 状态值
                                                    
                                                    catNumberInput.value = catNumber;
                                                    
                                                    // 确保状态是有效值，根据表格类型选择默认值
                                                    if (isChampionshipTable) {
                                                        // Championship表格检查GC、CH、NOV
                                                        if (status === 'GC' || status === 'CH' || status === 'NOV') {
                                                            statusSelect.value = status;
                                                        } else {
                                                            statusSelect.value = 'GC'; // 默认值
                                                        }
                                                    } else if (isPremiershipTable) {
                                                        // Premiership表格检查GP、PR、NOV
                                                        if (status === 'GP' || status === 'PR' || status === 'NOV') {
                                                            statusSelect.value = status;
                                                        } else {
                                                            statusSelect.value = 'GP'; // 默认值
                                                        }
                                                    }
                                                } else {
                                                    // 旧CSV格式或无格式，只填充猫编号，状态使用默认值
                                                    catNumberInput.value = csvValue;
                                                    statusSelect.value = isChampionshipTable ? 'GC' : 'GP'; // 根据表格类型选择默认值
                                                }
                                            }
                                        } else {
                                            // 找不到复合控件，但有可能是旧版本生成的表格，尝试找普通输入框
                                            const input = td.querySelector('input');
                                            if (input) {
                                                input.value = csvValue;
                                            }
                                        }
                                    }
                                } else {
                                    // 普通行处理
                                    const inputs = tableRow.querySelectorAll('input');
                                    
                                    // 处理每一行数据
                                    if (inputs.length > 0 && rowData.length > 1) {
                                        for (let i = 0; i < inputs.length && i + 1 < rowData.length; i++) {
                                            const csvValue = rowData[i + 1] ? rowData[i + 1].trim() : '';
                                            inputs[i].value = csvValue;
                                        }
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
    
    // 检查是否是cat-number-input类的输入框(只验证猫编号，不验证状态下拉选择)
    const isCatNumberInput = input.classList.contains('cat-number-input');
    
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
    let cell;
    
    if (isCatNumberInput) {
        // 如果是猫编号输入框，需要往上找到容器的父元素td
        const container = input.closest('.input-select-container');
        cell = container ? container.closest('td') : input.closest('td');
    } else {
        cell = input.closest('td');
    }
    
    if (!cell) return;
    
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
            // 针对不同类型的输入框检查值
            let prevValue = '';
            const prevCell = rows[i].getElementsByTagName('td')[colIndex + 1]; // +1是因为第一列是标题列
            
            if (prevCell) {
                // 检查是否是复合控件
                const prevContainer = prevCell.querySelector('.input-select-container');
                if (prevContainer) {
                    const prevInput = prevContainer.querySelector('.cat-number-input');
                    prevValue = prevInput ? prevInput.value.trim() : '';
                } else {
                    // 传统的单一输入框
                    const prevInput = prevCell.querySelector('input');
                    prevValue = prevInput ? prevInput.value.trim() : '';
                }
            }
            
            if (!prevValue) {
                input.style.backgroundColor = '#ffcccc';
                input.title = `Row #${rowIndex-2} was Filled, but Previous Row #${i-2} was not Filled, Please Complete`;
                return;
            }
        }
        
        // 收集当前列中的所有数字以检查重复
        const usedNumbers = new Set();
        for (let i = 3; i <= 17 && i < rows.length; i++) {
            if (i === rowIndex) continue; // 跳过当前行
            
            const otherCell = rows[i].getElementsByTagName('td')[colIndex + 1]; // +1是因为第一列是标题列
            if (otherCell) {
                let otherValue = '';
                
                // 检查是否是复合控件
                const otherContainer = otherCell.querySelector('.input-select-container');
                if (otherContainer) {
                    const otherInput = otherContainer.querySelector('.cat-number-input');
                    otherValue = otherInput ? otherInput.value.trim().toLowerCase() : '';
                } else {
                    // 传统的单一输入框
                    const otherInput = otherCell.querySelector('input');
                    otherValue = otherInput ? otherInput.value.trim().toLowerCase() : '';
                }
                
                if (otherValue && otherValue !== 'void' && /^\d+$/.test(otherValue)) {
                    const otherNumValue = parseInt(otherValue, 10);
                    usedNumbers.add(otherNumValue);
                }
            }
        }
        
        // 检查当前数字是否重复
        if (usedNumbers.has(numValue)) {
            input.style.backgroundColor = '#ffcccc';
            input.title = `Duplicate Cat # ${numValue} Entered`;
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
            
            // 只有在Championship表格中才进行CH关系验证
            if (realTableId.includes('championship')) {
                // 获取第3行的Ring Type
                const ringTypeCell = rows[2].getElementsByTagName('td')[colIndex + 1]; // +1 因为第一列是标题列
                let ringType = 'Allbreed'; // 默认值
                
                // 从输入框而不是从单元格文本中获取Ring Type
                if (ringTypeCell) {
                    const ringTypeInput = ringTypeCell.querySelector('input');
                    if (ringTypeInput) {
                        ringType = ringTypeInput.value.trim();
                    }
                }
                
                // 只有在Ring Type为Allbreed时进行CH猫的关系验证
                if (ringType === 'Allbreed') {
                    // 1. 如果是Best CH系列中的输入，则验证与Top 15中CH猫的关系
                    if (groupName === 'Best CH') {
                        const top15CHCats = collectTop15CHCats(rows, colIndex);
                        // 如果Top 15中有CH猫，则验证Best CH系列与Top 15中CH猫的顺序一致性
                        if (top15CHCats.length > 0) {
                            const bestCHValues = collectFinalsValues(rows, colIndex, 18, 22);
                            const nonEmptyBestCH = bestCHValues.filter(v => v.value && v.value.toLowerCase() !== 'void');
                            
                            // 找到当前输入在Best CH系列中的位置
                            const currentPosition = rowIndex - 18;
                            
                            // 如果当前输入的位置超过了Top 15中CH猫的数量
                            if (currentPosition >= top15CHCats.length) {
                                input.style.backgroundColor = '#ffcccc';
                                input.title = `Top 15中只有${top15CHCats.length}个CH猫，但您正在填写第${currentPosition + 1}个Best CH猫`;
                                return;
                            }
                            
                            // 验证当前输入的值是否与对应位置的Top 15中CH猫一致
                            if (top15CHCats[currentPosition] && numValue !== parseInt(top15CHCats[currentPosition].value)) {
                                input.style.backgroundColor = '#ffcccc';
                                input.title = `此位置应填写猫编号${top15CHCats[currentPosition].value}，与Top 15中CH猫的顺序保持一致`;
                                return;
                            }
                        }
                    }
                    
                    // 2. 如果是Best LH CH或Best SH CH系列中的输入，则验证与Best CH系列的关系
                    if (groupName === 'Best LH CH' || groupName === 'Best SH CH') {
                        const bestCHValues = collectFinalsValues(rows, colIndex, 18, 22);
                        const nonEmptyBestCH = bestCHValues.filter(v => v.value && v.value.toLowerCase() !== 'void');
                        
                        // 如果Best CH系列为空，则不允许填写Best LH CH或Best SH CH
                        if (nonEmptyBestCH.length === 0) {
                            input.style.backgroundColor = '#ffcccc';
                            input.title = `Best CH系列为空，不能填写${groupName}`;
                            return;
                        }
                        
                        // 获取所有Best CH编号
                        const bestCHNumbers = nonEmptyBestCH.map(v => v.value);
                        
                        // 检查当前输入的编号是否在Best CH系列中
                        if (!bestCHNumbers.includes(value)) {
                            input.style.backgroundColor = '#ffcccc';
                            input.title = `猫编号${value}不在Best CH系列中，${groupName}中的猫必须来自Best CH系列`;
                            return;
                        }
                        
                        // 获取Best LH CH和Best SH CH系列中的所有编号
                        const bestLHValues = collectFinalsValues(rows, colIndex, 23, 27);
                        const bestSHValues = collectFinalsValues(rows, colIndex, 28, 32);
                        const nonEmptyBestLH = bestLHValues.filter(v => v.value && v.value.toLowerCase() !== 'void');
                        const nonEmptyBestSH = bestSHValues.filter(v => v.value && v.value.toLowerCase() !== 'void');
                        const bestLHNumbers = nonEmptyBestLH.map(v => v.value);
                        const bestSHNumbers = nonEmptyBestSH.map(v => v.value);
                        
                        // 检查是否有编号同时出现在Best LH CH和Best SH CH中
                        if (groupName === 'Best LH CH' && bestSHNumbers.includes(value)) {
                            input.style.backgroundColor = '#ffcccc';
                            input.title = `猫编号${value}已经在Best SH CH系列中使用，每个猫只能出现在一个系列中`;
                            return;
                        } else if (groupName === 'Best SH CH' && bestLHNumbers.includes(value)) {
                            input.style.backgroundColor = '#ffcccc';
                            input.title = `猫编号${value}已经在Best LH CH系列中使用，每个猫只能出现在一个系列中`;
                            return;
                        }
                        
                        // 验证顺序一致性
                        // 创建Best CH位置映射表
                        const bestCHPositions = {};
                        bestCHNumbers.forEach((num, index) => {
                            bestCHPositions[num] = index;
                        });
                        
                        if (groupName === 'Best LH CH') {
                            // 提取当前编号之前的所有Best LH CH编号
                            const prevBestLH = [];
                            for (let i = 23; i < rowIndex; i++) {
                                const prevInput = rows[i].querySelectorAll('input')[colIndex];
                                const prevValue = prevInput ? prevInput.value.trim() : '';
                                if (prevValue && prevValue !== 'void' && bestCHNumbers.includes(prevValue)) {
                                    prevBestLH.push(prevValue);
                                }
                            }
                            
                            // 检查顺序是否一致
                            for (const prevNum of prevBestLH) {
                                if (bestCHPositions[prevNum] > bestCHPositions[value]) {
                                    input.style.backgroundColor = '#ffcccc';
                                    input.title = `猫编号${value}在Best CH系列中的位置早于${prevNum}，但在Best LH CH系列中的顺序相反`;
                                    return;
                                }
                            }
                        } else if (groupName === 'Best SH CH') {
                            // 提取当前编号之前的所有Best SH CH编号
                            const prevBestSH = [];
                            for (let i = 28; i < rowIndex; i++) {
                                const prevInput = rows[i].querySelectorAll('input')[colIndex];
                                const prevValue = prevInput ? prevInput.value.trim() : '';
                                if (prevValue && prevValue !== 'void' && bestCHNumbers.includes(prevValue)) {
                                    prevBestSH.push(prevValue);
                                }
                            }
                            
                            // 检查顺序是否一致
                            for (const prevNum of prevBestSH) {
                                if (bestCHPositions[prevNum] > bestCHPositions[value]) {
                                    input.style.backgroundColor = '#ffcccc';
                                    input.title = `猫编号${value}在Best CH系列中的位置早于${prevNum}，但在Best SH CH系列中的顺序相反`;
                                    return;
                                }
                            }
                        }
                    }
                    
                    // 3. 验证是否所有Best CH编号都被分配到了Best LH CH或Best SH CH中
                    // 这个检查只在用户完成输入后执行，不在每次blur事件中检查
                }
            }
        }
    }
}

/**
 * 设置表格输入框的验证
 */
function setupInputValidation() {
    // 移除所有现有的验证监听器
    const inputs = document.querySelectorAll('input[data-has-validator="true"]');
    inputs.forEach(input => {
        input.removeEventListener('blur', validateInputOnBlur);
        input.removeAttribute('data-has-validator');
    });
    
    // 添加验证到冠军组表格
    const championshipTable = document.getElementById('championshipTable');
    if (championshipTable) {
        // 为普通输入框添加验证
        const regularInputs = championshipTable.querySelectorAll('input:not(.cat-number-input)');
        regularInputs.forEach(input => {
            input.addEventListener('blur', validateInputOnBlur);
            input.setAttribute('data-has-validator', 'true');
        });
        
        // 为猫编号输入框添加验证
        const catNumberInputs = championshipTable.querySelectorAll('.cat-number-input');
        catNumberInputs.forEach(input => {
            input.addEventListener('blur', validateInputOnBlur);
            input.setAttribute('data-has-validator', 'true');
        });
    }
    
    // 添加验证到幼猫组表格
    const kittenTable = document.getElementById('kittenTable');
    if (kittenTable) {
        const inputs = kittenTable.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInputOnBlur);
            input.setAttribute('data-has-validator', 'true');
        });
    }
    
    // 添加验证到绝育组表格
    const premiershipTable = document.getElementById('premiershipTable');
    if (premiershipTable) {
        const inputs = premiershipTable.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInputOnBlur);
            input.setAttribute('data-has-validator', 'true');
        });
    }
    
    console.log("输入框验证设置完成");
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
 * 收集Top 15中的CH状态猫
 * @param {HTMLCollection} rows - 表格行集合
 * @param {number} col - 列索引
 * @returns {Array} 包含CH状态猫的编号和行索引的数组
 */
function collectTop15CHCats(rows, col) {
    const chCats = [];
    
    // 遍历Top 15行 (行索引3-17)
    for (let row = 3; row <= 17 && row < rows.length; row++) {
        const cell = rows[row].getElementsByTagName('td')[col + 1]; // +1 因为第一列是标题
        if (!cell) continue;
        
        // 检查是否是复合控件
        const container = cell.querySelector('.input-select-container');
        if (container) {
            const catNumberInput = container.querySelector('.cat-number-input');
            const statusSelect = container.querySelector('.cat-status-select');
            
            const catNumber = catNumberInput ? catNumberInput.value.trim() : '';
            const status = statusSelect ? statusSelect.value : 'GC';
            
            // 如果猫的状态是CH且有编号，则添加到列表中
            if (catNumber && status === 'CH') {
                chCats.push({
                    row: row,
                    value: catNumber,
                    position: row - 2 // 对应的排名(1-15)
                });
            }
        }
    }
    
    // 按照位置排序（从小到大）
    chCats.sort((a, b) => a.position - b.position);
    
    return chCats;
}

/**
 * 验证Best CH系列与Top 15中CH猫的关系
 * @param {Array} top15CHCats - Top 15中CH状态的猫的列表
 * @param {Array} bestCHValues - Best CH系列的猫的列表
 * @param {string} ringNumber - 环号
 * @param {string} judgeName - 裁判名称
 * @returns {boolean} 验证通过返回true，否则返回false
 */
function validateBestCHWithTop15(top15CHCats, bestCHValues, ringNumber, judgeName) {
    // 如果Top 15中没有CH猫，则不验证Best CH系列
    if (top15CHCats.length === 0) {
        return true;
    }
    
    // 过滤掉Best CH系列中的空值
    const nonEmptyBestCH = bestCHValues.filter(v => v.value && v.value.toLowerCase() !== 'void');
    
    // 获取Top 15中CH状态猫的编号列表
    const chCatNumbers = top15CHCats.map(cat => cat.value);
    console.log(chCatNumbers);

    // 验证Best CH系列中的猫编号必须按顺序与Top 15中的CH猫一致
    for (let i = 0; i < Math.min(nonEmptyBestCH.length, top15CHCats.length); i++) {
        const bestCHNumber = nonEmptyBestCH[i].value;
        const expectedCHNumber = chCatNumbers[i];
        
        if (bestCHNumber !== expectedCHNumber) {
            switchTab('championship');
            alert(`在Ring #${ringNumber}（裁判: ${judgeName}）中，Best CH系列中第${i+1}个应该是猫编号${expectedCHNumber}，而不是${bestCHNumber}。Best CH系列必须与Top 15中的CH猫按顺序一致。`);
            highlightElement(nonEmptyBestCH[i].element);
            return false;
        }
    }
    
    return true;
}

/**
 * 验证Best LH CH和Best SH CH与Best CH的关系
 * @param {Array} bestCHValues - Best CH系列的猫的列表
 * @param {Array} bestLHValues - Best LH CH系列的猫的列表
 * @param {Array} bestSHValues - Best SH CH系列的猫的列表
 * @param {string} ringNumber - 环号
 * @param {string} judgeName - 裁判名称
 * @returns {boolean} 验证通过返回true，否则返回false
 */
function validateLHSHWithBestCH(bestCHValues, bestLHValues, bestSHValues, ringNumber, judgeName) {
    // 过滤掉空值和void
    const nonEmptyBestCH = bestCHValues.filter(v => v.value && v.value.toLowerCase() !== 'void');
    const nonEmptyBestLH = bestLHValues.filter(v => v.value && v.value.toLowerCase() !== 'void');
    const nonEmptyBestSH = bestSHValues.filter(v => v.value && v.value.toLowerCase() !== 'void');
    
    // 如果Best CH系列为空，则Best LH CH和Best SH CH也应该为空
    if (nonEmptyBestCH.length === 0) {
        if (nonEmptyBestLH.length > 0) {
            switchTab('championship');
            alert(`在Ring #${ringNumber}（裁判: ${judgeName}）中，Best CH系列为空，但Best LH CH系列有猫编号。如果没有Best CH猫，也不应该有Best LH CH猫。`);
            highlightElement(nonEmptyBestLH[0].element);
            return false;
        }
        
        if (nonEmptyBestSH.length > 0) {
            switchTab('championship');
            alert(`在Ring #${ringNumber}（裁判: ${judgeName}）中，Best CH系列为空，但Best SH CH系列有猫编号。如果没有Best CH猫，也不应该有Best SH CH猫。`);
            highlightElement(nonEmptyBestSH[0].element);
            return false;
        }
        
        return true;
    }
    
    // 获取Best CH系列中的猫编号
    const bestCHNumbers = nonEmptyBestCH.map(v => v.value);
    
    // 验证Best LH CH和Best SH CH的并集必须包含所有Best CH的编号
    const bestLHNumbers = nonEmptyBestLH.map(v => v.value);
    const bestSHNumbers = nonEmptyBestSH.map(v => v.value);
    const combinedLHSHNumbers = [...new Set([...bestLHNumbers, ...bestSHNumbers])];
    
    // 检查是否所有Best CH编号都出现在Best LH CH或Best SH CH中
    const missingNumbers = bestCHNumbers.filter(num => !combinedLHSHNumbers.includes(num));
    if (missingNumbers.length > 0) {
        switchTab('championship');
        alert(`在Ring #${ringNumber}（裁判: ${judgeName}）中，以下猫编号出现在Best CH系列中，但没有出现在Best LH CH或Best SH CH系列中：${missingNumbers.join(', ')}。所有Best CH中的猫必须出现在Best LH CH或Best SH CH中的一个系列中。`);
        return false;
    }
    
    // 检查是否有编号同时出现在Best LH CH和Best SH CH中
    const duplicateNumbers = bestLHNumbers.filter(num => bestSHNumbers.includes(num));
    if (duplicateNumbers.length > 0) {
        switchTab('championship');
        alert(`在Ring #${ringNumber}（裁判: ${judgeName}）中，以下猫编号同时出现在Best LH CH和Best SH CH系列中：${duplicateNumbers.join(', ')}。每个猫只能出现在其中一个系列中。`);
        return false;
    }
    
    // 验证Best LH CH中的顺序与它们在Best CH中的顺序一致
    const bestCHPositions = {};
    bestCHNumbers.forEach((num, index) => {
        bestCHPositions[num] = index;
    });
    
    // 提取Best LH CH中也出现在Best CH中的编号
    const lhInBestCH = bestLHNumbers.filter(num => bestCHNumbers.includes(num));
    
    // 检查这些编号的顺序是否与它们在Best CH中的顺序一致
    for (let i = 0; i < lhInBestCH.length - 1; i++) {
        const currentPos = bestCHPositions[lhInBestCH[i]];
        const nextPos = bestCHPositions[lhInBestCH[i + 1]];
        
        if (currentPos > nextPos) {
            switchTab('championship');
            alert(`在Ring #${ringNumber}（裁判: ${judgeName}）中，Best LH CH系列中的猫编号${lhInBestCH[i]}和${lhInBestCH[i + 1]}的顺序与它们在Best CH系列中的顺序不一致。`);
            return false;
        }
    }
    
    // 验证Best SH CH中的顺序与它们在Best CH中的顺序一致
    const shInBestCH = bestSHNumbers.filter(num => bestCHNumbers.includes(num));
    
    // 检查这些编号的顺序是否与它们在Best CH中的顺序一致
    for (let i = 0; i < shInBestCH.length - 1; i++) {
        const currentPos = bestCHPositions[shInBestCH[i]];
        const nextPos = bestCHPositions[shInBestCH[i + 1]];
        
        if (currentPos > nextPos) {
            switchTab('championship');
            alert(`在Ring #${ringNumber}（裁判: ${judgeName}）中，Best SH CH系列中的猫编号${shInBestCH[i]}和${shInBestCH[i + 1]}的顺序与它们在Best CH系列中的顺序不一致。`);
            return false;
        }
    }
    
    return true;
}
