      // Import the author's journal draft once; leave the source draft and theme intact.
      (()=>{
        const sourceKey='personal-home-lengjueqing-journal-v2';
        const marker='journalTextTransfer20261018';
        const textFields=['name','englishName','tagline','location','bio','about','email','github','interestsText','projectsText','skillsText','skillProgressText','learningText','practiceURL','lifeHeadline','lifeLead','lifeAbout','journeyIntro','lifeNext'];
        function transferJournalDraft(){
          if(config[marker])return;
          let draft;
          try{draft=JSON.parse(localStorage.getItem(sourceKey))}catch{return}
          if(!draft||typeof draft!=='object'||Array.isArray(draft))return;
          const own=(key)=>Object.prototype.hasOwnProperty.call(draft,key);
          const changed=textFields.some(key=>own(key)&&typeof draft[key]==='string'&&draft[key]!==String(key==='lifeHeadline'?'在热爱里，\n慢慢成为自己。':defaults[key]||''))||
            own('experiences')&&JSON.stringify(draft.experiences)!==JSON.stringify(defaults.experiences);
          if(!changed)return;
          const content={};for(const key of ['lifeHeadline','lifeLead','lifeAbout','journeyIntro','lifeNext'])content[key]=own(key)?draft[key]:String(defaults[key]||'');
          let validated;
          try{validated=validateLifeDocument({version:1,content,experiences:own('experiences')?draft.experiences:defaults.experiences})}catch{return}
          const patch={...validated};
          for(const key of textFields)if(own(key)&&typeof draft[key]==='string'&&draft[key].length<=30000)patch[key]=draft[key];
          const next={...config,...patch,[marker]:true};
          try{
            const existing=localStorage.getItem(storageKey);
            const backupKey=storageKey+'-before-journal-text-transfer';
            if(existing&&!localStorage.getItem(backupKey))localStorage.setItem(backupKey,existing);
            localStorage.setItem(storageKey,JSON.stringify(next));
          }catch{return}
          config=next;
          if(typeof renderLife==='function'&&document.querySelector('#life-timeline')){populate();render()}
        }
        transferJournalDraft();
        window.addEventListener('storage',event=>{if(event.key===sourceKey)transferJournalDraft()});
        window.addEventListener('focus',transferJournalDraft);
      })();
