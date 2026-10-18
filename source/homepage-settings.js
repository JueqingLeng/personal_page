      function setupHomepageSettings(){
        for(const id of ['homepage-settings','pet-edit-toolbar'])$(id)?.remove();
        document.body.classList.remove('pets-editing');
        let editing=false,drag=null,resizeFrame=0;
        const pets={left:$('left-rail'),right:document.querySelector('.daily-frog-wrap')};
        const handles={left:$('taichi-frog'),right:$('daily-frog')};
        const nav=document.querySelector('.rail-profile');
        const dialog=document.createElement('dialog');dialog.id='homepage-settings';dialog.className='homepage-settings';dialog.setAttribute('aria-labelledby','homepage-settings-title');
        dialog.innerHTML=`<div class="settings-heading"><div><span>属于你的这一页</span><h2 id="homepage-settings-title">设置</h2></div><button type="button" class="settings-close" aria-label="关闭设置">×</button></div>
          <div class="settings-tabs" role="tablist" aria-label="设置分类"><button type="button" id="pet-settings-tab" role="tab" aria-selected="true" aria-controls="pet-settings-panel">奶蛙位置</button><button type="button" id="design-settings-tab" role="tab" aria-selected="false" aria-controls="design-settings-panel" tabindex="-1">主页设计</button></div>
          <section id="pet-settings-panel" role="tabpanel" aria-labelledby="pet-settings-tab"><h3>让奶蛙换个位置</h3><p>开启摆放模式后，按住任意一只奶蛙拖动。移动后，个人图标会缓缓落到左下角。</p><p class="settings-note">支持鼠标和触屏；键盘聚焦奶蛙后可用方向键移动，按住 Shift 加快。</p><div class="settings-actions"><button type="button" id="pet-edit-start">开启摆放模式</button><button type="button" id="pet-position-reset">还原位置</button></div></section>
          <section id="design-settings-panel" role="tabpanel" aria-labelledby="design-settings-tab" hidden><h3>背景风格</h3><div class="background-options" role="group" aria-label="背景风格"><button type="button" data-background="bronze" aria-pressed="true"><span class="background-sample sample-bronze"></span>青铜纹理风</button><button type="button" data-background="ink" aria-pressed="false"><span class="background-sample sample-ink"></span>墨色山岚</button><button type="button" data-background="night" aria-pressed="false"><span class="background-sample sample-night"></span>静夜星光</button><button type="button" data-background="neon-ride" aria-pressed="false"><span class="background-sample sample-neon-ride"></span>霓虹同行</button><button type="button" data-background="starry-eyes" aria-pressed="false"><span class="background-sample sample-starry-eyes"></span>紫色星瞳</button><button type="button" data-background="custom" aria-pressed="false" id="custom-background-choice" hidden><span class="background-sample sample-custom"></span>我的背景</button></div><div class="settings-actions"><button type="button" id="background-upload">上传背景图片</button><button type="button" id="background-remove" hidden>移除上传图片</button></div><input type="file" id="background-file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" hidden><p class="settings-note">支持 JPG、PNG、WebP、AVIF、GIF，最大 12 MB。图片会自动缩放保存。</p><h3>主题颜色</h3><div class="theme-colors" role="group" aria-label="主题颜色"><button type="button" data-home-theme="xuan" aria-pressed="true"><i></i>玄色</button><button type="button" data-home-theme="white" aria-pressed="false"><i></i>白色</button><button type="button" data-home-theme="pink" aria-pressed="false"><i></i>粉色</button><button type="button" data-home-theme="yellow" aria-pressed="false"><i></i>黄色</button></div><h3>按钮颜色</h3><div class="button-colors" role="group" aria-label="按钮颜色"><button type="button" data-button-color="gold" aria-pressed="true"><i></i>金色</button><button type="button" data-button-color="blue" aria-pressed="false"><i></i>蓝色</button><button type="button" data-button-color="black" aria-pressed="false"><i></i>黑色</button><button type="button" data-button-color="pink" aria-pressed="false"><i></i>粉色</button><button type="button" data-button-color="glass" aria-pressed="false"><i></i>磨砂透明</button></div><p class="settings-note">更换背景后，正文自动使用磨砂玻璃底，保留清晰阅读。</p></section><p class="settings-status" id="homepage-settings-status" role="status" aria-live="polite"></p>`;
        document.body.append(dialog);
        const toolbar=document.createElement('div');toolbar.id='pet-edit-toolbar';toolbar.className='pet-edit-toolbar';toolbar.hidden=true;toolbar.innerHTML='<span>摆放模式 · 拖动奶蛙</span><button type="button" id="pet-edit-done">完成摆放</button><button type="button" id="pet-edit-reset">还原位置</button>';document.body.append(toolbar);
        const design=()=>config.homepageDesign&&typeof config.homepageDesign==='object'?config.homepageDesign:{};
        // Apply the requested new starting design once; retain text, uploads and pet positions.
        if(design().defaultsVersion!==2){
          config.homepageDesign={...design(),background:'neon-ride',buttonColor:'glass',theme:'xuan',defaultsVersion:2};
          try{localStorage.setItem(storageKey,JSON.stringify(config))}catch{}
        }
        const layout=()=>config.petPositions&&typeof config.petPositions==='object'?config.petPositions:{};
        function persist(message){try{localStorage.setItem(storageKey,JSON.stringify(config));$('homepage-settings-status').textContent=message||'已保存。'}catch{$('homepage-settings-status').textContent='当前设置已预览；浏览器空间不足，请导出网页保存。'}}
        function dockIcons(animate){
          if(nav.classList.contains('is-docked'))return;
          const before=nav.getBoundingClientRect();document.body.append(nav);nav.classList.add('is-docked');
          if(animate&&!motionPreference.matches){const after=nav.getBoundingClientRect();nav.animate([{transform:`translate(${before.left-after.left}px,${before.top-after.top}px)`},{transform:'translate(0,0)'}],{duration:850,easing:'cubic-bezier(.22,.7,.2,1)'});}
        }
        function undockIcons(){nav.getAnimations().forEach(animation=>animation.cancel());nav.classList.remove('is-docked');pets.left.append(nav);}
        function positionPet(key,pose){
          const pet=pets[key];
          if(!pose||!Number.isFinite(pose.x)||!Number.isFinite(pose.y)){pet.classList.remove('is-positioned');pet.style.removeProperty('--pet-x');pet.style.removeProperty('--pet-y');pet.style.removeProperty('--pet-width');return;}
          const width=Math.max(100,Math.min(178,Number(pose.width)||178,innerWidth-48));pet.style.setProperty('--pet-width',width+'px');pet.classList.add('is-positioned');
          const height=pet.getBoundingClientRect().height;
          const x=12+Math.max(0,Math.min(1,pose.x))*Math.max(0,innerWidth-width-24);
          const y=12+Math.max(0,Math.min(1,pose.y))*Math.max(0,innerHeight-height-24);
          pet.style.setProperty('--pet-x',x+'px');pet.style.setProperty('--pet-y',y+'px');
        }
        function applySettings(){
          const d=design(),background=['bronze','ink','night','neon-ride','starry-eyes'].includes(d.background)?d.background:d.background==='custom'&&/^data:image\/(?:webp|png|jpeg);base64,/.test(d.image||'')?'custom':'neon-ride';
          document.body.dataset.homeBackground=background;
          document.body.dataset.buttonColor=['gold','blue','black','pink','glass'].includes(d.buttonColor)?d.buttonColor:'glass';
          document.body.dataset.homeTheme=['xuan','white','pink','yellow'].includes(d.theme)?d.theme:'xuan';
          const uploaded=/^data:image\/(?:webp|png|jpeg);base64,/.test(d.image||'')?'url("'+d.image+'")':'none';
          document.body.style.setProperty('--homepage-image',background==='custom'?uploaded:['neon-ride','starry-eyes'].includes(background)?'var(--background-'+background+')':'none');
          document.body.style.setProperty('--uploaded-image',uploaded);
          dialog.querySelectorAll('[data-background]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.background===background)));
          dialog.querySelectorAll('[data-button-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.buttonColor===document.body.dataset.buttonColor)));
          dialog.querySelectorAll('[data-home-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.homeTheme===document.body.dataset.homeTheme)));
          $('custom-background-choice').hidden=!d.image;$('background-remove').hidden=!d.image;
          const stored=layout();if(stored.left||stored.right)dockIcons(false);else undockIcons();
          if(!drag)for(const key of Object.keys(pets))positionPet(key,stored[key]);
        }
        function updateDesign(patch){config.homepageDesign={...design(),...patch};applySettings();persist('主页设计已保存。');}
        function resetPositions(){config.petPositions={};drag=null;for(const pet of Object.values(pets))pet.classList.remove('is-dragging');applySettings();persist('奶蛙与个人图标已回到原位。');}
        function setEditing(value){editing=value;document.body.classList.toggle('pets-editing',value);toolbar.hidden=!value;for(const handle of Object.values(handles))handle.setAttribute('aria-label',value?'拖动奶蛙调整位置，也可使用方向键':handle.dataset.normalLabel);}
        for(const handle of Object.values(handles))handle.dataset.normalLabel=handle.getAttribute('aria-label')||'点击奶蛙';
        $('rail-settings').addEventListener('click',()=>dialog.showModal());
        dialog.querySelector('.settings-close').addEventListener('click',()=>dialog.close());
        dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()});
        const tabs=[...dialog.querySelectorAll('[role=tab]')];
        function selectTab(tab){tabs.forEach(b=>{const selected=b===tab;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;$(b.getAttribute('aria-controls')).hidden=!selected;});}
        tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?tabs[0]:e.key==='End'?tabs.at(-1):tabs[(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];selectTab(next);next.focus()})});
        $('pet-edit-start').addEventListener('click',()=>{dialog.close();setEditing(true);handles.left.focus({preventScroll:true});});
        $('pet-edit-done').addEventListener('click',()=>{setEditing(false);$('rail-settings').focus({preventScroll:true})});
        $('pet-position-reset').addEventListener('click',resetPositions);$('pet-edit-reset').addEventListener('click',resetPositions);
        document.addEventListener('keydown',e=>{if(e.key==='Escape'&&editing)setEditing(false)});
        window.addEventListener('hashchange',()=>{if(document.body.dataset.view==='intro')setEditing(false)});
        function movePet(key,x,y,width,animateDock=true){
          dockIcons(animateDock);
          const pet=pets[key];pet.style.setProperty('--pet-width',width+'px');pet.classList.add('is-positioned');
          const height=pet.getBoundingClientRect().height,maxX=Math.max(0,innerWidth-width-24),maxY=Math.max(0,innerHeight-height-24);
          const pose={x:maxX?Math.max(0,Math.min(1,(x-12)/maxX)):0,y:maxY?Math.max(0,Math.min(1,(y-12)/maxY)):0,width};
          config.petPositions={...layout(),[key]:pose};positionPet(key,pose);
        }
        for(const [key,handle] of Object.entries(handles)){
          handle.addEventListener('click',e=>{if(editing||handle.dataset.suppressClick==='true'){e.preventDefault();e.stopImmediatePropagation();delete handle.dataset.suppressClick;}},true);
          handle.addEventListener('pointerdown',e=>{if(!editing||e.button!==0)return;e.preventDefault();const rect=pets[key].getBoundingClientRect();drag={key,id:e.pointerId,startX:e.clientX,startY:e.clientY,x:rect.x,y:rect.y,width:Math.min(178,rect.width),moved:false};handle.setPointerCapture(e.pointerId);});
          handle.addEventListener('pointermove',e=>{if(!drag||drag.key!==key||drag.id!==e.pointerId)return;const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(!drag.moved&&Math.hypot(dx,dy)<5)return;drag.moved=true;pets[key].classList.add('is-dragging');movePet(key,drag.x+dx,drag.y+dy,drag.width);});
          function finish(e){if(!drag||drag.key!==key||drag.id!==e.pointerId)return;const moved=drag.moved;drag=null;pets[key].classList.remove('is-dragging');if(handle.hasPointerCapture(e.pointerId))handle.releasePointerCapture(e.pointerId);if(moved){handle.dataset.suppressClick='true';setTimeout(()=>delete handle.dataset.suppressClick,0);persist();}}
          handle.addEventListener('pointerup',finish);handle.addEventListener('pointercancel',finish);handle.addEventListener('lostpointercapture',finish);
          handle.addEventListener('keydown',e=>{if(!editing||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const r=pets[key].getBoundingClientRect(),step=e.shiftKey?24:8;movePet(key,r.x+(e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0),r.y+(e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0),Math.min(178,r.width));persist();});
        }
        window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{if(!drag)for(const key of Object.keys(pets))positionPet(key,layout()[key]);});});
        dialog.querySelectorAll('[data-background]').forEach(b=>b.addEventListener('click',()=>updateDesign({background:b.dataset.background})));
        dialog.querySelectorAll('[data-button-color]').forEach(b=>b.addEventListener('click',()=>updateDesign({buttonColor:b.dataset.buttonColor})));
        dialog.querySelectorAll('[data-home-theme]').forEach(b=>b.addEventListener('click',()=>updateDesign({theme:b.dataset.homeTheme})));
        $('background-upload').addEventListener('click',()=>$('background-file').click());
        $('background-remove').addEventListener('click',()=>updateDesign({background:'bronze',image:''}));
        let uploadToken=0;
        $('background-file').addEventListener('change',async e=>{
          const file=e.target.files?.[0];if(!file)return;const token=++uploadToken;
          $('homepage-settings-status').textContent='正在处理背景图片…';$('background-upload').disabled=true;
          let url;
          try{
            if(file.size>12*1024*1024)throw new Error('请选择不超过 12 MB 的图片。');
            if(!['image/jpeg','image/png','image/webp','image/avif','image/gif'].includes(file.type))throw new Error('请选择 JPG、PNG、WebP、AVIF 或 GIF 图片。');
            url=URL.createObjectURL(file);const image=new Image();image.src=url;await image.decode();
            const scale=Math.min(1,1920/Math.max(image.naturalWidth,image.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
            const ctx=canvas.getContext('2d');ctx.fillStyle='#111914';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
            const data=canvas.toDataURL('image/webp',.84);if(data.length>2*1024*1024)throw new Error('图片细节过多，请缩小后重新上传。');
            if(token===uploadToken)updateDesign({background:'custom',image:data});
          }catch(error){$('homepage-settings-status').textContent=error.message||'图片无法读取，请换一张重试。';}finally{if(url)URL.revokeObjectURL(url);e.target.value='';$('background-upload').disabled=false;}
        });
        const baseRender=render;render=function(){baseRender();applySettings()};
      }
