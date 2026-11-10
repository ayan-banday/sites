/* The story as data: each chapter has a palette, a top band, a page ground, and four panels.
   A panel = background type + the cast (faces swap per panel) + lettering + an optional sound cue. */
const PAL={
  c1:{paper:'#efe2ea',a:'#501345',b:'#d8a37b',c:'#a1a39a',dark:'#2e0b28',page:'#3a0f34'},   // No. 238
  c2:{paper:'#f6e6c4',a:'#d96629',b:'#f99d1b',c:'#ebd3a2',dark:'#111314',page:'#5a2412'},   // No. 190 + Yellow Orange
  c3:{paper:'#f7cbd9',a:'#b73f74',b:'#fcb315',c:'#59256a',dark:'#2b0d2a',page:'#59256a'},   // No. 170
  c4:{paper:'#2a2a2c',a:'#111314',b:'#3b3b3e',c:'#a1a39a',dark:'#111314',page:'#151416'},   // No. 69
  c5:{paper:'#f3d9c4',a:'#802626',b:'#bb7125',c:'#a36aa5',dark:'#1e0f0f',page:'#3a1212'},   // No. 269
  end:{paper:'#2c0f2b',a:'#4e1d4c',b:'#59256a',c:'#fcb315',dark:'#1d0a1c',page:'#1d0a1c'}   // No. 53
};
/* a drawn speech bubble inside the art (used for the censored ones) */
function sbub(x,y,w,h,tx,ty,fill=CREAM,sw=2.6){const cx=x+w/2,cy=y+h/2;const a=Math.atan2(ty-cy,tx-cx);const bx=cx+Math.cos(a)*w*.36,by=cy+Math.sin(a)*h*.36;const px=-Math.sin(a)*12,py=Math.cos(a)*12;
  return `<path d="${blob(cx,cy,w/2,h/2,26,.03)}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" filter="url(#wob)"/><path d="M${bx+px},${by+py} Q${(bx+tx)/2+px*.3},${(by+ty)/2+py*.3} ${tx},${ty} Q${(bx+tx)/2-px*.6},${(by+ty)/2-py*.6} ${bx-px},${by-py}Z" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/><path d="M${bx+px*.8},${by+py*.8} L${bx-px*.8},${by-py*.8}" stroke="${fill}" stroke-width="${sw+3}"/>`}
const arrow=(d,col=INK)=>ln(d,2.4,col);
const flask=(x,y)=>`<g transform="translate(${x} ${y})" filter="url(#wob)"><path d="M-30,0 h60 M-24,0 v60 M24,0 v60" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-10,-80 h20 v24 l24,44 q5,12 -7,12 h-54 q-12,0 -7,-12 l24,-44z" fill="#fff6e8" fill-opacity=".85" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><path d="M-21,-26 h42 l9,16 q4,10 -6,10 h-48 q-10,0 -6,-10z" fill="${ROSE}"/><circle cx="-4" cy="-40" r="4" fill="none" stroke="${INK}" stroke-width="1.6"/><circle cx="6" cy="-62" r="3" fill="none" stroke="${INK}" stroke-width="1.6"/><circle cx="-2" cy="-92" r="5" fill="none" stroke="${INK}" stroke-width="1.6"/></g>`;
const bulb=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wob)">${[0,1,2,3,4,5,6,7].map(i=>{const a=i/8*Math.PI*2;return `<path d="M${Math.cos(a)*40},${Math.sin(a)*40-6} L${Math.cos(a)*58},${Math.sin(a)*58-6}" stroke="${GOLD}" stroke-width="4" stroke-linecap="round"/>`}).join('')}<path d="${blob(0,-8,26,28,18,.02)}" fill="#fff3b8" stroke="${INK}" stroke-width="2.6"/><path d="M-8,-4 q8,-12 16,0" stroke="${AMBER}" stroke-width="2.4" fill="none"/><path d="M-12,18 h24 v14 h-24z" fill="#a1a39a" stroke="${INK}" stroke-width="2.4"/><path d="M-12,24 h24" stroke="${INK}" stroke-width="1.6"/></g>`;
const bolt=(x,y,s=1)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0,0 L-18,40 L-4,40 L-16,80 L16,30 L2,30 L14,0Z" fill="${GOLD}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" opacity=".9" filter="url(#wob)"/>`;
const swoosh=(d,col)=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round" opacity=".8" filter="url(#pencil)"/><path d="${d}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="10 8" transform="translate(0 10)"/>`;
const stain=`<path d="M-22,-178 C-30,-160 -26,-140 -12,-128 C-4,-120 8,-122 14,-132 C26,-146 24,-170 16,-182Z" fill="#2a0f33" opacity=".75"/><path d="M-6,-128 q-2,10 0,16 M8,-130 q2,8 0,14" stroke="#2a0f33" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;

const NERD_P1=`ok so quick thing, not quick actually, this song works because the chord in the second chorus is borrowed from the minor key, which is why it sounds happy and sad at once, and also sorry one more point, which has a sub-point, which has a footnote, and the footnote is another voice note, and that voice note`;
const NERD_P3=`and ALSO, before you reply, i thought about what you said earlier and i have a follow-up, plus a counter-point to my own follow-up, plus a link, two links, it's a list now, numbered, with sub-bullets`;
const NERD_P4=`hold on, these goggles are rated for lab glare, not for whatever this is, technically light this bright should`;
const NERD_P5=`ok so technically, and hear me out, a cape is basically a wearable flag, and flags are`;

function ground(pal,seed){return (W,H)=>{R=rng(seed);let a=`<rect width="${W}" height="${H}" fill="${pal.page}"/>`;
  a+=wash(blob(W*.25,H*.2,W*.45,H*.25,22,.15),pal.a,.7)+wash(blob(W*.8,H*.55,W*.45,H*.3,22,.15),pal.b,.45)+wash(blob(W*.3,H*.85,W*.4,H*.2,20,.2),pal.c,.35);
  for(let i=0;i<10;i++)a+=shade(R()*W*.9,R()*H*.95,50+R()*80,6+R()*8,5,i%2?pal.b:pal.c,.3,-20+R()*40,1);
  for(let i=0;i<Math.round(W*H/2500);i++)a+=`<circle cx="${(R()*W)|0}" cy="${(R()*H)|0}" r="${(.5+R()*1.2).toFixed(1)}" fill="${GOLD}" opacity=".5"/>`;
  return a}}
/* a chapter band: its own drawn strip of sky with a little stamp at each end */
function band(type,pal,stamp,o={}){return (W,H)=>bg(type,W,H,700+stamp.length%97,pal,o)+[90].map((x,i)=>`<g transform="translate(${x} ${H/2}) rotate(${i?8:-8})"><path d="${blob(0,0,44,44,20,.04)}" fill="${CREAM}" stroke="${INK}" stroke-width="3" filter="url(#wob)"/><path d="${blob(0,0,37,37,18,.05)}" fill="none" stroke="${INK}" stroke-width="1.4" stroke-dasharray="4 4"/>${stamp}</g>`).join('')}
const ST={
  note:P.sticky(-20,-18,40,36,-6),
  phone:P.phone(0,0,.85,-10),
  voice:`<g transform="scale(.8)">${vnote(-34,-11,68,-6,'#ffe3a8')}</g>`,
  drop:`<path d="M0,-24 q-18,24 0,36 q18,-12 0,-36z" fill="#a1a39a" stroke="${INK}" stroke-width="2.4" filter="url(#wob)"/>`,
  hammer:P.hammer(10,-6,.28,40),
  star:`<g transform="scale(.9)"><use href="#star"/></g>`
};
const FLY='M300,170 C300,60 420,40 470,90 C490,110 510,100 530,90 L530,330 C560,360 690,320 720,200 C720,172.4 697.6,150 670,150 C642.4,150 620,172.4 620,200 C620,227.6 642.4,250 670,250 C697.6,250 720,227.6 720,200 C722,270 712,320 690,350';

const CHAPTERS=[
/* ================= CHAPTER 1 ================= */
{id:'ch1',num:1,title:'A Cow Gets Named',song:'Risk It All',pal:PAL.c1,mk:'salmon',stars:.62,tilt:-14,
 band:(W,H)=>band('pencil',PAL.c1,ST.note,{base:'#6b2a5e'})(W,H)+[[250,40,-12],[330,120,8],[470,30,5],[640,135,-7],[790,46,10],[880,118,-4]].map(([x,y,r],i)=>i%2?`<g transform="translate(${x} ${y}) rotate(${r})">${sbub(-26,-14,52,28,-22,22,i%4?'#ffe3a8':CREAM,2)}</g>`:P.sticky(x-18,y-16,36,32,r,i%4?'#f7cbd9':'#ffd86b')).join(''),ground:ground(PAL.c1,101),
 rows:[[0,1],[2,3]],
 panels:[
  {W:660,H:440,bg:['paper'],cue:'risk',
   art:(W,H)=>{R=rng(111);let a=flask(616,382);
     a+=cow(150,422,.95,'o> wob sweat',{pose:'hold',hold:P.phone(0,30,.8)});
     a+=`<path d="M200,300 C260,200 380,170 450,215" fill="none" stroke="${PAL.c1.a}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`;
     a+=`<g transform="translate(318 196) rotate(-10)">${sbub(-40,-24,80,48,-36,30,'#ffe3a8',2.4)}<path d="M-22,-6 h44 M-22,6 h30" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/></g>`;
     a+=nerd(500,430,.95,'huge o brow:up');
     a+=arrow('M70,300 q10,-26 40,-32')+arrow('M612,150 q-14,-24 -54,-26');
     return a},
   t:[{k:'narr',x:24,y:22,w:350,html:'<small>MARCH 2026</small>A girl messages a <b>very weird nerd.</b>'},
      {k:'lab',x:36,y:304,w:80,html:'Gauri',rot:-6},{k:'lab',x:600,y:156,w:60,html:'me',rot:4}]},
  {W:460,H:440,bg:['halftone',{fx:230,fy:300}],
   art:(W,H)=>cow(230,478,1.5,'wide wob shake sweat',{pose:'hold',hold:P.phone(0,30,.8)}),
   t:[{k:'bub',x:44,y:22,w:300,html:'I’ll be honest <b>I’m scared of you</b>',tail:['b',62]}]},
  {W:460,H:500,bg:['speed',{fx:330,fy:110}],
   art:(W,H)=>{let a=nerd(190,770,1.35,'squint smirk brow:raise');
     a+=`<g transform="translate(330 104) rotate(-6)">${box(-90,-36,180,72,'#fff3d6')}</g>`;
     a+=cow(392,496,.42,'flat pout steam');return a},
   t:[{k:'narr',x:18,y:20,w:200,html:'He squints at <b>her name.</b>'},
      {k:'sign',x:246,y:76,w:168,fs:40,rot:-6,html:'GAURI'},
      {k:'bub',x:236,y:176,w:206,html:'Gauri… sounds like <b class="c">cow‑ri.</b>',tail:['b',18]}]},
  {W:660,H:500,bg:['wash'],
   art:(W,H)=>{let a=bulb(420,96,.9);
     a+=nerd(220,566,1.05,'star grin sparkle brow:up',{arms:'shrug',top:P.sticky(-66,-474,132,98,-5)});
     a+=cow(520,488,.92,'angry O vein');
     a+=ln('M600,236 l6,-26 M612,240 l14,-18 M590,238 l-2,-24',3,PAL.c1.a);return a},
   t:[{k:'sign',x:152,y:72,w:132,fs:16,rot:-5,html:'GAURI = COW.<br>memory trick.<br>do not forget.'}]}
 ]},

/* ================= CHAPTER 2 ================= */
{id:'ch2',num:2,title:'She Calls Anyway',song:'Risk It All',pal:PAL.c2,mk:'orange',stars:.42,tilt:-10,
 band:band('burst',PAL.c2,ST.phone,{base:'#f2b35c',fx:560,fy:150}),ground:ground(PAL.c2,202),
 rows:[[0,1],[2,3]],
 panels:[
  {W:440,H:460,bg:['lamp',{fx:200}],
   art:(W,H)=>P.bigPhone(318,300,.95)+cow(140,440,.9,'det grit sweat'),
   t:[{k:'narr',x:20,y:28,w:290,html:'Calling him was <b>scary.</b> She did it <b class="s">anyway.</b>'}]},
  {W:680,H:460,bg:['screentone',{fx:190,fy:280,spot:'#ffe7b0'}],
   art:(W,H)=>{R=rng(221);let a=`<path d="M400,0 L330,460" stroke="${INK}" stroke-width="7"/><path d="M412,0 L342,460" stroke="${PAL.c2.b}" stroke-width="4"/>`;
     a+=cow(180,446,1.0,'wet wob shake',{pose:'hold',hold:P.phone(0,30,.8)});
     a+=nerd(540,472,.92,'x wobble bigsweat shake');
     for(let i=0;i<3;i++)a+=ln(`M${250+i*30},${250-i*14} q8,-10 0,-20 q-8,-10 0,-20`,3,PAL.c2.a)+ln(`M${450+i*24},${180-i*10} q8,-10 0,-20 q-8,-10 0,-20`,3,PAL.c2.a);
     return a},
   t:[{k:'narr',x:20,y:20,w:300,html:'The <b>first and only</b> call.'}]},
  {W:680,H:500,bg:['burst',{fx:300,fy:350}],
   art:(W,H)=>{R=rng(231);let a=nerd(300,524,1.0,'smug flat brow:raise blush',{arms:'out1',top:stain});
     a+=P.glass(400,236,150)+P.splash(392,272,1.1);
     a+=cow(566,494,.85,'xd wail drops',{r:-10});return a},
   t:[{k:'narr',x:20,y:20,w:320,html:'He spills water all over his jeans. It looks <b class="s">VERY</b> bad.'},
      {k:'bub',x:400,y:100,w:250,html:'So… now we’re <b>both</b> nervous.',tail:['b',12]},
      {k:'lab',cls:'pp',x:490,y:258,w:150,html:'(she laughs)',rot:-6}]},
  {W:440,H:500,bg:['pencil'],
   art:(W,H)=>cow(150,482,.95,'sp O sparkles',{cape:'big'})+nerd(372,524,.86,'side wobble blush',{arms:'out',flip:true}),
   t:[{k:'ash',x:140,y:24,w:280,fs:16,h:12,html:'you’re becoming batman gauri…?<br>step one.<br><span style="display:block;font-size:.5em;line-height:1.25;margin-top:.5em;opacity:.8">'+NERD_P5+'</span>',tail:['b',72]},
      {k:'narr',x:16,y:150,w:150,html:'Way <b>too big.</b>'}]}
 ]},

/* ================= CHAPTER 3 ================= */
{id:'ch3',num:3,title:'They Get Too Close',song:'Cloud 9',cue:'cloud',pal:PAL.c3,mk:'gold',stars:.05,tilt:0,
 band:band('glow',PAL.c3,ST.voice,{base:'#d4568c'}),ground:ground(PAL.c3,303),
 bandFx:'<div class="pulse" style="position:absolute;left:50%;top:50%;width:16cqw;height:16cqw;margin:-8cqw 0 0 -8cqw;top:70%;border-radius:50%;background:radial-gradient(#fff6dc 0,#fcb31599 30%,#fcb31500 70%)"></div>',
 rows:[[0,1],[2,3]],
 panels:[
  {W:660,H:430,bg:['notes'],
   art:(W,H)=>{R=rng(311);let a='';
     [[70,392,74,-6],[120,402,84,4],[30,404,70,8],[200,396,90,-3],[260,404,78,6],[150,380,70,-12],[90,368,66,10],[250,374,80,-8],[330,400,86,3],[380,384,74,-10],[420,404,80,5],[560,398,80,-4],[600,380,52,8],[330,372,70,12]].forEach(([x,y,w,r],i)=>a+=vnote(x,y,w,r,i%3==0?'#ffe3a8':i%3==1?CREAM:'#fad3e1'));
     a+=nerd(506,416,.86,'dot talk speed');
     a+=cow(178,394,.95,'hap tongue blush');
     a+=arrow('M66,312 q14,-24 46,-24')+arrow('M612,214 q-8,-26 -40,-36');return a},
   t:[{k:'narr',x:22,y:22,w:330,html:'A cow named <b>Gauri</b>. A very weird nerd (me). <b class="c">Booboo era</b>: when we couldn’t stop talking.'},
      {k:'lab',x:24,y:316,w:80,html:'Gauri',rot:-6},{k:'lab',x:590,y:220,w:60,html:'me',rot:4},
      {k:'ash',x:214,y:112,w:236,h:18,html:NERD_P1,tail:['br',70]}]},
  {W:440,H:430,bg:['screentone',{fx:220,fy:200,spot:'#ffd1e0'}],cue:'gasp',
   art:(W,H)=>{R=rng(321);let a=nerd(360,566,1.05,'fog wobble bigsweat');
     a+=cow(84,404,.68,'ov cat blush nerv');
     a+=sbub(18,110,92,44,46,262)+sbub(124,96,212,96,370,236)+sbub(148,214,176,74,108,272);
     a+=bars(150,124,150,4,15,10)+bars(176,236,124,3,15,10);
     for(let i=0;i<9;i++){const x=12+i*52+j(6),y=430+j(4);a+=`<path d="${blob(x,y,26,30,14,.06)}" fill="${INK}" filter="url(#wob)"/><path d="${blob(x+j(4),y-14,4,5.5,8,.1)}" fill="${ROSE}"/>`}
     a+=`<g transform="translate(330 352) rotate(-6)"><path d="${wob(rectPts(0,0,84,30,14),1,true)}" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>${note(14,22,.55,CREAM)}</g>`;
     a+=box(160,300,156,48);return a},
   t:[{k:'narr',x:18,y:18,w:240,html:'Truth or dare. <b>Every night.</b>'},
      {k:'bub',cls:'nobg',x:22,y:121,w:84,fs:19,html:'truth.'},
      {k:'lab',x:168,y:306,w:142,fs:15,html:'(We will not be taking questions.)'},
      {k:'lab',x:360,y:352,w:56,fs:16,html:'gasp',rot:-6}]},
  {W:460,H:540,bg:['wash'],
   art:(W,H)=>{R=rng(331);let a='';const fills=[CREAM,'#fad3e1','#ffe3a8',CREAM,'#f2b3cb'];
     for(let r=9;r>=0;r--){const y=520-r*36,half=220*(1-r/10.6),cx=236;let x=cx-half;
       while(x<cx+half-20){const w=34+R()*40;const f=fills[(R()*fills.length)|0];
         a+=`<g transform="rotate(${j(8).toFixed(1)} ${x+w/2} ${y})"><path d="${wob(rectPts(x,y-14,w,26,10),.9,true)}" fill="${f}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/><path d="M${x+8},${y+12} l-4,9 l11,-9" fill="${f}" stroke="${INK}" stroke-width="1.6"/>`;
         a+=R()<.22?xdMark(x+w/2,y-1,.7,PINK):`<path d="M${x+6},${y-5} h${w-14} M${x+6},${y+3} h${(w-14)*.6}" stroke="${INK}" stroke-width="1.6" opacity=".6"/>`;
         a+=`</g>`;x+=w+2+R()*6}}
     a+=cow(244,190,.55,'hap xd tears');
     a+=nerd(398,536,.5,'focus tongue',{arms:'type'});
     a+=sbub(300,466,58,30,374,470,CREAM,2)+`<g fill="${INK}"><circle cx="316" cy="481" r="3"/><circle cx="328" cy="481" r="3"/><circle cx="340" cy="481" r="3"/></g>`;return a},
   t:[{k:'cnt',x:16,y:20,w:180,html:'<b>38,526</b> messages.<br><b>1,531</b> XDs.<br><b>53</b> ‘wanna talk’s.'},
      {k:'ash',x:186,y:282,w:196,h:16,html:NERD_P3,tail:['br',60]}]},
  {W:640,H:540,bg:['glow'],cue:'glow',
   art:(W,H)=>cow(196,520,.95,'shut grit')+nerd(468,532,.92,'glare o',{arms:'down'}),
   art2:(W,H)=>{R=rng(341);let a=`<circle cx="320" cy="170" r="300" fill="url(#burn)"/>`;
     for(let i=0;i<30;i++){const an=i/30*Math.PI*2,r1=70+R()*20,r2=230+R()*200;a+=`<path d="M${(320+Math.cos(an)*r1).toFixed(0)},${(170+Math.sin(an)*r1).toFixed(0)} L${(320+Math.cos(an)*r2).toFixed(0)},${(170+Math.sin(an)*r2).toFixed(0)}" stroke="${i%2?GOLD:CREAM}" stroke-width="${(2+R()*5).toFixed(1)}" stroke-linecap="round" opacity=".75" filter="url(#pencil)"/>`}
     a+=`<rect width="640" height="540" fill="#fff6e4" opacity=".3"/>`+starAt(300,166,1.15)+starAt(342,160,1.15);
     return `<clipPath id="g4"><path d="${wob(rectPts(10,10,620,520,24),1.4,true)}"/></clipPath><g clip-path="url(#g4)">${a}</g>`},
   t:[{k:'narr',x:20,y:20,w:330,html:'Too bright to <b class="s">see straight.</b>'},
      {k:'ash',x:470,y:140,w:150,h:14,html:NERD_P4,tail:['b',10]}]}
 ]},

/* ================= CHAPTER 4 ================= */
{id:'ch4',num:4,title:'They Drift Far',song:'rain, then Reckless',pal:PAL.c4,mk:'lilac',stars:.84,tilt:-6,dim:.5,
 band:band('rain',PAL.c4,ST.drop,{base:'#1c1b1e'}),ground:ground(PAL.c4,404),
 rows:[[0,1],[2],[3]],
 panels:[
  {W:660,H:440,bg:['scribble',{base:'#2f2e31'}],cue:'snap',
   art:(W,H)=>{R=rng(411);let a=bolt(600,30,.9);
     a+=cow(140,424,.85,'sad frown tear',{pose:'hold',hold:P.cup(0,26)});
     a+=nerd(530,432,.85,'dead flat gloom soul',{arms:'out',flip:true,top:P.cup(94,-262,10)});
     a+=ln('M140,356 C200,330 260,300 300,306 q10,4 6,16',2.4,CREAM,'')+ln('M448,208 C410,230 360,260 334,268 q-10,4 -8,-12',2.4,CREAM,'');
     a+=sparkle(318,288,14,GOLD)+ln('M300,270 l-12,-14 M334,302 l14,10 M322,262 l4,-18',2.6,GOLD,'');return a},
   t:[{k:'narr',x:22,y:22,w:330,html:'<small>JUNE</small>We decided to <b>stop talking.</b>'}]},
  {W:460,H:440,bg:['tally'],cue:'thunder',
   art:(W,H)=>starAt(40,40,.55)+starAt(420,410,.55),
   over:()=>'<div style="position:absolute;inset:12px;overflow:hidden;pointer-events:none"><div class="raink" style="background-image:var(--rain)"></div></div>',
   t:[{k:'narr',x:22,y:358,w:170,fs:30,html:'<b class="c">94 days.</b>'}]},
  {W:1120,H:420,bg:['pencil',{base:'#2f2e31'}],
   art:(W,H)=>{R=rng(431);let a=`<path d="${wob([[560,0],[548,60],[572,120],[540,190],[570,260],[546,330],[566,420],[1120,420],[1120,0]],3,true)}" fill="#3e3d41"/>`;
     a+=`<path d="${wob([[560,0],[548,60],[572,120],[540,190],[570,260],[546,330],[566,420]],2)}" fill="none" stroke="${CREAM}" stroke-width="3"/>`;
     a+=`<ellipse cx="300" cy="400" rx="60" ry="10" fill="#111314" opacity=".5"/>`;
     [90,170].forEach((x,i)=>a+=`<path d="M${x},400 q40,-${50+i*14} 80,0" fill="none" stroke="${GOLD}" stroke-width="2.4" stroke-dasharray="3 8" opacity=".8"/>`);
     a+=`<path d="M250,400 q30,-40 50,-60" fill="none" stroke="${GOLD}" stroke-width="2.4" stroke-dasharray="3 8"/>`;
     a+=cow(300,350,.9,'det tongue',{pose:'hop',r:-8});
     a+=`<circle cx="840" cy="${410-250*.85}" r="40" fill="${GOLD}" opacity=".35" filter="url(#soft)"/>`;
     a+=nerd(840,410,.85,'closed smile',{arms:'chest'});return a},
   t:[{k:'narr',x:24,y:24,w:230,html:'Each grows <b>alone.</b>'},
      {k:'lab',cls:'pp',x:400,y:150,w:150,fs:20,html:'small hops.<br>no cape.',rot:-4},
      {k:'lab',cls:'pp',x:900,y:110,w:200,fs:20,html:'feeling it in his body, not just his head.',rot:3}]},
  {W:1120,H:480,bg:['door',{dx:500,dw:180,dark:'#19181b'}],cue:'door',
   art:(W,H)=>{let a=nerd(230,470,.85,'huge scream brow:up shake',{arms:'shrug'});
     a+=cow(690,452,1.0,'o< cat blush');
     a+=`<path d="${wob([[690,56],[790,26],[790,470],[690,442]],1.4,true)}" fill="#3b2a24" stroke="${INK}" stroke-width="3"/><path d="M700,70 L780,44 M700,430 L780,456" stroke="#5a4036" stroke-width="3"/><circle cx="772" cy="250" r="6" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>`;return a},
   t:[{k:'bub',x:700,y:110,w:300,html:'AHEM<br>Very long time no see <b>hehe</b>',tail:['b',6]},
      {k:'lab',cls:'lt',x:520,y:448,w:200,fs:18,html:'(creak)',rot:-3}]}
 ]},

/* ================= CHAPTER 5 ================= */
{id:'ch5',num:5,title:'They Break It Right',song:'Reckless',pal:PAL.c5,mk:'ember',stars:.26,tilt:-8,
 band:band('embers',PAL.c5,ST.hammer,{base:'#5a1c1c'}),ground:ground(PAL.c5,505),
 rows:[[0,1],[2,3]],
 panels:[
  {W:460,H:460,bg:['wash'],
   art:(W,H)=>cow(126,444,.85,'o> tiny')+nerd(336,452,.85,'dot grin sweat',{arms:'down'})+`<path d="M210,420 q20,-30 40,0" stroke="${PAL.c5.a}" stroke-width="2.4" fill="none" stroke-dasharray="3 6"/>`,
   t:[{k:'narr',x:20,y:20,w:290,html:'We were <b>back.</b> <b class="c">Mostly.</b>'}]},
  {W:660,H:460,bg:['embers',{base:'#3a1212'}],
   art:(W,H)=>{let a=swoosh('M300,40 C420,-10 560,60 560,190',GOLD)+swoosh('M290,90 C400,40 520,90 530,200',AMBER);
     a+=nerd(420,470,.75,'angry scream brow:angry steam',{arms:'up',top:P.hammer(-28,-560,.8,-14)});
     a+=cow(150,446,.85,'angry frown steam');return a},
   t:[{k:'sign',x:339,y:18,w:110,fs:22,rot:-14,html:'MY POINT'},
      {k:'narr',x:22,y:22,w:220,html:'One <b class="s">big</b> fight.'}]},
  {W:460,H:500,bg:['pencil',{base:'#f1d6dc'}],
   art:(W,H)=>P.hammer(220,452,.5,92)+cow(104,486,.75,'wet wob')+nerd(320,494,.95,'^soft frown brow:worry',{arms:'down'}),
   t:[{k:'narr',x:18,y:18,w:300,html:'He puts it down. Pushes his goggles up. <b>Just looks.</b>'},
      {k:'bub',x:16,y:190,w:200,html:'I should’ve <b>voiced it</b>',tail:['b',40]}]},
  {W:660,H:500,bg:['bricks'],
   art:(W,H)=>{R=rng(541);let a='';for(let r=0;r<3;r++)for(let k=0;k<5-r;k++)a+=P.brick(250+k*62+r*31,470-r*28,58,26,j(2));
     a+=cow(150,484,.8,'hap smile',{pose:'hold',hold:P.brick(0,22,46,22)});
     a+=nerd(560,490,.85,'^hap tongue',{arms:'out',flip:true});
     a+=P.brick(560-94*.85,490-262*.85,58,26,-8);return a},
   t:[{k:'narr',x:20,y:20,w:300,html:'We build it back <b>together.</b>'},
      {k:'sign',cls:'pp',x:280,y:140,w:290,fs:28,rot:-3,html:'conflicts or <b class="s">opportunities.</b>'}]}
 ]},

/* ================= ENDING ================= */
{id:'end',num:0,title:'Orbit',song:'Cloud 9',cue:'ending',pal:PAL.end,mk:'gold',stars:.12,tilt:0,orbit:true,
 band:band('stars',PAL.end,ST.star),ground:ground(PAL.end,606),
 rows:[[0],[1],[2],[3]],
 panels:[
  {W:1120,H:520,bg:['stars'],
   art:(W,H)=>{let a=`<path d="${wob([[0,520],[0,440],[200,420],[420,398],[560,392],[700,398],[900,420],[1120,440],[1120,520]],3,true)}" fill="#14060f"/>`;
     return a+cow(500,402,.48,'o^ smile')+nerd(620,404,.45,'^up smile',{arms:'down'})},
   over:()=>'<div class="orbit" style="inset:auto;left:50%;top:34%;width:0;height:0"><img class="bstar" alt="" style="left:-11cqw;top:-3.5cqw;margin:0;width:7cqw;height:7cqw"><img class="bstar" alt="" style="left:4cqw;top:-3.5cqw;margin:0;width:7cqw;height:7cqw"></div>',
   t:[{k:'narr',x:40,y:30,w:440,html:'Close enough to <b>see each other.</b> Far enough to <b class="s">both shine.</b>'}]},
  {W:1120,H:440,bg:['pencil',{base:'#3a1538'}],
   art:(W,H)=>cow(440,402,.9,'o^ smile blush')+nerd(660,420,.85,'^hap grin blush sparkle',{arms:'down'}),
   t:[{k:'bub',x:90,y:60,w:300,html:'I’ve been feeling <b>pretty good tooo</b>',tail:['br',86]},
      {k:'bub',x:740,y:52,w:230,html:'me too, <b>cow.</b>',tail:['b',6]}]},
  {W:1120,H:520,bg:['burst',{fx:660,fy:380,base:'#2c0f2b'}],cue:'cape',
   art:(W,H)=>nerd(330,500,.9,'^teary wobble tears',{arms:'chest'})+cow(660,490,1.0,'sp tiny'),
   art2:(W,H)=>panelSVG(W,H,722,bg('burst',W,H,722,PAL.end,{fx:660,fy:380,base:'#2c0f2b'})+nerd(330,500,.9,'^teary wobble tears',{arms:'chest'})+cow(660,490,1.0,'sp tiny sparkles',{cape:'fit'})+sparkle(560,200,12,GOLD)+sparkle(780,170,9,GOLD)+sparkle(800,330,7,CREAM)),
   t:[{k:'narr',x:40,y:30,w:330,html:'A long beat of <b>silence.</b>'},
      {k:'narr',cls:'after',x:720,y:60,w:330,html:'Then the cape. It <b class="c">fits</b> now.'}]},
  {W:1120,H:620,bg:['stars'],cue:'flight',
   art:(W,H)=>nerd(300,600,1.0,'^up O',{arms:'down'}),
   over:()=>{const rel=FLY.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g,(m,x,y)=>`${(+x-300).toFixed(1)},${(+y-170).toFixed(1)}`);
     R=rng(919);let bs='';for(let i=0;i<10;i++){const a=i/10*Math.PI*2+.3;bs+=sparkle(750+Math.cos(a)*(260+R()*60),500+Math.sin(a)*(95+R()*30),9+R()*9,i%2?'#fdf4e3':'#fcb315').replace(' filter="url(#wob)"',` style="animation-delay:${(i*.05).toFixed(2)}s"`)}
     return `<svg class="fly" viewBox="0 0 1120 620" aria-hidden="true"><path class="trail" d="${FLY}" fill="none" stroke="#fcb315" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/><g class="burst">${bs}</g><g transform="translate(300 170)"><image data-cow="1" x="-110" y="-130" width="220" height="220"/><animateMotion dur="3.6s" begin="indefinite" fill="freeze" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".45 .05 .4 1" path="${rel}"/></g></svg>`},
   t:[{k:'big',x:420,y:440,w:660,fs:58,html:'<span class="w1">Happy 19th,</span><br><span class="w2" style="color:#fdf4e3">Batman.</span>'}]}
 ]}
];
/* the rain that falls over Chapter 4: a light tile, moved by transform only */
(function(){R=rng(77);let s='';for(let i=0;i<16;i++){const x=R()*120,y=R()*120,l=10+R()*16;s+=`<path d='M${x.toFixed(0)},${y.toFixed(0)} l${(-l*.3).toFixed(1)},${l.toFixed(1)}' stroke='%23c8c9c2' stroke-width='1.4' stroke-linecap='round' opacity='.8'/>`}
  document.documentElement.style.setProperty('--rain',`url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>${s}</svg>")`)})();
