      function refineFrogFigures(){
        for(const prefix of ['tai','daily']){
          const left=prefix==='tai',stage=$(left?'taichi-frog':'daily-frog'),figure=stage.querySelector('.frog-adam-figure'),gold=`url(#${prefix}-gold)`;
          const head=figure.querySelector('.adam-head');
          head.removeAttribute('transform');
          // The right torso is mirrored: its local gaze rises towards the other frog.
          const gazeY=left?3:-4,tilt=left?8:-10;
          head.innerHTML=`<g transform="rotate(${tilt} 105 73)">
            <path d="M72 61 Q65 43 77 32 Q84 24 96 29 Q108 20 122 29 Q139 27 145 42 Q154 63 135 76 Q117 87 91 79 Q76 77 72 61Z" fill="${gold}" stroke="#bd9e3b" stroke-width="1.3"/>
            ${left?'<g fill="#37362b"><ellipse cx="72" cy="29" rx="11" ry="10"/><ellipse cx="140" cy="29" rx="11" ry="10"/><path d="M81 28 Q104 12 132 28 L134 36 Q120 26 109 33 Q99 25 89 35 L79 37Z"/></g><path d="M65 25 L79 32 M134 25 L147 32" stroke="#e0af70" stroke-width="2.5"/>':''}
            <ellipse cx="86" cy="47" rx="12" ry="14" fill="url(#${prefix}-eye)"/><ellipse cx="128" cy="46" rx="13" ry="15" fill="url(#${prefix}-eye)"/>
            <ellipse cx="90" cy="${47+gazeY}" rx="5.5" ry="7.5" fill="#1c261a"/><ellipse cx="133" cy="${46+gazeY}" rx="6" ry="8" fill="#1c261a"/>
            <circle cx="91" cy="${44+gazeY}" r="1.8" fill="#fffdeb"/><circle cx="134" cy="${43+gazeY}" r="1.8" fill="#fffdeb"/>
            <path d="M101 69 Q115 76 131 66" fill="none" stroke="#837037" stroke-width="1.7" stroke-linecap="round"/>
            <ellipse cx="91" cy="65" rx="6" ry="3" fill="#d39154" opacity=".3"/>
          </g>`;
          figure.querySelector('.adam-reaching-arm').innerHTML=`<g ${left?'':'transform="translate(200 184) scale(-1 -1)"'}>
            <path d="M129 92 Q140 93 151 105 Q160 114 176 118" fill="none" stroke="${gold}" stroke-width="14" stroke-linecap="round"/>
            <g class="adam-hand" fill="${gold}" stroke="#a68b35" stroke-width="1.2" stroke-linejoin="round">
              <path d="M172 113 Q179 112 184 116 L195 122 Q199 124 197 126 Q196 127 193 125 L183 122 Q181 123 185 126 L190 130 Q193 133 190 134 Q188 135 184 131 L179 127 L184 134 Q186 137 183 138 Q181 138 178 134 L174 128 L176 133 Q177 137 174 137 Q171 136 169 130 Q167 125 170 120Z"/>
              <path d="M176 118 Q179 120 183 122 M174 122 L179 127 M172 126 L174 128" fill="none" stroke-width=".8"/>
            </g>
          </g>`;
        }
        const scene=$('right-scene'),blanket=scene.querySelector('.blanket-prop');
        // A view from the foot of the bed: head on the pillow, body straight under the quilt.
        scene.querySelector('.bed-prop:not(.blanket-prop)').innerHTML=`
          <path d="M44 36 H156 V60 H44Z" fill="#a77e58" stroke="#896444" stroke-width="2"/>
          <path d="M40 37 V181 M160 37 V181" stroke="#896444" stroke-width="6" stroke-linecap="round"/>
          <path d="M46 52 H154 L178 176 H22Z" fill="#f1e7cb" stroke="#b78b63" stroke-width="3"/>
          <rect x="47" y="45" width="106" height="61" rx="19" fill="#fff3d7" stroke="#d6c7a7"/>
          <path d="M54 56 Q65 50 74 54 M126 54 Q138 50 146 58" fill="none" stroke="#e0d2b7" stroke-width="1.5"/>
          <text x="165" y="37" fill="#8fafa6" font-size="13">z</text><text x="176" y="24" fill="#8fafa6" font-size="10">z</text>`;
        // Eye mounds keep the sleeping silhouette recognisably Naiwa, with no rotated face.
        const sleeping=document.createElementNS('http://www.w3.org/2000/svg','g');sleeping.setAttribute('class','sleep-head');
        sleeping.innerHTML=`<path d="M60 68 Q56 56 62 44 Q68 33 80 36 Q90 37 94 46 Q101 43 107 46 Q111 35 124 36 Q141 36 142 54 Q150 72 137 87 Q125 100 100 100 Q75 100 63 86 Q54 77 60 68Z" fill="url(#daily-gold)" stroke="#c5aa49" stroke-width="1.3"/>
          <g class="frog-front-detail">
            <ellipse cx="76" cy="54" rx="12" ry="15" fill="url(#daily-eye)"/><ellipse cx="124" cy="54" rx="12" ry="15" fill="url(#daily-eye)"/>
            <path d="M67 54 Q76 61 85 54 M115 54 Q124 61 133 54" fill="none" stroke="#596a35" stroke-width="2.3" stroke-linecap="round"/>
            <path d="M85 81 Q100 88 115 81" fill="none" stroke="#837037" stroke-width="1.7" stroke-linecap="round"/>
            <ellipse cx="68" cy="73" rx="7" ry="3" fill="#d39154" opacity=".3"/><ellipse cx="132" cy="73" rx="7" ry="3" fill="#d39154" opacity=".3"/>
          </g>
          <g class="frog-back-detail" fill="none" stroke="#bf9f3e" stroke-width="1.5"><path d="M100 57 Q94 74 100 90"/><circle cx="78" cy="52" r="2"/><circle cx="123" cy="52" r="2"/><circle cx="75" cy="74" r="2"/><circle cx="126" cy="76" r="2"/></g>`;
        scene.insertBefore(sleeping,blanket);
        blanket.innerHTML=`<path d="M51 91 Q70 87 81 95 Q100 102 119 95 Q133 87 149 91 L174 169 Q139 181 100 178 Q61 181 26 169Z" fill="#779d92" stroke="#4f7b70" stroke-width="1.5"/>
          <path d="M51 91 Q70 87 81 95 Q100 102 119 95 Q133 87 149 91 L152 102 Q135 97 122 104 Q100 113 78 104 Q65 97 48 102Z" fill="#c0d5c8"/>
          <path d="M64 111 Q58 132 51 158 M136 111 Q143 132 149 158 M75 122 Q100 115 125 122 M67 151 Q100 142 134 152 M94 116 Q89 137 94 167" fill="none" stroke="#527f76" stroke-width="1.5" opacity=".65"/>
          <path d="M23 168 Q100 183 177 168 V183 Q100 195 23 183Z" fill="#b78b63" stroke="#896444" stroke-width="1.5"/>
          <path d="M27 182 V191 M173 182 V191" stroke="#896444" stroke-width="5" stroke-linecap="round"/>`;
      }
