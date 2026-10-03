// Lightweight runtime localization. Chinese remains the source language; the English game-data
// overlay is generated into /data/i18n-en.json by tools/build-i18n-en.mjs.

let locale = 'zh';
let englishCatalog = null;

const EN = Object.freeze({
  '卫戍协议：盟约': 'Stronghold Protocol: Covenant',
  '卫戍协议': 'Stronghold Protocol', '：': ': ', '盟约': 'Alliance', '博士': 'Doctor', '你': 'You', '自己': 'You', '队友': 'Teammate',
  '开始': 'Start', '确认': 'Confirm', '取消': 'Cancel', '关闭': 'Close', '完成': 'Done', '返回': 'Back', '返回战场': 'Back to Field',
  '上一页': 'Previous', '下一页': 'Next', '上一场': 'Previous', '下一场': 'Next', '设置': 'Settings', '玩法说明': 'Guide',
  '背景音乐': 'Background Music', '音效': 'Sound Effects', '静音': 'Mute', '显示伤害数字': 'Damage Numbers', '画面质量': 'Graphics Quality',
  '高': 'High', '中': 'Medium', '低': 'Low', '开启': 'On', '已关闭': 'Off', '语言': 'Language', '中文': '中文', '英文': 'English',
  '博士代号': 'Doctor Callsign', '请输入博士代号': 'Enter a Doctor callsign', '输入你的代号': 'Enter your callsign',
  '收到同盟邀请': 'Alliance invitation received', '输入代号后将自动加入': 'Enter a callsign to join automatically',
  '非官方同人复刻 · 游戏素材版权归 上海鹰角网络 / Yostar 所有': 'Unofficial fan remake · Game assets © Hypergryph / Yostar',
  '调配资金与干员，与同伴协同布防，抵御多波次进攻，直至击败敌方领袖。': 'Manage Funds and Operators, coordinate defenses, and defeat the enemy leader.',
  '准备连接': 'Ready to connect', '正在连接服务器': 'Connecting to server', '已连接服务器': 'Connected to server',
  '正在验证身份': 'Verifying identity', '连接中断，正在重连': 'Connection lost, reconnecting', '连接已关闭': 'Connection closed',
  '立即重连': 'Reconnect now', '重新连接': 'Reconnect', '重试': 'Retry', '刷新页面': 'Reload page', '在此页面继续': 'Continue here',
  '正在同步同盟状态…': 'Syncing alliance state…', '该身份已在其他页面登录': 'This identity is open in another tab',
  '独立模拟': 'Solo Simulation', '同盟模拟': 'Alliance Simulation', '创建同盟': 'Create Alliance', '加入同盟': 'Join Alliance',
  '同盟密钥': 'Alliance Key', '创建者': 'Host', '离开': 'Leave', '离开同盟': 'Leave Alliance', '准备就绪': 'Ready', '取消准备': 'Cancel Ready',
  '准许进入模拟': 'Start Simulation', '已就绪': 'Ready', '等待中': 'Waiting', '模拟': 'Simulation', '难度': 'Difficulty',
  '标准模拟': 'Standard Simulation', '险境模拟': 'Perilous Simulation', '绝境模拟': 'Dire Simulation', '终极模拟': 'Ultimate Simulation',
  '作战环境较为温和': 'Moderate combat environment', '作战环境困难': 'Difficult combat environment', '作战环境无比困难': 'Extremely difficult combat environment',
  '常规奖励': 'Regular rewards', '大幅增加奖励': 'Increased rewards', '可使用盟约数增加': 'More Alliances available',
  '出现更加危险的敌人': 'More dangerous enemies appear', '出现极度危险的敌人': 'Extremely dangerous enemies appear',
  '时长较短的模拟训练': 'A short training simulation', '敌方攻击强度较低的模拟训练': 'A simulation with weaker enemies',
  '敌方攻击强度较高的模拟训练': 'A simulation with stronger enemies', '敌方攻击强度极高的模拟训练': 'A simulation with very strong enemies',
  '敌方攻击强度到达极限的模拟训练': 'A simulation at the limit of enemy strength',
  '独自调配资金与干员，以自己的节奏完成整场模拟。': 'Manage Funds and Operators alone and play at your own pace.',
  '休整期与机变阶段不限时': 'Rest and Choice phases have no time limit', '战场固定': 'Fixed battlefield',
  '联防阶段 · 最终攻势合并生命值': 'Joint Defense · shared Life Points in Final Assault',
  '移除 AI 队友': 'Remove AI teammate', '移除该 AI 队友': 'Remove this AI teammate', '复制邀请链接': 'Copy invite link', '复制同盟密钥': 'Copy alliance key',
  '连接中断，请稍候重试': 'Connection lost; try again shortly', '仍有博士未准备就绪': 'Some Doctors are not ready',
  '确认本局信息': 'Confirm Simulation Info', '选择策略': 'Select Strategy', '休整期': 'Rest Phase', '作战中': 'In Combat',
  '联防阶段': 'Joint Defense', '最终攻势': 'Final Assault', '隐秘核心': 'Hidden Core', '模拟结束': 'Simulation Complete', '结算': 'Results',
  '1/2 确认本局信息': '1/2 Confirm Simulation Info', '2/2 选择策略': '2/2 Select Strategy',
  '等待轮到你': 'Waiting for your turn', '跳过本轮，稍后再选': 'Skip this turn and pick later', '跳过次数已用完': 'Skip already used',
  '队友已选': 'Chosen by teammate', '已选择': 'Selected', '决策中': 'Choosing', '当前轮到你决策': 'Your turn to choose',
  '确认选择': 'Confirm Selection', '选择中': 'Selecting', '再次点击': 'Click again', '倒计时结束后仍未选定将自动分配': 'A choice will be assigned when time expires',
  '策略': 'Strategy', '特质': 'Attribute', '机变': 'Choice', '团队增益': 'Team Buff', '效果': 'Effect', '生效中的效果': 'Active Effects',
  '调度中心': 'Dispatch Center', '升级调度中心': 'Upgrade Dispatch Center', '刷新': 'Refresh', '冻结': 'Freeze', '资金不足': 'Insufficient Funds',
  '价格': 'Price', '已售出': 'Sold Out', '无法购买': 'Cannot Purchase', '确认购买': 'Confirm Purchase', '剩余可放置角色：': 'Remaining deployment slots:',
  '干员': 'Operator', '装备': 'Equipment', '奇术': 'Art', '道具': 'Item', '出售': 'Sell', '撤退': 'Retreat', '销毁': 'Destroy',
  '撤退至整备区': 'Return to Bench', '销毁道具': 'Destroy Item', '临时整备区': 'Temporary Bench', '整备区': 'Bench', '作战区': 'Field',
  '技能': 'Skill', '天赋': 'Talent', '特性': 'Trait', '说明': 'Description', '属性': 'Stats', '选择模组': 'Select Module', '不装备模组': 'No Module',
  '未装备模组': 'No Module', '已调整': 'Customized', '保存中…': 'Saving…', '同步中…': 'Syncing…', '同步失败': 'Sync failed', '已同步': 'Synced',
  '生命上限': 'Max HP', '攻击': 'ATK', '防御': 'DEF', '法抗': 'RES', '阻挡': 'Block', '攻击间隔': 'Attack Interval', '再部署': 'Redeploy',
  '物理': 'Physical', '法术': 'Arts', '真实': 'True', '治疗': 'Healing', '无': 'None', '普通': 'Normal', '精英': 'Elite', '领袖': 'Leader',
  '先锋': 'Vanguard', '近卫': 'Guard', '重装': 'Defender', '狙击': 'Sniper', '术师': 'Caster', '医疗': 'Medic', '辅助': 'Supporter', '特种': 'Specialist',
  '自动回复': 'Auto Recovery', '攻击回复': 'Offensive Recovery', '受击回复': 'Defensive Recovery', '被动': 'Passive', '自动触发': 'Auto Trigger',
  '晕眩': 'Stun', '沉默': 'Silence', '沉睡': 'Sleep', '冻结': 'Freeze', '浮空': 'Levitate', '召唤物': 'Summon', '目标价值': 'Life Cost',
  '所属盟约': 'Alliances', '未激活': 'Inactive', '已激活': 'Active', '层数': 'Stacks', '在场': 'On field', '本局禁用': 'Disabled this run',
  '层数叠加已禁用': 'Stack gains disabled', '敌方情报': 'Enemy Intel', '查看即将迎击的敌方单位': 'View incoming enemies', '敌方领袖': 'Enemy Leader',
  '目标生命值': 'Life Points', '部署费用（再部署消耗）': 'Deployment Cost', '暂停': 'Pause', '继续作战': 'Resume Combat', '暂停中': 'Paused',
  '全景': 'Overview', '左侧战场': 'Left Field', '右侧战场': 'Right Field', '上一个战场': 'Previous Field', '下一个战场': 'Next Field',
  '前往查看': 'View Field', '正在查看': 'Viewing', '观战': 'Spectate', '联防阵地': 'Joint Defense Field', '领袖战场': 'Leader Field',
  '作战结束': 'Combat Complete', '作战结束，等待队友完成作战': 'Combat complete; waiting for teammates',
  '击倒敌人': 'Enemies Defeated', '刷新次数': 'Refreshes', '剩余生命': 'Life Remaining', '同盟剩余生命': 'Alliance Life Remaining',
  '完美作战': 'Perfect Battles', '损失生命': 'Life Lost', '晋升次数': 'Elite Promotions', '消耗资金': 'Funds Spent', '盟约层数': 'Alliance Stacks',
  '造成伤害': 'Damage Dealt', '配发装备': 'Equipment Issued', '领袖伤害': 'Leader Damage', '阵容已撤离': 'Lineup Withdrawn', '未击倒': 'Not Defeated',
  '全屏': 'Fullscreen', '退出全屏': 'Exit Fullscreen', '禁用': 'Disabled', '加载中': 'Loading', '详情': 'Details',
  '基础规则': 'Basic Rules', '休整期 · 资金与调度': 'Rest · Funds and Dispatch', '休整期 · 区域': 'Rest · Areas', '干员晋级': 'Operator Promotion',
  '盟约激活与叠加': 'Alliance Activation and Stacks', '策略与轮选': 'Strategies and Draft', '机变阶段': 'Choice Phase', '作战期': 'Combat Phase',
  '敌人类型': 'Enemy Types', '协同战斗': 'Co-op Combat', '限时战斗': 'Timed Combat', '章节': 'Chapter', '页码': 'Page',
  '该页面暂时无法显示': 'This page is currently unavailable', '界面发生错误': 'Interface Error', '重新加载界面': 'Reload Interface',
  // Connection, room and general status text.
  '请求超时，请重试': 'Request timed out; try again', '未连接到服务器': 'Not connected to server', '连接已断开，请重试': 'Connection lost; try again',
  '客户端版本与服务器不一致，请刷新页面': 'Client version mismatch; reload the page', '未知错误': 'Unknown error',
  '发生未知错误': 'An unexpected error occurred', '启动失败，请刷新页面重试': 'Startup failed; reload the page and try again',
  '服务器会话已重置，上一局模拟已结束': 'Server session reset; the previous simulation has ended',
  '服务器会话已重置，已返回大厅': 'Server session reset; returned to the lobby',
  '你已在其他同盟中，请先离开当前同盟': 'You are already in another Alliance; leave it first',
  '你已不在该同盟中': 'You are no longer in this Alliance', '创建者已离开，同盟已解散': 'The host left; the Alliance was disbanded',
  '由于长时间断开连接，你已离开同盟': 'You left the Alliance after being disconnected too long', '同盟已解散': 'Alliance disbanded',
  '你已被移出同盟': 'You were removed from the Alliance', '同盟已过期': 'Alliance expired', '服务器维护中，同盟已关闭': 'Server maintenance; Alliance closed',
  '该身份已在其他页面登录，本页已断开': 'This identity is open in another tab; this tab was disconnected',
  '与服务器的连接已中断，正在重连': 'Connection lost; reconnecting', '复制失败，请手动复制': 'Copy failed; please copy manually',
  '已复制邀请链接': 'Invite link copied', '复制密钥': 'Copy Key', '复制链接': 'Copy Link', '模拟难度': 'Simulation Difficulty',
  '由创建者选择': 'Selected by the host', '等待所有博士准备就绪': 'Waiting for all Doctors to be ready',
  '准备就绪后，创建者即可开始模拟': 'Once ready, the host can start the simulation',
  '*模拟协议已就绪，准许进入模拟': '*Simulation protocol ready; simulation authorized',
  '*同盟人数达标，准许进入模拟': '*Alliance roster complete; simulation authorized',
  '已就绪 · 等待创建者开始模拟': 'Ready · Waiting for the host to start',
  '你是同盟的创建者，离开后创建者身份将移交或同盟解散。确定离开吗？': 'You are the host. Leaving will transfer host status or disband the Alliance. Leave now?',

  // Shared battlefield, Alliance and player-state UI.
  '我的盟约': 'My Alliances', '部署干员以激活盟约': 'Deploy Operators to activate Alliances', '尚未激活盟约': 'has no active Alliances',
  '核心盟约': 'Core Alliance', '附加盟约': 'Additional Alliance', '当前效果': 'Current Effect', '盟约效果': 'Alliance Effect',
  '成员': 'Members', '在场': 'On Field', '名': 'members', '名及以下': 'members or fewer', '含整备区': 'including Bench',
  '队友作战进度': 'Teammate Battle Progress', '你已被淘汰，正在观战': 'You were eliminated and are spectating',
  '你已被淘汰，可点击队友头像前往查看': 'You were eliminated; select a teammate to spectate',
  '你已被淘汰 · 可继续观战队友': 'You were eliminated · You may continue spectating teammates',
  '你自己': 'You', '无人在家': 'No one here', '当前无法查看': 'Cannot spectate now',
  '无效的目标': 'Invalid target', '该队友已被淘汰，无法查看': 'That teammate was eliminated and cannot be viewed',
  '该队友已被淘汰，无法查看其阵地': "That teammate was eliminated; their field cannot be viewed",
  '该队友当前没有战场': 'That teammate has no active battlefield',
  '队友与你在同一战场，使用 ‹ › 切换视角': 'Your teammate is on the same battlefield; use ‹ › to switch view',
  '无法查看另一组队友的战场': "Cannot view the other team's battlefield",
  '无法查看另一组队友的战场情况': "Cannot view the other team's battlefield",
  '作战中无法查看队友，作战结束后可前往查看': 'You can spectate teammates after your battle ends',
  '前往查看': 'Spectate', '返回自己': 'Return to Your Field', '正在查看': 'Viewing', '同盟成员': 'Alliance Members',
  '查看自己的阵地': 'View your field', '连接已断开': 'Disconnected', '已离开': 'Left', '已淘汰': 'Eliminated',

  // Shop, loadout and details.
  '升级': 'Upgrade', '确认升级': 'Confirm Upgrade', '已满级': 'Max Level', '调度中心已达最高等级': 'Dispatch Center is at max level',
  '解冻': 'Unfreeze', '展开商店': 'Expand Shop', '收起': 'Collapse', '目前资金': 'Current Funds', '免费': 'Free',
  '已购买': 'Purchased', '已招募': 'Recruited', '已拥有': 'Owned', '可晋升': 'Promotable', '精锐干员将出现在作战区原位置': 'The Elite Operator will appear in the original field position',
  '精锐干员将进入整备区': 'The Elite Operator will enter the Bench', '晋升奖励': 'Promotion Reward', '晋升奖励待选择': 'Promotion Reward Available',
  '免费选择 1 名': 'Choose 1 for free', '稍后': 'Later', '已配发的装备无法销毁': 'Issued equipment cannot be destroyed',
  '临时整备区无法放入单位': 'Units cannot be placed in the Temporary Bench', '无法部署在该位置': 'Cannot deploy at this position',
  '无法放置在该位置': 'Cannot place at this position', '本局的干员调配已锁定，修改将在下一局生效': 'Loadout is locked for this run; changes apply next run',
  '本局已锁定 · 下一局生效': 'Locked this run · Applies next run', '没有符合条件的干员': 'No eligible Operators',
  '正在载入干员数据（打开页面后仅载入一次）…': 'Loading Operator data (once per page)…',
  '开始游戏前无法调整干员的等级，但可调整其所携带的技能和模组': 'Operator tier cannot be changed before a run, but Skills and Modules can be configured',
  '调整干员携带的技能与模组': 'Configure Operator Skills and Modules', '不装备模组：精锐干员以基础属性、特性与天赋作战。': 'No Module: the Elite Operator uses base stats, Trait, and Talents.',
  '属性': 'Stats', '能力': 'Abilities', '法术抗性': 'RES', '移动速度': 'Movement Speed', '攻击范围': 'Attack Range',
  '攻击范围扩大': 'Expanded Attack Range', '免疫': 'Immune', '效果获得': 'On Obtain', '默认': 'Default', '单位': 'Unit',
  '作战开始时在摆放的位置部署': 'Deploys at the selected position when battle starts',
  '作战开始时在摆放的位置部署一次，之后所属干员每次发动技能时再次出现（未摆放则不会出现）': 'Deploys once at the selected position when battle starts, then appears whenever its Operator activates a Skill (does not appear if not placed)',
  '所属干员发动技能时才在摆放的位置出现（未摆放则不会出现）': 'Appears at the selected position when its Operator activates a Skill (does not appear if not placed)',
  '2 件相同装备自动合成进阶装备': 'Two identical items automatically combine into an upgraded item',
  '达到上限强行佩戴会改为替换装备': 'Equipping at the limit will replace an existing item',

  // Match HUD, guide and results.
  '本局信息': 'Run Info', '本局信息（策略 / 禁用盟约 / 干员）': 'Run Info (Strategy / Disabled Alliances / Operators)',
  '加成情况': 'Bonuses', '卫戍能力': 'Stronghold Abilities', '助战及自选编队': 'Support and Custom Squad',
  '进阶图鉴': 'Advanced Compendium', '攻防战': 'Battle', '调度手册': 'Dispatch Manual', '模拟要点': 'Simulation Tips',
  '卫戍协议已运行': 'Stronghold Protocol Active', '追加盟约': 'Additional Alliances',
  '休整期可以查看即将迎击的敌方单位': 'View incoming enemies during the Rest Phase',
  '防卫失败的玩家可通过上方信息栏确认自身所属敌人的剩余数量': 'Players who failed defense can check their remaining enemies in the panel above',
  '队友每击倒一个就少扣 1 点': 'Each enemy defeated by teammates reduces Life loss by 1',
  '放入整备区或战场、配发或使用后才能准备就绪；休整期结束时仍留在临时整备区的单位将被销毁': 'Move, deploy, issue, or use these units before readying; units left in the Temporary Bench at the end of Rest will be destroyed',
  '若消耗已部署至作战区的干员，则发送至作战区对应位置': 'If a deployed Operator is consumed, send the result to the corresponding field position',
  '最终攻势起全队共享目标生命值': 'The team shares Life Points from Final Assault onward',
  '可以快速完成作战': 'Battles can be completed quickly', '作战结束，等待队友完成作战': 'Battle complete; waiting for teammates',
  'AI 托管中': 'AI Control Active', '暂离（AI 托管）': 'Away (AI Control)', '离开模拟': 'Leave Simulation',
  '返回模拟': 'Return to Simulation', '放弃模拟': 'Abandon Simulation', '暂停中': 'Paused',
  '超时': 'Overtime', '决策顺序': 'Decision Order', '等待其他博士': 'Waiting for other Doctors',
  // Short fragments that are separate DOM children around highlighted numbers/icons.
  '第': 'Round', '回合': 'Round', '回合 · 即将迎击': '· Incoming', '名敌人': 'enemies', '阶': 'Tier',
  '层': 'Stacks', '含整备区': 'including Bench', '未连接': 'Offline', '交流': 'Emotes', '获得奖杯': 'Trophy Earned',
  '卫戍认证': 'Stronghold Certification', '无倒计时': 'No countdown', '点击取消': 'Click to cancel',
  '秒后全队生命值开始流失': 'seconds until the team starts losing Life', '超时 · 生命值': 'Overtime · Life',
  '敌人进入蓝门，结算时扣除': 'enemies entered the blue gate; Life lost at settlement:',
  '点（每回合至多': 'points (max per round:', '点）': 'points)', '漏过的敌人': 'Leaked enemies',
  '你漏过的敌人': 'Your leaked enemies', '你漏过的…': 'Your leaks…', '已全部被击倒': 'all defeated',
  '部分盟约所含干员阵容不完整': 'Some Alliances have incomplete Operator rosters', '该干员': 'This Operator',
  '联防（自己）': 'Joint Defense (You)', '华法琳': 'Warfarin', '被动': 'Passive',
  '获得时': 'On Obtain', '价格': 'Price', '再次点击确认': 'Click again to confirm', '无法购买': 'Cannot Purchase',
  '再次点击': 'Click again', '已用': 'Used', '本局不限时': 'No time limit this run',
});

const RULES = Object.freeze([
  [/^输入你的代号（最多 (\d+) 字）$/, 'Enter your callsign (max $1 characters)'],
  [/^第\s*(\d+)\s*回合$/, 'Round $1'], [/^(\d+)阶$/, 'Tier $1'], [/^(\d+)\s*秒$/, '$1s'],
  [/^第\s*(\d+)\s*回合\s*·\s*即将迎击\s*(\d+)\s*名敌人$/, 'Round $1 · $2 incoming enemies'],
  [/^同盟密钥为\s*(\d+)\s*位字母或数字$/, 'Alliance Key must contain $1 letters or digits'],
  [/^已复制同盟密钥\s+(.+)$/, 'Alliance Key copied: $1'], [/^同盟已关闭：(.+)$/, 'Alliance closed: $1'],
  [/^发生意外错误：(.+)$/, 'Unexpected error: $1'], [/^战场固定为\s+(.+)$/, 'Fixed battlefield: $1'],
  [/^战场随机（共(\d+)张）$/, 'Random battlefield ($1 total)'], [/^(\d+)\s*名博士$/, '$1 Doctor(s)'],
  [/^1–(\d+)\s*名博士\s*·\s*可由 AI 队友补位$/, '1–$1 Doctors · AI teammates can fill empty seats'],
  [/^与至多\s*(\d+)\s*名博士组成同盟，共享干员池，联防协作抵御敌潮。$/, 'Form an Alliance with up to $1 Doctors, share the Operator pool, and defend together.'],
  [/^剩余\s*(\d+)$/, '$1 remaining'], [/^已就绪\s*(\d+)\/(\d+)$/, 'Ready $1/$2'],
  [/^(.+)\s+正在决策…$/, '$1 is choosing…'], [/^(.+)的盟约$/, "$1's Alliances"],
  [/^(.+)\s+尚未激活盟约$/, '$1 has no active Alliances'], [/^正在查看\s+(.+)\s+的阵地（只读）$/, "Viewing $1's field (read-only)"],
  [/^正在查看\s+(.+)\s+的盟约$/, "Viewing $1's Alliances"], [/^查看\s+(.+)\s+的阵地$/, "View $1's field"],
  [/^查看\s+(.+)\s+的战场$/, "View $1's battlefield"],
  [/^基础\s+(.+)$/, 'Base $1'], [/^出售（\+(\d+)\s*资金）$/, 'Sell (+$1 Funds)'],
  [/^出售，获得\s*(\d+)\s*资金$/, 'Sell for $1 Funds'], [/^(\d+)\s*个单位$/, '$1 units'], [/^(\d+)\s*件道具$/, '$1 items'],
  [/^已拥有\s*(\d+)\/(\d+)$/, 'Owned $1/$2'], [/^免费\s*×(\d+)$/, 'Free ×$1'],
  [/^联防：(.+)$/, 'Joint Defense: $1'], [/^(.+)：本局禁用（该盟约不会激活）$/, '$1: disabled this run (this Alliance will not activate)'],
  [/^道具无法出售。确定要销毁「(.+)」吗？$/, 'Items cannot be sold. Destroy “$1”?'],
  [/^将\s*(\d+)\s*名干员的技能与模组恢复为默认配置？$/, 'Restore default Skills and Modules for $1 Operators?'],
  [/^确定要出售精锐干员「(.+)」吗？出售后获得\s*(\d+)\s*资金。$/, 'Sell Elite Operator “$1” for $2 Funds?'],
  [/^确认选择「(.+)」（再次点击卡牌亦可）$/, 'Confirm “$1” (or click the card again)'],
  [/^(.+)，已选中，再次点击确认$/, '$1 selected; click again to confirm'],
  [/^(.+)，(.+)已选择$/, '$1, selected by $2'], [/^(.+)还剩\s*(\d+)\s*个（(.+)）$/, '$1: $2 remaining ($3)'],
  [/^(.+)，价格\s*(\d+)，无法购买$/, '$1, price $2, cannot purchase'],
  [/^(.+)，价格\s*(\d+)，再次点击确认$/, '$1, price $2, click again to confirm'],
  [/^技能\s*(\d*)：(.+)$/, 'Skill $1: $2'], [/^(.+)\s*(\d+)\s*阶$/, '$1 Tier $2'],
  [/^剩余不足\s*(\d+)\s*个后，队友每击倒一个少扣\s*1\s*点$/, 'Below $1 remaining, each enemy defeated by teammates reduces Life loss by 1'],
  [/^目标生命值\s*(\d+)，联防中：漏过的敌人还剩\s*(\d+)\s*个，按现在结算扣除\s*(\d+)\s*点（每回合至多\s*(\d+)\s*点）$/, 'Life $1 · Joint Defense: $2 leaked enemies remain; current loss $3 (max $4 per round)'],
  [/^目标生命值\s*(\d+)，(联防中，)?结算时扣除(至多)?\s*(\d+)\s*点$/, 'Life $1 · Lose $4 at settlement'],
  [/^升级调度中心（(\d+)\s*资金）\s*·\s*D$/, 'Upgrade Dispatch Center ($1 Funds) · D'],
  [/^再次点击确认升级（(\d+)\s*资金）$/, 'Click again to upgrade ($1 Funds)'],
  [/^临时整备区还有\s*(\d+)\s*个单位：(.+)$/, '$1 units remain in the Temporary Bench: $2'],
  [/^临时整备区\s*(\d+)\s*个单位待处理$/, '$1 units pending in the Temporary Bench'],
  [/^(.+)敌人进入蓝门，结算时扣除\s*(\d+)\s*点（每回合至多\s*(\d+)\s*点）$/, '$1 enemies entered the blue gate; lose $2 Life at settlement (max $3 per round)'],
]);

export function setLocale(next) {
  locale = next === 'en' ? 'en' : 'zh';
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN';
    document.title = locale === 'en' ? 'Stronghold Protocol: Covenant' : '卫戍协议：盟约';
  }
}

export const getLocale = () => locale;
export const isEnglish = () => locale === 'en';
export const installEnglishCatalog = (catalog) => { englishCatalog = catalog && catalog.locale === 'en' ? catalog : null; };

export function translateText(value) {
  if (locale !== 'en' || typeof value !== 'string' || !value) return value;
  const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(value);
  const core = match?.[2] ?? value;
  let translated = EN[core];
  if (!translated) {
    for (const [pattern, replacement] of RULES) {
      if (pattern.test(core)) { translated = core.replace(pattern, replacement); break; }
    }
  }
  return translated ? `${match?.[1] || ''}${translated}${match?.[3] || ''}` : value;
}

const TRANSLATABLE_PROPS = new Set(['title', 'label', 'placeholder', 'aria-label', 'alt', 'text', 'okText', 'cancelText', 'hint']);
export function localizeProps(props) {
  if (locale !== 'en' || !props || typeof props !== 'object') return props;
  let out = props;
  for (const key of TRANSLATABLE_PROPS) {
    if (typeof props[key] !== 'string') continue;
    const translated = translateText(props[key]);
    if (translated === props[key]) continue;
    if (out === props) out = { ...props };
    out[key] = translated;
  }
  return out;
}

export function localizeChild(value) {
  if (typeof value === 'string') return translateText(value);
  if (Array.isArray(value)) return value.map(localizeChild);
  return value;
}

function mergeOverlay(base, overlay) {
  if (overlay == null) return base;
  if (Array.isArray(overlay)) {
    const out = Array.isArray(base) ? [...base] : [];
    overlay.forEach((value, index) => { if (value !== undefined) out[index] = mergeOverlay(out[index], value); });
    return out;
  }
  if (typeof overlay !== 'object') return overlay;
  const out = base && typeof base === 'object' && !Array.isArray(base) ? { ...base } : {};
  for (const [key, value] of Object.entries(overlay)) out[key] = mergeOverlay(out[key], value);
  return out;
}

export function localizeData(name, value, id = null) {
  if (locale !== 'en' || !englishCatalog?.files || value == null || name === 'i18nEn') return value;
  const fileOverlay = englishCatalog.files[name];
  if (!fileOverlay) return value;
  const overlay = id == null ? fileOverlay : fileOverlay[String(id)];
  return overlay ? mergeOverlay(value, overlay) : value;
}
