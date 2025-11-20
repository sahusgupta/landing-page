/* Rendering helpers for pages to read from PortfolioStore and render Projects/Experience */
(function(window){
  function createEl(tag, cls, text){
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text) el.textContent = text;
    return el;
  }

  function renderProjects(containerSelector){
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const data = window.PortfolioStore.getData();
    container.innerHTML = '';

    const grid = createEl('div','modern-grid');
    data.projects.forEach(p => {
      const card = createEl('article','card');
      const head = createEl('div','card-head');
      head.appendChild(createEl('h3',null,p.title));
      if (p.tech && p.tech.length) {
        const techwrap = createEl('div','tech-wrap');
        p.tech.forEach(t => {
          const tag = createEl('span','tag',t);
          techwrap.appendChild(tag);
        });
        head.appendChild(techwrap);
      }
      card.appendChild(head);
      card.appendChild(createEl('p','card-desc',p.description || ''));
      const foot = createEl('div','card-foot');
      if (p.links && p.links.length){
        p.links.forEach(l => {
          const a = createEl('a','btn',l.label || 'Link');
          a.href = l.href || '#';
          a.target = '_blank';
          foot.appendChild(a);
        });
      }
      card.appendChild(foot);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  function renderExperience(containerSelector){
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const data = window.PortfolioStore.getData();
    container.innerHTML = '';

    data.experience.forEach(e => {
      const block = createEl('div','exp-block');
      block.appendChild(createEl('h3',null,e.title));
      if (e.date) block.appendChild(createEl('div','exp-date',e.date));
      if (e.description) block.appendChild(createEl('p',null,e.description));
      if (e.bullets && e.bullets.length){
        const ul = createEl('ul','exp-list');
        e.bullets.forEach(b => { const li = createEl('li',null,b); ul.appendChild(li); });
        block.appendChild(ul);
      }
      container.appendChild(block);
    });
  }

  window.PFRender = {
    renderProjects,
    renderExperience
  };

})(window);
