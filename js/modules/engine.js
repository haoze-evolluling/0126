/**
 * 诊断引擎模块
 * 核心测速逻辑、批量测试管理、状态更新
 */

const engine = {
    samples: 5,
    results: [],
    isRunning: false,
    
    setSamples(n) {
        if (this.isRunning) return;
        this.samples = n;
        
        // Update UI buttons
        document.querySelectorAll('.sample-btn').forEach(btn => {
            if (parseInt(btn.dataset.n) === n) {
                btn.classList.add('bg-ink', 'text-paper');
            } else {
                btn.classList.remove('bg-ink', 'text-paper');
            }
        });
    },

    async measureSite(site) {
        const times = [];
        const errors = [];
        let handshakeTime = 0;
        
        // Update UI current target
        const nameEl = document.getElementById('current-site-name');
        const urlEl = document.getElementById('current-site-url');
        const statusEl = document.getElementById('current-status');
        
        if (nameEl) nameEl.textContent = site.name;
        if (urlEl) urlEl.textContent = site.url;
        if (statusEl) statusEl.className = 'w-3 h-3 rounded-full bg-amber-500 testing-pulse relative';
        
        for (let i = 0; i < this.samples; i++) {
            const sampleEl = document.getElementById('sample-num');
            if (sampleEl) sampleEl.textContent = i + 1;
            
            const start = performance.now();
            let success = false;
            
            try {
                // Use Image loading to bypass CORS
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    const timeout = setTimeout(() => reject('timeout'), 10000);
                    
                    img.onload = () => {
                        clearTimeout(timeout);
                        success = true;
                        resolve();
                    };
                    
                    img.onerror = () => {
                        clearTimeout(timeout);
                        success = true; // CORS error still means server reached
                        resolve();
                    };
                    
                    // Try favicon with cache buster
                    const testUrl = `${site.url}/favicon.ico?cb=${Date.now()}${Math.random()}`;
                    img.src = testUrl;
                });
                
                const elapsed = performance.now() - start;
                times.push(elapsed);
                handshakeTime = elapsed * 0.3; // Estimate handshake as 30%
                viz.addPoint(elapsed);
                
            } catch (e) {
                times.push(10000); // Timeout penalty
                errors.push(10000);
                viz.addPoint(10000);
            }
            
            // Small delay between samples
            await new Promise(r => setTimeout(r, 200));
        }
        
        // Calculate metrics
        const validTimes = times.filter(t => t < 10000);
        const avg = validTimes.length ? 
            validTimes.reduce((a, b) => a + b, 0) / validTimes.length : 9999;
        const min = validTimes.length ? Math.min(...validTimes) : 9999;
        const max = validTimes.length ? Math.max(...validTimes) : 9999;
        const jitter = validTimes.length > 1 ? 
            validTimes.slice(1).map((t, i) => Math.abs(t - validTimes[i]))
                .reduce((a, b) => a + b, 0) / (validTimes.length - 1) : 0;
        const loss = ((this.samples - validTimes.length) / this.samples) * 100;
        
        // Update current display
        this.updateCurrentDisplay(avg, jitter, loss, handshakeTime);
        
        return {
            name: site.name,
            url: site.url,
            avg,
            min,
            max,
            jitter,
            loss,
            handshake: handshakeTime,
            samples: times
        };
    },
    
    updateCurrentDisplay(avg, jitter, loss, handshake) {
        const latencyEl = document.getElementById('current-latency');
        const jitterEl = document.getElementById('current-jitter');
        const lossEl = document.getElementById('current-loss');
        const handshakeEl = document.getElementById('current-handshake');
        const statusEl = document.getElementById('current-status');
        
        if (latencyEl) latencyEl.textContent = Math.round(avg);
        if (jitterEl) jitterEl.textContent = Math.round(jitter) + 'ms';
        if (lossEl) lossEl.textContent = loss.toFixed(0) + '%';
        if (handshakeEl) handshakeEl.textContent = Math.round(handshake) + 'ms';
        
        // Color coding
        let colorClass = 'text-emerald-600';
        if (avg > 100) colorClass = 'text-blue-600';
        if (avg > 300) colorClass = 'text-amber-500';
        if (avg > 500 || loss > 0) colorClass = 'text-red-600';
        
        if (latencyEl) {
            latencyEl.className = `data-display text-8xl font-black leading-none tracking-tighter ${colorClass}`;
        }
        
        if (statusEl) {
            const statusColor = loss > 50 ? 'bg-red-600' : colorClass.replace('text-', 'bg-');
            statusEl.className = `w-3 h-3 rounded-full ${statusColor} relative`;
        }
    },

    async start() {
        if (this.isRunning) return;
        
        const selected = selector.getSelected();
        if (selected.length === 0) {
            alert('请至少选择一个站点');
            return;
        }
        
        this.isRunning = true;
        this.results = [];
        viz.clear();
        
        // Update start button
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> 测试中...';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        
        // Show progress
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) progressContainer.classList.remove('hidden');
        
        const batchSize = 5; // Concurrent limit
        
        for (let i = 0; i < selected.length; i += batchSize) {
            const batch = selected.slice(i, i + batchSize);
            
            await Promise.all(batch.map(async (site) => {
                const result = await this.measureSite(site);
                this.results.push(result);
            }));
            
            // Update progress
            const progress = Math.min((i + batchSize) / selected.length, 1);
            const bar = document.getElementById('progress-bar');
            const text = document.getElementById('progress-text');
            
            if (bar) bar.style.width = (progress * 100) + '%';
            if (text) text.textContent = Math.min(i + batchSize, selected.length) + '/' + selected.length;
            
            // Update charts
            viz.drawBarChart(this.results);
            this.updateStats();
        }
        
        // Clean up
        const statusEl = document.getElementById('current-status');
        if (statusEl) statusEl.classList.remove('testing-pulse');
        
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.innerHTML = '<i data-lucide="activity" class="w-5 h-5"></i> 开始诊断';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        
        this.isRunning = false;
    },

    updateStats() {
        if (this.results.length === 0) return;
        
        const avgs = this.results.map(r => r.avg);
        const overallAvg = avgs.reduce((a, b) => a + b, 0) / avgs.length;
        const min = Math.min(...avgs);
        const max = Math.max(...avgs);
        const fastest = this.results.find(r => r.avg === min);
        const slowest = this.results.find(r => r.avg === max);
        const successRate = this.results.filter(r => r.loss < 50).length / this.results.length * 100;
        
        // Health score (0-100)
        let score = 100;
        if (overallAvg > 100) score -= 10;
        if (overallAvg > 300) score -= 20;
        if (overallAvg > 500) score -= 30;
        score -= (100 - successRate) * 0.5;
        score = Math.max(0, Math.min(100, score));
        
        // Update DOM
        this.updateStatElement('stat-avg', Math.round(overallAvg));
        this.updateStatElement('stat-min', Math.round(min), 'text-emerald-600');
        this.updateStatElement('stat-max', Math.round(max), 'text-red-600');
        this.updateStatElement('stat-success', successRate.toFixed(0), 'text-blue-600');
        
        const minNameEl = document.getElementById('stat-min-name');
        const maxNameEl = document.getElementById('stat-max-name');
        if (minNameEl) minNameEl.textContent = fastest.name;
        if (maxNameEl) maxNameEl.textContent = slowest.name;
        
        const scoreEl = document.getElementById('health-score');
        if (scoreEl) scoreEl.textContent = Math.round(score);
        
        viz.drawGauge(score);
        
        let verdict = '网络状况极佳';
        if (score < 80) verdict = '网络状况良好';
        if (score < 60) verdict = '网络状况一般';
        if (score < 40) verdict = '网络状况较差';
        
        const verdictEl = document.getElementById('health-verdict');
        if (verdictEl) verdictEl.textContent = verdict;
    },
    
    updateStatElement(id, value, colorClass) {
        const el = document.getElementById(id);
        if (!el) return;
        
        el.textContent = value;
        if (colorClass) {
            el.className = `data-display text-3xl font-bold ${colorClass}`;
        }
    }
};