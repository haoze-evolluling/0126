/**
 * 数据导出模块
 * 支持 CSV 导出和剪贴板复制
 */

const exporter = {
    toCSV() {
        if (!engine.results || engine.results.length === 0) {
            alert('暂无数据，请先运行测试');
            return;
        }
        
        const headers = ['站点', 'URL', '平均延迟(ms)', '最小延迟', '最大延迟', '抖动', '丢包率(%)', '握手时间(ms)'];
        const rows = engine.results.map(r => [
            r.name, 
            r.url, 
            r.avg.toFixed(2), 
            r.min.toFixed(2), 
            r.max.toFixed(2), 
            r.jitter.toFixed(2), 
            r.loss.toFixed(2), 
            r.handshake.toFixed(2)
        ]);
        
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `网络诊断报告-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    },

    copySnapshot() {
        if (!engine.results || engine.results.length === 0) {
            alert('暂无数据');
            return;
        }
        
        const text = engine.results.map(r => 
            `${r.name}: ${Math.round(r.avg)}ms (丢包${r.loss.toFixed(0)}%)`
        ).join('\n');
        
        const avgEl = document.getElementById('stat-avg');
        const scoreEl = document.getElementById('health-score');
        
        const summary = `网络诊断报告 ${new Date().toLocaleDateString()}\n` +
                       `平均延迟: ${avgEl ? avgEl.textContent : '--'}ms\n` +
                       `健康指数: ${scoreEl ? scoreEl.textContent : '--'}/100\n\n` +
                       text;
        
        navigator.clipboard.writeText(summary).then(() => {
            alert('报告已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        });
    }
};