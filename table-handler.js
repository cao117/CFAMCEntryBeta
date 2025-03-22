/**
 * 表格处理脚本
 * 处理表格的创建、填充和更新
 */

let judgeIndex = 1; // 从1开始自增

/**
 * 填充基本信息到冠军组、幼猫组和绝育组表格
 */
var fillBaseInfo = function() {
    var judgeInfoTableTr = $('#judgeInfoTable').find('tbody').find('tr');
    var championshipTableRingRow = $('#championshipTable').find('tbody').find('tr:first');
    var kittenTableRingRow = $('#kittenTable').find('tbody').find('tr:first');
    var premiershipTableRingRow = $('#premiershipTable').find('tbody').find('tr:first');
    var championshipTableJudgeRow = $('#championshipTable').find('tbody').find('tr:nth-child(2)');
    var kittenTableJudgeRow = $('#kittenTable').find('tbody').find('tr:nth-child(2)');
    var premiershipTableJudgeRow = $('#premiershipTable').find('tbody').find('tr:nth-child(2)');
    var championshipTableTypeRow = $('#championshipTable').find('tbody').find('tr:nth-child(3)');
    var kittenTableTypeRow = $('#kittenTable').find('tbody').find('tr:nth-child(3)');
    var premiershipTableTypeRow = $('#premiershipTable').find('tbody').find('tr:nth-child(3)');
    console.log(judgeInfoTableTr, championshipTableRingRow, championshipTableJudgeRow, championshipTableTypeRow);
    var i = 0;
    judgeInfoTableTr.each(function() {
        var ringTypeIndex = $(this).find('td:first').text();
        var judgeName = $(this).find('input[type="text"]').val();
        var judgeAcronym = $(this).find('td:nth-child(3)').find('input').val();
        var ringType = $(this).find('select').val();
        console.log(judgeName + " " + judgeAcronym + " " + ringType);
        var ringClassName = 'ring' + i;
        var judgeClassName = 'judge' + i;
        var typeClassName = 'type' + i;
        if (ringType == 'Double Specialty') {
            // 第一列设置为Longhair
            championshipTableRingRow.find('.' + ringClassName).val(ringTypeIndex).attr('readonly', true);
            kittenTableRingRow.find('.' + ringClassName).val(ringTypeIndex).attr('readonly', true);
            premiershipTableRingRow.find('.' + ringClassName).val(ringTypeIndex).attr('readonly', true);

            championshipTableJudgeRow.find('.' + judgeClassName).val(judgeAcronym).attr('readonly', true);
            kittenTableJudgeRow.find('.' + judgeClassName).val(judgeAcronym).attr('readonly', true);
            premiershipTableJudgeRow.find('.' + judgeClassName).val(judgeAcronym).attr('readonly', true);

            championshipTableTypeRow.find('.' + typeClassName).val('Longhair').attr('readonly', true);
            kittenTableTypeRow.find('.' + typeClassName).val('Longhair').attr('readonly', true);
            premiershipTableTypeRow.find('.' + typeClassName).val('Longhair').attr('readonly', true);
            i++;

            // 第二列设置为Shorthair
            ringClassName = 'ring' + i;
            judgeClassName = 'judge' + i;
            typeClassName = 'type' + i;
            championshipTableRingRow.find('.' + ringClassName).val(ringTypeIndex).attr('readonly', true);
            kittenTableRingRow.find('.' + ringClassName).val(ringTypeIndex).attr('readonly', true);
            premiershipTableRingRow.find('.' + ringClassName).val(ringTypeIndex).attr('readonly', true);

            championshipTableJudgeRow.find('.' + judgeClassName).val(judgeAcronym).attr('readonly', true);
            kittenTableJudgeRow.find('.' + judgeClassName).val(judgeAcronym).attr('readonly', true);
            premiershipTableJudgeRow.find('.' + judgeClassName).val(judgeAcronym).attr('readonly', true);

            championshipTableTypeRow.find('.' + typeClassName).val('Shorthair').attr('readonly', true);
            kittenTableTypeRow.find('.' + typeClassName).val('Shorthair').attr('readonly', true);
            premiershipTableTypeRow.find('.' + typeClassName).val('Shorthair').attr('readonly', true);
            i++;
        } else {
            championshipTableRingRow.find('.' + ringClassName).val(ringTypeIndex).attr('readonly', true);
            kittenTableRingRow.find('.' + ringClassName).val(ringTypeIndex).attr('readonly', true);
            premiershipTableRingRow.find('.' + ringClassName).val(ringTypeIndex).attr('readonly', true);

            championshipTableJudgeRow.find('.' + judgeClassName).val(judgeAcronym).attr('readonly', true);
            kittenTableJudgeRow.find('.' + judgeClassName).val(judgeAcronym).attr('readonly', true);
            premiershipTableJudgeRow.find('.' + judgeClassName).val(judgeAcronym).attr('readonly', true);

            championshipTableTypeRow.find('.' + typeClassName).val(ringType).attr('readonly', true);
            kittenTableTypeRow.find('.' + typeClassName).val(ringType).attr('readonly', true);
            premiershipTableTypeRow.find('.' + typeClassName).val(ringType).attr('readonly', true);
            i++;
        }
    });
}

/**
 * 根据裁判数量动态生成裁判信息行
 */
function updateJudgeInformation() {
    const numJudges = parseInt(document.getElementById('numberOfJudges').value);
    const judgeInfoTable = document.getElementById('judgeInfoTable').getElementsByTagName('tbody')[0];
    const judgeInfoTableHead = document.getElementById('judgeInfoTableHead');
    const championshipTableBody = document.getElementById('championshipTableBody');
    const kittenTableBody = document.getElementById('kittenTableBody');
    const premiershipTableBody = document.getElementById('premiershipTableBody');
    
    // 控制表头的显示/隐藏
    if (numJudges > 0) {
        judgeInfoTableHead.style.display = 'table-header-group';
    } else {
        judgeInfoTableHead.style.display = 'none';
    }
    
    // 获取当前表格中的行数
    const currentRows = judgeInfoTable.getElementsByTagName('tr');
    const currentRowCount = currentRows.length;
    
    // 保存现有的裁判信息
    const existingJudgeInfo = [];
    for (let i = 0; i < currentRowCount; i++) {
        const row = currentRows[i];
        const judgeName = row.querySelector('input[type="text"]').value;
        const judgeAcronym = row.getElementsByTagName('td')[2].querySelector('input').value;
        const ringType = row.querySelector('select').value;
        existingJudgeInfo.push({
            judgeName: judgeName,
            judgeAcronym: judgeAcronym,
            ringType: ringType
        });
    }

    // 清除表格内容
    championshipTableBody.innerHTML = '';
    kittenTableBody.innerHTML = '';
    premiershipTableBody.innerHTML = '';

    if (numJudges > 0) {
        // 调整Judge Information表格的行数
        if (numJudges > currentRowCount) {
            // 需要添加行
            for (let i = currentRowCount + 1; i <= numJudges; i++) {
                const row = document.createElement('tr');
                row.id = `row${i}`;

                // Auto index cell
                const indexCell = document.createElement('td');
                indexCell.textContent = i;

                // Judge Name cell
                const judgeNameCell = document.createElement('td');
                const judgeNameInput = document.createElement('input');
                judgeNameInput.type = 'text';
                judgeNameInput.placeholder = 'Judge Name';
                judgeNameInput.maxLength = 120;
                judgeNameInput.onchange = function() {
                    fillBaseInfo();
                }
                judgeNameCell.appendChild(judgeNameInput);

                // Judge Acronym cell
                const judgeAcronymCell = document.createElement('td');
                const judgeAcronymInput = document.createElement('input');
                judgeAcronymInput.type = 'text';
                judgeAcronymInput.placeholder = 'Acronym';
                judgeAcronymInput.maxLength = 6;
                judgeAcronymInput.onchange = function() {
                    fillBaseInfo();
                }
                judgeAcronymCell.appendChild(judgeAcronymInput);

                // Ring Type cell
                const ringTypeCell = document.createElement('td');
                const ringTypeSelect = document.createElement('select');
                const allbreedOption = document.createElement('option');
                allbreedOption.value = 'Allbreed';
                allbreedOption.textContent = 'Allbreed';
                const doubleSpecialtyOption = document.createElement('option');
                doubleSpecialtyOption.value = 'Double Specialty';
                doubleSpecialtyOption.textContent = 'Double Specialty';
                const longhairOption = document.createElement('option');
                longhairOption.value = 'Longhair';
                longhairOption.textContent = 'Longhair';
                const shorthairOption = document.createElement('option');
                shorthairOption.value = 'Shorthair';
                shorthairOption.textContent = 'Shorthair';

                ringTypeSelect.appendChild(allbreedOption);
                ringTypeSelect.appendChild(doubleSpecialtyOption);
                ringTypeSelect.appendChild(longhairOption);
                ringTypeSelect.appendChild(shorthairOption);
                ringTypeSelect.value = 'Allbreed'; // Default to Allbreed
                ringTypeSelect.onchange = function() {
                    fillBaseInfo();
                }
                ringTypeCell.appendChild(ringTypeSelect);

                // Append the cells to the new row
                row.appendChild(indexCell);
                row.appendChild(judgeNameCell);
                row.appendChild(judgeAcronymCell);
                row.appendChild(ringTypeCell);

                // Add the new row to the Judge Information Table body
                judgeInfoTable.appendChild(row);
            }
        } else if (numJudges < currentRowCount) {
            // 需要删除行
            while (judgeInfoTable.rows.length > numJudges) {
                judgeInfoTable.deleteRow(judgeInfoTable.rows.length - 1);
            }
        }
        
        // 恢复已有的裁判信息
        for (let i = 0; i < Math.min(numJudges, existingJudgeInfo.length); i++) {
            const row = judgeInfoTable.rows[i];
            row.querySelector('input[type="text"]').value = existingJudgeInfo[i].judgeName;
            row.getElementsByTagName('td')[2].querySelector('input').value = existingJudgeInfo[i].judgeAcronym;
            row.querySelector('select').value = existingJudgeInfo[i].ringType;
        }

        let totalColumns = 0;
        
        // 计算总列数
        const rows = judgeInfoTable.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const ringTypeSelect = rows[i].querySelector('select');
            const selectedRingType = ringTypeSelect.value;

            if (selectedRingType === 'Allbreed') {
                totalColumns += 1;
            } else if (selectedRingType === 'Double Specialty') {
                totalColumns += 2;
            } else if (selectedRingType === 'Longhair' || selectedRingType === 'Shorthair') {
                totalColumns += 1;
            }
            
            // 添加事件监听器
            ringTypeSelect.addEventListener('change', function() {
                updateColumnBasedOnRingType();
            });
        }

        // Generate Championship, Kitten, and Premiership table rows dynamically based on the # of Judges input
        const championshipRows = 33;
        const rowHeaders = ['Ring #', 'Judge', 'Type', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11*', '12*', '13*', '14*', '15*', 'Best CH', '2nd CH', '3rd CH', '4th CH', '5th CH', 'Best LH CH', '2nd LH CH', '3rd LH CH', '4th LH CH', '5th LH CH', 'Best SH CH', '2nd SH CH', '3rd SH CH', '4th SH CH', '5th SH CH'];
        const kittenRows = 18;
        const kittenRowHeaders = ['Ring #', 'Judge', 'Type', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11*', '12*', '13*', '14*', '15*'];
        const premiershipRows = 27;
        const premiershipRowHeaders = ['Ring #', 'Judge', 'Type', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11*', '12*', '13*', '14*', '15*', 'Best PR', '2nd Best PR', '3rd Best PR', 'Best LH PR', '2nd LH PR', '3rd LH PR', 'Best SH PR', '2nd SH PR', '3rd SH PR'];
        generateTableRows(championshipTableBody, championshipRows, rowHeaders, totalColumns);
        generateTableRows(kittenTableBody, kittenRows, kittenRowHeaders, totalColumns);
        generateTableRows(premiershipTableBody, premiershipRows, premiershipRowHeaders, totalColumns);
        fillBaseInfo();
    } else {
        judgeInfoTable.innerHTML = '';  // 当裁判数为0时清空
        championshipTableBody.innerHTML = ''; // 当没有裁判时清空冠军组表格
        kittenTableBody.innerHTML = ''; // 当没有裁判时清空幼猫组表格
        premiershipTableBody.innerHTML = ''; // 当没有裁判时清空绝育组表格
    }
}

/**
 * 生成冠军组、幼猫组和绝育组表格的行
 * @param {HTMLElement} tableBody - 表格体元素
 * @param {number} rows - 行数
 * @param {Array} rowHeaders - 行标题数组
 * @param {number} totalColumns - 总列数
 */
function generateTableRows(tableBody, rows, rowHeaders, totalColumns) {
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
            judgeCell.appendChild(judgeInput);
            row.appendChild(judgeCell);
        }

        tableBody.appendChild(row);
    }
}

/**
 * 处理裁判环类型变更并更新列计算
 */
function updateColumnBasedOnRingType() {
    const judgeInfoTable = document.getElementById('judgeInfoTable').getElementsByTagName('tbody')[0];
    const championshipTableBody = document.getElementById('championshipTableBody');
    const kittenTableBody = document.getElementById('kittenTableBody');
    const premiershipTableBody = document.getElementById('premiershipTableBody');
    
    let totalColumns = 0;
    
    // 遍历裁判信息表中的每个裁判并计算总列数
    const rows = judgeInfoTable.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const ringTypeSelect = rows[i].querySelector('select');
        const selectedRingType = ringTypeSelect.value;

        if (selectedRingType === 'Allbreed') {
            totalColumns += 1;
        } else if (selectedRingType === 'Double Specialty') {
            totalColumns += 2;
        } else if (selectedRingType === 'Longhair' || selectedRingType === 'Shorthair') {
            totalColumns += 1;
        }
    }
    
    // 清除现有的冠军组和幼猫组表格体
    championshipTableBody.innerHTML = '';
    kittenTableBody.innerHTML = '';
    premiershipTableBody.innerHTML = '';

    // 使用新的总列数生成冠军组、幼猫组和绝育组表格
    const championshipRows = 33;
    const rowHeaders = ['Ring #', 'Judge', 'Type', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11*', '12*', '13*', '14*', '15*', 'Best CH', '2nd CH', '3rd CH', '4th CH', '5th CH', 'Best LH CH', '2nd LH CH', '3rd LH CH', '4th LH CH', '5th LH CH', 'Best SH CH', '2nd SH CH', '3rd SH CH', '4th SH CH', '5th SH CH'];
    const kittenRows = 18;
    const kittenRowHeaders = ['Ring #', 'Judge', 'Type', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11*', '12*', '13*', '14*', '15*'];
    const premiershipRows = 27;
    const premiershipRowHeaders = ['Ring #', 'Judge', 'Type', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11*', '12*', '13*', '14*', '15*', 'Best PR', '2nd Best PR', '3rd Best PR', 'Best LH PR', '2nd LH PR', '3rd LH PR', 'Best SH PR', '2nd SH PR', '3rd SH PR'];
    generateTableRows(championshipTableBody, championshipRows, rowHeaders, totalColumns);
    generateTableRows(kittenTableBody, kittenRows, kittenRowHeaders, totalColumns);
    generateTableRows(premiershipTableBody, premiershipRows, premiershipRowHeaders, totalColumns);
    fillBaseInfo();
}

/**
 * 切换标签页
 * @param {string} tabId - 要显示的标签页ID
 */
function switchTab(tabId) {
    // 当尝试切换到Championship、Kitten或Premiership标签时，检查Judge Information
    if (tabId === 'championship' || tabId === 'kitten' || tabId === 'premiership') {
        // 检查裁判数量是否已设置
        const numberOfJudges = document.getElementById('numberOfJudges').value;
        if (!numberOfJudges || numberOfJudges <= 0) {
            alert('Please set # of judges');
            return;
        }
        
        // 检查所有裁判信息是否填写完整
        const judgeRows = document.getElementById('judgeInfoTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        for (let i = 0; i < judgeRows.length; i++) {
            const judgeName = judgeRows[i].getElementsByTagName('td')[1].querySelector('input').value;
            if (!judgeName) {
                alert(`Please fill the name of judge #${i+1}`);
                return;
            }
            
            // 检查裁判缩写
            const judgeAcronym = judgeRows[i].getElementsByTagName('td')[2].querySelector('input').value;
            if (!judgeAcronym) {
                alert(`Plase fill the acronym of judge #${i+1}`);
                return;
            }
        }
    }

    const tabs = document.querySelectorAll('.tab-content');
    const tabLinks = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.classList.remove('active-tab');
    });

    tabLinks.forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active-tab');
    const activeLink = Array.from(tabLinks).find(link => link.textContent.toLowerCase() === tabId);
    if (activeLink) activeLink.classList.add('active');
}
