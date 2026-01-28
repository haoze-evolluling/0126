/**
 * 可视化模块
 * 负责所有 Canvas 图表渲染：波形图、柱状图、仪表盘
 */

const viz = {
    waveform: [],
    maxPoints: 100, // 支持10次采样 x 多站点
    
    addPoint(val) {
        this.waveform.push(val);
        if (this.waveform.length > this.maxPoints) {
            this.waveform.shift();
        }
        this.drawWaveform();
    },

    drawWaveform() {
        const canvas = document.getElementById('waveform-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        
        ctx.clearRect(0, 0, w, h);
        
        if (this.waveform.length < 2) return;
        
        ctx.beginPath();
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 1.5;
        
        const maxVal = Math.max(...this.waveform, 1000);
        const step = w / (this.maxPoints - 1);
        
        this.waveform.forEach((val, i) => {
            const x = i * step;
            const y = h - (val / maxVal) * (h - 20) - 10;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        
        ctx.stroke();
        
        // Draw baseline
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(26,26,26,0.1)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, h - 10);
        ctx.lineTo(w, h - 10);
        ctx.stroke();
    },

  drawBarChart(results) {
    const canvas = document.getElementById('barchart-canvas');
    if (!canvas || !results || results.length === 0) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    
    // 固定柱状图高度，根据数据量计算 canvas 总高度
    const fixedBarHeight = 40; // 每个柱状图固定高度
    const barSpacing = 16; // 柱状图间距
    const topPadding = 40; // 顶部留白
    const bottomPadding = 20; // 底部留白
    const h = results.length * (fixedBarHeight + barSpacing) + topPadding + bottomPadding;
    
    // 设置 canvas 高度
    canvas.height = h;
    canvas.style.height = h + 'px';
    
    ctx.clearRect(0, 0, w, h);

    const sorted = [...results].sort((a, b) => a.avg - b.avg);
    const maxVal = Math.max(...sorted.map(r => r.avg), 1000);
    const maxBarWidth = w - 160; // 右侧留出更多空间显示数值

    sorted.forEach((res, i) => {
      const y = i * (fixedBarHeight + barSpacing) + topPadding + fixedBarHeight / 2;
      const barW = (res.avg / maxVal) * maxBarWidth;

      // Color based on latency
      let color = '#059669'; // emerald
      if (res.avg > 100) color = '#2563EB'; // blue
      if (res.avg > 300) color = '#F59E0B'; // amber
      if (res.avg > 500) color = '#DC2626'; // red

      // Draw bar (outline style per magazine spec)
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(120, y - fixedBarHeight / 2 + 4, barW, fixedBarHeight - 8);

      // Fill with transparency
      ctx.fillStyle = color + '33'; // 20% opacity
      ctx.fillRect(120, y - fixedBarHeight / 2 + 4, barW, fixedBarHeight - 8);

      // Site name - 右对齐，更清晰
      ctx.fillStyle = '#1A1A1A';
      ctx.font = '600 13px Inter, "Noto Sans SC", sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(res.name, 110, y);

      // Latency value - 加粗显示
      ctx.textAlign = 'left';
      ctx.font = 'bold 13px Inter, "Noto Sans SC", sans-serif';
      ctx.fillStyle = color;
      ctx.fillText(Math.round(res.avg) + ' ms', 120 + barW + 12, y);
    });
  },

    drawGauge(score) {
        const canvas = document.getElementById('gauge-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = 80;
        
        ctx.clearRect(0, 0, w, h);
        
        // Background arc
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
        ctx.strokeStyle = 'rgba(26,26,26,0.1)';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Value arc
        const angle = Math.PI * 0.75 + (score / 100) * (Math.PI * 1.5);
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * 0.75, angle);
        
        // Color based on score
        let color = '#DC2626';
        if (score > 25) color = '#F59E0B';
        if (score > 50) color = '#2563EB';
        if (score > 75) color = '#059669';
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.stroke();
    },
    
    clear() {
        this.waveform = [];
        this.drawWaveform();
    }
};