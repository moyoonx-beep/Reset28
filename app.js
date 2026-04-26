// ── Storage helpers ──────────────────────────────────────────────
const S = {
  get: k => JSON.parse(localStorage.getItem(k)),
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  del: k => localStorage.removeItem(k)
};

// ── State ─────────────────────────────────────────────────────────
let user = null;
let chatMode = 'comfort';
let impulseTimer = null;
let sosEmotion = null;

// ── Task hints (suggestions shown as placeholder) ─────────────────
const TASK_HINTS = [
  '出门走15分钟，不带耳机',
  '听一集喜欢的播客',
  '做一顿饭给自己吃',
  '写下今天让你感到安心的一件事',
  '联系一个很久没联系的朋友',
  '整理一下房间的某个角落',
  '看一部一直想看的电影',
  '今天早睡30分钟',
  '去咖啡馆坐一个小时',
  '写下你今天感谢自己的一件事',
  '做10分钟拉伸或瑜伽',
  '买一束花放在桌上',
  '读书30分钟',
  '今天不刷他的社交媒体',
  '给自己点一份喜欢的外卖',
  '画画或涂色，哪怕只有5分钟',
  '写下三件你期待的事',
  '今天做一件只为自己开心的事',
  '去一个没去过的地方走走',
  '听一张完整的专辑',
];

const RECS = {
  miss: [
    { type: '音乐', name: 'Someone Like You — Adele' },
    { type: '音乐', name: 'The Night We Met — Lord Huron' },
    { type: '音乐', name: 'Skinny Love — Bon Iver' },
    { type: '音乐', name: 'Liability — Lorde' },
    { type: '音乐', name: 'From the Start — Laufey' },
    { type: '音乐', name: 'Happier — Olivia Rodrigo' },
    { type: '音乐', name: '我记得 — 赵雷' },
    { type: '音乐', name: 'All I Want — Kodaline' },
    { type: '电影', name: '《花束般的恋爱》' },
    { type: '电影', name: '《蓝色是最温暖的颜色》' },
    { type: '电影', name: '《Before Sunrise》日出之前' },
    { type: '电影', name: '《500 Days of Summer》' },
    { type: '电影', name: '《Call Me By Your Name》' },
    { type: '电影', name: '《Eternal Sunshine of the Spotless Mind》' },
    { type: '电影', name: '《怦然心动》' },
    { type: '电影', name: '《爱在黎明破晓前》' },
  ],
  hate: [
    { type: '音乐', name: 'Good 4 U — Olivia Rodrigo' },
    { type: '音乐', name: 'Forget You — CeeLo Green' },
    { type: '音乐', name: 'Since U Been Gone — Kelly Clarkson' },
    { type: '音乐', name: 'Irreplaceable — Beyoncé' },
    { type: '音乐', name: 'Stronger — Kelly Clarkson' },
    { type: '音乐', name: 'You Oughta Know — Alanis Morissette' },
    { type: '音乐', name: 'Revenge — P!nk' },
    { type: '音乐', name: '不要再联系 — 郑秀文' },
    { type: '电影', name: '《消失的她》' },
    { type: '电影', name: '《Gone Girl》消失的爱人' },
    { type: '电影', name: '《Legally Blonde》律政俏佳人' },
    { type: '电影', name: '《Kill Bill》杀死比尔' },
    { type: '电影', name: '《Midsommar》仲夏魂' },
    { type: '电影', name: '《The First Wives Club》' },
    { type: '电影', name: '《Promising Young Woman》前途似锦的女孩' },
    { type: '电影', name: '《Fleabag》伦敦生活（剧）' },
  ],
  doubt: [
    { type: '音乐', name: 'Shake It Out — Florence + The Machine' },
    { type: '音乐', name: 'Dog Days Are Over — Florence + The Machine' },
    { type: '音乐', name: 'Brave — Sara Bareilles' },
    { type: '音乐', name: 'Rise Up — Andra Day' },
    { type: '音乐', name: 'This Is Me — The Greatest Showman' },
    { type: '音乐', name: 'Roar — Katy Perry' },
    { type: '音乐', name: '我很好 — 张韶涵' },
    { type: '音乐', name: 'Try — P!nk' },
    { type: '电影', name: '《Wild》涉足荒野' },
    { type: '电影', name: '《Eat Pray Love》美食、祈祷和恋爱' },
    { type: '电影', name: '《Little Miss Sunshine》阳光小美女' },
    { type: '电影', name: '《The Devil Wears Prada》穿普拉达的女王' },
    { type: '电影', name: '《Amélie》天使爱美丽' },
    { type: '电影', name: '《Frances Ha》' },
    { type: '电影', name: '《Ladybird》' },
    { type: '电影', name: '《Normal People》普通人（剧）' },
  ],
  lonely: [
    { type: '音乐', name: 'The Night Will Always Win — Manchester Orchestra' },
    { type: '音乐', name: 'Holocene — Bon Iver' },
    { type: '音乐', name: 'Motion Picture Soundtrack — Radiohead' },
    { type: '音乐', name: 'Re: Stacks — Bon Iver' },
    { type: '音乐', name: 'Lua — Bright Eyes' },
    { type: '音乐', name: '平凡之路 — 朴树' },
    { type: '音乐', name: 'Breathe (2 AM) — Anna Nalick' },
    { type: '音乐', name: 'The Sound of Silence — Simon & Garfunkel' },
    { type: '电影', name: '《Her》她' },
    { type: '电影', name: '《Lost in Translation》迷失东京' },
    { type: '电影', name: '《Paterson》帕特森' },
    { type: '电影', name: '《The Secret Life of Walter Mitty》白日梦想家' },
    { type: '电影', name: '《About Time》时空恋旅人' },
    { type: '电影', name: '《Julie & Julia》朱莉与朱莉娅' },
    { type: '电影', name: '《Into the Wild》荒野生存' },
    { type: '电影', name: '《High Fidelity》高保真（剧）' },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────
function getStage(day) {
  if (day <= 10) return 'detox';
  if (day <= 20) return 'wave';
  return 'recover';
}

function getStageName(stage) {
  return { detox: '戒断期', wave: '波动期', recover: '恢复期' }[stage];
}

function getStageClass(stage) {
  return { detox: 'stage-detox', wave: 'stage-wave', recover: 'stage-recover' }[stage];
}

function getDaysSince(dateStr) {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - start) / 86400000) + 1;
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function timeStr() {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

function getTodayLog() {
  const logs = S.get('logs') || [];
  return logs.find(l => l.date === getTodayStr());
}

function saveTodayLog(data) {
  const logs = S.get('logs') || [];
  const idx = logs.findIndex(l => l.date === getTodayStr());
  if (idx >= 0) logs[idx] = { ...logs[idx], ...data };
  else logs.push({ date: getTodayStr(), ...data });
  S.set('logs', logs);
}

function getStreak() {
  const logs = S.get('logs') || [];
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 28; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const log = logs.find(l => l.date === ds);
    if (log && !log.relapse) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function getTodayTaskHints() {
  // 每天给3个不重复的提示，基于日期做种子
  const day = user.currentDay;
  const hints = [];
  const used = new Set();
  for (let i = 0; hints.length < 3; i++) {
    const idx = (day * 7 + i * 13) % TASK_HINTS.length;
    if (!used.has(idx)) { used.add(idx); hints.push(TASK_HINTS[idx]); }
  }
  return hints;
}

function getUserTasks() {
  return S.get(`tasks_${getTodayStr()}`) || ['', '', ''];
}

function saveUserTask(idx, val) {
  const tasks = getUserTasks();
  tasks[idx] = val;
  S.set(`tasks_${getTodayStr()}`, tasks);
}

function getCompletedTasks() {
  return S.get('completedTasks') || {};
}

function markTaskDone(idx) {
  const ct = getCompletedTasks();
  ct[`${getTodayStr()}_${idx}`] = true;
  S.set('completedTasks', ct);
}

function isTaskDone(idx) {
  return !!(getCompletedTasks()[`${getTodayStr()}_${idx}`]);
}

// ── Screen router ─────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');

  const nav = document.getElementById('bottom-nav');
  const noNav = ['auth', 'log', 'sos', 'chat', 'settings'];
  nav.classList.toggle('visible', !noNav.includes(id));

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.screen === id);
  });

  if (id === 'home') renderHome();
  if (id === 'complete') renderComplete();
  if (id === 'log')  renderLog();
  if (id === 'sos')  renderSOS();
  if (id === 'chat') renderChat();
}

// ── Auth ──────────────────────────────────────────────────────────
function initAuth() {
  const saved = S.get('user');
  if (saved) { user = saved; showScreen('home'); return; }
  showScreen('auth');
}

function handleRegister() {
  const name = document.getElementById('auth-name').value.trim();
  const email = document.getElementById('auth-email').value.trim();
  if (!name || !email) return alert('请填写昵称和邮箱');
  user = { name, email, startDate: getTodayStr(), currentDay: 1 };
  S.set('user', user);
  showScreen('home');
}

function handleLogin() {
  const email = document.getElementById('auth-email').value.trim();
  const saved = S.get('user');
  if (!saved || saved.email !== email) return alert('未找到该账号，请先注册');
  user = saved;
  showScreen('home');
}

function toggleAuthMode() {
  const isReg = document.getElementById('auth-name').style.display !== 'none';
  document.getElementById('auth-name').style.display = isReg ? 'none' : 'block';
  document.getElementById('auth-btn').textContent = isReg ? '登录' : '开始我的28天';
  document.getElementById('auth-toggle-text').innerHTML = isReg
    ? '还没有账号？<span onclick="toggleAuthMode()">注册</span>'
    : '已有账号？<span onclick="toggleAuthMode()">登录</span>';
  document.getElementById('auth-btn').onclick = isReg ? handleLogin : handleRegister;
}

// ── Home ──────────────────────────────────────────────────────────
function renderHome() {
  const daysSince = getDaysSince(user.startDate);
  user.currentDay = Math.min(daysSince, 28);
  S.set('user', user);

  // 如果断联天数达到28天，且不是从完成页返回，才跳转
  if (getStreak() >= 28 && !window._fromComplete) { showScreen('complete'); return; }
  window._fromComplete = false;

  const stage = getStage(user.currentDay);
  const streak = getStreak();
  const todayLog = getTodayLog();
  const emotion = todayLog ? todayLog.emotion : null;

  document.getElementById('home-name').textContent = user.name;
  document.getElementById('home-streak').textContent = streak;
  document.getElementById('home-stage').textContent = getStageName(stage);
  document.getElementById('home-stage').className = 'stage-badge ' + getStageClass(stage);

  // Emotion bar
  if (emotion) {
    document.getElementById('emotion-val').textContent = emotion;
    document.getElementById('emotion-bar').style.width = (emotion * 10) + '%';
    document.getElementById('emotion-label').textContent = '今日情绪';
  } else {
    document.getElementById('emotion-val').textContent = '—';
    document.getElementById('emotion-bar').style.width = '0%';
    document.getElementById('emotion-label').textContent = '今日未记录';
  }

  // AI feedback
  const feedback = S.get('lastFeedback');
  const fbEl = document.getElementById('ai-feedback');
  if (feedback && feedback.date === getTodayStr()) {
    fbEl.style.display = 'block';
    document.getElementById('ai-feedback-text').textContent = feedback.text;
  } else {
    fbEl.style.display = 'none';
  }

  // Tasks
  const hints = getTodayTaskHints();
  const userTasks = getUserTasks();
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = hints.map((hint, i) => {
    const done = isTaskDone(i);
    const val = userTasks[i] || '';
    return `
    <div class="task-item">
      <div class="task-dot ${done ? 'done' : ''}"></div>
      <div style="flex:1">
        <input class="task-input" data-idx="${i}" value="${val.replace(/"/g,'&quot;')}" placeholder="${hint}" ${done ? 'disabled' : ''}
          onchange="saveUserTask(${i}, this.value)" style="${done ? 'text-decoration:line-through;color:var(--text-muted);' : ''}">
      </div>
      ${!done ? `<button class="task-complete-btn" onclick="completeTask(${i})">完成</button>` : ''}
    </div>`;
  }).join('');
}

function simulateComplete() {
  const d = new Date();
  d.setDate(d.getDate() - 27);
  user.startDate = d.toISOString().slice(0, 10);
  S.set('user', user);
  // 生成过28天的日志，全部断联
  const logs = [];
  for (let i = 0; i < 28; i++) {
    const dd = new Date(d);
    dd.setDate(dd.getDate() + i);
    logs.push({ date: dd.toISOString().slice(0, 10), emotion: 6, relapse: false });
  }
  S.set('logs', logs);
  showScreen('home');
}

function renderComplete() {
  const streak = getStreak();
  document.getElementById('complete-streak').textContent = streak + ' 天';
}

function completeTask(idx) {
  markTaskDone(idx);
  renderHome();
  showToast('✓ 很好，今天又前进了一步。');
}

// ── Log ───────────────────────────────────────────────────────────
let logRelapse = null; // false=没有, true=联系了, 'urge'=想联系

function renderLog() {
  const todayLog = getTodayLog();
  const slider = document.getElementById('emotion-slider');
  slider.value = todayLog ? todayLog.emotion : 5;
  document.getElementById('slider-val').textContent = slider.value;
  logRelapse = todayLog ? todayLog.relapse : null;
  updateYNButtons();
}

function updateYNButtons() {
  document.getElementById('yn-no').className   = 'yn-btn' + (logRelapse === false  ? ' selected-no'   : '');
  document.getElementById('yn-urge').className = 'yn-btn' + (logRelapse === 'urge' ? ' selected-urge' : '');
  document.getElementById('yn-yes').className  = 'yn-btn' + (logRelapse === true   ? ' selected-yes'  : '');
}

async function submitLog() {
  const emotion = parseInt(document.getElementById('emotion-slider').value);
  if (logRelapse === null) return alert('请选择今天的状态');

  saveTodayLog({ emotion, relapse: logRelapse });

  if (logRelapse === 'urge') {
    showScreen('home');
    showImpulseBlocker();
    return;
  }

  const feedback = await generateFeedback(emotion, logRelapse);
  S.set('lastFeedback', { date: getTodayStr(), text: feedback });
  showScreen('home');
  showToast(logRelapse === true ? '断联天数已重置，重新开始 🌱' : '记录完成 ✓');
}

// ── SOS ───────────────────────────────────────────────────────────
function renderSOS() {
  sosEmotion = null;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  document.getElementById('sos-result').style.display = 'none';
  document.getElementById('sos-generate-btn').style.display = 'none';
}

function selectEmotion(el, key) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  sosEmotion = key;
  document.getElementById('sos-generate-btn').style.display = 'block';
}

const sosUsed = {
  miss:   { music: [], movies: [], actions: [] },
  hate:   { music: [], movies: [], actions: [] },
  doubt:  { music: [], movies: [], actions: [] },
  lonely: { music: [], movies: [], actions: [] },
};

const ACTION_POOL = [
  '写一条“不会发送”的消息，把想说的全写出来',
  '允许自己哭10分钟，不需要压下去',
  '对着手机语音说出你的委屈',
  '写下今天最难受的那个时刻',
  '写一句你想对他说的话，写完就关掉',
  '写下你现在最真实的感受，不评判自己',
  '听一首让你能哭出来的歌',
  '写“我现在很难受，因为…”，把后面写完',
  '告诉自己“难受是正常的，不需要马上好起来”',
  '写下你今天忍住没联系的那一刻',
  '写你最舍不得的是什么',
  '写“如果我现在联系他会发生什么”，认真想一想',
  '写下你最想问他的问题，把它留在纸上',
  '写“这段关系让我最累的地方是…”',
  '承认你还没完全放下，这很正常',
  '写他让你失望的一个时刻',
  '写你曾经忽视的那些红旗',
  '写你曾经委屈自己的地方',
  '写“他其实没有那么好的地方是…”',
  '写“我在这段关系里的模式是…”',
  '写“如果朋友遇到同样情况，我会怎么建议她”',
  '写“我为什么会选择他”，认真回答自己',
  '写“这段关系教会我的3件事”',
  '写“我下一段关系想要什么”',
  '想一想你真正想要的是爱还是降伴',
  '区分“想他”和“孤独”，它们不是同一件事',
  '想一想你是在怀念人还是怀念一种习惯',
  '承认这段关系已经结束，允许自己悲伤',
  '告诉自己“他不再是我的人了”',
  '停止幻想“如果当时…”，过去无法改变',
  '接受没有答案也可以继续向前',
  '承认你们不是彼此的最终选择',
  '把注意力从他转回自己',
  '承认你正在慢慢变好',
  '想联系他时，先等10分钟再决定',
  '打开备忘录代替聊天框，写完就关掉',
  '把他的聊天窗口隐藏掉',
  '取消他的置顶',
  '把他的社交账号静音',
  '把想发的消息写下来但不发出去',
  '去刷一条与他无关的内容',
  '给一个朋友发消息，说说你现在的状态',
  '出门走一圈，哪怕只是楼道',
  '做一件需要专注的小事',
  '看一集轻松的剧',
  '听一段播客',
  '打开计时器，等情绪过去',
  '告诉自己“今天不联系就够了”',
  '只承诺自己坚持今天',
  '把手机放远一点',
  '让自己忙起来，做任何事都行',
  '去洗个脸，让身体先动起来',
];

function pickFresh(arr, usedList) {
  if (usedList.length >= arr.length) usedList.length = 0;
  let idx;
  do { idx = Math.floor(Math.random() * arr.length); } while (usedList.includes(idx));
  usedList.push(idx);
  return arr[idx];
}

async function generateSOS() {
  if (!sosEmotion) return;
  document.getElementById('sos-generate-btn').textContent = '生成中…';
  document.getElementById('sos-generate-btn').disabled = true;

  const emotionMap = { miss: '很想他', hate: '很恨他', doubt: '很怀疑自己', lonely: '很孤独' };

  const pool   = RECS[sosEmotion] || RECS.lonely;
  const music  = pool.filter(r => r.type === '音乐');
  const movies = pool.filter(r => r.type === '电影');
  const used   = sosUsed[sosEmotion];
  const recs   = [ pickFresh(music, used.music), pickFresh(movies, used.movies) ];
  const action = pickFresh(ACTION_POOL, used.actions);

  document.getElementById('sos-empathy').textContent = '…';
  document.getElementById('sos-action').textContent  = '…';
  document.getElementById('sos-recs').innerHTML = recs.map(r => `
    <div class="rec-item">
      <div class="rec-type">${r.type}</div>
      <div class="rec-name">${r.name}</div>
    </div>`).join('');
  document.getElementById('sos-result').style.display = 'block';

  const apiKey = S.get('apiKey') || AI_API_KEY_DEFAULT;
  const sosPrompt = `你是一个高情商的情感支持助手。用户现在感到“${emotionMap[sosEmotion]}”。用JSON回复，不要markdown代码块：{"empathy":"共情表达50字内，温柔克制，每次都要不一样"}。`;
  try {
    const res = await fetch(AI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: AI_MODEL, messages: [{ role: 'user', content: sosPrompt }], max_tokens: 100, temperature: 1.0, enable_thinking: false, stream: false })
    });
    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content.trim());
    document.getElementById('sos-empathy').textContent = parsed.empathy || '你现在的感受是真实的。';
  } catch(e) {
    document.getElementById('sos-empathy').textContent = '你现在的感受是真实的，允许自己感受它。';
  }
  document.getElementById('sos-action').textContent = action;

  document.getElementById('sos-generate-btn').textContent = '重新生成';
  document.getElementById('sos-generate-btn').disabled = false;
}

// ── AI Chat ───────────────────────────────────────────────────────
const CHAT_MODES = {
  comfort:  { label: '安慰我', system: '你是用户的AI闺蜜，高情商、温柔、有边界感。用户需要情感支持。请用温和但不煽情的方式回应，给出具体的安慰，不超过80字。' },
  rational: { label: '理性分析', system: '你是用户的AI闺蜜，理性、清醒、有洞察力。请帮用户理性分析她的情感状况，不鼓励复联，给出客观建议，不超过100字。' },
  block:    { label: '阻止我联系他', system: '用户现在很想联系前任。你是她的AI闺蜜，请用温和但坚定的方式阻止她，提醒她联系的代价，并给出一个替代行为建议，不超过80字。不要说教。' },
};

let chatHistory = [];

function renderChat() {
  document.querySelectorAll('.mode-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.mode === chatMode);
  });
}

function switchChatMode(mode) {
  chatMode = mode;
  chatHistory = [];
  document.getElementById('chat-messages').innerHTML = '';
  renderChat();
  const intro = { comfort: '我在这里。你想说什么都可以。', rational: '说说看，我们一起理清楚。', block: '等一下，先告诉我你现在的感受。' };
  appendMsg('ai', intro[mode]);
}

function appendMsg(role, text) {
  const wrap = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `msg msg-${role}`;
  div.innerHTML = `<div class="msg-bubble">${text}</div><div class="msg-time">${timeStr()}</div>`;
  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
}

function showTyping() {
  const wrap = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'msg msg-ai';
  div.id = 'typing-indicator';
  div.innerHTML = `<div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  input.style.height = 'auto';

  appendMsg('user', text);
  chatHistory.push({ role: 'user', content: text });

  showTyping();
  document.getElementById('chat-send-btn').disabled = true;

  let aiDiv = null;
  const reply = await callAI(null, [
    { role: 'system', content: CHAT_MODES[chatMode].system },
    ...chatHistory
  ], (chunk) => {
    if (!aiDiv) {
      removeTyping();
      const wrap = document.getElementById('chat-messages');
      aiDiv = document.createElement('div');
      aiDiv.className = 'msg msg-ai';
      aiDiv.innerHTML = `<div class="msg-bubble"></div><div class="msg-time">${timeStr()}</div>`;
      wrap.appendChild(aiDiv);
    }
    aiDiv.querySelector('.msg-bubble').textContent = chunk;
    const wrap = document.getElementById('chat-messages');
    wrap.scrollTop = wrap.scrollHeight;
  });

  if (!aiDiv) { removeTyping(); appendMsg('ai', reply); }
  chatHistory.push({ role: 'assistant', content: reply });
  document.getElementById('chat-send-btn').disabled = false;
}

// ── Impulse Blocker ───────────────────────────────────────────────
let impulseSeconds = 600;

function showImpulseBlocker() {
  impulseSeconds = 600;
  document.getElementById('impulse-overlay').classList.add('show');
  updateImpulseTimer();
  impulseTimer = setInterval(() => {
    impulseSeconds--;
    updateImpulseTimer();
    if (impulseSeconds <= 0) clearInterval(impulseTimer);
  }, 1000);
}

function updateImpulseTimer() {
  const m = Math.floor(impulseSeconds / 60);
  const s = impulseSeconds % 60;
  document.getElementById('impulse-timer').textContent =
    `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function closeImpulse() {
  clearInterval(impulseTimer);
  document.getElementById('impulse-overlay').classList.remove('show');
}

// ── AI API ────────────────────────────────────────────────────────
const AI_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const AI_MODEL   = 'Qwen/Qwen3-8B';
const AI_API_KEY_DEFAULT = 'sk-pewdmktcnrvefinpfswstwdubpifileprdymycfxjdghctmo';

async function callAI(prompt, messages, onChunk) {
  const apiKey = S.get('apiKey') || AI_API_KEY_DEFAULT;
  const msgs = messages || [{ role: 'user', content: prompt }];

  try {
    const res = await fetch(AI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: AI_MODEL, messages: msgs, max_tokens: 200, temperature: 0.8, enable_thinking: false, stream: true })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split('\n');
      for (const line of lines) {
        if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
        try {
          const delta = JSON.parse(line.slice(6)).choices[0].delta.content;
          if (delta) {
            full += delta;
            if (onChunk) onChunk(full);
          }
        } catch(e) {}
      }
    }
    return full;
  } catch(e) {
    return '（网络错误，请检查连接）';
  }
}

async function generateFeedback(emotion, relapse) {
  let context;
  if (relapse === true)  context = '今天联系了前任。请温柔安慰用户，不要评判，同时轻轻提醒她断联天数需要重新开始计算，语气要像朋友一样，不超过30字';
  else                   context = '今天没有联系前任';
  const prompt = `用户今天情绪值${emotion}/10，${context}。请给出一句简短的个性化反馈（20字以内），温柔克制，不煽情，不说教。`;
  return await callAI(prompt);
}

// ── API Modal ─────────────────────────────────────────────────────
function showApiModal() {
  document.getElementById('api-modal').classList.add('show');
  const saved = S.get('apiKey');
  if (saved) document.getElementById('api-key-input').value = saved;
}

function saveApiKey() {
  const key = document.getElementById('api-key-input').value.trim();
  if (!key) return;
  S.set('apiKey', key);
  document.getElementById('api-modal').classList.remove('show');
  showToast('API Key 已保存');
}

// ── Settings ──────────────────────────────────────────────────────
function renderSettings() {
  if (!user) return;
  document.getElementById('settings-name').textContent = user.name;
  document.getElementById('settings-email').textContent = user.email;
  document.getElementById('settings-day').textContent = `Day ${user.currentDay}`;
  document.getElementById('settings-api').textContent = S.get('apiKey') ? '已设置 ✓' : '未设置';
}

function resetProgress() {
  if (!confirm('确定要重置进度吗？所有记录将被清除。')) return;
  S.del('logs'); S.del('completedTasks'); S.del('lastFeedback');
  user.startDate = getTodayStr();
  user.currentDay = 1;
  S.set('user', user);
  showScreen('home');
  showToast('进度已重置，重新开始 Day 1');
}

function logout() {
  if (!confirm('确定要退出登录吗？')) return;
  S.del('user');
  user = null;
  showScreen('auth');
}

// ── Toast ─────────────────────────────────────────────────────────
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = `position:fixed;bottom:100px;left:50%;transform:translateX(-50%);
      background:#2c2c2c;color:#fff;padding:10px 20px;border-radius:20px;
      font-size:13px;z-index:500;opacity:0;transition:opacity .2s;white-space:nowrap;`;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; }, 2500);
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Slider live update
  document.getElementById('emotion-slider').addEventListener('input', function() {
    document.getElementById('slider-val').textContent = this.value;
  });

  // Chat input auto-resize + enter to send
  const chatInput = document.getElementById('chat-input');
  chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
  });
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
  });

  // Init first chat message
  appendMsg('ai', '我在这里。你想说什么都可以。');

  initAuth();
});
