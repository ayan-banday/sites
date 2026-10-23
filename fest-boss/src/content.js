// Fest Boss 2: all story text and data. Plain ES module, no imports.
// Every spoken line: { who, text (Roman Hinglish, <=70), say (Devanagari for hi voices) }.
// Zib and narrator are read by an English-India voice, so they have no `say`.

export const CAST = {
  riya: {
    id: 'riya', name: 'Riya', color: '#9B6BFF',
    blurb: 'A purple jelly blob who wobbles when excited, which is always. Keen to try anything, new to almost everything.',
  },
  zib: {
    id: 'zib', name: 'Zib', color: '#2EC4B6',
    blurb: 'A three-eyed teal bat and a brilliant artist. Very sure of itself, and a little dramatic about it.',
  },
  gorp: {
    id: 'gorp', name: 'Gorp', color: '#8DBB3A',
    blurb: 'A slow, mossy rock golem of few words. The best builder on campus, and it knows it.',
  },
  blorb: {
    id: 'blorb', name: 'Dean Blorb', color: '#C98B5A',
    blurb: 'The big tan Dean with glasses and a tie. Pompous, but kind. Believes in you more than you do.',
  },
  bunty: {
    id: 'bunty', name: 'Bunty Bhaiya', color: '#6E7FD8',
    blurb: 'The old fest organiser. Sweaty, panicky, last seen sprinting out of the gate with a clipboard.',
  },
};

export const STYLES = [
  { id: 'direct', name: 'Direct', level: 4, skill: 'low', will: 'high', color: '#FF8A3D', icon: 'sign_direct',
    quote: 'Main dikhata hoon, step by step', tagline: 'Tell them how' },
  { id: 'coach', name: 'Coach', level: 3, skill: 'low', will: 'low', color: '#FFC93C', icon: 'sign_coach',
    quote: 'Saath karo, main wajah samjhaunga', tagline: 'Show how, explain why' },
  { id: 'support', name: 'Support', level: 2, skill: 'high', will: 'low', color: '#FF8FC7', icon: 'sign_support',
    quote: 'Tu kar sakta hai, main hoon na', tagline: 'Listen, cheer, back them' },
  { id: 'delegate', name: 'Delegate', level: 1, skill: 'high', will: 'high', color: '#2EC4B6', icon: 'sign_delegate',
    quote: 'Poora tera. Mujhe result batana', tagline: 'Hand it over, step back' },
];

export const COLD_OPEN = {
  barks: [
    { at: 1.5, who: 'bunty', text: 'Bhaago bhaago! Fest ka scaffold gir raha hai!',
      say: 'भागो भागो! फेस्ट का स्कैफोल्ड गिर रहा है!' },
    { at: 5.5, who: 'bunty', text: 'Main Bunty, purana organiser! Ab tum Fest Boss ho, bye!',
      say: 'मैं बंटी, पुराना ऑर्गनाइज़र! अब तुम फेस्ट बॉस हो, बाय!' },
    { at: 9.5, who: 'riya', text: 'Boss! Main Riya. Hum sab walkie pe hain, bhaagte raho!',
      say: 'बॉस! मैं रिया। हम सब वॉकी पे हैं, भागते रहो!' },
    { at: 14, who: 'zib', text: 'Darling, debris incoming! Jump, jump, jump!' },
    { at: 18.5, who: 'gorp', text: 'Bada speaker aage. Dabake rakho, zor se kudo.',
      say: 'बड़ा स्पीकर आगे। दबाके रखो, ज़ोर से कूदो।' },
    { at: 23, who: 'riya', text: 'Fest paanch din mein hai, aur sab kuch toota hua hai!',
      say: 'फेस्ट पाँच दिन में है, और सब कुछ टूटा हुआ है!' },
    { at: 27.5, who: 'zib', text: 'Boss, we need a miracle. Or good leadership. Both, ideally!' },
    { at: 31.5, who: 'bunty', text: 'Sorry boss! Mummy ne bulaya hai! All the best!',
      say: 'सॉरी बॉस! मम्मी ने बुलाया है! ऑल द बेस्ट!' },
    { at: 35.5, who: 'blorb', text: 'Naye Fest Boss! Hall mein aao, jaldi!',
      say: 'नये फेस्ट बॉस! हॉल में आओ, जल्दी!' },
  ],
  tipTap: 'TAP to jump',
  tipHold: 'HOLD to jump higher',
  door: { who: 'blorb', text: 'Shabaash! Andar aao, meeting shuru karte hain.',
    say: 'शाबाश! अंदर आओ, मीटिंग शुरू करते हैं।' },
};

export const MEETING = {
  lines: [
    { who: 'blorb', text: 'Namaste, Fest Boss! Main hoon Dean Blorb. Swagat hai!',
      say: 'नमस्ते, फेस्ट बॉस! मैं हूँ डीन ब्लॉर्ब। स्वागत है!' },
    { who: 'blorb', text: 'Fest paanch din mein hai. Purana boss bhaag gaya.',
      say: 'फेस्ट पाँच दिन में है। पुराना बॉस भाग गया।' },
    { who: 'blorb', text: 'Ab saari zimmedari aapki hai. Aur ye hai aapki team!',
      say: 'अब सारी ज़िम्मेदारी आपकी है। और ये है आपकी टीम!' },
    { who: 'blorb', text: 'Teen kaam, teen log. Chalo, kaam baant dete hain.',
      say: 'तीन काम, तीन लोग। चलो, काम बाँट देते हैं।' },
  ],
  assign: [
    { who: 'riya', task: 'budget',
      line: { who: 'riya', text: 'Budget? Wow, main karungi! Wobble wobble!',
        say: 'बजट? वाह, मैं करूँगी! वॉबल वॉबल!' } },
    { who: 'zib', task: 'posters',
      line: { who: 'zib', text: 'Posters! Finally, a canvas worthy of my three eyes!' } },
    { who: 'gorp', task: 'stage',
      line: { who: 'gorp', text: 'Stage. Hmm. Theek hai.',
        say: 'स्टेज। हम्म। ठीक है।' } },
  ],
  roadsIntro: { who: 'blorb', text: 'Har bande ko alag raasta chahiye. Chaar raaste hain!',
    say: 'हर बंदे को अलग रास्ता चाहिए। चार रास्ते हैं!' },
  roads: {
    direct: { who: 'blorb', text: 'Pehla, Direct. Naye bande ko seedha batao, kya karna hai.',
      say: 'पहला, डायरेक्ट। नये बंदे को सीधा बताओ, क्या करना है।' },
    coach: { who: 'blorb', text: 'Doosra, Coach. Saath karo, aur kyun karna hai, woh bhi samjhao.',
      say: 'दूसरा, कोच। साथ करो, और क्यों करना है, वो भी समझाओ।' },
    support: { who: 'blorb', text: 'Teesra, Support. Bas suno, hausla do, saath khade raho.',
      say: 'तीसरा, सपोर्ट। बस सुनो, हौसला दो, साथ खड़े रहो।' },
    delegate: { who: 'blorb', text: 'Chautha, Delegate. Kaam uska, bharosa tumhara. Peeche hat jao.',
      say: 'चौथा, डेलिगेट। काम उसका, भरोसा तुम्हारा। पीछे हट जाओ।' },
  },
  outro: { who: 'blorb', text: 'Samajh gaye? Ab jao, fest bachao! Sab tumhare bharose hain.',
    say: 'समझ गए? अब जाओ, फेस्ट बचाओ! सब तुम्हारे भरोसे हैं।' },
};

export const LOOPS = [
  {
    id: 'l1', modes: ['short', 'long'], creature: 'riya', task: 'budget', place: 'quad',
    title: 'Budget Bawaal',
    skill: 'low', will: 'high', need: 'direct',
    barks: [
      { at: 1.5, who: 'riya', cue: null, text: 'Boss, ye hai quad! Yahin fest ka cash rakha hai!',
        say: 'बॉस, ये है क्वाड! यहीं फेस्ट का कैश रखा है!' },
      { at: 4.5, who: 'riya', cue: 'skill', text: 'Spreadsheet? Wo cell, jahan paise sote hain na?',
        say: 'स्प्रेडशीट? वो सेल, जहाँ पैसे सोते हैं ना?' },
      { at: 7.5, who: 'riya', cue: null, text: 'Cash box mere paas hai. Chai bhi. Sab set hai!',
        say: 'कैश बॉक्स मेरे पास है। चाय भी। सब सेट है!' },
      { at: 10.5, who: 'riya', cue: 'will', text: 'Main bahut excited hoon! Ekdum ready, kab shuru?',
        say: 'मैं बहुत एक्साइटेड हूँ! एकदम रेडी, कब शुरू?' },
      { at: 13, who: 'riya', cue: null, text: 'Ye hawa aaj bahut shararat kar rahi hai, na?',
        say: 'ये हवा आज बहुत शरारत कर रही है, ना?' },
    ],
    breakLine: { who: 'riya', text: 'Arre! Hawa ne sab notes ud diye! Pakdo pakdo!',
      say: 'अरे! हवा ने सब नोट उड़ा दिए! पकड़ो पकड़ो!' },
    ask: { who: 'riya', text: 'Boss, ab batao, main budget kaise karun?',
      say: 'बॉस, अब बताओ, मैं बजट कैसे करूँ?' },
    read: { skill: 'Never made a budget before', will: 'Super excited, wants to start now' },
    reactions: {
      match: {
        line: { who: 'riya', text: 'Steps clear hain! Pehle ye, phir wo. Samajh gayi!',
          say: 'स्टेप्स क्लियर हैं! पहले ये, फिर वो। समझ गई!' },
        lesson: 'Riya had fire but no skill. Beginners need clear steps: Direct.',
      },
      over: {
        line: { who: 'riya', text: 'Itna control? Main bas seekh rahi thi, yaar!',
          say: 'इतना कंट्रोल? मैं बस सीख रही थी, यार!' },
        lesson: 'Riya needed plain steps, and Direct is the most hands-on style.',
      },
      under: {
        line: { who: 'riya', text: 'Boss? Kahan gaye? Kaunsa button dabana hai?',
          say: 'बॉस? कहाँ गए? कौनसा बटन दबाना है?' },
        lesson: 'Riya was keen but new. Left alone, she got lost. Beginners need Direct.',
      },
    },
  },
  {
    id: 'l2', modes: ['short', 'long'], creature: 'zib', task: 'posters', place: 'woods',
    title: 'Posters Panga',
    skill: 'high', will: 'high', need: 'delegate',
    barks: [
      { at: 1.5, who: 'zib', cue: null, text: 'Welcome to my studio, darling. A forest. So rustic!' },
      { at: 4.5, who: 'zib', cue: 'skill', text: 'I have painted forty murals taller than your hostel.' },
      { at: 7.5, who: 'zib', cue: null, text: 'Tree trunks are free billboards. Nature, so generous!' },
      { at: 10.5, who: 'zib', cue: 'will', text: 'I sketched twelve poster ideas at breakfast. On fire!' },
      { at: 13, who: 'zib', cue: null, text: 'Why is the sky so moody? Even clouds are dramatic!' },
    ],
    breakLine: { who: 'zib', text: 'Rain! My posters! Oh, the soggy tragedy!' },
    ask: { who: 'zib', text: 'So, boss. How shall we proceed? I am quite inspired.' },
    read: { skill: 'Dozens of murals, a pro artist', will: 'Bursting with ideas, ready to go' },
    reactions: {
      match: {
        line: { who: 'zib', text: 'Finally, a boss with taste! Watch me work, darling.' },
        lesson: 'Zib had skill and will. Give the whole job and step back: Delegate.',
      },
      over: {
        line: { who: 'zib', text: 'You are correcting my brushstrokes? Me? Three eyes?' },
        lesson: 'Zib was ready to fly. Steps and check-ins felt like doubt. Delegate.',
      },
      under: {
        line: { who: 'zib', text: 'Hello? Boss? Oh never mind. I shall manage.' },
        lesson: 'Zib needed no help here. Stepping back was right: Delegate.',
      },
    },
  },
  {
    id: 'l3', modes: ['short', 'long'], creature: 'gorp', task: 'stage', place: 'backstage',
    title: 'Stage Struggle',
    skill: 'high', will: 'low', need: 'support',
    barks: [
      { at: 1.5, who: 'gorp', cue: null, text: 'Backstage. Yahan stage banega.',
        say: 'बैकस्टेज। यहाँ स्टेज बनेगा।' },
      { at: 4.5, who: 'gorp', cue: 'skill', text: 'Chalis stage banaye. Ek bhi nahi gira.',
        say: 'चालीस स्टेज बनाए। एक भी नहीं गिरा।' },
      { at: 7.5, who: 'gorp', cue: null, text: 'Ye rassi, ye rig. Sab purane dost.',
        say: 'ये रस्सी, ये रिग। सब पुराने दोस्त।' },
      { at: 10.5, who: 'gorp', cue: 'will', text: 'Design pichli baar reject hua. Ab mann nahi.',
        say: 'डिज़ाइन पिछली बार रिजेक्ट हुआ। अब मन नहीं।' },
      { at: 13, who: 'gorp', cue: null, text: 'Upar ki light dheeli hai. Par chhodo.',
        say: 'ऊपर की लाइट ढीली है। पर छोड़ो।' },
    ],
    breakLine: { who: 'gorp', text: 'Dhadaam! Stage light gir gayi!',
      say: 'धड़ाम! स्टेज लाइट गिर गई!' },
    ask: { who: 'gorp', text: 'Boss, main kya karun? Mann hi nahi lag raha.',
      say: 'बॉस, मैं क्या करूँ? मन ही नहीं लग रहा।' },
    read: { skill: 'Built 40 stages, none ever fell', will: 'Design rejected, feels unheard' },
    reactions: {
      match: {
        line: { who: 'gorp', text: 'Aapne suna. Theek hai. Main bana dunga.',
          say: 'आपने सुना। ठीक है। मैं बना दूँगा।' },
        lesson: 'Gorp has the skill but lost heart. Listen and back him: Support.',
      },
      over: {
        line: { who: 'gorp', text: 'Mujhe banana aata hai. Mat sikhao.',
          say: 'मुझे बनाना आता है। मत सिखाओ।' },
        lesson: 'Gorp already knows how to build. Orders felt like an insult. Use Support.',
      },
      under: {
        line: { who: 'gorp', text: 'Kisi ko parwah nahi. Patthar thak gaya.',
          say: 'किसी को परवाह नहीं। पत्थर थक गया।' },
        lesson: 'Gorp knew the work but felt unheard. Walking away hurts. Support him.',
      },
    },
  },
  {
    id: 'l4', modes: ['short', 'long'], creature: 'riya', task: 'budget', place: 'canteen',
    title: 'Budget Round 2',
    skill: 'low', will: 'low', need: 'coach',
    barks: [
      { at: 1.5, who: 'riya', cue: null, text: 'Canteen. Yahan saare vendors ke bills aaye hain.',
        say: 'कैंटीन। यहाँ सारे वेंडर्स के बिल आए हैं।' },
      { at: 4.5, who: 'riya', cue: 'skill', text: 'Kal ka budget flop tha. Total hi galat aaya tha.',
        say: 'कल का बजट फ्लॉप था। टोटल ही गलत आया था।' },
      { at: 7.5, who: 'riya', cue: null, text: 'Red errors dekh dekh ke meri neend udd gayi.',
        say: 'रेड एरर्स देख देख के मेरी नींद उड़ गई।' },
      { at: 10.5, who: 'riya', cue: 'will', text: 'Shayad main bani hi nahi hoon is kaam ke liye.',
        say: 'शायद मैं बनी ही नहीं हूँ इस काम के लिए।' },
      { at: 13, who: 'riya', cue: null, text: 'Vendor bhaiya ka bill dekhti hoon. Uff.',
        say: 'वेंडर भैया का बिल देखती हूँ। उफ़।' },
    ],
    breakLine: { who: 'riya', text: 'Arre! Vendor ka bill dekho! Mera toh dil baith gaya!',
      say: 'अरे! वेंडर का बिल देखो! मेरा तो दिल बैठ गया!' },
    ask: { who: 'riya', text: 'Boss, mujhse nahi hoga. Ab kya karun?',
      say: 'बॉस, मुझसे नहीं होगा। अब क्या करूँ?' },
    read: { skill: 'Last budget flopped, shaky formulas', will: 'Confidence crashed, doubts herself' },
    reactions: {
      match: {
        line: { who: 'riya', text: 'Oh! Toh isliye galat aaya tha! Ab kar sakti hoon!',
          say: 'ओह! तो इसलिए गलत आया था! अब कर सकती हूँ!' },
        lesson: 'Riya lost skill and heart. Teach the why and cheer her on: Coach.',
      },
      over: {
        line: { who: 'riya', text: 'Aap sab kar rahe ho. Toh main kya karun?',
          say: 'आप सब कर रहे हो। तो मैं क्या करूँ?' },
        lesson: 'Only orders left Riya feeling useless. She needed the why and cheering: Coach.',
      },
      under: {
        line: { who: 'riya', text: 'Main haar gayi. Koi madad nahi. Chhod deti hoon.',
          say: 'मैं हार गई। कोई मदद नहीं। छोड़ देती हूँ।' },
        lesson: 'Riya could not do it and did not believe she could. She needed Coach.',
      },
    },
  },
  {
    id: 'l5', modes: ['long'], creature: 'zib', task: 'food', place: 'canteen',
    title: 'Chilli Chaos',
    skill: 'low', will: 'high', need: 'direct',
    barks: [
      { at: 1.5, who: 'zib', cue: null, text: 'A food stall! Very bold, very daring, very me.' },
      { at: 4.5, who: 'zib', cue: 'skill', text: 'I have never cooked. But how hard can noodles be?' },
      { at: 7.5, who: 'zib', cue: null, text: 'Food is simply edible painting, darling. Same thing!' },
      { at: 10.5, who: 'zib', cue: 'will', text: 'I am so ready! Chilli? I shall pour the whole jar!' },
      { at: 13, who: 'zib', cue: null, text: 'Why is the oil smoking? That is a feature, surely.' },
    ],
    breakLine: { who: 'zib', text: 'Fire! The stall is on fire! Perhaps too much chilli!' },
    ask: { who: 'zib', text: 'Boss, the stall is smoking. Shall we, ah, discuss?' },
    read: { skill: 'Great artist, but never cooked', will: 'Overconfident, jumping right in' },
    reactions: {
      match: {
        line: { who: 'zib', text: 'Oh! One spoon, not the jar. Noted, chef!' },
        lesson: 'Same Zib, new task, low skill. Style fits the task, not the person: Direct.',
      },
      over: {
        line: { who: 'zib', text: 'You are hovering over my noodles?!' },
        lesson: 'Zib was new to cooking, so clear steps were right: Direct.',
      },
      under: {
        line: { who: 'zib', text: 'Why is the stall smoking? It is fine. It is art!' },
        lesson: 'Zib is great at art but new to cooking. A new task needs clear steps: Direct.',
      },
    },
  },
  {
    id: 'l6', modes: ['long'], creature: 'gorp', task: 'stage', place: 'backstage',
    title: 'Final Sound Check',
    skill: 'high', will: 'high', need: 'delegate',
    barks: [
      { at: 1.5, who: 'gorp', cue: null, text: 'Wapas backstage. Aaj fest ki raat hai.',
        say: 'वापस बैकस्टेज। आज फेस्ट की रात है।' },
      { at: 4.5, who: 'gorp', cue: 'skill', text: 'Bolt do baar check kiye. Light bhi wire ki.',
        say: 'बोल्ट दो बार चेक किए। लाइट भी वायर की।' },
      { at: 7.5, who: 'gorp', cue: null, text: 'Naya design chal gaya. Sabko pasand aaya.',
        say: 'नया डिज़ाइन चल गया। सबको पसंद आया।' },
      { at: 10.5, who: 'gorp', cue: 'will', text: 'Ab mann hai. Gorp ko garv hai. Khud kar loonga.',
        say: 'अब मन है। गॉर्प को गर्व है। खुद कर लूँगा।' },
      { at: 13, who: 'gorp', cue: null, text: 'Sound check ka mic pakad liya. Chalu.',
        say: 'साउंड चेक का माइक पकड़ लिया। चालू।' },
    ],
    breakLine: { who: 'gorp', text: 'Kheen kheen! Mic glitch. Gorp sambhal lega.',
      say: 'खीं खीं! माइक ग्लिच। गॉर्प संभाल लेगा।' },
    ask: { who: 'gorp', text: 'Boss, sound check ka time hai. Aap kya chahte ho?',
      say: 'बॉस, साउंड चेक का टाइम है। आप क्या चाहते हो?' },
    read: { skill: 'Best builder, checked it all twice', will: 'Proud and confident again' },
    reactions: {
      match: {
        line: { who: 'gorp', text: 'Theek. Stage khada rahega. Gorp chala.',
          say: 'ठीक। स्टेज खड़ा रहेगा। गॉर्प चला।' },
        lesson: 'Gorp had skill and will back. Trust him and step away: Delegate.',
      },
      over: {
        line: { who: 'gorp', text: 'Chalis baar kiya hai. Aap kyun dekh rahe ho?',
          say: 'चालीस बार किया है। आप क्यों देख रहे हो?' },
        lesson: 'Gorp was ready. Check-ins can drain the confidence you rebuilt: Delegate.',
      },
      under: {
        line: { who: 'gorp', text: 'Gorp theek hai. Stage theek hai.',
          say: 'गॉर्प ठीक है। स्टेज ठीक है।' },
        lesson: 'Gorp needed no help here. Stepping back was right: Delegate.',
      },
    },
  },
];

export const STORM = {
  barks: [
    { at: 2, who: 'riya', text: 'Light gayi! Andhera ho gaya! Boss, kya karein?!',
      say: 'लाइट गई! अंधेरा हो गया! बॉस, क्या करें?!' },
    { at: 7, who: 'zib', text: 'Lightning! Thunder! I love it, but also, help!' },
    { at: 12, who: 'gorp', text: 'Tension mat lo. Main generator dekhta hoon.',
      say: 'टेंशन मत लो। मैं जनरेटर देखता हूँ।' },
    { at: 17, who: 'riya', text: 'Main torch laati hoon! Sab ek saath, team!',
      say: 'मैं टॉर्च लाती हूँ! सब एक साथ, टीम!' },
    { at: 22, who: 'zib', text: 'Together we can beat this storm, boss. Run, run, run!' },
  ],
};

export const FINALE = {
  barks: [
    { at: 2, who: 'riya', text: 'Boss! Fest ki raat aa gayi! Bhaago stage ki taraf!',
      say: 'बॉस! फेस्ट की रात आ गई! भागो स्टेज की तरफ!' },
    { at: 8, who: 'zib', text: 'Look at that crowd, darling! Everyone came!' },
    { at: 14, who: 'gorp', text: 'Dekho. Jo humne banaya. Sab dekh rahe hain.',
      say: 'देखो। जो हमने बनाया। सब देख रहे हैं।' },
    { at: 20, who: 'bunty', text: 'Boss! Main wapas aaya! Mummy ne bhi bhej diya!',
      say: 'बॉस! मैं वापस आया! मम्मी ने भी भेज दिया!' },
    { at: 26, who: 'riya', text: 'Kuch gadbad hui toh jugaad se sambhal lenge!',
      say: 'कुछ गड़बड़ हुई तो जुगाड़ से संभाल लेंगे!' },
    { at: 32, who: 'blorb', text: 'Shabaash, Fest Boss! Aakhri sprint, fireworks wait kar rahe hain!',
      say: 'शाबाश, फेस्ट बॉस! आखिरी स्प्रिंट, फायरवर्क्स वेट कर रहे हैं!' },
  ],
  good: {
    budget: 'Budget held. Fireworks for everyone!',
    posters: 'Zib\'s posters packed the whole quad.',
    stage: 'Gorp\'s stage stood tall and loud.',
    food: 'Hot noodles and happy crowds!',
  },
  bad: {
    budget: 'Budget ran dry. One sad rocket.',
    posters: 'Posters came out soggy. Few showed up.',
    stage: 'The stage wobbled and went crash.',
    food: 'Stall on fire. Noodles everywhere!',
  },
};

export const PROFILES = {
  situational: {
    title: 'The Situational Leader',
    line: 'You read skill and will for each task, then changed your style to fit. Keep doing that.',
  },
  micromanager: {
    title: 'The Micromanager',
    line: 'You gave too much control, even to people ready to fly. Ask what they know, then step back.',
  },
  ghost: {
    title: 'The Ghost Boss',
    line: 'You stepped back when your team needed you. Check what they need before you walk away.',
  },
  frozen: {
    title: 'The Frozen Boss',
    line: 'You froze when it counted. Name skill and will first, then pick a style fast.',
  },
};

export const COPY = {
  title: 'Fest Boss',
  subtitle: 'Lead the Situation',
  tap: 'TAP TO RUN',
  rotate: 'Turn your phone sideways',
  rotateSub: 'Fest Boss plays in landscape',
  short: 'Quick fest · 6 min',
  long: 'Full fest · 10 min',
  modeSwitch: 'Change mode',
  letsGo: "Let's go!",
  continue: 'Continue',
  replay: 'Play again',
  tryLong: 'Try the full fest',
  needed: 'Needed',
  you: 'You',
  timedOut: 'You froze!',
  tooMuch: 'Too hands-on',
  tooLittle: 'Too hands-off',
  spotOn: 'Spot on!',
  stumble: 'Stumble!',
  shield: 'Shield!',
  closing: 'Lead the situation in front of you.',
  reportTitle: 'Fest Report',
  habit: 'Your leadership habit',
  skill: 'Skill',
  will: 'Will',
  low: 'LOW',
  high: 'HIGH',
  buffs: { sync: 'In Sync', resentful: 'Resentful', lost: 'Lost' },
  tipTap: 'TAP to jump',
  tipHold: 'HOLD to jump higher',
};
