/**
 * 表单验证脚本
 * 提供验证表单的功能
 */

/**
 * 验证表单数据
 * @returns {boolean} 表单是否通过验证
 */
function validateForm() {
    // 验证基本信息
    const showDate = document.getElementById('showDate').value;
    const clubName = document.getElementById('clubName').value;
    const masterClerkName = document.getElementById('masterClerkName').value;
    
    if (!showDate) {
        alert('请输入Show Date');
        return false;
    }
    
    if (!clubName) {
        alert('请输入Club Name');
        return false;
    }
    
    if (clubName.length > 255) {
        alert('Club Name不能超过255个字符');
        return false;
    }
    
    if (!masterClerkName) {
        alert('请输入Master Clerk Name');
        return false;
    }
    
    if (masterClerkName.length > 120) {
        alert('Master Clerk Name不能超过120个字符');
        return false;
    }
    
    // 验证裁判信息
    const judgeRows = document.getElementById('judgeInfoTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (let i = 0; i < judgeRows.length; i++) {
        const judgeName = judgeRows[i].getElementsByTagName('td')[1].querySelector('input').value;
        if (!judgeName) {
            alert(`请输入第${i+1}个裁判的姓名`);
            return false;
        }
        
        if (judgeName.length > 120) {
            alert(`第${i+1}个裁判的姓名不能超过120个字符`);
            return false;
        }
        
        // 验证裁判缩写
        const judgeAcronym = judgeRows[i].getElementsByTagName('td')[2].querySelector('input').value;
        if (judgeAcronym && judgeAcronym.length > 6) {
            alert(`第${i+1}个裁判的缩写不能超过6个字符`);
            return false;
        }
    }
    
    return true;
}

/**
 * 强制输入值在最小值和最大值之间
 * @param {HTMLElement} el - 输入元素
 */
function enforceMinMax(el) {
    if (el.value != "") {
        if (parseInt(el.value) < parseInt(el.min)) {
            el.value = el.min;
        }
        if (parseInt(el.value) > parseInt(el.max)) {
            el.value = el.max;
        }
    }
}

/**
 * 获取当前日期字符串，格式为YYYYMMDDmmSS（年、月、日、分钟、秒）
 * @returns {string} 格式化的日期字符串
 */
function getDateStr() {
    const currentDate = new Date();
    const year = currentDate.getFullYear(); // 获取完整年份(YYYY)
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 获取月份(MM)，补零
    const day = currentDate.getDate().toString().padStart(2, '0'); // 获取日期(DD)，补零
    const minutes = currentDate.getMinutes().toString().padStart(2, '0'); // 获取分钟(mm)，补零
    const seconds = currentDate.getSeconds().toString().padStart(2, '0'); // 获取秒(SS)，补零
    return `${year}${month}${day}${minutes}${seconds}`; // 组合形成YYYYMMDDmmSS
}
