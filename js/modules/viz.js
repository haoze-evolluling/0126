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
        const h = canvas.height;
        
        ctx.clearRect(0, 0, w, h);
        
        const sorted = [...results].sort((a, b) => a.avg - b.avg);
        const maxVal = Math.max(...sorted.map(r => r.avg), 1000);
        const barHeight = (h - 60) / sorted.length;
        const maxBarWidth = w - 150;
        
        sorted.forEach((res, i) => {
            const y = i * barHeight + 30;
            const barW = (res.avg / maxVal) * maxBarWidth;
            
            // Color based on latency
            let color = '#059669'; // emerald
            if (res.avg > 100) color = '#2563EB'; // blue
            if (res.avg > 300) color = '#F59E0B'; // amber
            if (res.avg > 500) color = '#DC2626'; // red
            
            // Draw bar (outline style per magazine spec)
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeRect(100, y - barHeight / 2 + 5, barW, barHeight - 10);
            
            // Fill with transparency
            ctx.fillStyle = color + '33'; // 20% opacity
            ctx.fillRect(100, y - barHeight / 2 + 5, barW, barHeight - 10);
            
            // Text
            ctx.fillStyle = '#1A1A1A';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(res.name, 90, y + 4);
            
            ctx.textAlign = 'left';
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillText(Math.round(res.avg) + 'ms', 100 + barW + 8, y + 4);
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