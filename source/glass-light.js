      function setupGlassLight(){
        const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
        const eligible='.detail-section,.life-entry-sheet,.learning-panel,.detail-card,.beijing-panel,.homepage-settings,.settings-heading,.rail-profile-dialog,.life-reading-nav,.drawer,button,a';
        let active=new Set(),frame=0,point=null;
        function clear(){for(const el of active)el.classList.remove('is-glass-lit');active.clear();}
        function draw(){
          frame=0;if(!point||!finePointer.matches||document.body.dataset.view!=='details'){clear();return;}
          const next=new Set();let el=document.elementFromPoint(point.x,point.y);
          for(;el&&el!==document.body;el=el.parentElement){
            if(!el.matches(eligible)||el.closest('.jue-content'))continue;
            const style=getComputedStyle(el);
            if(!/blur\(/.test(style.backdropFilter||style.webkitBackdropFilter||''))continue;
            if(style.position==='static')el.classList.add('glass-light-static');
            const rect=el.getBoundingClientRect();
            el.style.setProperty('--glass-light-x',(point.x-rect.left)+'px');el.style.setProperty('--glass-light-y',(point.y-rect.top)+'px');
            el.classList.add('has-glass-light','is-glass-lit');next.add(el);
          }
          for(const old of active)if(!next.has(old))old.classList.remove('is-glass-lit');active=next;
        }
        document.addEventListener('pointermove',event=>{
          if(event.pointerType!=='mouse'){clear();return;}
          point={x:event.clientX,y:event.clientY};if(!frame)frame=requestAnimationFrame(draw);
        },{passive:true});
        function leave(){point=null;cancelAnimationFrame(frame);frame=0;clear();}
        document.documentElement.addEventListener('pointerleave',leave);window.addEventListener('blur',leave);
        window.addEventListener('scroll',leave,{passive:true,capture:true});window.addEventListener('resize',leave,{passive:true});
        document.addEventListener('visibilitychange',()=>{if(document.hidden)leave()});
      }
