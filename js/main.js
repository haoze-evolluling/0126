/**
 * 主入口文件
 * 初始化所有模块并设置全局事件
 */

document.addEventListener('DOMContentLoaded', () => {
    // 设置当前日期
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    }
    
    // 初始化 Lucide 图标
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // 初始化站点选择器（默认全选）
    selector.init();
    selector.selectAll();
    
    // 初始化可视化（空状态）
    viz.drawWaveform();
    viz.drawBarChart([]);
    viz.drawGauge(0);
    
    console.log('网络诊断工具已初始化');
});