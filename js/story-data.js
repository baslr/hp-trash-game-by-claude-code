// story-data.js – All Chapter 1 narrative text as structured data
// Original text inspired by the events of Harry Potter and the Philosopher's Stone, Chapter 1
// This is an original retelling for the interactive experience

export const storyData = {
  scene1: {
    title: "The Morning at the Dursleys",
    entries: [
      {
        id: 's1_intro',
        text: "Number four, Privet Drive. Home to the Dursley family — the most determinedly ordinary people you could ever hope to meet.",
        type: 'narration'
      },
      {
        id: 's1_intro2',
        text: "Vernon and Petunia Dursley prided themselves on their complete and utter normality. Anything strange, unusual, or mysterious was simply not tolerated.",
        type: 'narration'
      },
      {
        id: 's1_dursley_desc',
        text: "Mr Dursley was a large, beefy man who ran a drill-making company called Grunnings. He had a thick moustache and practically no neck at all.",
        type: 'narration'
      },
      {
        id: 's1_petunia_desc',
        text: "His wife Petunia was thin and blonde, with an extraordinarily long neck — perfect for peering over fences at the neighbours.",
        type: 'narration'
      },
      {
        id: 's1_dudley',
        text: "They had one son, Dudley, whom they considered to be the finest child in all the land.",
        type: 'narration'
      },
      {
        id: 's1_secret',
        text: "But the Dursleys harboured a secret. A dreadful, terrible secret that haunted them day and night.",
        type: 'narration'
      },
      {
        id: 's1_potters',
        text: "Petunia had a sister. A sister who was... different. And they lived in constant fear that someone might connect them to the Potter family.",
        type: 'narration'
      },
      {
        id: 's1_morning',
        text: "On this particular grey Tuesday morning, the sky gave no hint that strange and extraordinary events were unfolding across the country.",
        type: 'narration'
      },
      {
        id: 's1_tie',
        text: "Mr Dursley selected his most boring tie, kissed his wife goodbye, and stepped outside to begin what he expected to be a thoroughly unremarkable day.",
        type: 'narration'
      },
      {
        id: 's1_cat',
        text: "That's when he noticed something odd on the corner of the street — a tabby cat, sitting rigidly on the garden wall, apparently studying a map.",
        type: 'narration'
      },
      {
        id: 's1_cat2',
        text: "The cat stared at Mr Dursley with an unnervingly intelligent gaze. He blinked, shook his head, and hurried to his car. Cats can't read maps. Obviously.",
        type: 'narration'
      },
      {
        id: 's1_cat_denial',
        text: "Putting the peculiar cat firmly out of his mind, Mr Dursley drove away, his thoughts turning to drills and the large order he hoped to secure.",
        type: 'narration'
      }
    ]
  },

  scene2: {
    title: "Strange Things in Town",
    entries: [
      {
        id: 's2_cloaks',
        text: "Stuck in the morning traffic, Mr Dursley's attention was caught by something unusual: clusters of people on the pavements, wearing long, colourful cloaks.",
        type: 'narration'
      },
      {
        id: 's2_cloaks2',
        text: "Cloaks! Of all things! Mr Dursley detested people who dressed oddly. Some ridiculous new fashion, no doubt.",
        type: 'narration'
      },
      {
        id: 's2_cloaks3',
        text: "He drummed his fingers irritably on the steering wheel, watching a huddle of cloaked figures whispering together on the street corner.",
        type: 'narration'
      },
      {
        id: 's2_whispering',
        text: "They were buzzing with excitement. And they were not all young people — one man in an emerald cloak looked even older than Mr Dursley himself. The nerve!",
        type: 'narration'
      },
      {
        id: 's2_office',
        text: "At the Grunnings office, he shouted at several employees and felt much better. By lunchtime, he decided to stretch his legs and buy a bun from the bakery.",
        type: 'narration'
      },
      {
        id: 's2_owls',
        text: "Outside the bakery, he passed another group of those peculiar cloaked strangers. They were huddled together, whispering urgently.",
        type: 'narration'
      },
      {
        id: 's2_potters',
        text: "Fragments of their conversation drifted to his ears: something about \"the Potters\" and \"their son, Harry.\"",
        speaker: 'Whispering voices',
        type: 'dialogue'
      },
      {
        id: 's2_panic',
        text: "Mr Dursley froze on the spot. A cold wave of dread washed over him. Potter. Harry. It couldn't be... could it?",
        type: 'narration'
      },
      {
        id: 's2_phone',
        text: "He rushed back to his office and grabbed the telephone, his pudgy fingers trembling as he dialled home — then stopped. What would he even say?",
        type: 'narration'
      },
      {
        id: 's2_denial',
        text: "He set the phone down and stroked his moustache. Potter was a common enough name. Surely there were hundreds of Harrys. He was being ridiculous.",
        type: 'narration'
      },
      {
        id: 's2_owls2',
        text: "But leaving the office at five o'clock, he saw something that shook him to his core: owls. Dozens of them, swooping through the daylight sky.",
        type: 'narration'
      }
    ]
  },

  scene3: {
    title: "Evening at the Dursleys",
    entries: [
      {
        id: 's3_arrive',
        text: "Mr Dursley arrived home to find everything in perfect order. Petunia chattered about the neighbours while Dudley threw cereal at the walls. Normal. Everything was normal.",
        type: 'narration'
      },
      {
        id: 's3_news',
        text: "After putting Dudley to bed, he settled into his armchair and switched on the evening news, hoping for something reassuringly mundane.",
        type: 'narration'
      },
      {
        id: 's3_newsreader',
        text: "\"In an extraordinary development, birdwatchers across the nation are reporting that owls have been behaving most unusually — flying in broad daylight, hundreds of them...\"",
        speaker: 'Newsreader',
        type: 'dialogue'
      },
      {
        id: 's3_newsreader2',
        text: "\"And Jim, can we expect any more of these owl showers tonight?\"",
        speaker: 'Newsreader',
        type: 'dialogue'
      },
      {
        id: 's3_weather',
        text: "\"Well, it's not just the owls, Ted. Viewers from all over Britain are reporting showers of shooting stars instead of the rain I predicted. Most unusual weather indeed!\"",
        speaker: 'Weatherman',
        type: 'dialogue'
      },
      {
        id: 's3_dursley_thinks',
        text: "Mr Dursley sat rigid in his armchair. Owls by daylight. People in cloaks. Shooting stars. And someone whispering about the Potters...",
        type: 'narration'
      },
      {
        id: 's3_dialog',
        text: "\"Petunia, dear... you haven't happened to hear from your sister recently, have you?\"",
        speaker: 'Mr Dursley',
        type: 'dialogue'
      },
      {
        id: 's3_petunia',
        text: "\"No. Why would I?\" she replied, her voice sharp as broken glass.",
        speaker: 'Mrs Dursley',
        type: 'dialogue'
      },
      {
        id: 's3_nothing',
        text: "\"Oh, no reason. Just... odd things on the telly. Owls. Stars. Peculiar folk wandering about in cloaks...\"",
        speaker: 'Mr Dursley',
        type: 'dialogue'
      },
      {
        id: 's3_petunia2',
        text: "\"And? What's that got to do with anything?\" Petunia's lips were pressed into a thin, dangerous line.",
        speaker: 'Mrs Dursley',
        type: 'dialogue'
      },
      {
        id: 's3_deny',
        text: "\"Nothing! Nothing at all. I just wondered if perhaps it might be connected to... her sort of people.\"",
        speaker: 'Mr Dursley',
        type: 'dialogue'
      },
      {
        id: 's3_bed',
        text: "Petunia sipped her tea in pointed silence. Vernon considered mentioning the name 'Potter' but decided he rather valued his peaceful evening.",
        type: 'narration'
      },
      {
        id: 's3_window',
        text: "Heading upstairs to bed, he paused at the window. The tabby cat was still there, perched on the wall, staring down the street as if waiting for someone.",
        type: 'narration'
      },
      {
        id: 's3_sleep',
        text: "Was he imagining all of this? Surely these strange events had nothing to do with the Potters. Surely.",
        type: 'narration'
      },
      {
        id: 's3_sleep2',
        text: "The Dursleys fell into an uneasy sleep. But outside, the cat sat perfectly still on the garden wall, watching the corner of Privet Drive with absolute concentration.",
        type: 'narration'
      }
    ]
  },

  scene4: {
    title: "Dumbledore Arrives",
    entries: [
      {
        id: 's4_night',
        text: "The cat remained motionless for hours, unflinching even as car doors slammed and owls sailed overhead. It was nearly midnight before anything happened.",
        type: 'narration'
      },
      {
        id: 's4_man',
        text: "A tall figure materialised on the corner of the street — so suddenly and silently that he might have risen from the pavement itself.",
        type: 'narration'
      },
      {
        id: 's4_desc',
        text: "He was ancient and dignified, with a silver beard long enough to tuck into his belt. He wore sweeping purple robes and half-moon spectacles that caught the lamplight.",
        type: 'narration'
      },
      {
        id: 's4_eyes',
        text: "His bright blue eyes sparkled with a knowing intelligence. This was Albus Dumbledore — the most extraordinary wizard of the age.",
        type: 'narration'
      },
      {
        id: 's4_putouter',
        text: "From within his cloak, he produced a small silver device — a Put-Outer. He raised it toward the nearest street lamp and clicked.",
        type: 'narration'
      },
      {
        id: 's4_lights_out',
        text: "The lamp went dark with a soft pop. Click — another lamp winked out. Click, click, click. One by one, every light on Privet Drive was extinguished, plunging the street into velvet darkness.",
        type: 'narration'
      },
      {
        id: 's4_cat_look',
        text: "Pocketing the Put-Outer, Dumbledore strode down the darkened street to number four, where he settled himself on the garden wall beside the watchful cat.",
        type: 'narration'
      },
      {
        id: 's4_speak',
        text: "\"Good evening, Professor McGonagall.\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      }
    ]
  },

  scene5: {
    title: "McGonagall and the Conversation",
    entries: [
      {
        id: 's5_transform',
        text: "Where the cat had been sitting, there now stood a tall, stern-looking woman in emerald robes, her dark hair pulled into a tight bun. Square spectacles framed her sharp eyes.",
        type: 'narration'
      },
      {
        id: 's5_mcg1',
        text: "\"How did you know it was me?\"",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_dum1',
        text: "\"My dear Professor, no ordinary cat sits that stiffly.\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      },
      {
        id: 's5_mcg2',
        text: "\"You'd sit stiffly too, if you'd spent all day on a stone wall.\"",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_rumors',
        text: "\"All day? Surely you could have joined the celebrations. I passed at least a dozen parties on my way here.\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      },
      {
        id: 's5_mcg3',
        text: "\"Celebrations! Yes, everyone is celebrating. And being terribly careless about it. The Muggles have noticed — owls, shooting stars, cloaked wizards everywhere.\"",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_news',
        text: "\"It was on their television news. I watched through the window.\" She nodded toward the Dursleys' darkened house.",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_voldemort',
        text: "\"Dumbledore... is it true? They're saying that last night, You-Know-Who went to Godric's Hollow. That he found the Potters.\"",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_rumor2',
        text: "\"They're saying that Lily and James are... that they're gone, Dumbledore.\" Her voice trembled.",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_confirm',
        text: "Dumbledore lowered his head in silent confirmation. McGonagall drew a sharp breath. \"I didn't want to believe it...\"",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_harry',
        text: "\"But that's not all. They say he tried to kill the Potters' baby son — little Harry. And he couldn't do it. Somehow, the child survived.\"",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_gone',
        text: "\"After everything he's done... all the lives he's taken... stopped by a baby? It's extraordinary. What happened to him?\"",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_dum2',
        text: "\"That is something we may never fully understand.\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      },
      {
        id: 's5_sherbet',
        text: "Dumbledore drew a golden pocket watch from his robes and studied it. An unusual timepiece — its twelve hands circled a face marked with tiny planets rather than numbers.",
        type: 'narration'
      },
      {
        id: 's5_watch',
        text: "\"Hagrid is running late. I presume he told you where to find me?\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      },
      {
        id: 's5_here',
        text: "\"I don't suppose you'll tell me why you've chosen this place, of all places?\"",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_dursleys',
        text: "\"I've come to bring Harry to his aunt and uncle. They are the only family he has left.\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      },
      {
        id: 's5_mcg_protest',
        text: "\"You don't mean these people? Dumbledore, you can't! I've watched them all day. They're the worst sort of Muggles imaginable!\"",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_best',
        text: "\"It is the safest place for him. I've written them a letter explaining everything.\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      },
      {
        id: 's5_letter',
        text: "\"A letter! You think a letter will make them understand? This boy will be famous! Every child in our world will know his name!\"",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_famous',
        text: "\"Precisely why he must grow up away from all of that. Fame at such a young age would be a terrible burden. Here, he can have a normal childhood.\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      },
      {
        id: 's5_agree',
        text: "McGonagall opened her mouth to argue, then closed it again. \"Yes... I suppose you're right,\" she admitted reluctantly.",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_sherbet2',
        text: "\"Sherbet lemon?\" offered Dumbledore, producing a small paper bag from his robes.",
        speaker: 'Dumbledore',
        type: 'dialogue'
      },
      {
        id: 's5_sherbet3',
        text: "\"A what?\"",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's5_sherbet4',
        text: "\"A Muggle sweet. I'm rather fond of them.\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      }
    ]
  },

  scene6: {
    title: "Hagrid's Arrival",
    entries: [
      {
        id: 's6_sound',
        text: "A deep, rumbling sound shattered the silence of the night. It grew louder and louder — both Dumbledore and McGonagall scanned the sky for its source.",
        type: 'narration'
      },
      {
        id: 's6_motorcycle',
        text: "An enormous motorcycle dropped from the clouds and touched down on the road with a tremendous roar. But enormous as the machine was, it was dwarfed by its rider.",
        type: 'narration'
      },
      {
        id: 's6_hagrid_desc',
        text: "The man was nearly twice the height of an ordinary person and several times as wide, with a wild mane of tangled black hair and a bushy beard that covered most of his face.",
        type: 'narration'
      },
      {
        id: 's6_hagrid_desc2',
        text: "His hands were the size of dustbin lids, and his boots could have belonged to a young elephant. In his massive arms, cradled with surprising gentleness, was a bundle of blankets.",
        type: 'narration'
      },
      {
        id: 's6_hagrid1',
        text: "\"Hagrid! At last. Where on earth did you get that motorcycle?\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      },
      {
        id: 's6_hagrid2',
        text: "\"Borrowed it, sir. Young Sirius Black lent it to me.\"",
        speaker: 'Hagrid',
        type: 'dialogue'
      },
      {
        id: 's6_harry',
        text: "\"No problems on the journey?\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      },
      {
        id: 's6_harry2',
        text: "\"The house was nearly destroyed, sir, but I got him out safe. The little fellow fell asleep somewhere over Bristol.\"",
        speaker: 'Hagrid',
        type: 'dialogue'
      },
      {
        id: 's6_baby',
        text: "Dumbledore and McGonagall leaned forward to peer into the bundle. Inside, barely visible among the blankets, was a sleeping baby boy.",
        type: 'narration'
      },
      {
        id: 's6_scar',
        text: "Beneath a tuft of jet-black hair on his tiny forehead, they could make out a strange mark — a thin cut in the shape of a lightning bolt.",
        type: 'narration'
      },
      {
        id: 's6_scar2',
        text: "\"Is that where...?\" McGonagall whispered.",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's6_scar3',
        text: "\"Yes. He will carry that scar forever.\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      }
    ]
  },

  scene7: {
    title: "Harry on the Doorstep",
    entries: [
      {
        id: 's7_doorstep',
        text: "Dumbledore gently took the sleeping child into his arms and turned toward the darkened house at number four.",
        type: 'narration'
      },
      {
        id: 's7_leave',
        text: "\"Could I... could I say goodbye to him, Professor?\" Hagrid's deep voice cracked with emotion.",
        speaker: 'Hagrid',
        type: 'dialogue'
      },
      {
        id: 's7_goodbye',
        text: "The giant of a man bent down and pressed a whiskery kiss to the baby's forehead. Then, without warning, he let out an enormous, anguished howl.",
        type: 'narration'
      },
      {
        id: 's7_shh',
        text: "\"Quiet! You'll wake every Muggle on the street!\" McGonagall hissed.",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's7_sorry',
        text: "\"S-sorry... I just... Lily and James... gone... and poor little Harry, left with Muggles...\" Great tears rolled down Hagrid's leathery cheeks.",
        speaker: 'Hagrid',
        type: 'dialogue'
      },
      {
        id: 's7_dum_comfort',
        text: "\"We must be strong, Hagrid. Harry will be safe here.\" McGonagall patted Hagrid's enormous arm somewhat gingerly.",
        speaker: 'McGonagall',
        type: 'dialogue'
      },
      {
        id: 's7_place',
        text: "Dumbledore stepped over the low garden wall, walked to the front door, and laid the baby gently on the doorstep. He slipped a letter into the folds of the blankets.",
        type: 'narration'
      },
      {
        id: 's7_minute',
        text: "For a long, silent moment, the three of them stood gazing at the tiny bundle on the cold stone step. Even Dumbledore's ever-present twinkle seemed to dim.",
        type: 'narration'
      },
      {
        id: 's7_well',
        text: "\"Well. That's done. There's nothing more for us here. We should go and join the celebrations.\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      },
      {
        id: 's7_hagrid_leave',
        text: "\"Right then. I'll return this motorcycle. Goodnight, Professor McGonagall. Professor Dumbledore, sir.\"",
        speaker: 'Hagrid',
        type: 'dialogue'
      },
      {
        id: 's7_fly_away',
        text: "Hagrid wiped his streaming eyes, climbed onto the motorcycle, and kicked the engine to life. With a thunderous roar, the machine rose into the sky and vanished into the night.",
        type: 'narration'
      },
      {
        id: 's7_putouter',
        text: "Dumbledore walked back to the corner of the street. He drew the Put-Outer from his cloak and clicked it. Twelve tiny orbs of golden light sailed through the air and returned to their lamps.",
        type: 'narration'
      },
      {
        id: 's7_lights',
        text: "Privet Drive flickered back to life, bathed once more in warm orange lamplight. At one end, a tabby cat slipped around a corner. At the other, a tiny bundle lay on a doorstep.",
        type: 'narration'
      },
      {
        id: 's7_goodluck',
        text: "\"Good luck, Harry.\"",
        speaker: 'Dumbledore',
        type: 'dialogue'
      },
      {
        id: 's7_gone',
        text: "With a swirl of his cloak, Dumbledore turned on his heel and vanished into the darkness, as silently as he had come.",
        type: 'narration'
      },
      {
        id: 's7_breeze',
        text: "A night breeze stirred the neat hedges of Privet Drive — the last place in the world you would expect anything remarkable to happen.",
        type: 'narration'
      },
      {
        id: 's7_sleep',
        text: "On the doorstep, the baby stirred in his sleep, one tiny hand curling around the letter. He did not know that he was special. He did not know he was famous.",
        type: 'narration'
      },
      {
        id: 's7_final',
        text: "All across the country, in hidden places and secret rooms, witches and wizards were raising their glasses in hushed, reverent voices: \"To Harry Potter — the boy who lived.\"",
        type: 'narration'
      }
    ]
  }
};
