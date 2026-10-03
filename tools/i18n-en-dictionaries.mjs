// Terminology dictionaries and translation catalogs for Stronghold Protocol English localization.
// Covers Stronghold-exclusive bosses, enemies, garrisons, item flavors, choice events, and tokens.

export const GARRISON_EVENT_TYPES = Object.freeze({
  '整备能力': 'Rest Phase Ability',
  '战斗能力': 'Combat Ability',
  '部署能力': 'Deployment Ability',
  '获得能力': 'Obtain Ability',
  '进阶能力': 'Promotion Ability',
  '离场能力': 'Exit Ability',
  '击倒能力': 'Defeat Ability',
  '特殊能力': 'Special Ability',
});

export const BOSS_ABILITIES = Object.freeze({
  boss_1: [
    'Randomly selects targets to fire rays that deal Arts damage',
    '【Calamitous Doom】Selects the Operator with the highest ATK and fires an <Armor-Piercing Shell>. Upon reaching the target, it explodes, Stunning the target and surrounding 8 tiles for an extended period and dealing Physical damage every second; attacking the shell several times while in flight will destroy it',
    'When HP falls below a certain percentage, reduces Physical and Arts damage taken, and 【Calamitous Doom】fires an additional <Armor-Piercing Shell>',
    '【Death Swarm】Periodically summons drone units',
    'Hidden Core',
    '【Sword and Hammer of Past Days】Upon fulfilling specific conditions in the simulation and entering the Hidden Core round, <OpFor: Armor> gains the <“Armor-Severing Sword”> and <“Armor-Crushing Hammer”> and appears in its complete form',
    '<“Armor-Severing Sword”> and <“Armor-Crushing Hammer”> are initially invulnerable; when shot down, a percentage of damage taken is transferred to <OpFor: Armor>',
    '<“Armor-Severing Sword”> and <“Armor-Crushing Hammer”> periodically fly toward the Operator with the lowest ATK and self-destruct, Stunning the target and Operators in the surrounding 8 tiles and dealing Physical damage every second, before returning to <OpFor: Armor>; while in flight, they lose invulnerability and can be shot down after taking damage a certain number of times; once shot down, they are treated as ground units and take increased damage',
  ],
  boss_2: [
    'Prioritizes attacking the unit with the highest DEF',
    'Attacks inflict Corrosion Injury',
    'Cannot be blocked',
    'Attacking the same target gradually increases Attack Speed',
    '【Final Retribution】Ceases attacks, significantly increases Movement Speed, and charges toward the unit with the highest DEF on the battlefield, dealing Physical damage to units in its path',
    'Hidden Core',
    '【Unfinished Confession】Upon fulfilling specific conditions in the simulation and entering the Hidden Core round, <“Spring of Gun-Shattering”> appears on the battlefield, and <OpFor: Gun> takes significantly reduced Physical and Arts damage',
    '【Vow of Blind Faith】Links with all <“Spring of Gun-Shattering”> on the field; when a <“Spring of Gun-Shattering”> takes damage, a percentage of that damage is transferred to <OpFor: Gun>; allied units caught in the link take Physical damage every second',
    '【Doomsday Sermon】Continually summons all <“Spring of Gun-Shattering”> to move toward itself; <“Spring of Gun-Shattering”> gains significantly increased Movement Speed and invulnerability, dealing Physical damage to allied units in its path',
  ],
  boss_3: [
    'While on the field, continually summons <“Lingering Echo”> in 【Dark Lament】form; when HP falls below a certain percentage, reduces summon interval',
    'Prioritizes attacking <“Lingering Echo”> in 【Dark Lament】form',
    '【Rhapsody of Split Pipe】Strikes all <“Lingering Echo”> in 【Dark Lament】form with a 3-hit attack, dealing area Arts damage and Necrosis Injury',
    'Hidden Core',
    'Upon fulfilling specific conditions in the simulation and entering the Hidden Core round, <OpFor: String> appears simultaneously alongside <OpFor: Pipe>',
  ],
  boss_4: [
    'Simultaneously attacks the two units with the highest DEF',
    '【Spring Tide】Deals Arts damage and Nervous Impairment to all allied units',
    '【Collapse】Deals Physical damage to several allied units',
    '【Fission】Summons spawn to ensnare allied units, Stunning them',
    '【Species Outburst】Drains all Life Points after battle continues for an extended period',
  ],
  boss_5: [
    'Has a chance to dodge Physical and Arts attacks when unblocked; when blocked, quickly moves behind the blocker, leaving an <Ominous Apparition> behind',
    'Uses a skill that deals Physical damage to surrounding units; attacks and skills ignore a portion of the target DEF and inflict additional Nervous Impairment',
  ],
  boss_6: [
    'When HP drops to 50% or below, increases DEF and RES, and 【All Under Heaven】activates two pieces of equipment each time',
    '【Repel】After battle continues for an extended period, deals Arts splash damage to all allied units and drains all Life Points',
    '【Sovereign Mandate】Locks onto an allied unit and the 4 adjacent tiles, dealing heavy Physical damage to units in the area and generating random equipment on those tiles',
    '【All Under Heaven】While equipment is on the battlefield, animates a piece of equipment; different equipment produces different effects',
  ],
  boss_7: [
    '【Icicle】Attacks deal Physical damage to an entire row of allied units',
    '【Nature\'s Surge】Stuns an allied unit and causes it to take continuous Arts damage',
    'When HP falls below 50%, reduces Physical and Arts damage taken, and 【Icicle】and 【Nature\'s Surge】select an additional target',
  ],
  boss_8: [
    'Randomly selects targets to perform Arts attacks',
    'When HP falls below a certain percentage, reduces Physical and Arts damage taken, and 【Calamitous Doom】fires an additional <Armor-Piercing Shell>',
    '【Calamitous Doom】Selects the Operator in range with the highest ATK and fires an <Armor-Piercing Shell>. Upon reaching the target, it explodes, Stunning the target and surrounding 8 tiles and dealing Physical damage every second; requires several attacks to destroy while in flight',
    '【Death Swarm】Periodically summons drone units',
    'Hidden Core',
    '【Sword and Hammer of Past Days】Upon fulfilling specific conditions in the simulation and entering the Hidden Core round, <OpFor: Armor> unleashes its complete form',
  ],
  boss_9: [
    'Prioritizes attacking the unit with the highest DEF',
    'Attacks inflict Corrosion Injury',
    'Cannot be blocked',
    'Attacking the same target gradually increases Attack Speed',
    '【Final Retribution】Ceases attacks, significantly increases Movement Speed, and charges toward the unit with the highest DEF on the battlefield, dealing Physical damage to units in its path',
    'Hidden Core',
    '【Unfinished Confession】Upon fulfilling specific conditions in the simulation and entering the Hidden Core round, <“Spring of Gun-Shattering”> appears on the battlefield, and <OpFor: Gun> takes greatly reduced Physical and Arts damage',
    '【Vow of Blind Faith】Links with all <“Spring of Gun-Shattering”> on the field; when a <“Spring of Gun-Shattering”> takes damage, a percentage of that damage is transferred to <OpFor: Gun> and other <“Spring of Gun-Shattering”> on the field; allied units caught in the link take Physical damage every second',
    '【Doomsday Sermon】Continually summons all <“Spring of Gun-Shattering”> to move toward itself; <“Spring of Gun-Shattering”> gains significantly increased Movement Speed and invulnerability, dealing Physical damage to allied units in its path',
  ],
  boss_10: [
    'While on the field, continually summons <“Lingering Echo”> in 【Dark Lament】form; when HP falls below a certain percentage, reduces summon interval',
    'Prioritizes attacking <“Lingering Echo”> in 【Dark Lament】form',
    '【Rhapsody of Split Pipe】Strikes all <“Lingering Echo”> in 【Dark Lament】form with a 3-hit attack, dealing area Arts damage and Necrosis Injury',
    'Hidden Core',
    'Upon fulfilling specific conditions in the simulation and entering the Hidden Core round, <OpFor: String> appears simultaneously alongside <OpFor: Pipe>',
  ],
});

export const SP_ENEMIES = Object.freeze({
  enemy_9006_actoxi: {
    name: 'OpFor: Fissure',
    desc: 'Simulated combat projection with corrosive capabilities.',
    abilities: ['Periodically inflicts area Arts damage and Corrosion Injury'],
  },
  enemy_9007_acelem: {
    name: 'OpFor: Quagmire',
    desc: 'Simulated combat projection that impedes movement.',
    abilities: ['Slows nearby allied units and deals continuous Arts damage'],
  },
  enemy_9008_acbunn: {
    name: 'OpFor: Spines',
    desc: 'Simulated combat projection covered in thorny spikes.',
    abilities: ['Reflects a portion of Physical damage taken back to the attacker'],
  },
  enemy_9009_acfort: {
    name: 'OpFor: Dark Cloud',
    desc: 'Simulated combat projection with heavy aerial bombardment.',
    abilities: ['Fires high-explosive shells at distant targets; requires 3 SP to unleash volley'],
  },
  enemy_9010_acpupp: {
    name: 'OpFor: Regeneration',
    desc: 'Simulated combat projection that recovers HP continuously.',
    abilities: ['Continuously regenerates HP; rate increases when below 50% HP'],
  },
  enemy_9011_acrefr: {
    name: 'OpFor: Mirror',
    desc: 'Simulated combat projection equipped with reflective shielding.',
    abilities: ['Gains a high Arts barrier and reflects Arts damage while active'],
  },
  enemy_9012_acloon: {
    name: 'Yan\'s Protection',
    desc: 'Protective manifestation summoned by Yan Alliances.',
    abilities: ['Attacks up to 3 targets simultaneously and inflicts Burn and Elemental Fragility'],
  },
  enemy_9013_acstmk: {
    name: 'OpFor: Armor',
    desc: 'Heavy mechanical combat projection representing fortress defenses.',
    abilities: BOSS_ABILITIES.boss_1,
  },
  enemy_9013_acstmk_2: {
    name: 'OpFor: Armor',
    desc: 'Fortified version of the mechanical armor projection.',
    abilities: BOSS_ABILITIES.boss_8,
  },
  enemy_9014_acstma: {
    name: '“Armor-Severing Sword”',
    desc: 'Aerial offensive drone component of OpFor: Armor.',
    abilities: ['Initially invulnerable; flies toward the Operator with the lowest ATK and self-destructs'],
  },
  enemy_9015_acstmb: {
    name: '“Armor-Crushing Hammer”',
    desc: 'Heavy aerial drone component of OpFor: Armor.',
    abilities: ['Initially invulnerable; flies toward the Operator with the lowest ATK and self-destructs'],
  },
  enemy_9016_acstmr: {
    name: 'Armor-Piercing Shell',
    desc: 'Projectile fired by OpFor: Armor targeting high ATK units.',
    abilities: ['Explodes on impact, Stunning nearby allies and dealing Physical damage every second; can be destroyed in flight'],
  },
  enemy_9017_achunt: {
    name: 'OpFor: Gun',
    desc: 'Swift sniper combat projection prioritizing high DEF targets.',
    abilities: BOSS_ABILITIES.boss_2,
  },
  enemy_9017_achunt_2: {
    name: 'OpFor: Gun',
    desc: 'Reinforced sniper projection with amplified suppression.',
    abilities: BOSS_ABILITIES.boss_9,
  },
  enemy_9018_actrpa: {
    name: '“Spring of Gun-Shattering”',
    desc: 'Possesses significant damage reduction while shielded.',
    abilities: [
      '【Unfinished Prayer】Initially possesses one type of special shield; unblockable while shield is active; recharges shield after a delay',
      'Elemental Shield: Greatly reduces Physical and Arts damage; disappears upon Elemental Burst. Periodically fires bouncing elemental bullets',
      'Arts Shield: Grants Arts Barrier; greatly reduces Physical damage taken. Counterattacks with Physical damage and Corrosion Injury',
      'Hit-Count Shield: Depleted after taking damage a set number of times. Periodically executes a 10-hit attack',
    ],
  },
  enemy_9019_actrpb: {
    name: '“Spring of Gun-Shattering”',
    desc: 'Secondary resonance spring linked with OpFor: Gun.',
    abilities: ['Transfers damage to OpFor: Gun while linked'],
  },
  enemy_9020_actrpc: {
    name: '“Spring of Gun-Shattering”',
    desc: 'Tertiary resonance spring linked with OpFor: Gun.',
    abilities: ['Transfers damage to OpFor: Gun while linked'],
  },
  enemy_9021_acduml: {
    name: 'OpFor: Pipe',
    desc: 'Musical combat projection utilizing acoustic waves; prioritizes “Sound of Broken String”.',
    abilities: BOSS_ABILITIES.boss_3,
  },
  enemy_9021_acduml_2: {
    name: 'OpFor: Pipe',
    desc: 'Amplified acoustic projection deploying hazardous resonances.',
    abilities: BOSS_ABILITIES.boss_10,
  },
  enemy_9022_acdumm: {
    name: 'OpFor: String',
    desc: 'Acoustic companion projection; prioritizes “Sound of Split Pipe”.',
    abilities: [
      'Permanently invulnerable; retreats when <OpFor: Pipe> is defeated',
      'Continually summons <“Lingering Echo”> in 【Golden Wail】form',
      'Prioritizes attacking <“Lingering Echo”> in 【Golden Wail】form',
      '【Rhapsody of Broken String】Strikes all <“Lingering Echo”> in 【Golden Wail】form, dealing large area Arts damage and Necrosis Injury, and shifting their form',
    ],
  },
  enemy_9023_acdums: {
    name: '“Sound of Split Pipe” / “Sound of Broken String”',
    desc: 'Deals Arts damage and Necrosis Injury to surrounding units when attacked; shifts form after taking damage a set number of times.',
    abilities: [
      'Requires multiple hits to defeat',
      'Can only be blocked by units with Block Count 2 or higher',
      '【Polyphony】Shifts between 【Golden Wail】and 【Dark Lament】forms',
      '【Golden Wail】form increases ASPD; shifts to 【Dark Lament】after taking damage a set number of times',
      '【Dark Lament】form decreases Movement Speed and increases ATK; shifts to 【Golden Wail】after taking damage a set number of times',
      'Deals area Arts damage and Necrosis Injury around itself when taking damage',
      'All <“Lingering Echo”> units periodically perform a synchronized concert dealing area Arts damage and Necrosis Injury',
    ],
  },
  enemy_9032_aclionk: {
    name: 'Alistair, Final Flame of the Empire',
    desc: 'The last fading glow of an empire, a phantom beneath a tarnished crown. Speak against him, against the supreme glory and might of Victoria—he will weigh your words, and he may forgive.',
    abilities: BOSS_ABILITIES.boss_6,
  },
  enemy_9033_acdeer: {
    name: '“Samivilinn,” the Resolution of the Very North',
    desc: 'Born from frost, earth, and Sami\'s singular thought. When HP falls below 50%, reduces Physical and Arts damage taken, and all skills target an additional unit.',
    abilities: BOSS_ABILITIES.boss_7,
  },
  enemy_10112_ymgds: {
    name: 'Careless Underling',
    desc: 'Stunned for a duration after being Shifted.',
    abilities: ['Stunned for a duration after being Shifted'],
  },
  enemy_10116_ymgtop: {
    name: 'Suiton Ninja',
    desc: 'Continuously deals Physical damage to surrounding units while spinning; stops spinning when Shifted.',
    abilities: [
      'Continuously deals Physical damage to surrounding units while spinning; stops spinning when Shifted',
      'Deflects <“Certain Destiny”>',
    ],
  },
  enemy_10118_ymgprc: {
    name: 'Mio',
    desc: 'Attacks twice. Every few attacks, the next attack deals higher damage.',
    abilities: [
      'Attacks strike twice',
      '【Cold Dawn】Every few attacks, the next attack deals higher damage in a 2-hit strike',
      'Deflects <“Certain Destiny”>',
    ],
  },
  enemy_10122_uacann_2: {
    name: 'Army Heavy Artillery',
    desc: 'Attacks leave behind burning areas; prioritizes attacking Guerilla Miners when given Commander orders.',
    abilities: [
      'Attacks leave behind burning areas',
      'Prioritizes attacking <Guerilla Miners> when given Commander orders',
    ],
  },
  enemy_10124_uashld_2: {
    name: 'Army Veteran Shieldguard',
    desc: 'More easily targeted by allied attacks, can engage 3 Miners; takes reduced damage when given Commander orders.',
    abilities: [
      'More easily targeted by allied attacks, can engage 3 <Guerilla Miners>',
      'Takes reduced damage when given Commander orders',
    ],
  },
  enemy_10127_rkmbst_2: {
    name: 'Abnormal Manglerbeast α',
    desc: 'More easily targeted by allied attacks, takes reduced damage, increases ASPD; loses ability after being attacked several times by Guerilla Miners.',
    abilities: [
      'More easily targeted by allied attacks, takes reduced damage, increases ASPD',
      'Loses ability after being attacked several times by <Guerilla Miners>',
    ],
  },
  enemy_10138_xdsnow: {
    name: 'Snowchild',
    desc: 'Takes additional damage upon colliding with high ground.',
    abilities: ['Takes additional damage upon colliding with high ground'],
  },
  enemy_10141_xdpeng_2: {
    name: 'Frostcradler Fowlbeast',
    desc: 'After being Shifted, loses egg, gains increased Movement Speed and becomes unblockable.',
    abilities: ['Loses egg and becomes unblockable with increased Movement Speed after being Shifted'],
  },
  enemy_10144_xdelk_2: {
    name: 'Blackhorn Rhuul',
    desc: 'Charges up an attack to push blocking units; can be interrupted by Shift or Stun.',
    abilities: [
      '【Antler Duel】Can charge up an attack to push blocking units',
      'Upon completing charge, deals damage to target and pushes it back 1 tile; if target cannot be pushed, deals increased damage and Stuns for several seconds',
      'Charge can be interrupted by Shift, Stun, or other abnormal statuses',
    ],
  },
  enemy_10156_mncrer: {
    name: 'Novice Acolyte',
    desc: 'When defeated, replenishes water in a nearby fountain basin and heals surrounding enemies.',
    abilities: ['When defeated, replenishes water in a nearby fountain basin and heals surrounding enemies'],
  },
  enemy_10159_mntrjn: {
    name: 'Wooden Burdenbeast of Ilion',
    desc: 'Cannot be blocked; can carry up to 5 passengers, each passenger reduces Movement Speed by a certain percentage.',
    abilities: [
      'Cannot be blocked',
      'Can carry up to 5 passengers',
      'Movement Speed is reduced proportionally for each passenger carried',
    ],
  },
  enemy_10162_mnctpt: {
    name: 'Handmade Catapult',
    desc: 'Attacks strike 3 times, dealing Physical splash damage. When Immersed, attacks deviate with large random offsets.',
    abilities: [
      'Attacks strike 3 times, dealing Physical splash damage',
      'Attacks deviate with large random offsets when Immersed',
    ],
  },
});

export const GARRISON_FALLBACKS = Object.freeze({
  garrison_29_a: {
    desc: '<In battle> Whenever 1 enemy within range is Frozen, 60% chance to grant +1 stack to active [Kjerag] Alliance',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_29_b: {
    desc: '<In battle> Whenever 1 enemy within range is Frozen, 60% chance to grant +2 stacks to active [Kjerag] Alliance',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_54_b: {
    desc: '<When Rest Phase ends> +6 [Victoria] / +4 [Marvel] stacks to active Alliance for every [Victoria] / [Marvel] Operator of a different Tier on the field',
    eventTypeDesc: 'Rest Phase Ability',
  },
  garrison_55_b: {
    desc: '<In battle> Whenever this Operator spends 7 bullets, grants +14 [Laterano] and +6 [Foresight] stacks to active Alliances ([Foresight] max 42 stacks per battle)',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_95_a: {
    desc: '<In battle> When activating a skill, grants +1 stack to this Operator\'s active Alliances (max 7 stacks per battle)',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_95_b: {
    desc: '<In battle> When activating a skill, grants +2 stacks to this Operator\'s active Alliances',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_96_a: {
    desc: '<In battle> When activating a skill, grants +1 stack to active [Precision] Alliance (max 10 stacks per battle)',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_96_b: {
    desc: '<In battle> When activating a skill, grants +2 stacks to active [Precision] Alliance',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_108_a: {
    desc: '<On deployment> Grants +4 stacks to active [Kazimierz] and [Precision] Alliances (max 24 stacks per battle)',
    eventTypeDesc: 'Deployment Ability',
  },
  garrison_108_b: {
    desc: '<On deployment> Grants +8 stacks to active [Kazimierz] and [Precision] Alliances (max 48 stacks per battle)',
    eventTypeDesc: 'Deployment Ability',
  },
  garrison_117_b: {
    desc: 'When defeating an enemy, grants +2 stacks to active [Siracusa] Alliance',
    eventTypeDesc: 'Defeat Ability',
  },
  garrison_144_a: {
    desc: 'For every 3 [Kazimierz] stacks gained, this Operator\'s Redeployment Time -1.5% and ASPD +0.5',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_144_b: {
    desc: 'For every 3 [Kazimierz] stacks gained, this Operator\'s Redeployment Time -3% and ASPD +1',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_153_a: {
    desc: '<In battle> Deals Weakness damage (adapts between Physical and Arts based on target DEF/RES); first 3 enemy defeats grant +2 [Siracusa] and +1 [Marvel] stacks to active Alliances',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_153_b: {
    desc: '<In battle> Deals Weakness damage (adapts between Physical and Arts based on target DEF/RES); first 3 enemy defeats grant +4 [Siracusa] and +2 [Marvel] stacks to active Alliances',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_157_a: {
    desc: '<When obtained> +6 [Yan] and +3 [Marvel] stacks (does not require active Alliance)',
    eventTypeDesc: 'Obtain Ability',
  },
  garrison_157_b: {
    desc: '<When obtained> +12 [Yan] and +6 [Marvel] stacks (does not require active Alliance)',
    eventTypeDesc: 'Obtain Ability',
  },
  garrison_159_a: {
    desc: 'For every 3 [Kazimierz] stacks gained, this Operator gains +0.5 ASPD',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_159_b: {
    desc: 'For every 3 [Kazimierz] stacks gained, this Operator gains +1 ASPD',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_160_a: {
    desc: '<When battle starts> Grants self and the Operator 1 tile ahead the Trait: "For every 3 [Kazimierz] stacks gained, ASPD +0.5"',
    eventTypeDesc: 'Combat Ability',
  },
  garrison_160_b: {
    desc: '<When battle starts> Grants self and the Operator 1 tile ahead the Trait: "For every 3 [Kazimierz] stacks gained, ASPD +1"',
    eventTypeDesc: 'Combat Ability',
  },
});

export const ITEM_FLAVORS = Object.freeze({
  '维式重锤': 'A heavy hammer that once forged peace in the factories of Victoria.\n“With the same iron and fire, bring an end to that war.”',
  '坚守盾牌': 'A shield belonging to those who hold the line.\n“Push, parry, suppress—active defense begins with mastery of the shield.”',
  '盟约之币': '“The cornerstone driving the protocol simulation forward.”',
  '随身身份牌': 'A handy gadget certifying one\'s identity. “Welcome to the simulation battlefield.”',
  '源石溶剂': '“A classic military application of industrial Originium materials.”',
  '不屈弹射器': 'A catapult for the unyielding.\n“It lets you move quickly between platforms, assuming you learn to use it instead of falling flat on your snout.”',
  '紧急调度券': '“Sometimes success just takes a little bit of luck…”',
  '战栗维式重锤': 'A heavy hammer once forged in Victorian mills, now carrying even greater renown.\n“With the same iron and fire, bring an end to that war.”',
  '萨尔贡浓茶': 'A potent tea that saved lives in the scorched wastes of Sargon.\n“Do not fear bitterness; it keeps you sharp, and sharpness keeps you alive.”',
  '精打细算玩偶': '“She always wants to save a little extra for you.”',
  '特种急救箱': 'First aid kit customized for frontline operators in extreme hazards.',
  '战术折叠椅': 'Portable folding chair widely praised by battlefield commanders.',
  '奇迹骰子': '“Fate favors the bold… or at least those who roll high.”',
  '隐秘通信终端': 'Secure terminal facilitating tactical coordination under jamming.',
  '战术目镜': 'Enhanced optics providing real-time combat analytics.',
  '便携式发电机': 'Compact power generator keeping field equipment operational.',
  '先锋战旗': 'Standard carried high to rally advancing squads.',
  '术师聚焦镜': 'Focusing lens amplifying Arts discharge coherence.',
  '医疗无人机电池': 'High-capacity cell extending drone support uptime.',
  '重装强化外骨骼': 'Reinforced frame providing superior defensive bracing.',
  '狙击测距仪': 'Precision rangefinder compensating for ballistic arc and drift.',
});

export const CHOICE_EVENTS = Object.freeze({
  '机密商店': {
    name: 'Classified Shop',
    desc: 'Obtain equipment supplies without spending Funds.',
  },
  '悬赏决策': {
    name: 'Bounty Decision',
    desc: 'Select a bounty target to earn bonus rewards.',
  },
  '战术决策': {
    name: 'Tactical Decision',
    desc: 'Make coordinated adjustments and prepare for battle.',
  },
  '道具补给': {
    name: 'Item Supply',
    desc: 'Obtain equipment supplies without spending Funds.',
  },
});

export const TOKENS = Object.freeze({
  token_10000_silent_healrb: {
    name: 'Medical Drone',
    desc: 'Cannot be targeted by attacks; restores HP of surrounding allies.',
  },
  token_10006_vodfox_doll: {
    name: 'Curse Doll',
    desc: 'Cannot be targeted by attacks.',
  },
  token_10011_beewax_oblisk: {
    name: 'Desert Obelisk',
    desc: 'Blocks 3 enemies.',
  },
  token_10012_rosmon_shield: {
    name: 'Rosmontis-gear',
    desc: 'Blocks 2 enemies; reduces DEF of blocked enemies.',
  },
  token_10015_dusk_drgn: {
    name: '“Freeling”',
    desc: 'Attacks deal Arts damage.',
  },
  token_10017_skadi2_dedant: {
    name: 'Skadi\'s Seaborn',
    desc: 'Cannot be targeted by attacks.',
  },
  token_10019_nearl2_sword: {
    name: '“Blazing Sun”',
    desc: 'Blocks 2 enemies.',
  },
  token_10022_kazema_shadow: {
    name: 'Kaminingyo',
    desc: 'Does not block enemies.',
  },
  token_10028_vigil_wolf: {
    name: 'Wolf Pack',
    desc: 'Can only be deployed within summoner\'s attack range.',
  },
  token_10030_mlyss_wtrman: {
    name: 'Flowing Shape',
    desc: 'Initial attacks deal Arts damage; can only be deployed within summoner\'s attack range.',
  },
  token_10031_swire2_gdtrap: {
    name: 'Champagne Bomb',
    desc: 'Explosive trap; detonates upon contact or manual activation.',
  },
  token_10039_ulpia_block: {
    name: 'Undeviating Course',
    desc: 'Ulpianus returns to this position when skill ends; other Operators cannot deploy here.',
  },
  token_10040_siege2_vlion: {
    name: 'Golden Vow',
    desc: 'Blocks 1 enemy; attacks deal True damage.',
  },
  token_10041_cathy_catsld: {
    name: 'Crawler Protection Unit',
    desc: 'Cannot be targeted by attacks.',
  },
  token_10056_angel2_target: {
    name: 'Delivery Coordinates',
    desc: 'Cannot be targeted by attacks.',
  },
  token_10057_svash2_eagle1: {
    name: 'Eye of the Snowstorm',
    desc: 'Added to deployment queue while SilverAsh the Unyielding is on field. DP cost varies with skill.',
  },
  token_10057_svash2_eagle2: {
    name: 'Eye of the Snowstorm',
    desc: 'Added to deployment queue while SilverAsh the Unyielding is on field. DP cost varies with skill.',
  },
  token_10057_svash2_eagle3: {
    name: 'Eye of the Snowstorm',
    desc: 'Added to deployment queue while SilverAsh the Unyielding is on field. DP cost varies with skill.',
  },
  token_10058_sbell2_icetgt: {
    name: 'Protection Objective – Frozen',
    desc: 'Blocks 3 enemies.',
  },
  enemy_9012_acloon: {
    name: '“Yan\'s Protection”',
    desc: 'Allied unit summoned when 6 [Yan] Operators are active; gains ATK and HP equal to 30% of total ATK and HP of all [Yan] Operators on field.',
  },
  char_605_cmedic: {
    name: 'Reserve Operator - Medic',
    desc: 'Restores HP of friendly units.',
  },
  char_613_acmedc: {
    name: 'Touch',
    desc: 'Restores HP of friendly units.',
  },
});

export const STAGES = Object.freeze({
  act1autochess_m01: { name: 'Battlefield #01' },
  act1autochess_m02: { name: 'Battlefield #02' },
  act1autochess_m03: { name: 'Battlefield #03' },
  act1autochess_m04: { name: 'Battlefield #04 Active Originium' },
  act1autochess_m05: { name: 'Battlefield #05 High Tide / Floating Platforms' },
  act1autochess_m06: { name: 'Battlefield #06 Sandstorm / Earthen Structures' },
  act1autochess_m07: { name: 'Battlefield #07 Thicket' },
  act2autochess_m01: { name: 'Battlefield #05 Originium Flow Generator' },
  act2autochess_m02: { name: 'Battlefield #06 Marsh Control' },
  act2autochess_m03: { name: 'Battlefield #07 Exhaust Grate' },
  act2autochess_m04: { name: 'Battlefield #08 Tide Control' },
});

export const FACTIONS = Object.freeze({
  SPECIAL: {
    name: 'Special Enemies · Aberrant',
    desc: 'These enemies have exceptional damage output and survivability',
  },
  FLY: {
    name: 'Special Enemies · Airborne',
    desc: 'Contains many aerial units',
  },
  TIMES: {
    name: 'Special Enemies · Multi-hit',
    desc: 'Requires a certain number of hits to defeat',
  },
  ELEMENT: {
    name: 'Special Enemies · Elemental',
    desc: 'Capable of dealing Elemental Injury',
  },
  DOT: {
    name: 'Special Enemies · Damage over Time',
    desc: 'Specializes in dealing damage over time',
  },
  INVISIBLE: {
    name: 'Special Enemies · Camouflage',
    desc: 'These enemies possess Camouflage / Stealth',
  },
  REFLECTION: {
    name: 'Special Enemies · Refraction',
    desc: 'These enemies possess Refraction',
  },
});

export const MODULE_TALENT_FALLBACKS = Object.freeze({
  uniequip_002_pithst: [{
    name: 'Boundless Snowscape',
    desc: 'Every 5 seconds, generates a layer of snow on ground tiles within attack range. Ground enemies stepping on snow immediately take Arts damage equal to 100% of ATK. Each layer of snow reduces Movement Speed of all enemies passing through by 12%, stacking up to 5 times (snow disappears when the first enemy leaves the tile). Immediately generates a layer of snow upon deployment.',
  }],
  uniequip_002_sbell2: [{
    name: 'Natural Bell Toll',
    desc: 'Attacks inflict Enfeeble and deal Arts damage equal to 15% of ATK to surrounding enemies',
  }],
  uniequip_002_yu: [{
    name: 'Leisurely Cloud in the Market',
    desc: 'When there are no less than 2 Operators on field, regenerates HP and Elemental Injury equal to 1.5% of Max HP per second; when no less than 4, increases Arts damage dealt to targets during Burn Injury burst by 14%',
  }],
  uniequip_003_skadi2: [{
    name: 'Predatory Habit',
    desc: 'When allied Operators are within attack range of self or Seaborn, self ATK +9% and DEF +8%; changes to ATK +20% and DEF +8% if an [Abyssal Hunters] Operator is present; after an allied Operator is deployed within range of self or Seaborn, immediately gains 3 SP',
  }],
  uniequip_004_pasngr: [{
    name: 'Mechanic Analysis',
    desc: 'When attacks hit enemies with HP above 80%, increases damage dealt to them by 20% for 3 seconds; in Reclamation Algorithm, every 10 seconds strikes 5 targets for 500% Arts damage, grants vision for 12 seconds, and grants 2 SP to hit allies',
  }],
  uniequip_003_pepe: [{
    name: 'Diffused Lotus Fragrance',
    desc: 'While on field, all [Guard] Operators gain ATK +16%; in Reclamation Algorithm, gains vision of chests on deploy, and each attack produces an aftershock equal to 50% ATK at all Guard locations',
  }],
  uniequip_003_siege2: [{
    name: 'Unbound Edge',
    desc: 'The first time damage is dealt to each enemy, inflicts Tremble for 6 seconds (12 seconds for Elite and Leader enemies). Vina Victoria and summons deal 15% more damage to Trembling targets',
  }],
  uniequip_003_reed2: [{
    name: 'Blazing Mark',
    desc: 'When dealing damage, 30% chance to inflict Blazing Mark on enemies: ATK -20%, 38% Arts Fragile, non-stackable, lasts 8 seconds',
  }],
  uniequip_003_cello: [{
    name: 'Mental Deconstruction',
    desc: 'While on field, increases Necrosis Injury taken by all enemies on field by 20%; during Necrosis Injury burst, enemies take 150 Elemental damage per second',
  }],
  uniequip_002_nymph: [{
    name: 'Key to Mind',
    desc: 'Whenever an enemy suffers Necrosis Injury burst anywhere on field, ATK +3%, stacking up to 10 times; at 10 stacks, ASPD +12',
  }],
  uniequip_003_nymph: [{
    name: 'Soul Loss',
    desc: 'When attacking enemies during Necrosis Injury burst, causes them to take Elemental damage equal to 40% of ATK every 0.7 seconds until the burst ends',
  }],
  uniequip_003_qiubai: [{
    name: 'Fallen Blossoms',
    desc: 'Attacks have a 25% chance to Bind the target for 1.5 seconds; increases to 100% chance and 3 seconds Bind duration on the first hit against each enemy',
  }],
  uniequip_002_halo2: [{
    name: 'Data Modeling',
    desc: 'When inflicting Slow on enemies, self ASPD +1, stacking up to 25 times; at max stacks, self ATK +12%',
  }],
  uniequip_003_blkkgt: [{
    name: 'Living Legend',
    desc: 'ATK +8%; when attacking Trembling targets, ignores 33% DEF; when ground enemies enter attack range for the first time, inflicts Tremble for 6 seconds',
  }],
  uniequip_003_agoat2: [{
    name: 'Dense Mist',
    desc: 'Normal healing grants targets an additional heal and Elemental Injury recovery of 13% per second for 8 seconds (stacks up to 3 times)',
  }],
});
