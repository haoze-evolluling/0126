/**
 * 可视化模块
 * 负责所有图表渲染：波形图、柱状图、仪表盘
 * 革新版：卡片式对比分析展示
 */

const viz = {
    waveform: [],
    maxPoints: 100,
    
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
        
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(26,26,26,0.1)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, h - 10);
        ctx.lineTo(w, h - 10);
        ctx.stroke();
    },

    getLatencyClass(avg) {
        if (avg < 100) return 'excellent';
        if (avg < 300) return 'good';
        if (avg < 500) return 'average';
        return 'poor';
    },

    getLatencyColor(avg) {
        if (avg < 100) return '#059669';
        if (avg < 300) return '#2563EB';
        if (avg < 500) return '#F59E0B';
        return '#DC2626';
    },

    getRankClass(index) {
        if (index === 0) return 'gold';
        if (index === 1) return 'silver';
        if (index === 2) return 'bronze';
        return '';
    },

    getRankLabel(index) {
        return index + 1;
    },

    showSkeleton() {
        const skeleton = document.getElementById('comparison-skeleton');
        const grid = document.getElementById('comparison-grid');
        const summary = document.getElementById('comparison-summary');
        
        if (skeleton) skeleton.classList.remove('hidden');
        if (grid) grid.classList.add('hidden');
        if (summary) summary.classList.add('hidden');
    },

    hideSkeleton() {
        const skeleton = document.getElementById('comparison-skeleton');
        const grid = document.getElementById('comparison-grid');
        
        if (skeleton) skeleton.classList.add('hidden');
        if (grid) grid.classList.remove('hidden');
    },

    showSummary() {
        const summary = document.getElementById('comparison-summary');
        if (summary) summary.classList.remove('hidden');
    },

    drawBarChart(results) {
        const grid = document.getElementById('comparison-grid');
        if (!grid) return;

        if (!results || results.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideSkeleton();
        this.showSummary();

        const sorted = [...results].sort((a, b) => a.avg - b.avg);
        const maxVal = Math.max(...sorted.map(r => r.avg), 1000);
        
        this.updateSummary(sorted);
        this.updateCount(results.length);

        grid.innerHTML = sorted.map((res, index) => {
            const latencyClass = this.getLatencyClass(res.avg);
            const latencyColor = this.getLatencyColor(res.avg);
            const rankClass = this.getRankClass(index);
            const percentage = Math.min((res.avg / maxVal) * 100, 100);
            
            return `
                <div class="comparison-card ${latencyClass}" data-site="${res.name}" onclick="viz.toggleDetails(this)">
                    <div class="comparison-rank ${rankClass}">${this.getRankLabel(index)}</div>
                    <div class="comparison-site">
                        <span class="comparison-site-name">${res.name}</span>
                        <span class="comparison-site-domain">${res.url || ''}</span>
                    </div>
                    <div class="comparison-progress">
                        <div class="comparison-progress-bar">
                            <div class="comparison-progress-fill" style="width: ${percentage}%; background: ${latencyColor}"></div>
                        </div>
                        <div class="comparison-progress-text">
                            <span>0ms</span>
                            <span>${maxVal}ms</span>
                        </div>
                    </div>
                    <div class="comparison-latency">
                        <span class="comparison-latency-value" style="color: ${latencyColor}">${Math.round(res.avg)}</span>
                        <span class="comparison-latency-unit">毫秒</span>
                    </div>
                    <div class="comparison-details">
                        <div class="comparison-details-grid">
                            <div class="comparison-detail-item">
                                <div class="comparison-detail-label">平均延迟</div>
                                <div class="comparison-detail-value">${Math.round(res.avg)} ms</div>
                            </div>
                            <div class="comparison-detail-item">
                                <div class="comparison-detail-label">最小延迟</div>
                                <div class="comparison-detail-value">${Math.round(res.min)} ms</div>
                            </div>
                            <div class="comparison-detail-item">
                                <div class="comparison-detail-label">最大延迟</div>
                                <div class="comparison-detail-value">${Math.round(res.max)} ms</div>
                            </div>
                            <div class="comparison-detail-item">
                                <div class="comparison-detail-label">抖动</div>
                                <div class="comparison-detail-value">${Math.round(res.jitter || 0)} ms</div>
                            </div>
                            <div class="comparison-detail-item">
                                <div class="comparison-detail-label">丢包率</div>
                                <div class="comparison-detail-value">${res.loss || 0}%</div>
                            </div>
                            <div class="comparison-detail-item">
                                <div class="comparison-detail-label">成功次数</div>
                                <div class="comparison-detail-value">${res.success}/${res.total}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.triggerAnimations();
    },

    updateSummary(sorted) {
        if (sorted.length === 0) return;
        
        const bestSite = document.getElementById('best-site');
        const worstSite = document.getElementById('worst-site');
        const avgLatency = document.getElementById('avg-latency');
        const passRate = document.getElementById('pass-rate');
        
        if (bestSite) {
            bestSite.textContent = sorted[0].name;
        }
        if (worstSite) {
            worstSite.textContent = sorted[sorted.length - 1].name;
        }
        
        const avg = sorted.reduce((sum, r) => sum + r.avg, 0) / sorted.length;
        if (avgLatency) {
            avgLatency.textContent = Math.round(avg);
        }
        
        const passed = sorted.filter(r => r.avg < 300).length;
        const rate = (passed / sorted.length) * 100;
        if (passRate) {
            passRate.textContent = Math.round(rate) + '%';
        }
    },

    updateCount(count) {
        const countEl = document.getElementById('comparison-count');
        if (countEl) {
            countEl.textContent = count + ' 项';
        }
    },

    showEmptyState() {
        const grid = document.getElementById('comparison-grid');
        const skeleton = document.getElementById('comparison-skeleton');
        
        if (skeleton) skeleton.classList.add('hidden');
        
        if (grid) {
            grid.innerHTML = `
                <div class="comparison-empty">
                    <svg class="comparison-empty-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="8" y="8" width="48" height="48" rx="4"/>
                        <line x1="20" y1="24" x2="24" y2="24"/>
                        <line x1="20" y1="32" x2="44" y2="32"/>
                        <line x1="20" y1="40" x2="36" y2="40"/>
                    </svg>
                    <p class="comparison-empty-text">暂无对比数据</p>
                    <p class="text-xs text-ink/40 mt-2" style="font-size: 11px;">请选择站点并开始诊断</p>
                </div>
            `;
            grid.classList.remove('hidden');
        }
    },

    toggleDetails(card) {
        if (card) {
            card.classList.toggle('expanded');
        }
    },

    triggerAnimations() {
        const cards = document.querySelectorAll('.comparison-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = (index * 0.05) + 's';
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
        
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
        ctx.strokeStyle = 'rgba(26,26,26,0.1)';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        const angle = Math.PI * 0.75 + (score / 100) * (Math.PI * 1.5);
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * 0.75, angle);
        
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
        
        const grid = document.getElementById('comparison-grid');
        const skeleton = document.getElementById('comparison-skeleton');
        const summary = document.getElementById('comparison-summary');
        const countEl = document.getElementById('comparison-count');
        
        if (grid) grid.innerHTML = '';
        if (skeleton) skeleton.classList.remove('hidden');
        if (summary) summary.classList.add('hidden');
        if (countEl) countEl.textContent = '0 项';
    }
};