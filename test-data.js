/**
 * 测试数据填充脚本
 * 这个文件包含用于快速填充测试数据的函数
 * 在生产环境中可以移除此文件
 */

function fillTestData() {
    // 填充基本信息
    document.getElementById('showDate').value = new Date().toISOString().split('T')[0]; // 今天的日期
    document.getElementById('clubName').value = 'Cat Fanciers Club';
    document.getElementById('masterClerkName').value = 'John Smith';
    
    // 设置随机裁判数量并触发更新
    const randomJudgeCount = Math.floor(Math.random() * 12) + 1; // 随机生成1-12的裁判数量
    document.getElementById('numberOfJudges').value = randomJudgeCount;
    updateJudgeInformation();
    
    // 填充裁判信息
    const judgeNames = ['James Wilson', 'Robert Johnson', 'Mary Davis', 'Patricia Miller', 'Jennifer Garcia', 'Michael Brown', 'Elizabeth Jones', 'David Martinez', 'Richard Taylor', 'Susan Anderson', 'Thomas White', 'Nancy Thomas'];
    const judgeAcronyms = ['JW', 'RJ', 'MD', 'PM', 'JG', 'MB', 'EJ', 'DM', 'RT', 'SA', 'TW', 'NT'];
    const ringTypes = ['Allbreed', 'Double Specialty', 'Longhair', 'Shorthair'];
    
    const judgeRows = document.getElementById('judgeInfoTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (let i = 0; i < judgeRows.length; i++) {
        // 确保即使裁判数量超过预定义名称数量也能生成数据
        const nameIndex = i % judgeNames.length;
        let judgeName = judgeNames[nameIndex];
        let judgeAcronym = judgeAcronyms[nameIndex];
        
        // 如果超过预定义数量，添加序号以区分
        if (i >= judgeNames.length) {
            const suffix = Math.floor(i / judgeNames.length) + 1;
            judgeName += " " + suffix;
            judgeAcronym += suffix;
        }
        
        judgeRows[i].getElementsByTagName('td')[1].querySelector('input').value = judgeName;
        judgeRows[i].getElementsByTagName('td')[2].querySelector('input').value = judgeAcronym;
        // 随机选择一个环类型
        const randomTypeIndex = Math.floor(Math.random() * ringTypes.length);
        judgeRows[i].getElementsByTagName('td')[3].querySelector('select').value = ringTypes[randomTypeIndex];
    }
    
    // 更新表格数据
    fillBaseInfo();
    
    // 填充Championship表格数据
    fillChampionshipData();
    
    // 填充Kitten表格数据
    fillKittenData();
    
    // 填充Premiership表格数据
    fillPremiershipData();
}

/**
 * 填充冠军组表格数据，从第4行开始的猫ID，填充15行
 * 确保生成的数据符合验证规则：1-450之间的数字，且不重复
 */
function fillChampionshipData() {
    const championshipTableBody = document.getElementById('championshipTableBody');
    if (!championshipTableBody) return;
    
    // 获取列数
    const rows = championshipTableBody.getElementsByTagName('tr');
    if (rows.length < 4) return;
    
    const firstRow = rows[0];
    const columnCount = firstRow.querySelectorAll('input').length;
    
    // 为每一列生成一组1-450之间不重复的随机数
    for (let col = 0; col < columnCount; col++) {
        // 跳过没有环号或裁判的列
        const ringNumber = rows[0].querySelectorAll('input')[col].value;
        const judgeName = rows[1].querySelectorAll('input')[col].value;
        if (!ringNumber || !judgeName) continue;
        
        // 生成1-450之间的15个不重复随机数
        const usedNumbers = new Set();
        for (let i = 3; i < Math.min(18, rows.length); i++) {
            const inputs = rows[i].querySelectorAll('input');
            if (inputs.length > col) {
                // 生成一个尚未使用的随机数
                let randomNum;
                do {
                    randomNum = Math.floor(Math.random() * 450) + 1;
                } while (usedNumbers.has(randomNum));
                
                usedNumbers.add(randomNum);
                inputs[col].value = randomNum;
            }
        }
        
        // 填充Best CH, 2nd CH, 3rd CH, 4th CH, 5th CH的获胜者
        // (这些应该是前面15个数字中的一部分)
        const bestCHRows = [18, 19, 20, 21, 22]; // 对应Best CH开始的行
        const bestLHRows = [23, 24, 25, 26, 27]; // 对应Best LH CH开始的行
        const bestSHRows = [28, 29, 30, 31, 32]; // 对应Best SH CH开始的行
        
        // 将usedNumbers转换为数组，取前几名
        const topNumbers = Array.from(usedNumbers).slice(0, 5);
        
        // 填充Best CH系列
        for (let i = 0; i < bestCHRows.length && i < topNumbers.length; i++) {
            if (bestCHRows[i] < rows.length) {
                const inputs = rows[bestCHRows[i]].querySelectorAll('input');
                if (inputs.length > col) {
                    inputs[col].value = topNumbers[i];
                }
            }
        }
        
        // 为了简单起见，也用同样的数字填充Best LH CH和Best SH CH系列
        for (let i = 0; i < bestLHRows.length && i < topNumbers.length; i++) {
            if (bestLHRows[i] < rows.length) {
                const inputs = rows[bestLHRows[i]].querySelectorAll('input');
                if (inputs.length > col) {
                    inputs[col].value = topNumbers[i];
                }
            }
        }
        
        for (let i = 0; i < bestSHRows.length && i < topNumbers.length; i++) {
            if (bestSHRows[i] < rows.length) {
                const inputs = rows[bestSHRows[i]].querySelectorAll('input');
                if (inputs.length > col) {
                    inputs[col].value = topNumbers[i];
                }
            }
        }
    }
}

/**
 * 填充幼猫组表格数据
 * 确保生成的数据符合验证规则：1-450之间的数字，且不重复
 */
function fillKittenData() {
    const kittenTableBody = document.getElementById('kittenTableBody');
    if (!kittenTableBody) return;
    
    // 获取列数
    const rows = kittenTableBody.getElementsByTagName('tr');
    if (rows.length < 4) return;
    
    const firstRow = rows[0];
    const columnCount = firstRow.querySelectorAll('input').length;
    
    // 为每一列生成一组1-450之间不重复的随机数
    for (let col = 0; col < columnCount; col++) {
        // 跳过没有环号或裁判的列
        const ringNumber = rows[0].querySelectorAll('input')[col].value;
        const judgeName = rows[1].querySelectorAll('input')[col].value;
        if (!ringNumber || !judgeName) continue;
        
        // 生成1-450之间的15个不重复随机数
        const usedNumbers = new Set();
        for (let i = 3; i < Math.min(18, rows.length); i++) {
            const inputs = rows[i].querySelectorAll('input');
            if (inputs.length > col) {
                // 生成一个尚未使用的随机数
                let randomNum;
                do {
                    randomNum = Math.floor(Math.random() * 450) + 1;
                } while (usedNumbers.has(randomNum));
                
                usedNumbers.add(randomNum);
                inputs[col].value = randomNum;
            }
        }
    }
}

/**
 * 填充绝育组表格数据
 * 确保生成的数据符合验证规则：1-450之间的数字，且不重复
 */
function fillPremiershipData() {
    const premiershipTableBody = document.getElementById('premiershipTableBody');
    if (!premiershipTableBody) return;
    
    // 获取列数
    const rows = premiershipTableBody.getElementsByTagName('tr');
    if (rows.length < 4) return;
    
    const firstRow = rows[0];
    const columnCount = firstRow.querySelectorAll('input').length;
    
    // 为每一列生成一组1-450之间不重复的随机数
    for (let col = 0; col < columnCount; col++) {
        // 跳过没有环号或裁判的列
        const ringNumber = rows[0].querySelectorAll('input')[col].value;
        const judgeName = rows[1].querySelectorAll('input')[col].value;
        if (!ringNumber || !judgeName) continue;
        
        // 生成1-450之间的15个不重复随机数
        const usedNumbers = new Set();
        for (let i = 3; i < Math.min(18, rows.length); i++) {
            const inputs = rows[i].querySelectorAll('input');
            if (inputs.length > col) {
                // 生成一个尚未使用的随机数
                let randomNum;
                do {
                    randomNum = Math.floor(Math.random() * 450) + 1;
                } while (usedNumbers.has(randomNum));
                
                usedNumbers.add(randomNum);
                inputs[col].value = randomNum;
            }
        }
        
        // 填充Best PR, 2nd PR, 3rd PR系列
        const bestPRRows = [18, 19, 20]; // 对应Best PR开始的行
        const bestLHRows = [21, 22, 23]; // 对应Best LH PR开始的行
        const bestSHRows = [24, 25, 26]; // 对应Best SH PR开始的行
        
        // 将usedNumbers转换为数组，取前几名
        const topNumbers = Array.from(usedNumbers).slice(0, 3);
        
        // 填充Best PR系列
        for (let i = 0; i < bestPRRows.length && i < topNumbers.length; i++) {
            if (bestPRRows[i] < rows.length) {
                const inputs = rows[bestPRRows[i]].querySelectorAll('input');
                if (inputs.length > col) {
                    inputs[col].value = topNumbers[i];
                }
            }
        }
        
        // 为了简单起见，也用同样的数字填充Best LH PR和Best SH PR系列
        for (let i = 0; i < bestLHRows.length && i < topNumbers.length; i++) {
            if (bestLHRows[i] < rows.length) {
                const inputs = rows[bestLHRows[i]].querySelectorAll('input');
                if (inputs.length > col) {
                    inputs[col].value = topNumbers[i];
                }
            }
        }
        
        for (let i = 0; i < bestSHRows.length && i < topNumbers.length; i++) {
            if (bestSHRows[i] < rows.length) {
                const inputs = rows[bestSHRows[i]].querySelectorAll('input');
                if (inputs.length > col) {
                    inputs[col].value = topNumbers[i];
                }
            }
        }
    }
}
