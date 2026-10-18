      // Experience edition: local drafts, plain-text long form, portable JSON and HTML.
      const lifeKinds={education:'学习',practice:'实践',life:'生活'};
      const lifeLimits={title:140,period:80,place:200,summary:2000,body:30000,reflection:5000,tags:300,link:1500};
      let lifeFilter='all',lifeSelected=0,lifeExpanded=false,lifeScrollFrame=0;
      const lifeOpenEntries=new Set();
      function cleanLifeEntry(value,index){
        const source=value&&typeof value==='object'?value:{};
        const entry={id:'entry-'+index,kind:Object.hasOwn(lifeKinds,source.kind)?source.kind:'education',template:source.template===true};
        for(const [key,limit] of Object.entries(lifeLimits))entry[key]=typeof source[key]==='string'?source[key].slice(0,limit):'';
        return entry;
      }
      function lifeEntries(){return (Array.isArray(config.experiences)?config.experiences:[]).slice(0,60).map(cleanLifeEntry)}
      function lifeElement(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el}
      function lifeParagraphs(target,text){target.replaceChildren();String(text||'').split(/\n\s*\n/).filter(s=>s.trim()).forEach(paragraph=>target.append(lifeElement('p','',paragraph.trim())))}
      function renderLife(){
        $('story-title').textContent=String(config.lifeHeadline||'把经历，\n慢慢写成自己。');
        $('life-lead').textContent=String(config.lifeLead||'');lifeParagraphs($('life-about'),config.lifeAbout);
        $('life-signature-name').textContent=String(config.name||'冷玦清');
        $('journey-intro').textContent=String(config.journeyIntro||'');
        lifeParagraphs($('life-next'),config.lifeNext);$('next').hidden=!String(config.lifeNext||'').trim();
        contactLink('life-email',emailValid(String(config.email||'').trim())?'mailto:'+String(config.email).trim():null);
        contactLink('life-github',githubURL(String(config.github||'').trim()));
        const list=$('life-timeline'),entries=lifeEntries();list.replaceChildren();let visible=0;
        entries.forEach((entry,index)=>{
          if(lifeFilter!=='all'&&lifeFilter!==entry.kind)return;visible++;
          const item=lifeElement('li','timeline-item');item.dataset.lifeIndex=String(index);
          const meta=lifeElement('div','life-entry-meta');
          meta.append(lifeElement('span','life-entry-period',entry.period||'时间待填写'),lifeElement('span','life-entry-kind',lifeKinds[entry.kind]),lifeElement('span','life-entry-number',String(index+1).padStart(2,'0')));
          const sheet=lifeElement('article','life-entry-sheet');
          if(entry.template||entry.place){const flags=lifeElement('div','life-entry-flags');if(entry.template)flags.append(lifeElement('span','life-template-tag','待填写'));if(entry.place)flags.append(lifeElement('span','',entry.place));sheet.append(flags)}
          const heading=lifeElement('h3','',entry.title||'尚未命名的经历');heading.id='life-entry-title-'+index;sheet.setAttribute('aria-labelledby',heading.id);sheet.append(heading);
          if(entry.summary)sheet.append(lifeElement('p','life-summary',entry.summary));
          if(entry.tags){const tags=lifeElement('div','life-tags');entry.tags.split(/[,，、]/).map(s=>s.trim()).filter(Boolean).slice(0,12).forEach(tag=>tags.append(lifeElement('span','',tag)));sheet.append(tags)}
          const href=safeProjectURL(entry.link);
          if(entry.body.trim()||entry.reflection.trim()){
            const details=lifeElement('details',''),summary=lifeElement('summary','');
            const count=(entry.body+entry.reflection).replace(/\s/g,'').length;
            summary.append(lifeElement('span','','阅读这段经历'),lifeElement('small','',Math.max(1,Math.ceil(count/400))+' 分钟'));
            const prose=lifeElement('div','life-prose');lifeParagraphs(prose,entry.body);details.append(summary,prose);
            if(entry.reflection){const reflection=lifeElement('aside','life-reflection');reflection.append(lifeElement('span','life-reflection-label','这一程的收获'));const copy=lifeElement('div','life-prose');lifeParagraphs(copy,entry.reflection);reflection.append(copy);details.append(reflection)}
            if(href){const link=lifeElement('a','life-entry-link','相关作品 / 记录 ↗');link.href=href;link.target='_blank';link.rel='noopener noreferrer';details.append(link)}
            details.open=lifeExpanded||lifeOpenEntries.has(index);
            details.addEventListener('toggle',()=>{if(!details.isConnected)return;if(details.open)lifeOpenEntries.add(index);else lifeOpenEntries.delete(index);syncLifeExpandedButton()});
            sheet.append(details);
          }else if(href){const link=lifeElement('a','life-entry-link','相关作品 / 记录 ↗');link.href=href;link.target='_blank';link.rel='noopener noreferrer';sheet.append(link)}
          item.append(meta,sheet);list.append(item);
        });
        $('life-empty').hidden=visible>0;$('life-filter-status').textContent='显示 '+visible+' 段'+(lifeFilter==='all'?'':lifeKinds[lifeFilter])+'经历';
        syncLifeExpandedButton();requestLifeReadingUpdate();
      }
      function syncLifeExpandedButton(){
        const all=[...$('life-timeline').querySelectorAll('details')],expanded=all.length>0&&all.every(el=>el.open);
        $('life-expand-all').setAttribute('aria-expanded',String(expanded));$('life-expand-all').textContent=expanded?'收起全部 ↑':'展开全部 ↓';$('life-expand-all').disabled=all.length===0;
      }
      function populateLifeEditor(){
        const entries=lifeEntries();lifeSelected=Math.max(0,Math.min(lifeSelected,entries.length-1));const select=$('life-entry-select');select.replaceChildren();
        entries.forEach((entry,index)=>{const option=lifeElement('option','',String(index+1).padStart(2,'0')+' · '+(entry.title||'未命名经历'));option.value=String(index);select.append(option)});
        select.disabled=!entries.length;select.value=String(lifeSelected);$('life-entry-fields').hidden=!entries.length;
        const entry=entries[lifeSelected];document.querySelectorAll('[data-life-field]').forEach(input=>{const value=entry?.[input.dataset.lifeField];if(input.type==='checkbox')input.checked=value===true;else input.value=value||''});
        $('life-up').disabled=!entries.length||lifeSelected===0;$('life-down').disabled=!entries.length||lifeSelected===entries.length-1;$('life-delete').disabled=!entries.length;$('life-add').disabled=entries.length>=60;
        syncLifeLinkError();
      }
      function syncLifeLinkError(){const value=$('life-link-input').value.trim(),invalid=Boolean(value&&!safeProjectURL(value));$('life-link-error').textContent=invalid?'请输入 http:// 或 https:// 链接；无效链接不会展示。':'';$('life-link-input').setAttribute('aria-invalid',String(invalid))}
      function commitLifeEntries(entries,message){config.experiences=entries;lifeOpenEntries.clear();lifeExpanded=false;populateLifeEditor();renderLife();save();$('life-edit-status').textContent=message}
      function lifeDownload(name,value,type){const url=URL.createObjectURL(new Blob([value],{type}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}
      function lifeDocument(){const content={};for(const key of ['lifeHeadline','lifeLead','lifeAbout','journeyIntro','lifeNext'])content[key]=String(config[key]||'');return {version:1,content,experiences:lifeEntries()}}
      function validateLifeDocument(value){
        if(!value||value.version!==1||!value.content||typeof value.content!=='object'||!Array.isArray(value.experiences)||value.experiences.length>60)throw new Error('请选择由本页导出的经历备份，最多 60 段经历。');
        const content={},limits={lifeHeadline:100,lifeLead:1500,lifeAbout:30000,journeyIntro:1500,lifeNext:15000};
        for(const [key,limit] of Object.entries(limits)){if(typeof value.content[key]!=='string'||value.content[key].length>limit)throw new Error('备份的长文内容格式或长度不正确。');content[key]=value.content[key]}
        for(const entry of value.experiences){if(!entry||typeof entry!=='object'||!Object.hasOwn(lifeKinds,entry.kind))throw new Error('备份中的经历类型不正确。');for(const [key,limit] of Object.entries(lifeLimits)){if(typeof entry[key]!=='string'||entry[key].length>limit)throw new Error('备份中的经历内容格式或长度不正确。')}}
        return {...content,experiences:value.experiences.map(cleanLifeEntry)};
      }
      function requestLifeReadingUpdate(){if(lifeScrollFrame)return;lifeScrollFrame=requestAnimationFrame(updateLifeReading)}
      function updateLifeReading(){
        lifeScrollFrame=0;const main=document.querySelector('.detail-content'),nav=$('life-reading-nav');if(!main||!nav)return;
        nav.hidden=document.body.dataset.view!=='details'||main.getBoundingClientRect().top>innerHeight*.7;
        const ids=['story','journey','skills','projects','interests'],anchor=innerHeight*.3;
        let active='story';for(const id of ids)if($(id).getBoundingClientRect().top<anchor)active=id;
        for(const link of nav.querySelectorAll('a')){if(link.hash==='#'+active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')}
        const start=main.offsetTop,range=Math.max(1,main.offsetHeight-innerHeight);nav.style.setProperty('--read-progress',Math.max(0,Math.min(100,(scrollY-start)/range*100))+'%');
      }
      function setupLife(){
        const baseRender=render;render=function(){baseRender();renderLife()};
        const basePopulate=populate;populate=function(){basePopulate();populateLifeEditor()};
        const baseSyncView=syncView;syncView=function(focusOpening=true){if(['#story','#journey','#next'].includes(location.hash)){document.body.dataset.view='details';clearBrush()}else baseSyncView(focusOpening);requestLifeReadingUpdate()};
        document.querySelectorAll('[data-life-filter]').forEach(button=>button.addEventListener('click',()=>{lifeFilter=button.dataset.lifeFilter;document.querySelectorAll('[data-life-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));renderLife()}));
        $('life-expand-all').addEventListener('click',()=>{const items=[...$('life-timeline').querySelectorAll('details')],open=!items.every(el=>el.open);lifeExpanded=false;items.forEach(el=>{el.open=open;const index=Number(el.closest('[data-life-index]').dataset.lifeIndex);if(open)lifeOpenEntries.add(index);else lifeOpenEntries.delete(index)});syncLifeExpandedButton()});
        $('life-entry-select').addEventListener('change',event=>{lifeSelected=Number(event.target.value)||0;populateLifeEditor()});
        document.querySelectorAll('[data-life-field]').forEach(input=>input.addEventListener('input',()=>{const entries=lifeEntries(),entry=entries[lifeSelected];if(!entry)return;entry[input.dataset.lifeField]=input.type==='checkbox'?input.checked:input.value;config.experiences=entries;if(input.dataset.lifeField==='title')$('life-entry-select').options[lifeSelected].textContent=String(lifeSelected+1).padStart(2,'0')+' · '+(input.value||'未命名经历');syncLifeLinkError();renderLife();save()}));
        $('life-add').addEventListener('click',()=>{const entries=lifeEntries();if(entries.length>=60)return;lifeSelected=entries.length;entries.push(cleanLifeEntry({title:'新的一段经历',kind:'education',template:true},lifeSelected));commitLifeEntries(entries,'已新增经历，请填写标题与正文。');$('life-title-input').focus()});
        $('life-delete').addEventListener('click',()=>{const entries=lifeEntries();if(!entries.length)return;const removed=entries.splice(lifeSelected,1)[0];config.lifeUndo={entry:removed,index:lifeSelected};commitLifeEntries(entries,'已删除。可点击“撤销删除”恢复刚才的一条。');$('life-undo').hidden=false});
        $('life-undo').addEventListener('click',()=>{const undo=config.lifeUndo;if(!undo)return;const entries=lifeEntries();if(entries.length>=60)return;lifeSelected=Math.min(undo.index,entries.length);entries.splice(lifeSelected,0,undo.entry);delete config.lifeUndo;commitLifeEntries(entries,'已恢复删除的经历。');$('life-undo').hidden=true});
        for(const [id,direction] of [['life-up',-1],['life-down',1]])$(id).addEventListener('click',()=>{const entries=lifeEntries(),next=lifeSelected+direction;if(next<0||next>=entries.length)return;[entries[lifeSelected],entries[next]]=[entries[next],entries[lifeSelected]];lifeSelected=next;commitLifeEntries(entries,'已调整顺序。')});
        $('life-export-data').addEventListener('click',()=>{lifeDownload('冷玦清-经历备份.json',JSON.stringify(lifeDocument(),null,2),'application/json;charset=utf-8');$('life-edit-status').textContent='经历备份已导出；这份 JSON 用于重新导入，不是上线网页。'});
        $('life-import-data').addEventListener('click',()=>$('life-data-file').click());
        $('life-data-file').addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;try{if(file.size>10000000)throw new Error('备份请保持在 10MB 以内。');const value=validateLifeDocument(JSON.parse(await file.text()));config={...config,...value};lifeSelected=0;lifeFilter='all';lifeOpenEntries.clear();lifeExpanded=false;delete config.lifeUndo;$('life-undo').hidden=true;document.querySelectorAll('[data-life-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lifeFilter==='all')));populate();render();save();$('life-edit-status').textContent='经历备份已导入，原有图片、联系方式和主题设置保留。'}catch(error){$('life-edit-status').textContent='导入未修改内容：'+error.message}finally{event.target.value=''}});
        window.addEventListener('scroll',requestLifeReadingUpdate,{passive:true});window.addEventListener('resize',requestLifeReadingUpdate);window.addEventListener('hashchange',requestLifeReadingUpdate);
        $('edit-toggle').addEventListener('click',()=>{populateLifeEditor();$('life-undo').hidden=!config.lifeUndo});
        $('reset-button').addEventListener('click',()=>{lifeOpenEntries.clear();lifeExpanded=false;lifeSelected=0;lifeFilter='all';$('life-undo').hidden=true;document.querySelectorAll('[data-life-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lifeFilter==='all')));populateLifeEditor();renderLife()});
      }
