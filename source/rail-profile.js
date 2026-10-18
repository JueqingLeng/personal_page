      function setupRailProfile(){
        const rail=$('left-rail');if(!rail)return;
        document.querySelectorAll('.rail-profile').forEach(el=>el.remove());
        const svg=paths=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths+'</svg>';
        const github=svg('<path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .1-1.7-.5-2.3 3-.3 6-1.5 6-6.5a5 5 0 0 0-1.4-3.5c.2-.8.2-2.2-.2-3.2 0 0-1.1-.4-3.7 1.3a13 13 0 0 0-6.4 0C6.2 2.1 5.1 2.5 5.1 2.5c-.4 1-.4 2.4-.2 3.2A5 5 0 0 0 3.5 9.2c0 5 3 6.2 6 6.5-.5.5-.6 1.2-.5 2.3v4"/>');
        const mail=svg('<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m4 7 8 6 8-6"/>');
        const settings=svg('<path d="m9.4 3-.6 2.1-1.6.9-2.1-.5-2 3.4 1.5 1.6v1.9L3.1 14l2 3.5 2.1-.5 1.6.9.6 2.1h4l.6-2.1 1.6-.9 2.1.5 2-3.5-1.5-1.6v-1.8L19.7 9l-2-3.5-2.1.5-1.6-.9-.6-2.1Z"/><circle cx="11.4" cy="11.5" r="3"/>');
        const info=svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>');
        const nav=document.createElement('nav');nav.className='rail-profile';nav.setAttribute('aria-label','个人链接');
        nav.innerHTML='<a class="rail-profile-icon" id="rail-github" target="_blank" rel="noopener noreferrer" aria-label="GitHub 主页" title="GitHub 主页">'+github+'</a><a class="rail-profile-icon" id="rail-email" aria-label="发送邮件" title="发送邮件">'+mail+'</a><button class="rail-profile-icon" id="rail-settings" type="button" aria-label="设置" title="设置" aria-haspopup="dialog">'+settings+'</button><button class="rail-profile-icon" id="rail-about" type="button" aria-label="个人简介" title="个人简介" aria-haspopup="dialog">'+info+'</button>';
        rail.append(nav);
        $('rail-profile-dialog')?.remove();
        const dialog=document.createElement('dialog');dialog.id='rail-profile-dialog';dialog.className='rail-profile-dialog';dialog.setAttribute('aria-labelledby','rail-profile-name');
        dialog.innerHTML='<button class="rail-profile-close" type="button" aria-label="关闭简介">×</button><span class="rail-profile-mark" aria-hidden="true">玦</span><h2 id="rail-profile-name"></h2><p id="rail-profile-bio"></p>';
        document.body.append(dialog);
        $('rail-about').addEventListener('click',()=>dialog.showModal());
        dialog.querySelector('.rail-profile-close').addEventListener('click',()=>dialog.close());
        dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()});
        const baseRender=render;
        render=function(){
          baseRender();
          contactLink('rail-github',githubURL(String(config.github||'').trim()));
          const email=String(config.email||'').trim();contactLink('rail-email',emailValid(email)?'mailto:'+email:null);
          $('rail-email').title=email||'发送邮件';
          $('rail-profile-name').textContent=String(config.name||'冷玦清');
          $('rail-profile-bio').textContent=String(config.bio||config.tagline||'一名普通大学生，爱好动漫、游戏和音乐，喜欢学习一切新的事物。');
        };
      }
