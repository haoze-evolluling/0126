/**
 * 站点选择器模块
 * 管理目标站点的选择/取消/全选/反选逻辑
 */

const selector = {
    selected: new Set(),
    
    init() {
        this.render();
        this.updateCount();
    },

    render() {
        const grid = document.getElementById('site-grid');
        if (!grid) return;
        
        grid.innerHTML = UNIQUE_SITES.map((site, idx) => `
            <label class="cursor-pointer group relative">
                <input type="checkbox" class="site-checkbox hidden" value="${idx}" 
                       ${this.selected.has(idx) ? 'checked' : ''} 
                       onchange="selector.toggle(${idx})">
                <div class="border border-ink/20 p-3 text-xs font-sans transition-all hover:border-ink/40 h-full flex flex-col justify-between min-h-[80px]">
                    <div class="flex justify-between items-start">
                        <i data-lucide="${site.icon}" class="w-4 h-4 opacity-50"></i>
                        <span class="text-[10px] uppercase tracking-wider opacity-40">${site.category}</span>
                    </div>
                    <div class="font-bold truncate mt-2 magazine-title text-sm">${site.name}</div>
                </div>
            </label>
        `).join('');
        
        // 重新初始化图标
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        this.updateCount();
    },

    toggle(idx) {
        if (this.selected.has(idx)) {
            this.selected.delete(idx);
        } else {
            this.selected.add(idx);
        }
        this.render();
    },

    selectAll() {
        UNIQUE_SITES.forEach((_, idx) => this.selected.add(idx));
        this.render();
    },

    selectNone() {
        this.selected.clear();
        this.render();
    },

    toggleCustom() {
        UNIQUE_SITES.forEach((_, idx) => {
            if (this.selected.has(idx)) {
                this.selected.delete(idx);
            } else {
                this.selected.add(idx);
            }
        });
        this.render();
    },

    getSelected() {
        return Array.from(this.selected).map(idx => UNIQUE_SITES[idx]);
    },
    
    updateCount() {
        const totalEl = document.getElementById('total-count');
        const selectedEl = document.getElementById('selected-count');
        if (totalEl) totalEl.textContent = UNIQUE_SITES.length;
        if (selectedEl) selectedEl.textContent = this.selected.size;
    }
};