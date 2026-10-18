'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const standalone=fs.existsSync(path.join(__dirname,'base-v1.html'));
const root=path.resolve(__dirname,'..'),source=standalone?__dirname:path.join(__dirname,'experience-edition'),out=standalone?root:path.join(root,'outputs/experience-edition');
fs.mkdirSync(path.join(out,'licenses'),{recursive:true});
const original=fs.readFileSync(standalone?path.join(__dirname,'base-v1.html'):path.join(root,'outputs/preserved-v1-2026-10-16/index.html'),'utf8');
let html=original;
const read=file=>fs.readFileSync(path.join(source,file),'utf8');
function replaceOnce(before,after){if(!html.includes(before))throw new Error('Missing insertion point: '+before.slice(0,100));html=html.replace(before,after)}
const suppliedBackgrounds=':root{'+['neon-ride','starry-eyes'].map(name=>'--background-'+name+':url("data:image/webp;base64,'+fs.readFileSync(path.join(source,'backgrounds',name+'.webp')).toString('base64')+'");').join('')+'}';
replaceOnce('  </style>',read('experience.css')+'\n'+read('homepage-settings.css')+'\n'+read('page-refinements.css')+'\n'+suppliedBackgrounds+'\n  </style>');
replaceOnce('    <main class="detail-content">','    <main class="detail-content">\n'+read('sections.html'));
// Keep the afterword, curiosity line and contacts within the interests chapter.
replaceOnce('</p></section>\n      <footer class="detail-footer">','</p>\n'+read('afterword.html')+'\n      <footer class="detail-footer">');
replaceOnce('</span></footer>','</span></footer></section>');
replaceOnce('<a href="#skills">技能</a>','<a href="#journey">经历</a><a href="#skills">技能</a>');
replaceOnce("['#details','#home','#about','#interests','#contact','#projects','#skills']","['#details','#home','#about','#interests','#contact','#projects','#skills','#story','#journey','#next']");
replaceOnce('<small>01 / SKILLS</small>','<small>贰 / SKILLS</small>');
replaceOnce('<small>02 / PROJECTS</small>','<small>叁 / PROJECTS</small>');
replaceOnce('<small>03 / INTERESTS</small>','<small>肆 / INTERESTS</small>');
replaceOnce('  <button class="edit-toggle"',`  <nav class="life-reading-nav" id="life-reading-nav" aria-label="阅读章节" hidden><a href="#story">卷首</a><a href="#journey">经历</a><a href="#skills">技能</a><a href="#projects">项目</a><a href="#interests">兴趣</a><span class="life-reading-progress" aria-hidden="true"></span></nav>\n  <button class="edit-toggle"`);
replaceOnce('      <fieldset><legend>联系方式</legend>',read('editor.html')+'\n      <fieldset><legend>联系方式</legend>');
const openingData=/<script type="application\/json" id="site-data">\s*([\s\S]*?)\s*<\/script>/;
const defaults=JSON.parse(html.match(openingData)[1]);
const entry=(kind,title,summary,body,tags)=>({kind,title,period:'时间待填写',place:'',summary,body,reflection:'',tags,link:'',template:true});
Object.assign(defaults,{
 storageId:'personal-home-lengjueqing-experience-v1',experienceEditionVersion:1,
 homepageDesign:{background:'neon-ride',buttonColor:'glass',theme:'xuan',defaultsVersion:2},
 lifeHeadline:'把经历，\n慢慢写成自己。',
 lifeLead:'一名普通大学生，喜欢学习一切新的事物。',
 lifeAbout:defaults.about,
 journeyIntro:'这里收藏学习、实践与生活中的一些片段。\n有些已经走过，有些仍在继续。',
 lifeNext:'大模型应用与安卓应用开发，是我接下来想学习的方向。',
 experiences:[
 entry('education','关于学习的这一程','为学校、专业、课程与成长留下一页。这里的内容由你亲自填写。','【填写提示 · 从哪里开始】\n写下你的学校、专业与这段经历的起止时间。最初为什么选择这个方向？哪门课程或哪位老师改变过你的想法？\n\n【填写提示 · 过程比结果更有意思】\n挑一两件具体的事展开写：一次难忘的作业、一段持续很久的练习、从不理解到终于想通的瞬间。可以写很多段，不必挤成简历上的一句话。\n\n【填写提示 · 此刻回望】\n最后写下这段时间带给你的变化。若还在路上，也可以保留一个尚未解答的问题。','学习记录，待填写'),
 entry('practice','把想法变成作品','为一次项目、实习、比赛或个人实践，记录完整的来龙去脉。','【填写提示 · 起因与目标】\n这件事最初想解决什么问题？你承担了什么角色？可以从一个小而具体的场景写起。\n\n【填写提示 · 你的行动】\n记录你做过的选择、尝试过的方法、遇到的困难，以及如何逐步推进。不要只罗列工具名，让读者看到你的思考。\n\n【填写提示 · 结果与复盘】\n成果是什么？有哪些遗憾？下一次会怎么做？你还可以附上代码仓库、作品演示或更完整的文章链接。','实践，作品，待填写'),
 entry('life','那些值得记下的日常','为动漫、游戏、音乐、播音主持，或一段重要的生活片段留白。','【填写提示 · 一个真实的片段】\n写下你想保存的瞬间：第一次站上舞台、遇见喜欢的作品、与朋友完成一件事，或一个平凡却难忘的下午。\n\n【填写提示 · 为什么记住它】\n这段经历为什么对你重要？它与你的性格、热爱或选择有什么联系？用自己的语言慢慢写，不必追求标准答案。','生活，热爱，待填写')
 ]
});
html=html.replace(openingData,'<script type="application/json" id="site-data">\n'+JSON.stringify(defaults).replace(/</g,'\\u003c')+'\n  </script>');
replaceOnce('      setupPavilions();setupScales();setupArtInputs();setupPracticeSlider();populate();render();populatePattern();syncView(false);refreshWeather();',read('experience.js')+'\n'+read('journal-text-transfer.js')+'\n'+read('rail-profile.js')+'\n'+read('homepage-settings.js')+'\n'+read('frog-refinements.js')+'\n'+read('glass-light.js')+'\n      setupLife();setupPavilions();refineFrogFigures();setupRailProfile();setupHomepageSettings();setupGlassLight();setupScales();setupArtInputs();setupPracticeSlider();populate();render();populatePattern();syncView(false);refreshWeather();');
replaceOnce("a.download='my-personal-page.html'","a.download='index.html'");
replaceOnce("clone.querySelector('#status').textContent='';","clone.querySelector('#status').textContent='';clone.querySelector('#life-edit-status').textContent='';clone.querySelector('#life-reading-nav').hidden=true;clone.querySelector('#life-undo').hidden=true;");
replaceOnce("const exported={...config,storageId:","clone.querySelectorAll('.rail-profile,.rail-profile-dialog,#homepage-settings,#pet-edit-toolbar').forEach(el=>el.remove());clone.querySelector('body').classList.remove('pets-editing');\n        const exported={...config,storageId:");
replaceOnce("const exported={...config,storageId:","clone.querySelectorAll('.has-glass-light').forEach(el=>{el.classList.remove('has-glass-light','is-glass-lit','glass-light-static');el.style.removeProperty('--glass-light-x');el.style.removeProperty('--glass-light-y')});\n        const exported={...config,storageId:");
const license=fs.readFileSync(path.join(__dirname,standalone?'upstream-vcard/LICENSE':'open-source-vcard/LICENSE'),'utf8');
replaceOnce('</head>','<!--\nExperience timeline adapted from https://github.com/codewithsadee/vcard-personal-portfolio\n'+license.replace(/--/g,'—')+'\n-->\n</head>');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
for(const script of scripts){if(script[0].startsWith('<script type="application/json"'))JSON.parse(script[1]);else new Function(script[1])}
fs.writeFileSync(path.join(out,'index.html'),html);
fs.writeFileSync(path.join(out,'licenses/vcard-MIT.txt'),license);
fs.writeFileSync(path.join(out,'licenses/SOURCES.md'),`# Open-source adaptation\n\n- Project: [vCard personal portfolio](https://github.com/codewithsadee/vcard-personal-portfolio), codewithsadee.\n- License: MIT, copyright 2022 codewithsadee; full text in vcard-MIT.txt and embedded in index.html.\n- Reference files: index.html (Resume / timeline-list), assets/css/style.css (timeline-item positioning, node and line pseudo-elements).\n- Retrieved: 2026-10-16, via jsDelivr mirror of GitHub master. Upstream copies retained under work/open-source-vcard in the editable source package.\n- Changes: bronze and paper styling, Chinese long-form reading, expandable narratives, category filters, author editor, JSON backup and standalone HTML export. No vCard runtime, icons, portraits or fictitious resume details are used.\n\nExisting Naiwa sprite credits and license remain embedded in the original page assets. Third-party artwork is not covered by the vCard MIT license.\n`);
fs.writeFileSync(path.join(out,'build-info.json'),JSON.stringify({edition:'experience-v1',preservedVersion:'preserved-v1-2026-10-16',baseSha256:crypto.createHash('sha256').update(original).digest('hex'),outputSha256:crypto.createHash('sha256').update(html).digest('hex'),source:'https://github.com/codewithsadee/vcard-personal-portfolio'},null,2));
console.log('Built experience edition:',Buffer.byteLength(html),'bytes; preserved original unchanged.');
