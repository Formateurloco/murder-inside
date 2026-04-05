/* ══════════════════════════════════════════
   Murder Inside – script.js
   ══════════════════════════════════════════ */

// ── Data ──────────────────────────────────

const CRIMINALS = [
  { key: "psychopathe",   name: "Psychopathe",   skill: "violence",   bonus: 2, passive: "Si le dé arme donne Tir, +2 munitions." },
  { key: "collectionneur",name: "Collectionneur", skill: "agilite",    bonus: 2, passive: "Ignore le premier échec contre une cible." },
  { key: "missionnaire",  name: "Missionnaire",   skill: "ruse",       bonus: 2, passive: "Quand un effet donne 2 PV, gagne +2 PV." },
  { key: "hedoniste",     name: "Hédoniste",      skill: "discretion", bonus: 2, passive: "Relance possible si premier résultat Warning." },
  { key: "psychotique",   name: "Psychotique",    skill: "folie",      bonus: 2, passive: "+1 à main nue." }
];

const SKILLS = { agilite: "Agilité", ruse: "Ruse", violence: "Violence", folie: "Folie", discretion: "Discrétion" };

const MELEE_WEAPONS = [
  { name: "Couteau de stase",   evo6: "Lame spectrale" },
  { name: "Batte neuronale",    evo6: "Batte gravitationnelle" },
  { name: "Marteau d'osmium",   evo6: "Marteau fractal" },
  { name: "Poings augmentés",   evo6: "Poings quantiques" }
];

const GUN_WEAPONS = [
  { name: "Pistolet semi-auto", evo6: "Pistolet quantique" },
  { name: "Fusil à pompe",      evo6: "Pompe à impulsion" },
  { name: "Sniper",             evo6: "Sniper à rail" },
  { name: "Mitraillette",       evo6: "Mitraillette plasma" }
];

const QUESTS = [
  { id: "q1", name: "Mire froide",     skill: "ruse",       threshold: 16, hits: 3, effect: "+3 / -3",             failType: "hp",      failAmount: 1,
    story: "Depuis trois jours tu surveilles ta prochaine cible. Tu cartographies ses habitudes, ses angles morts, ses failles. Ce soir, tu passes à l'action — arme en main, instinct en éveil. Un coup propre ou rien." },
  { id: "q2", name: "Interférence",    skill: "discretion", threshold: 16, hits: 3, effect: "Force une relance",    failType: "warning", failAmount: 1,
    story: "Quelqu'un essaie de saboter ton opération. Tu t'infiltres dans leur réseau de communication, tu brouilles les signaux au bon moment, tu disparais avant qu'ils comprennent ce qui vient de se passer. Ton arme reste dans l'étui — pour l'instant." },
  { id: "q3", name: "Surcharge rouge", skill: "violence",   threshold: 17, hits: 4, effect: "20 naturel = 2 dégâts",failType: "hp",      failAmount: 2,
    story: "Tu lâches tout. Pas de calcul, pas de retenue. Tu charges, tu renverses, tu fracasses tout ce qui se trouve devant toi. Ton arme devient une extension brute de ta rage — et ce soir, la rage suffit." },
  { id: "q4", name: "Angle mort",      skill: "agilite",    threshold: 15, hits: 3, effect: "+3 / -3",             failType: "warning", failAmount: 1,
    story: "Tu te glisses là où personne ne te voit venir. Une seconde tu n'es nulle part, la suivante tu es partout à la fois. Ton corps fait le travail — ton arme ne sert qu'à conclure ce que tes jambes ont commencé." },
  { id: "q5", name: "Parasite mental", skill: "folie",      threshold: 17, hits: 4, effect: "Force une relance",    failType: "hp",      failAmount: 1,
    story: "Tu laisses les voix guider ta main. Ça n'a aucun sens pour les autres — et c'est exactement ce qui te donne l'avantage. Ton arme obéit à une logique que toi seul comprends, et ce soir elle est parfaite." },
  { id: "q6", name: "Main du discret", skill: "ruse",       threshold: 18, hits: 4, effect: "20 naturel = 2 dégâts",failType: "warning", failAmount: 2,
    story: "Un coup propre, sans témoin, sans trace. Tu choisis le moment avec une précision chirurgicale — ni trop tôt, ni trop tard. Quand ton arme parle enfin, personne ne t'a vu arriver. Personne ne te verra partir." }
];

const TARGETS = {
  1: [
    { name: "STRIKER",      img: "striker.png",    skill: ["ruse"],       threshold: 10, hits: 3, fail: 2, xp: 3, desc: "Ruse + niveau d'une arme ≥ 10", story: "Ancien champion de boxe raté, Striker s'est reconverti dans les basses besognes après un scandale de matchs truqués. Rapide, calculateur, il frappe toujours en premier et ne pose jamais de questions." },
    { name: "L'ESPION",     img: "espion.png",     skill: ["ruse"],       threshold: 13, hits: 3, fail: 2, xp: 3, desc: "Ruse + niveau d'une arme ≥ 13", story: "Ancien agent retourné par trois services de renseignement différents, L'Espion vend ses compétences au plus offrant. Son vrai nom est un mystère même pour ses employeurs." },
    { name: "LA MANTE",     img: "mante.png",      skill: ["violence"],   threshold: 12, hits: 2, fail: 2, xp: 3, desc: "Violence + niveau d'une arme ≥ 12", story: "Séductrice froide et calculatrice, La Mante attire ses cibles dans des traquenards savamment construits. On dit qu'elle n'a jamais laissé de témoin vivant." },
    { name: "CALYPSO",      img: "calypso.png",    skill: ["violence"],   threshold: 10, hits: 2, fail: 1, xp: 3, desc: "Violence + niveau d'une arme ≥ 10", story: "Ancienne danseuse de cabaret au passé douloureux, Calypso s'est endurcie dans les rues de la ville basse. Ses mouvements sont toujours gracieux — même quand elle frappe." },
    { name: "LE BARJO",     img: "barjo.png",      skill: ["folie"],      threshold: 11, hits: 3, fail: 1, xp: 3, desc: "Folie + niveau d'une arme ≥ 11", story: "Personne ne sait ce qui lui est arrivé, mais tout le monde reconnaît le regard. Le Barjo opère par vagues de fureur pure et imprévisible. Le plus dangereux, c'est qu'il sourit tout le temps." },
    { name: "LE TARÉ",      img: "tare.png",       skill: ["folie"],      threshold: 11, hits: 3, fail: 1, xp: 2, desc: "Folie + niveau d'une arme ≥ 11", story: "Sorti des égouts de la ville après des années d'errance, Le Taré a survécu à des choses que la plupart ne peuvent même pas imaginer. Sa folie est sa cuirasse." },
    { name: "L'ACROBATE",   img: "acrobate.png",   skill: ["agilite"],    threshold: 12, hits: 4, fail: 2, xp: 4, desc: "Agilité + niveau d'une arme ≥ 12", story: "Ancienne gymnaste olympique éliminée de l'équipe nationale après une affaire de dopage, L'Acrobate a mis ses capacités physiques hors norme au service de ceux qui paient bien." },
    { name: "LA FAUCHEUSE", img: "faucheuse.png",  skill: ["agilite"],    threshold: 13, hits: 3, fail: 2, xp: 4, desc: "Agilité + niveau d'une arme ≥ 13", story: "Elle se déplace comme une ombre et disparaît avant même que sa cible touche le sol. La Faucheuse laisse toujours la même marque — une croix noire tracée à la craie." },
    { name: "LE SPECTRE",   img: "spectre.png",    skill: ["discretion"], threshold: 9,  hits: 3, fail: 1, xp: 2, desc: "Discrétion + niveau d'une arme ≥ 9",  story: "Officieusement déclaré mort trois fois par trois gouvernements différents, Le Spectre est une légende urbaine du milieu. Certains pensent qu'il n'existe pas vraiment." },
    { name: "LA DISCRÈTE",  img: "discrete.png",   skill: ["discretion"], threshold: 10, hits: 3, fail: 2, xp: 2, desc: "Discrétion + niveau d'une arme ≥ 10", story: "Elle peut passer pour une secrétaire, une infirmière ou une inspectrice fiscale. La Discrète infiltre les milieux les plus fermés sans jamais déclencher la moindre alarme." }
  ],
  2: [
    { name: "EVA, LA BRUTE",  img: "eva.png",          skill: ["violence"],   threshold: 20, hits: 3, fail: 2, xp: 3, desc: "Violence + niveau d'une arme ≥ 20", story: "Ancienne championne de MMA reconvertie en enforcer après que son manager l'a arnaquée. Eva ne négocie pas — elle casse. Sa seule règle : laisser quelqu'un pour raconter." },
    { name: "LA COLOSSE",     img: "colosse.png",      skill: ["violence"],   threshold: 19, hits: 3, fail: 3, xp: 2, desc: "Violence + niveau d'une arme ≥ 19", story: "Bodyguard d'élite passée de l'autre côté après la mort de son employeur. La Colosse pèse cent dix kilos de muscle pur et n'a jamais perdu un corps à corps." },
    { name: "LA VÉNÈRE",      img: "venere.png",       skill: ["ruse"],       threshold: 20, hits: 3, fail: 2, xp: 3, desc: "Ruse + niveau d'une arme ≥ 20", story: "Trahie par ses anciens associés lors d'un coup raté, La Vénère est revenue de nulle part pour régler ses comptes. Sa colère est froide, méthodique, absolue." },
    { name: "SOLDAT JIM",     img: "soldat_jim.png",   skill: ["ruse"],       threshold: 21, hits: 3, fail: 2, xp: 4, desc: "Ruse + niveau d'une arme ≥ 21", story: "Vétéran de trois conflits non déclarés, Jim applique les tactiques de guérilla avec une précision chirurgicale. Il planifie tout à l'avance — et a toujours un plan B." },
    { name: "L'IMPRÉVISIBLE", img: "imprevisible.png", skill: ["folie"],      threshold: 21, hits: 3, fail: 2, xp: 3, desc: "Folie + niveau d'une arme ≥ 21", story: "Son comportement chaotique désarçonne même les profilers les plus aguerris. L'Imprévisible change de méthode à chaque coup — jamais le même schéma, jamais le même outil." },
    { name: "LE COLÉRIQUE",   img: "colerique.png",    skill: ["folie"],      threshold: 20, hits: 3, fail: 3, xp: 4, desc: "Folie + niveau d'une arme ≥ 20", story: "Sa rage est une force de destruction brute qui efface tout sur son passage. Le Colérique a été expulsé de quatre organisations criminelles pour excès de violence — même eux avaient peur." },
    { name: "L'ÉQUILIBRISTE", img: "equilibriste.png", skill: ["agilite"],    threshold: 21, hits: 3, fail: 2, xp: 4, desc: "Agilité + niveau d'une arme ≥ 21", story: "Jongle simultanément entre six identités, trois villes et deux syndicats du crime. L'Équilibriste n'a jamais été au mauvais endroit au mauvais moment — c'est toujours toi qui l'es." },
    { name: "TIGNASSE",       img: "tignasse.png",     skill: ["agilite"],    threshold: 18, hits: 3, fail: 2, xp: 3, desc: "Agilité + niveau d'une arme ≥ 18", story: "Reconnaissable entre mille avec sa crinière rousse, Tignasse est pourtant insaisissable. Personne ne comprend comment il disparaît aussi vite. Il court, grimpe, plonge — et il rigole en le faisant." },
    { name: "MYA",            img: "mya.png",          skill: ["discretion"], threshold: 19, hits: 3, fail: 1, xp: 3, desc: "Discrétion + niveau d'une arme ≥ 19", story: "Ancienne hackeuse de génie qui a troqué le clavier contre des armes bien plus concrètes. Mya pirate encore les systèmes — mais désormais pour préparer ses propres coups dans l'ombre." },
    { name: "LA BOULE",       img: "boule.png",        skill: ["discretion"], threshold: 20, hits: 3, fail: 2, xp: 4, desc: "Discrétion + niveau d'une arme ≥ 20", story: "Compacte, rapide et silencieuse, La Boule se faufile là où nul autre ne passe. Elle opère sous des dizaines de couvertures différentes et change d'apparence avec une facilité déconcertante." }
  ],
  boss: [
    { name: "LE CHEF",     img: "chef.png",     skill: ["ruse","agilite"],        threshold: 31, hits: 5, fail: 2, xp: 5, desc: "Ruse + Agilité + niveau arme ≥ 31", story: "Architecte de l'ombre, Le Chef tire les ficelles de quatre organisations criminelles sans jamais apparaître nulle part. Son nom est une rumeur. Son visage est un secret." },
    { name: "LE CAÏD",     img: "caid.png",     skill: ["ruse","folie"],          threshold: 31, hits: 5, fail: 2, xp: 5, desc: "Ruse + Folie + niveau arme ≥ 31", story: "Il règne sur son territoire depuis vingt-deux ans. Dix-sept personnes ont tenté de le renverser. Personne n'est là pour le raconter. Le Caïd est patient, généreux avec les loyaux — et implacable avec les autres." },
    { name: "LE BARON",    img: "baron.png",    skill: ["discretion","folie"],    threshold: 31, hits: 5, fail: 3, xp: 5, desc: "Discrétion + Folie + niveau arme ≥ 31", story: "Aristocrate de la pègre, raffiné, cultivé, impitoyable. Le Baron collectionne les dettes de sang comme d'autres collectionnent l'art. Il attend toujours le moment parfait pour encaisser." },
    { name: "PAKHAN",      img: "pakhan.png",   skill: ["agilite","folie"],       threshold: 31, hits: 5, fail: 3, xp: 5, desc: "Agilité + Folie + niveau arme ≥ 31", story: "Pakhan a traversé trois frontières à pied avec rien dans les poches pour bâtir son empire. Aujourd'hui il dirige un réseau qui s'étend sur deux continents. On dit qu'il dort trois heures par nuit — les autres heures, il travaille." },
    { name: "EL PATRON",   img: "el_patron.png",skill: ["violence","discretion"], threshold: 30, hits: 5, fail: 2, xp: 7, desc: "Violence + Discrétion + niveau arme ≥ 30", story: "El Patron contrôle des pans entiers de l'économie souterraine. Juges, politiques, chefs de police — tout le monde a une dette envers lui. Il n'a jamais eu besoin de tirer lui-même." },
    { name: "LE CHE",      img: "che.png",      skill: ["violence","ruse"],       threshold: 30, hits: 5, fail: 2, xp: 7, desc: "Violence + Ruse + niveau arme ≥ 30", story: "Le Che croit sincèrement en sa cause. Il se voit comme un révolutionnaire, pas un criminel. Cette conviction absolue le rend d'autant plus dangereux — les idéalistes n'ont pas de limite." },
    { name: "LE CERVEAU",  img: "cerveau.png",  skill: ["folie","discretion"],    threshold: 34, hits: 5, fail: 4, xp: 7, desc: "Folie + Discrétion + niveau arme ≥ 34", story: "Génie criminel avec un QI hors normes, Le Cerveau anticipe toujours quatre coups d'avance. Il a conçu des escroqueries si parfaites que ses victimes ont remercié pour l'expérience." },
    { name: "JIMMY",       img: "jimmy.png",    skill: ["folie","violence"],      threshold: 34, hits: 5, fail: 4, xp: 7, desc: "Folie + Violence + niveau arme ≥ 34", story: "Jimmy sourit tout le temps. Il est drôle, chaleureux, inoubliable. Ses victimes l'adoraient — jusqu'à la toute dernière seconde. C'est le plus dangereux de tous : nul ne le voit venir." },
    { name: "L'OMEGA",     img: "omega.png",    skill: ["discretion","agilite"],  threshold: 30, hits: 5, fail: 3, xp: 5, desc: "Discrétion + Agilité + niveau arme ≥ 30", story: "L'Omega est le dernier recours. On l'appelle quand tout le reste a échoué. Son identité est inconnue, sa méthode toujours différente. Il ne laisse aucune trace — seulement des résultats." },
    { name: "LOLA FÉROCE", img: "lola.png",     skill: ["discretion","ruse"],     threshold: 30, hits: 5, fail: 3, xp: 5, desc: "Discrétion + Ruse + niveau arme ≥ 30", story: "Ancienne protégée du Caïd, Lola l'a trahi pour bâtir son propre empire. Elle connaît tous les secrets de l'organisation — et s'en sert comme monnaie d'échange. La prédatrice la plus redoutée du milieu." }
  ]
};

const SOLO_EVENTS = [
  { name: "Interférence système", desc: "-2 au prochain d20.",           apply: p => { p.systemMinus2 = (p.systemMinus2 || 0) + 1; } },
  { name: "Patch d'urgence",      desc: "+1 PV immédiatement.",          apply: p => { p.hp = Math.min(p.maxHp, p.hp + 1); } },
  { name: "Panne de munitions",   desc: "Perds 1 munition si possible.", apply: p => { if (p.ammo > 0) p.ammo -= 1; } },
  { name: "Cache de données",     desc: "+1 datacoin.",                  apply: p => { p.datacoins += 1; } },
  { name: "Parasite mental",      desc: "+1 Warning.",                   apply: p => { p.warnings += 1; } },
  { name: "Chambre forte",        desc: "+1 ressource au choix.",        apply: p => { p.choiceRes += 1; } },
  { name: "Adrénaline noire",     desc: "+2 au prochain d20.",           apply: p => { p.systemPlus2 = (p.systemPlus2 || 0) + 1; } }
];

const SOLO_ENEMY_AI = [
  { key: "counter_warning",  name: "Contre-feu",         desc: "À chaque échec contre cette cible : +1 Warning." },
  { key: "tax_data",         name: "Racket de données",  desc: "À chaque échec contre cette cible : -1 datacoin si possible." },
  { key: "adaptive_guard",   name: "Blindage adaptatif", desc: "Après chaque réussite partielle, le seuil augmente de +1." },
  { key: "first_hit_shield", name: "Bouclier réactif",   desc: "La première réussite contre cette cible inflige 0 dégât." }
];

const SKILL_10_RANK_XP = {
  agilite:    [12, 8, 0, 0],
  ruse:       [10, 8, 5, 0],
  violence:   [10, 5, 5, 0],
  folie:      [5, 10, 0, 0],
  discretion: [5, 0, 10, 0]
};

const DICE = {
  datacoin: ["0D","1D","2D","3D","4D","5D"],
  skill:    ["A","D","F","V","R","C?"],
  weapon:   ["Tir","Poing","Tir","Poing","2 Munitions","Warning"],
  resource: ["1 CD","1 Bobine","1 Batterie","2 CD","2 Bobines","2 Batteries"],
  mystery:  ["Compétence au choix","Arme au choix","2 PV","1 Warning","2 Munitions","Ressource au choix"],
  leader:   ["Double réussite","1 compétence au choix (tous)","1 arme/compétence au choix (tous)","+3 à tous les d20","2 PV (tous)","Ressource au choix (tous)"]
};

// ── State ─────────────────────────────────

const state = {
  screen: "home", mode: "multi", playerCount: 2,
  setup: [], players: [], leader: 0,
  phase: "draft", pool: [], draftOrder: [], draftStep: 0,
  actionChoice: null, sharedTarget: null, log: [],
  rankLvl2: [], systemEvent: null,
  soloEnemyAi: null, soloEnemyThresholdBonus: 0, soloEnemyShieldFresh: false,
  skillRace: { agilite: [], ruse: [], violence: [], folie: [], discretion: [] },
  lockScreen: null, privateView: null,
  setupStep: 0, setupLock: false,
  draftLocked: false,
  seqPlayerIdx: 0, seqLocked: false,
  duel: null
};

// ── Supabase Multijoueur ──────────────────

const SUPA_URL = "https://lpnclqfcshuhppbrhaiw.supabase.co";
const SUPA_KEY = "sb_publishable_7kMPJ5D_MfqY9piihSxVSg_jWjRQv1U";
const supa = supabase.createClient(SUPA_URL, SUPA_KEY);

let __gameCode    = null;  // code de la partie en cours
let __myPlayerId  = null;  // id du joueur local
let __realtimeSub = null;  // abonnement realtime
let __isSyncing   = false; // évite les boucles de sync

// Générer un code de partie à 4 lettres
function genCode() {
  return Array.from({length:4}, () => "ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.floor(Math.random()*23)]).join("");
}

// Sauvegarder l'état complet dans Supabase
async function syncToCloud() {
  if (!__gameCode || __isSyncing) return;
  await supa.from("games").upsert({ code: __gameCode, state: JSON.parse(JSON.stringify(state)), updated_at: new Date().toISOString() });
}

// Charger l'état depuis Supabase
async function loadFromCloud(remoteState) {
  if (!remoteState) return;
  __isSyncing = true;
  Object.assign(state, remoteState);
  render();
  __isSyncing = false;
}

// S'abonner aux changements en temps réel
function subscribeRealtime(code) {
  if (__realtimeSub) supa.removeChannel(__realtimeSub);
  __realtimeSub = supa.channel("game-" + code)
    .on("postgres_changes", { event: "*", schema: "public", table: "games", filter: "code=eq." + code },
      payload => {
        if (payload.new && payload.new.state) loadFromCloud(payload.new.state);
      })
    .subscribe();
}

// Créer une nouvelle partie en ligne
async function createOnlineGame() {
  const code = genCode();
  __gameCode   = code;
  __myPlayerId = state.setup[0]?.id || "host";
  const { error } = await supa.from("games").insert({ code, state: JSON.parse(JSON.stringify(state)) });
  if (error) { alert("Erreur création partie : " + error.message); return; }
  subscribeRealtime(code);
  return code;
}

// Rejoindre une partie existante
async function joinOnlineGame(code) {
  const { data, error } = await supa.from("games").select("state").eq("code", code).single();
  if (error || !data) { alert("Code introuvable. Vérifie le code et réessaie."); return false; }
  __gameCode = code;
  subscribeRealtime(code);
  await loadFromCloud(data.state);
  return true;
}

// Patch : toutes les actions appellent syncToCloud à la fin
const __origRender = window.render;

// ── Utilities ─────────────────────────────

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}
function sh(a)   { return [...a].sort(() => Math.random() - 0.5); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function addLog(s) { state.log.unshift(s); state.log = state.log.slice(0, 60); }

// ── Player factory ────────────────────────

function makePlayer(i) {
  const c = CRIMINALS[i % CRIMINALS.length];
  const skills = { agilite: 0, ruse: 0, violence: 0, folie: 0, discretion: 0 };
  skills[c.skill] = 2;
  return {
    id: "p" + i + Math.random().toString(36).slice(2, 6),
    name: "", mode: "", criminal: c.key, gender: null,
    melee: MELEE_WEAPONS[i % MELEE_WEAPONS.length].name,
    gun:   GUN_WEAPONS[i % GUN_WEAPONS.length].name,
    skills, quests: QUESTS, chosen: [],
    hp: 12, maxHp: 12, datacoins: 3, ammo: 0, warnings: 0,
    cds: 0, bobines: 0, batteries: 0,
    skill10Awarded: { agilite: false, ruse: false, violence: false, folie: false, discretion: false },
    freeSkill: 0, freeWeapon: 0, choiceRes: 0,
    meleeBuilt3: false, meleeBuilt6: false,
    gunBuilt3:   false, gunBuilt6:   false,
    meleeLevel: 0, gunLevel: 0,
    pending: [], rolled: [], done: false, rollPanel: null,
    plus3: false, doubleHit: false,
    questProgress: {}, questReady: [], questPowerUses: {}, abandonedQuests: [],
    targetOptions: [], chosenTarget: null,
    targetHits: 0, finishedTarget: false, finishedQuestsThisTurn: false,
    xp: 0, kills1: 0, kills2: 0,
    committedQuestId: null,
    abandonedThisTurn: false, abandonedQuestThisTurn: false,
    targetReady: false, questReadyThisTurn: false
  };
}

function stage(p) {
  if (p.kills2 >= 3) return "boss";
  if (p.kills1 >= 3) return 2;
  return 1;
}

function buildOrder() {
  const n = state.players.length, f = state.leader, fw = [], bw = [], o = [];
  for (let i = 0; i < n; i++) fw.push((f + i) % n);
  for (let i = 0; i < n; i++) bw.push((f - i + n) % n);
  fw.forEach(i => o.push(i));
  bw.forEach(i => o.push(i));
  return o;
}

function maybeAwardSkill10Xp(p) {
  for (const skill of Object.keys(SKILLS)) {
    if ((p.skills[skill] || 0) >= 10 && !p.skill10Awarded[skill]) {
      p.skill10Awarded[skill] = true;
      if (!state.skillRace[skill].includes(p.id)) state.skillRace[skill].push(p.id);
      const rank = state.skillRace[skill].indexOf(p.id);
      const gain = (SKILL_10_RANK_XP[skill] && SKILL_10_RANK_XP[skill][rank]) || 0;
      if (gain > 0) {
        p.xp += gain;
        addLog(`${p.name} atteint 10 en ${SKILLS[skill]} : +${gain} XP (${rank + 1}${rank === 0 ? "er" : "e"} joueur).`);
      } else {
        addLog(`${p.name} atteint 10 en ${SKILLS[skill]} : 0 XP de course.`);
      }
    }
  }
}

// ── Game init ─────────────────────────────

function initSetup() { state.setup = Array.from({ length: state.playerCount }, (_, i) => makePlayer(i)); }

function initGame() {
  state.players = state.setup.map(p => {
    const x = JSON.parse(JSON.stringify(p));
    x.questProgress = {}; x.questPowerUses = {};
    x.chosen.forEach(q => { x.questProgress[q.id] = 0; x.questPowerUses[q.effect] = 0; });
    return x;
  });
  state.leader   = state.mode === "solo" ? 0 : Math.floor(Math.random() * state.players.length);
  state.rankLvl2 = [];
  startTurn(true);
  state.screen = "game";
  state.log    = [];
  addLog(`Premier joueur : ${state.players[state.leader].name}.`);
}

function applyModeEvent() {
  state.systemEvent = null;
  if (state.mode !== "solo") return;
  const p = state.players[0];
  if (!p) return;
  const ev = pick(SOLO_EVENTS);
  state.systemEvent = ev;
  ev.apply(p);
  addLog(`Événement du système : ${ev.name} — ${ev.desc}`);
}

function startTurn(first = false) {
  state.phase = "draft";
  state.draftLocked = true;
  state.pool  = ["datacoin","datacoin","skill","skill","weapon","weapon","resource","resource","mystery","mystery"];
  state.draftOrder = buildOrder();
  state.draftStep  = 0;
  state.actionChoice = null;
  state.sharedTarget = null;
  state.soloEnemyAi  = null;
  state.soloEnemyThresholdBonus  = 0;
  state.soloEnemyShieldFresh     = false;
  state.players.forEach((p, i) => {
    p.pending  = i === state.leader ? ["leader"] : [];
    p.rolled   = []; p.done = false; p.rollPanel = null;
    p.plus3    = false; p.doubleHit = false;
    p.finishedTarget = false; p.finishedQuestsThisTurn = false;
    p.abandonedQuests = []; p.targetHits = 0;
    p.committedQuestId = null;
    p.abandonedThisTurn = false; p.abandonedQuestThisTurn = false;
    p.targetReady = false; p.targetOptions = []; p.chosenTarget = null;
  });
  state.seqPlayerIdx = state.leader;
  state.seqLocked    = true;
  state.duel         = null;
  applyModeEvent();
  if (!first) addLog(state.mode === "solo" ? "Nouveau tour solo." : `Nouveau tour. ${state.players[state.leader].name} devient premier joueur.`);
}

function checkGameOver() {
  const dead   = state.players.find(p => p.hp <= 0);
  const warned = state.players.find(p => p.warnings >= 10);
  if (dead || warned) {
    const p = dead || warned;
    if (dead) {
      p.xp = Math.max(0, p.xp - 10);
      addLog(`${p.name} est mort — pénalité de 10 XP.`);
    }
    const reason = dead ? `${p.name} a atteint 0 PV.` : `${p.name} a atteint 10 Warnings.`;
    state.phase  = "gameover";
    addLog(`Fin de partie : ${reason}`);
    return true;
  }
  return false;
}

function effectiveXp(p) { return p.xp - p.warnings * 2; }
function nextTurn() { state.leader = (state.leader + 1) % state.players.length; startTurn(); render(); }

// ── Rendering ─────────────────────────────

function render() {
  const app = document.getElementById("app");
  const ae  = document.activeElement;
  const focus = ae && ae.getAttribute ? { key: ae.getAttribute("data-focus"), start: ae.selectionStart || 0 } : null;
  const inSeqPhase = state.screen === "game" && state.phase === "roll";
  if (state.screen === "lobby") {
    app.innerHTML = renderLobby();
  } else if (state.lockScreen) {
    app.innerHTML = renderLockScreen();
  } else if (state.privateView) {
    app.innerHTML = renderPrivateView();
  } else if (state.setupLock && state.screen === "setup") {
    app.innerHTML = renderSetupLock();
  } else if (state.draftLocked && state.screen === "game" && state.phase === "draft") {
    app.innerHTML = renderDraftLock();
  } else if (inSeqPhase && state.seqLocked) {
    app.innerHTML = renderSeqLock();
  } else {
    app.innerHTML = state.screen === "home"  ? renderHome()
                  : state.screen === "setup" ? renderSetup()
                  : renderGame();
  }
  if (focus && focus.key) {
    const el = document.querySelector(`[data-focus="${focus.key}"]`);
    if (el) { el.focus(); try { el.setSelectionRange(focus.start, focus.start); } catch (e) {} }
  }
  // Sync cloud après chaque render (sauf pendant la sync elle-même)
  if (__gameCode && !__isSyncing) syncToCloud();
}

function iconToken(icon, label, value) {
  const ico = icon === "🪙"
    ? `<img src="images/datacoin.png" style="width:20px;height:20px;object-fit:contain;flex-shrink:0">`
    : `<span class="token-ico">${icon}</span>`;
  return `<div class="token">${ico}<div><div class="mini">${label}</div><div style="font-weight:800">${value}</div></div></div>`;
}

function renderHearts(current, max) {
  let s = '<div class="hearts">';
  for (let i = 0; i < max; i++) s += `<span class="heart ${i < current ? "" : "off"}">❤</span>`;
  return s + "</div>";
}

function renderSkulls(count) {
  let out = '<div class="row" style="gap:6px">';
  for (let i = 0; i < 3; i++) out += `<span style="font-size:18px;opacity:${i < count ? 1 : 0.28};filter:${i < count ? "none" : "grayscale(1)"}">☠</span>`;
  return out + "</div>";
}

function skillWithCrown(p, key) {
  return `${SKILLS[key]} ${(p.skills[key] || 0) >= 10 ? "👑" : ""}`;
}

function skillProgress(v) {
  const pct = Math.max(0, Math.min(100, (v / 10) * 100));
  return `<div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>`;
}

function phaseClass() { return `phase-${state.phase}`; }

// ── Audio ─────────────────────────────────

let __audioCtx = null;
function getAudioCtx() {
  try {
    if (!__audioCtx) __audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return __audioCtx;
  } catch (e) { return null; }
}

function unlockAudio() {
  const ctx = getAudioCtx();
  if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
}

// ── Voix intro ────────────────────────────
let __introSpoken = false;
function speakIntro() {
  if (__introSpoken || !window.speechSynthesis) return;
  __introSpoken = true;
  function doSpeak() {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance("Bienvenue dans la matrice.");
    u.lang = "fr-FR"; u.rate = 0.78; u.pitch = 0.55; u.volume = 1;
    const voices = speechSynthesis.getVoices();
    const fr = voices.find(v => v.lang.startsWith("fr") && /thomas|nicolas|jean/i.test(v.name))
            || voices.find(v => v.lang === "fr-FR")
            || voices.find(v => v.lang.startsWith("fr"));
    if (fr) u.voice = fr;
    speechSynthesis.speak(u);
  }
  if (speechSynthesis.getVoices().length > 0) doSpeak();
  else speechSynthesis.addEventListener("voiceschanged", doSpeak, { once: true });
}

// ── Musique procédurale ───────────────────
let __musicNodes = [];
let __currentMood = null;
let __masterMute  = null;
let __muted       = false;

function getMasterMute() {
  if (__masterMute) return __masterMute;
  const ctx = getAudioCtx();
  if (!ctx) return null;
  __masterMute = ctx.createGain();
  __masterMute.gain.value = 1;
  __masterMute.connect(ctx.destination);
  return __masterMute;
}

function toggleMute() {
  __muted = !__muted;
  const mute = getMasterMute();
  if (mute) mute.gain.value = __muted ? 0 : 1;
  // mettre à jour le bouton
  const btn = document.getElementById("btn-mute");
  if (btn) btn.textContent = __muted ? "🔇" : "🔊";
}

function stopMusic() {
  __musicNodes.forEach(n => { try { n.stop(); } catch(e){} try { n.disconnect(); } catch(e){} });
  __musicNodes = [];
  __currentMood = null;
}

function startMusic(mood) {
  if (__currentMood === mood) return;
  stopMusic();
  __currentMood = mood;
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});

  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 3);
  master.connect(getMasterMute());
  __musicNodes.push(master);

  if (mood === "ambient") {
    // ── Drone de fond très doux (sine, pas sawtooth) ──
    [36.7, 55, 73.4].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.value = [0.12, 0.07, 0.04][i];
      osc.connect(g); g.connect(master);
      osc.start(); __musicNodes.push(osc, g);
    });

    // ── Nappe atmosphérique qui respire (triangle filtré) ──
    [110, 164.8].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const filt = ctx.createBiquadFilter();
      const g    = ctx.createGain();
      const lfo  = ctx.createOscillator();
      const lg   = ctx.createGain();
      osc.type = "triangle"; osc.frequency.value = freq;
      filt.type = "lowpass"; filt.frequency.value = 400; filt.Q.value = 1.5;
      g.gain.value = 0.04;
      lfo.type = "sine"; lfo.frequency.value = 0.05 + i * 0.03;
      lg.gain.value = 180;
      lfo.connect(lg); lg.connect(filt.frequency);
      osc.connect(filt); filt.connect(g); g.connect(master);
      lfo.start(); osc.start();
      __musicNodes.push(osc, filt, g, lfo, lg);
    });

    // ── Bruit très filtré — souffle lointain ──
    const bufSize = ctx.sampleRate * 4;
    const buf  = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
    const noise = ctx.createBufferSource();
    noise.buffer = buf; noise.loop = true;
    const f1 = ctx.createBiquadFilter(); f1.type = "lowpass";  f1.frequency.value = 120;
    const f2 = ctx.createBiquadFilter(); f2.type = "highpass"; f2.frequency.value = 40;
    const ng = ctx.createGain(); ng.gain.value = 0.025;
    noise.connect(f1); f1.connect(f2); f2.connect(ng); ng.connect(master);
    noise.start(); __musicNodes.push(noise, f1, f2, ng);

    // ── Volume qui respire très lentement ──
    const lfo = ctx.createOscillator();
    const lg  = ctx.createGain();
    lfo.type = "sine"; lfo.frequency.value = 0.06;
    lg.gain.value = 0.04;
    lfo.connect(lg); lg.connect(master.gain);
    lfo.start(); __musicNodes.push(lfo, lg);

    // ── Pulsation cardiaque douce et espacée ──
    function heartbeat() {
      if (__currentMood !== "ambient") return;
      const ctx2 = getAudioCtx();
      if (!ctx2) return;
      [0, 0.18].forEach((delay, di) => {
        const o = ctx2.createOscillator();
        const g = ctx2.createGain();
        const f = ctx2.createBiquadFilter();
        o.type = "sine"; o.frequency.value = di === 0 ? 52 : 44;
        f.type = "lowpass"; f.frequency.value = 200;
        g.gain.setValueAtTime(0, ctx2.currentTime + delay);
        g.gain.linearRampToValueAtTime(0.14, ctx2.currentTime + delay + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + delay + 0.55);
        o.connect(f); f.connect(g); g.connect(master);
        o.start(ctx2.currentTime + delay);
        o.stop(ctx2.currentTime + delay + 0.6);
      });
      setTimeout(heartbeat, 2800 + Math.random() * 1200);
    }
    setTimeout(heartbeat, 2000);

  } else if (mood === "attack") {
    // ── Drone tendu mais doux (triangle+sine) ──
    [55, 58.3, 82.4].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const filt = ctx.createBiquadFilter();
      const g    = ctx.createGain();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      osc.detune.value = i * 5;
      filt.type = "lowpass"; filt.frequency.value = 600;
      g.gain.value = [0.1, 0.07, 0.05][i];
      osc.connect(filt); filt.connect(g); g.connect(master);
      osc.start(); __musicNodes.push(osc, filt, g);
    });

    // ── Battement cardiaque qui s'accélère doucement ──
    let beatInterval = 700;
    function stressBeat() {
      if (__currentMood !== "attack") return;
      const ctx2 = getAudioCtx();
      if (!ctx2) return;
      [0, 0.14].forEach((delay, di) => {
        const o = ctx2.createOscillator();
        const g = ctx2.createGain();
        const f = ctx2.createBiquadFilter();
        o.type = "sine"; o.frequency.value = di === 0 ? 58 : 48;
        f.type = "lowpass"; f.frequency.value = 220;
        g.gain.setValueAtTime(0, ctx2.currentTime + delay);
        g.gain.linearRampToValueAtTime(0.2, ctx2.currentTime + delay + 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + delay + 0.3);
        o.connect(f); f.connect(g); g.connect(master);
        o.start(ctx2.currentTime + delay);
        o.stop(ctx2.currentTime + delay + 0.35);
      });
      beatInterval = Math.max(480, beatInterval - 5);
      setTimeout(stressBeat, beatInterval);
    }
    setTimeout(stressBeat, 200);

    // ── Nappes montantes très douces ──
    [138, 146.8, 196].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const filt = ctx.createBiquadFilter();
      const g    = ctx.createGain();
      const lfo  = ctx.createOscillator();
      const lg   = ctx.createGain();
      osc.type = "sine"; osc.frequency.value = freq;
      filt.type = "lowpass"; filt.frequency.value = 500 + i * 80;
      g.gain.value = 0.035;
      lfo.type = "sine"; lfo.frequency.value = 0.1 + i * 0.07;
      lg.gain.value = freq * 0.02;
      lfo.connect(lg); lg.connect(osc.frequency);
      osc.connect(filt); filt.connect(g); g.connect(master);
      lfo.start(); osc.start();
      __musicNodes.push(osc, filt, g, lfo, lg);
    });
  }
}

// Déclenche la musique et la voix au premier clic
let __firstInteraction = false;
document.addEventListener("click", function onFirst() {
  if (__firstInteraction) return;
  __firstInteraction = true;
  speakIntro();
  setTimeout(() => startMusic("ambient"), 3200); // après la voix
}, { once: false });

function playTone(freq = 220, duration = 0.08, type = "sawtooth", volume = 0.03) {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playRollSound(success) {
  if (success) {
    playTone(420, 0.05, "square",   0.025);
    setTimeout(() => playTone(620, 0.09, "triangle", 0.03), 55);
  } else {
    playTone(140, 0.08, "sawtooth", 0.04);
    setTimeout(() => playTone(90,  0.12, "sawtooth", 0.035), 60);
  }
}

function triggerBloodEffect(intense = false) {
  const overlay = document.getElementById("bloodOverlay");
  const flash   = document.getElementById("screenFlash");
  if (!overlay || !flash) return;
  overlay.innerHTML = "";
  const count = intense ? 10 : 6;
  for (let i = 0; i < count; i++) {
    const s    = document.createElement("div");
    s.className = "blood-splash";
    const size  = (intense ? 60 : 38) + Math.random() * (intense ? 120 : 70);
    s.style.width   = size + "px";
    s.style.height  = size + "px";
    s.style.left    = Math.random() * 100 + "vw";
    s.style.top     = Math.random() * 100 + "vh";
    s.style.opacity = String(0.35 + Math.random() * 0.45);
    overlay.appendChild(s);
  }
  overlay.classList.add("show");
  flash.classList.remove("show");
  void flash.offsetWidth;
  flash.classList.add("show");
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 280);
  setTimeout(() => overlay.classList.remove("show"), 380);
}

// ── Screen renderers ──────────────────────

function renderLobby() {
  const isHost = state.lobby && state.lobby.isHost;
  const code   = __gameCode || "----";
  const players = state.lobby ? state.lobby.players || [] : [];
  if (isHost) {
    return `<div class="wrap" style="max-width:480px;margin:0 auto;padding-top:60px">
      <div class="card">
        <div class="chip">Partie en ligne</div>
        <div class="hero-title" style="font-size:42px;margin-top:16px">Code de la partie</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:80px;letter-spacing:.12em;color:var(--gold);text-align:center;margin:20px 0">${code}</div>
        <p class="mini" style="text-align:center;line-height:1.6">Partage ce code aux autres joueurs.<br>Attends qu'ils rejoignent, puis lance la partie.</p>
        <div class="grid" style="margin-top:16px">
          ${players.map(p => `<div class="pill"><span>${esc(p.name || "Joueur " + p.idx)}</span><span class="badge">Connecté</span></div>`).join("") || '<div class="mini" style="text-align:center;margin-top:8px">En attente des joueurs…</div>'}
        </div>
        <div style="margin-top:20px">
          <button class="btn cyan" data-act="online-launch" style="width:100%">
            Lancer la partie →
          </button>
        </div>
      </div>
    </div>`;
  } else {
    return `<div class="wrap" style="max-width:480px;margin:0 auto;padding-top:60px">
      <div class="card">
        <div class="chip">Partie en ligne</div>
        <div class="hero-title" style="font-size:36px;margin-top:16px">En attente du lancement…</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:80px;letter-spacing:.12em;color:var(--gold);text-align:center;margin:20px 0">${code}</div>
        <p class="mini" style="text-align:center;line-height:1.6">Tu es connecté. L'hôte va lancer la partie.</p>
        <div class="grid" style="margin-top:16px">
          ${players.map(p => `<div class="pill"><span>${esc(p.name || "Joueur " + p.idx)}</span><span class="badge">Connecté</span></div>`).join("")}
        </div>
      </div>
    </div>`;
  }
}

function renderHome() {
  return `<div class="wrap">
    <div class="hero-grid">
      <div class="card">
        <div class="chip">Murder Inside · Dossier criminel</div>
        <div style="margin-top:16px" class="hero-title">Bienvenue dans<br>la matrice.</div>
        <p style="margin-top:18px" class="hero-sub">
          Un jeu de rôle criminel où chaque décision laisse une trace. Choisis ton mode et le nombre de joueurs.
        </p>

        <div class="section-card" style="margin-top:20px">
          <div class="label-top">Partie multijoueur · 2 à 4 joueurs</div>
          <p class="mini" style="margin-top:8px;line-height:1.55">Chaque joueur crée son profil sur cet appareil, puis le passe au suivant. Quêtes, cibles, montée en puissance.</p>
          <div class="row" style="margin-top:14px;align-items:center">
            <div>
              <div class="mini" style="margin-bottom:6px">Nombre de joueurs</div>
              <select class="select" id="player-count-home" style="width:130px">
                ${[2,3,4].map(n => `<option value="${n}" ${n === state.playerCount ? "selected" : ""}>${n} joueurs</option>`).join("")}
              </select>
            </div>
            <button class="btn cyan" data-act="start-setup" style="align-self:flex-end">Commencer →</button>
          </div>
        </div>

        <div class="section-card" style="margin-top:12px">
          <div class="label-top">Mode solo · Contre le système</div>
          <p class="mini" style="margin-top:8px;line-height:1.55">Un événement système se déclenche à chaque tour. Pression maximale, aucune aide.</p>
          <div style="margin-top:14px">
            <button class="btn pink" data-act="start-solo">Mode solo →</button>
          </div>
        </div>

        <div class="section-card" style="margin-top:12px">
          <div class="label-top">Mode en ligne · Chacun sur son écran</div>
          <p class="mini" style="margin-top:8px;line-height:1.55">Crée une partie et partage le code. Chaque joueur joue depuis son propre appareil en temps réel.</p>
          <div class="grid" style="margin-top:14px;gap:10px">
            <div>
              <div class="mini" style="margin-bottom:6px">Nombre de joueurs</div>
              <select class="select" id="player-count-home" style="width:130px">
                ${[2,3,4].map(n => `<option value="${n}" ${n === state.playerCount ? "selected" : ""}>${n} joueurs</option>`).join("")}
              </select>
            </div>
            <button class="btn cyan" data-act="start-online" style="align-self:flex-end">Créer une partie →</button>
          </div>
          <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
            <input class="input" id="join-code" placeholder="Code à 4 lettres" style="width:150px;text-transform:uppercase">
            <button class="btn outline" data-act="join-online">Rejoindre →</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="label-top" style="margin-bottom:12px">Briefing · Projet Murder Inside</div>
        <div class="target-story" style="font-size:13px;line-height:1.75;color:var(--text)">
          <p style="margin-bottom:12px">Nous sommes en l'an 5000. L'humanité vit dans deux mondes : la <strong style="color:var(--gold)">réalité</strong> et la <strong style="color:var(--cyan)">matrice</strong>. Toute infraction dans l'un ou l'autre entraîne l'emprisonnement dans la réalité.</p>
          <p style="margin-bottom:12px">La matrice fut créée en 1990 par les <strong>Intellects</strong> — projet classé secret défense. Elle a fuité en 2500, permettant à l'homme de mener une double vie. La criminalité y est élevée. Les <em>e-soldiers</em> traquent les coupables, mais les grandes puissances de la matrice échappent à tout jugement.</p>
          <p style="margin-bottom:12px">Les Intellects ont alors développé une <strong style="color:var(--blood)">IA de contrôle</strong> — efficace mais insuffisante. Face à l'échec du système, <strong>Le Discret</strong>, descendant des Intellects, a conçu le <strong>Projet Murder Inside</strong> : infiltrer la matrice par des criminels sélectionnés.</p>
          <p style="margin-bottom:0">Vous êtes ces criminels. En échange de votre liberté dans la réalité, vous devez éliminer les grandes puissances. Vous avez été pucé·es — Le Discret contrôle chacun de vos mouvements. <strong style="color:var(--gold)">Un seul d'entre vous sera récompensé.</strong></p>
        </div>
        <div style="margin-top:20px">
          <div class="section-title">Comment jouer</div>
          <div class="soft-list" style="margin-top:12px">
            <div class="soft-item"><strong>Objectif.</strong> Terminer avec le plus d'XP effectif. Chaque Warning enlève 2 XP au score final.</div>
            <div class="soft-item"><strong>Draft.</strong> À chaque tour, chaque joueur choisit un dé — un seul de chaque type. Ressources, compétences, armes.</div>
            <div class="soft-item"><strong>Quêtes.</strong> Tu choisis 3 quêtes au départ. Complète-les pour débloquer des capacités spéciales.</div>
            <div class="soft-item"><strong>Cibles.</strong> 2 cibles au choix. Élimine-les pour gagner XP et points de compétence.</div>
            <div class="soft-item"><strong>Action commune.</strong> Chaque tour : attaquer une cible, faire les quêtes, ou affaiblir un autre joueur.</div>
            <div class="soft-item"><strong>Niveaux.</strong> 3 cibles niv.1 → accès niv.2. 3 cibles niv.2 → accès aux boss.</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderSetup() {
  const i    = state.setupStep;
  const p    = state.setup[i];
  const isLast = i === state.setup.length - 1;
  return `<div class="wrap">
    <div class="card">
      <div class="between">
        <div>
          <div class="chip">Joueur ${i + 1} sur ${state.setup.length}</div>
          <h2 style="margin-top:8px">Construis ton profil criminel</h2>
          <p class="mini">${state.mode === "solo" ? "Mode solo contre le système." : "Choisis surnom, classe, armes et 3 quêtes. Passe ensuite l'appareil."}</p>
        </div>
      </div>
    </div>
    <div style="margin-top:16px">${renderSetupPlayer(p, i)}</div>
    <div class="row" style="margin-top:16px">
      <button class="btn cyan" data-act="${isLast ? "launch" : "setup-next"}">
        ${isLast ? "Lancer la partie" : "Continuer →"}
      </button>
    </div>
  </div>`;
}

function renderSetupPlayer(p, i) {
  const c = CRIMINALS.find(x => x.key === p.criminal);
  return `<div class="card">
    <div class="between"><h3>Criminel ${i + 1}</h3><span class="badge">${c.name}</span></div>
    <div class="grid" style="margin-top:12px">
      <div>
        <div class="label-top" style="margin-bottom:8px">Avatar — Apparence</div>
        <div class="row" style="gap:12px">
          <button class="btn ${p.gender === "homme" ? "cyan" : "outline"}" data-act="pick-gender" data-idx="${i}" data-gender="homme" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 14px">
            <img src="images/homme.png" style="width:52px;height:52px;object-fit:cover;border-radius:2px;border:1px solid ${p.gender === "homme" ? "var(--cyan)" : "var(--line)"}">
            <span>Homme</span>
          </button>
          <button class="btn ${p.gender === "femme" ? "cyan" : "outline"}" data-act="pick-gender" data-idx="${i}" data-gender="femme" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 14px">
            <img src="images/femme.png" style="width:52px;height:52px;object-fit:cover;border-radius:2px;border:1px solid ${p.gender === "femme" ? "var(--cyan)" : "var(--line)"}">
            <span>Femme</span>
          </button>
        </div>
      </div>
      <input class="input" data-focus="name-${i}" data-idx="${i}" data-field="name" placeholder="Surnom" value="${esc(p.name)}">
      <input class="input" data-focus="mode-${i}" data-idx="${i}" data-field="mode" placeholder="Mode opératoire" value="${esc(p.mode)}">
      <select class="select" data-idx="${i}" data-field="criminal">
        ${CRIMINALS.map(x => `<option value="${x.key}" ${x.key === p.criminal ? "selected" : ""}>${x.name}</option>`).join("")}
      </select>
      <div class="grid g2">
        <div class="quest-frame">
          <div class="label-top">✋ Main gauche — Arme de poing</div>
          <select class="select" data-idx="${i}" data-field="melee" style="margin-top:8px">
            ${MELEE_WEAPONS.map(w => `<option value="${w.name}" ${w.name === p.melee ? "selected" : ""}>${w.name}</option>`).join("")}
          </select>
          ${(() => { const w = MELEE_WEAPONS.find(x => x.name === p.melee); return w ? `<div class="mini" style="margin-top:6px">Niv. 6 → <strong>${esc(w.evo6)}</strong></div>` : ""; })()}
        </div>
        <div class="target-frame">
          <div class="label-top">🤜 Main droite — Arme de tir</div>
          <select class="select" data-idx="${i}" data-field="gun" style="margin-top:8px">
            ${GUN_WEAPONS.map(w => `<option value="${w.name}" ${w.name === p.gun ? "selected" : ""}>${w.name}</option>`).join("")}
          </select>
          ${(() => { const w = GUN_WEAPONS.find(x => x.name === p.gun); return w ? `<div class="mini" style="margin-top:6px">Niv. 6 → <strong>${esc(w.evo6)}</strong></div>` : ""; })()}
        </div>
      </div>
      <div class="note">${SKILLS[c.skill]} +2 · ${c.passive}</div>
      <div class="mini">Choisis 3 quêtes parmi 6 :</div>
      <div class="grid">
        ${p.quests.map(q => `
          <div class="card quest ${p.chosen.some(x => x.id === q.id) ? "active" : ""}" data-act="toggle-quest" data-idx="${i}" data-qid="${q.id}" style="cursor:pointer">
            <div class="between"><strong>${esc(q.name)}</strong><span class="badge">${SKILLS[q.skill]}</span></div>
            ${q.story ? `<p style="font-family:'Special Elite',serif;font-size:12px;color:var(--muted);margin:8px 0 6px;line-height:1.5">${esc(q.story)}</p>` : ""}
            <div class="mini">${q.hits} réussites · ${q.effect}</div>
            <div class="mini" style="margin-top:2px">Échec : ${q.failType === "hp" ? "-" + q.failAmount + " PV" : "+" + q.failAmount + " Warning"}</div>
          </div>`).join("")}
      </div>
    </div>
  </div>`;
}

function renderSeqLock() {
  const p = state.players[state.seqPlayerIdx];
  if (!p) return renderGame();
  const isLeader = state.players.indexOf(p) === state.leader;
  const icon  = "🎲";
  const label = "Ton tour";
  const hint  = isLeader
    ? "Lance tes dés, gère tes achats, puis choisis l'action du tour (cible ou quête)."
    : `Lance tes dés et gère tes achats. L'action du tour est déjà choisie par ${esc(state.players[state.leader]?.name || "le premier joueur")}.`;
  return `<div class="lock-screen">
    <div class="lock-content">
      <div class="lock-icon">${icon}</div>
      <div class="label-top">${label} · Passe l'appareil à</div>
      <div class="lock-name">${esc(p.name)}</div>
      <p class="lock-hint">${hint}</p>
      <button class="btn cyan" data-act="seq-unlock">C'est parti →</button>
    </div>
  </div>`;
}

function renderSetupLock() {
  const next = state.setup[state.setupStep];
  const label = next && next.name && next.name.trim() ? next.name : `Joueur ${state.setupStep + 1}`;
  return `<div class="lock-screen">
    <div class="lock-content">
      <div class="lock-icon">🔒</div>
      <div class="lock-label">Passe l'appareil à</div>
      <div class="lock-name">${esc(label)}</div>
      <p class="lock-hint">C'est à toi de créer ton profil criminel.</p>
      <button class="btn cyan" data-act="setup-unlock">Créer mon profil →</button>
    </div>
  </div>`;
}

function renderDraftLock() {
  const idx = state.draftOrder[state.draftStep];
  const p   = state.players[idx];
  if (!p) { state.draftLocked = false; return renderGame(); }
  return `<div class="lock-screen">
    <div class="lock-content">
      <div class="lock-icon">🎲</div>
      <div class="lock-label">Phase de draft · C'est au tour de</div>
      <div class="lock-name">${esc(p.name)}</div>
      <p class="lock-hint">Choisis un dé parmi ceux disponibles. Tu ne peux prendre qu'un seul dé de chaque type.</p>
      <button class="btn cyan" data-act="draft-unlock">Voir les dés →</button>
    </div>
  </div>`;
}

function renderLockScreen() {
  const p = state.players.find(x => x.id === state.lockScreen);
  if (!p) { state.lockScreen = null; return renderGame(); }
  return `<div class="lock-screen">
    <div class="lock-content">
      <div class="lock-icon">🔒</div>
      <div class="lock-label">Passe l'appareil à</div>
      <div class="lock-name">${esc(p.name)}</div>
      <p class="lock-hint">L'écran est masqué. Appuie quand tu es prêt.</p>
      <button class="btn cyan" data-act="unlock-private" data-id="${p.id}">Voir ma feuille</button>
      <div style="margin-top:16px">
        <button class="btn outline" data-act="cancel-lock">Retour au jeu commun</button>
      </div>
    </div>
  </div>`;
}

function renderSummaryCard(p) {
  const completedQuests = p.chosen.filter(q => (p.questProgress[q.id] || 0) >= q.hits);
  return `<div class="card summary-card">
    <div class="label-top">Synthèse · ${esc(p.name)}</div>
    <div class="stat-strip" style="margin-top:12px">
      ${iconToken("⭐", "XP brut",        p.xp)}
      ${iconToken("📊", "XP effectif",    effectiveXp(p))}
      ${iconToken("📋", "Quêtes réussies",completedQuests.length + "/" + p.chosen.length)}
      ${iconToken("⚠",  "Warnings",       p.warnings)}
    </div>
    <div class="screen-grid" style="margin-top:12px">
      <div class="note"><div class="mini">Cibles niv. 1 éliminées</div>${renderSkulls(p.kills1)}</div>
      <div class="note"><div class="mini">Cibles niv. 2 éliminées</div>${renderSkulls(p.kills2)}</div>
    </div>
  </div>`;
}

function renderPrivateView() {
  const p = state.players.find(x => x.id === state.privateView);
  if (!p) { state.privateView = null; return renderGame(); }
  const i = state.players.indexOf(p);
  return `<div class="wrap">
    <div class="between" style="margin-bottom:16px">
      <div class="chip">🔒 Feuille privée · ${esc(p.name)}</div>
      <button class="btn outline" data-act="close-private">← Retour au jeu</button>
    </div>
    ${renderSummaryCard(p)}
    <div style="margin-top:16px">${renderPlayer(p, i)}</div>
  </div>`;
}

function renderPhaseFocus() {
  const texts = {
    draft:    ["Choix des dés",         "Choisis seulement les dés utiles à ton tour."],
    roll:     ["Lancer du destin",       "Résous les dés choisis avant de passer à la suite."],
    purchase: ["Préparation du carnage", "Achète, construis, puis verrouille ta feuille."],
    action:   ["Moment de mise à mort", "Concentre-toi uniquement sur ta cible ou ta quête."],
    gameover: ["Fin de partie",          "Score final et classement effectif."]
  };
  const [title, sub] = texts[state.phase] || ["Murder Inside", ""];
  return `<div class="phase-focus"><div class="phase-title">${title}</div><div class="phase-sub">${sub}</div></div>`;
}

function renderGame() {
  const isSeq = state.phase === "roll";
  const activeP = isSeq ? state.players[state.seqPlayerIdx] : null;
  const activeI = isSeq ? state.seqPlayerIdx : -1;

  return `<div class="wrap ${phaseClass()}">
    <div class="grid g2">
      <div class="card">
        ${renderPhaseFocus()}
        <div class="between">
          <div>
            <h2>Murder Inside</h2>
            <p class="mini">Premier joueur : <strong style="color:#fff">${esc(state.players[state.leader]?.name || "")}</strong> · phase : ${state.phase}</p>
          </div>
          <span class="badge">${state.actionChoice || "aucune action"}</span>
        </div>
        ${renderMain()}
        ${renderTarget()}
      </div>
      <div class="card">
        <div class="note">
          ${state.mode === "solo"
            ? "En mode solo, un événement système se déclenche au début de chaque tour."
            : "Le dé premier joueur concerne tous les joueurs. Si son résultat demande un choix, la suite du tour reste bloquée tant que ce choix n'est pas validé."}
        </div>
        ${state.mode === "solo" && state.systemEvent ? `
          <div class="note" style="margin-top:12px">
            <strong>Événement du tour</strong>
            <div class="mini" style="margin-top:6px">${esc(state.systemEvent.name)}</div>
            <div class="mini" style="margin-top:4px">${esc(state.systemEvent.desc)}</div>
          </div>` : ""}
        <div class="note" style="margin-top:12px">
          <strong>XP compétences à 10</strong>
          <div class="mini" style="margin-top:6px">Agilité 12/8/0/0 · Ruse 10/8/5/0 · Violence 10/5/5/0 · Folie 5/10/0/0 · Discrétion 5/0/10/0</div>
        </div>
        <div class="log" style="margin-top:12px">${state.log.map(x => `<div>${esc(x)}</div>`).join("")}</div>
      </div>
    </div>
    <div style="margin-top:16px">
      ${isSeq && activeP
        ? renderPlayer(activeP, activeI)
        : `<div class="grid g2">${state.players.map((p, i) => renderPlayer(p, i)).join("")}</div>`}
    </div>
  </div>`;
}

function renderMain() {
  if (state.phase === "draft") {
    const idx = state.draftOrder[state.draftStep], p = state.players[idx];
    const dieIcons = { datacoin:`<img src="images/datacoin.png" style="width:28px;height:28px;object-fit:contain">`, skill:"🧠", weapon:"⚔️", resource:"📦", mystery:"❓" };
    const dieColors = {
      datacoin: "border-color:var(--gold);background:var(--gold-soft)",
      skill:    "border-color:var(--cyan);background:var(--cyan-soft)",
      weapon:   "border-color:rgba(192,24,46,.4);background:rgba(192,24,46,.06)",
      resource: "border-color:rgba(74,158,106,.4);background:rgba(74,158,106,.06)",
      mystery:  "border-color:rgba(150,100,200,.4);background:rgba(150,100,200,.06)"
    };
    const alreadyPicked = p.pending.filter(d => d !== "leader");
    return `<div style="margin-top:16px">
      <div class="between">
        <strong>Choix du dé</strong>
        <span class="badge">Au tour de ${esc(p.name)} · ${alreadyPicked.length}/${idx === state.leader ? 2 : 1} choisi${alreadyPicked.length > 1 ? "s" : ""}</span>
      </div>
      ${alreadyPicked.length ? `<div class="note" style="margin-top:10px">
        <span class="label-top">Dé choisi</span>
        <div class="row" style="margin-top:6px">
          ${alreadyPicked.map(d => `<span class="chip">${dieIcons[d] || "🎲"} ${labelDie(d)}</span>`).join("")}
        </div>
      </div>` : ""}
      <div class="grid g2" style="margin-top:12px">
        ${Object.keys(DICE).filter(x => x !== "leader").map(t => {
          const count = state.pool.filter(x => x === t).length;
          const taken = alreadyPicked.includes(t);
          const disabled = !state.pool.includes(t) || taken;
          return `<div class="card" style="${dieColors[t] || ""};opacity:${disabled ? ".45" : "1"}">
            <div class="between">
              <div style="${t === 'datacoin' ? '' : 'font-size:28px'}">${dieIcons[t] || "🎲"}</div>
              <span class="badge" style="${count === 0 ? "opacity:.4" : ""}">${count} dispo</span>
            </div>
            <div style="font-size:16px;font-weight:800;margin:8px 0 4px;font-family:'Bebas Neue',sans-serif;letter-spacing:.04em">${labelDie(t)}</div>
            <div class="mini" style="margin-bottom:12px;line-height:1.5">${DICE[t].join(" · ")}</div>
            <button class="btn ${disabled ? "outline" : "cyan"}" data-act="pick-die" data-die="${t}" ${disabled ? "disabled" : ""} style="width:100%">
              ${taken ? "✓ Déjà pris" : count === 0 ? "Épuisé" : "Prendre ce dé"}
            </button>
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  if (state.phase === "roll") {
    return `<div style="margin-top:16px">
      <strong>Tours de jeu</strong>
      <div class="grid" style="margin-top:10px">
        ${state.players.map(p => {
          const status = p.done ? "✓ Terminé"
            : p.rolled.length ? "Achat en cours…"
            : "En attente";
          return `<div class="pill"><span>${esc(p.name)}</span><span>${status}</span></div>`;
        }).join("")}
      </div>
      ${state.actionChoice
        ? `<div class="mini" style="margin-top:10px">Action du tour : <strong>${{ target: "Attaquer une cible", quest: "Quêtes", duel: "Affaiblir un joueur" }[state.actionChoice] || state.actionChoice}</strong></div>`
        : ""}
    </div>`;
  }

  if (state.phase === "gameover") {
    const ranking = [...state.players].sort((a, b) => effectiveXp(b) - effectiveXp(a));
    return `<div style="margin-top:16px">
      <strong>Fin de partie</strong>
      <div class="note" style="margin-top:10px">La partie s'arrête quand un joueur atteint 0 PV ou 10 Warnings. Chaque Warning enlève 2 XP au score final.</div>
      <div class="grid" style="margin-top:12px">
        ${ranking.map((p, idx) => `<div class="pill"><span>${idx + 1}. ${esc(p.name)}</span><strong>${effectiveXp(p)} XP effectifs</strong></div>`).join("")}
      </div>
    </div>`;
  }

  // action phase
  return `<div style="margin-top:16px">
    <strong>Action commune</strong>
    <div class="row" style="margin-top:10px">
      <button class="btn pink"    data-act="choose-action" data-kind="quest"  ${state.actionChoice ? "disabled" : ""}>Quêtes</button>
      <button class="btn cyan"    data-act="choose-action" data-kind="target" ${state.actionChoice ? "disabled" : ""}>Attaquer une cible</button>
      ${state.mode !== "solo" && state.players.length > 1 ? `<button class="btn pink" data-act="choose-action" data-kind="duel" ${state.actionChoice ? "disabled" : ""}>Affaiblir un joueur</button>` : ""}
      <button class="btn outline" data-act="end-turn">Fin du tour</button>
    </div>
    ${state.actionChoice === "duel" ? renderDuel() : ""}
  </div>`;
}

function renderLeaderChoiceBox() {
  const p = state.players[state.leader];
  if (!p || !p.rollPanel || p.rollPanel.kind !== "leaderChoice") return "";
  const face = p.rollPanel.face;

  if (face === "1 compétence au choix (tous)") {
    return `<div class="card" style="margin-top:12px">
      <strong>Dé premier joueur</strong>
      <div class="mini" style="margin-top:8px">Choisis la compétence pour tous les joueurs.</div>
      <div class="row" style="margin-top:10px">
        ${Object.keys(SKILLS).map(k => `<button class="btn outline" data-act="resolve-leader" data-choice="${k}">${SKILLS[k]}</button>`).join("")}
      </div>
    </div>`;
  }

  if (face === "1 arme/compétence au choix (tous)") {
    return `<div class="card" style="margin-top:12px">
      <strong>Dé premier joueur</strong>
      <div class="mini" style="margin-top:8px">Choisis pour tous : compétence, arme de tir ou arme de poing.</div>
      <div class="row" style="margin-top:10px">
        ${Object.keys(SKILLS).map(k => `<button class="btn outline" data-act="resolve-leader" data-choice="${k}">${SKILLS[k]}</button>`).join("")}
        <button class="btn outline" data-act="resolve-leader" data-choice="gun">Arme de tir</button>
        <button class="btn outline" data-act="resolve-leader" data-choice="melee">Arme de poing</button>
      </div>
    </div>`;
  }

  if (face === "Ressource au choix (tous)") {
    return `<div class="card" style="margin-top:12px">
      <strong>Dé premier joueur</strong>
      <div class="mini" style="margin-top:8px">Choisis la ressource donnée à tous les joueurs.</div>
      <div class="row" style="margin-top:10px">
        <button class="btn outline" data-act="resolve-leader" data-choice="cds">CD</button>
        <button class="btn outline" data-act="resolve-leader" data-choice="bobines">Bobine</button>
        <button class="btn outline" data-act="resolve-leader" data-choice="batteries">Batterie</button>
      </div>
    </div>`;
  }

  return "";
}

function renderTarget() {
  if (state.actionChoice !== "target") {
    return `<div style="margin-top:16px" class="card target-frame hide-in-draft hide-in-roll hide-in-purchase">
      <div class="label-top">Cibles</div>
      <strong style="font-size:22px">Cibles personnelles</strong>
      <div class="mini" style="margin-top:8px">Chaque joueur choisira sa cible parmi 2 options quand la phase d'action commence.</div>
    </div>`;
  }
  return `<div style="margin-top:16px" class="card target-frame only-action">
    <div class="label-top">Cibles personnelles</div>
    <strong style="font-size:18px">Statut des cibles</strong>
    ${state.mode === "solo" && state.soloEnemyAi ? `<div class="mini warn" style="margin-top:6px">IA ennemie active : ${esc(state.soloEnemyAi.name)} — ${esc(state.soloEnemyAi.desc)}</div>` : ""}
    <div class="grid" style="margin-top:10px">
      ${state.players.map(p => {
        const t = p.chosenTarget;
        return `<div class="pill">
          <span>${esc(p.name)}</span>
          <span>${t ? `${esc(t.name)} (${p.targetHits}/${t.hits})` : p.finishedTarget ? "✓ Abattu" : "En attente de choix…"}</span>
        </div>`;
      }).join("")}
    </div>
  </div>`;
}

function renderPlayer(p, i) {
  const c          = CRIMINALS.find(x => x.key === p.criminal);
  const meleeObj   = MELEE_WEAPONS.find(x => x.name === p.melee) || { name: p.melee, evo6: "Évolution mk VI" };
  const gunObj     = GUN_WEAPONS.find(x => x.name === p.gun)     || { name: p.gun,   evo6: "Évolution mk VI" };
  const leftLabel  = p.meleeBuilt3 ? meleeObj.name : "Main gauche";
  const rightLabel = p.gunBuilt3   ? gunObj.name   : "Main droite";
  const meleeStatus = p.meleeBuilt6 ? `Évolution : ${meleeObj.evo6}` : (p.meleeBuilt3 ? "Évolution dispo au palier 6" : "Construire au palier 3");
  const gunStatus   = p.gunBuilt6   ? `Évolution : ${gunObj.evo6}`   : (p.gunBuilt3   ? "Évolution dispo au palier 6" : "Construire au palier 3");

  return `<div class="card identity-card">
    ${renderRollButton(p)}
    ${renderRolled(p)}
    ${renderTargetTop(p)}
    ${renderActionPanel(p)}
    <div class="between" style="margin-top:14px">
      <div class="row" style="gap:12px;align-items:flex-start">
        ${p.gender ? `<img src="images/${p.gender}.png" class="player-avatar" alt="${esc(p.gender)}">` : ""}
        <div>
          <div class="player-sub">${c.name}</div>
          <div class="player-name">${esc(p.name)}</div>
          <div class="mini" style="margin-top:4px">${esc(p.mode || "Sans mode opératoire")}</div>
        </div>
      </div>
      <div class="row">
        ${i === state.leader ? '<span class="badge-rare">Premier joueur</span>' : ""}
        <span class="badge">XP ${p.xp}</span>
        ${state.mode !== "solo" ? `<button class="btn outline" data-act="show-private" data-id="${p.id}" style="font-size:12px;padding:6px 10px">🔒 Ma feuille</button>` : ""}
      </div>
    </div>

    <div class="section-card" style="margin-top:14px">
      <div class="label-top">État vital</div>
      ${renderHearts(p.hp, p.maxHp)}
      <div class="stat-strip" style="margin-top:12px">
        ${iconToken("🪙", "Datacoins",  p.datacoins)}
        ${iconToken("⚠",  "⚠ DANGER",   p.warnings)}
        ${iconToken("🎯", "Munitions",  p.ammo)}
        ${iconToken("🧠", "Ress. choix",p.choiceRes)}
      </div>
      <div class="screen-grid" style="margin-top:12px">
        <div class="note"><div class="mini">Cibles niveau 1</div>${renderSkulls(p.kills1)}</div>
        <div class="note"><div class="mini">Cibles niveau 2</div>${renderSkulls(p.kills2)}</div>
      </div>
    </div>

    <div class="screen-grid" style="margin-top:14px">
      <div class="section-card">
        <div class="label-top">Profil criminel</div>
        <div class="grid" style="margin-top:10px">
          ${Object.entries(p.skills).map(([k, v]) => `
            <div class="progress-wrap">
              <div class="progress-row">
                <span>${skillWithCrown(p, k)}</span>
                ${skillProgress(v)}
                <strong>${v}</strong>
              </div>
            </div>`).join("")}
        </div>
        ${p.freeSkill ? `<div class="row" style="margin-top:10px">
          ${Object.keys(SKILLS).map(k => `<button class="btn outline" data-act="boost-skill" data-id="${p.id}" data-skill="${k}">${SKILLS[k]}</button>`).join("")}
        </div>` : ""}
      </div>

      <div class="section-card">
        <div class="label-top">Arsenal</div>
        <div class="grid" style="margin-top:10px">
          <div class="quest-frame">
            <div class="between"><strong>${esc(leftLabel)}</strong><span class="badge">Main gauche · Niv. ${p.meleeLevel}</span></div>
            <div class="mini" style="margin-top:6px">Palier 3 : ${p.meleeBuilt3 ? "Construit" : "Non construit"}</div>
            <div class="mini">Palier 6 : ${p.meleeBuilt6 ? "Construit" : "Non construit"}</div>
            <div class="mini" style="margin-top:6px">${esc(meleeStatus)}</div>
          </div>
          <div class="target-frame">
            <div class="between"><strong>${esc(rightLabel)}</strong><span class="badge">Main droite · Niv. ${p.gunLevel}</span></div>
            <div class="mini" style="margin-top:6px">Palier 3 : ${p.gunBuilt3 ? "Construit" : "Non construit"}</div>
            <div class="mini">Palier 6 : ${p.gunBuilt6 ? "Construit" : "Non construit"}</div>
            <div class="mini" style="margin-top:6px">${esc(gunStatus)}</div>
          </div>
        </div>
        ${p.freeWeapon ? `<div class="row" style="margin-top:10px">
          <button class="btn outline" data-act="boost-weapon" data-id="${p.id}" data-weapon="melee">+1 main gauche</button>
          <button class="btn outline" data-act="boost-weapon" data-id="${p.id}" data-weapon="gun">+1 main droite</button>
        </div>` : ""}
      </div>
    </div>

    <div class="resource-grid" style="margin-top:14px">
      ${iconToken("💿", "CD",       p.cds)}
      ${iconToken("🧵", "Bobines",  p.bobines)}
      ${iconToken("🔋", "Batteries",p.batteries)}
    </div>

    ${renderPurchasePanel(p)}
    ${renderQuests(p)}
  </div>`;
}

function renderRollButton(p) {
  if (state.phase !== "roll") return "";
  if (p.rolled.length > 0 && !p.rollPanel) return `
    <div class="card section-card" style="margin-top:12px">
      <div class="label-top">Dés lancés</div>
      <p class="mini" style="margin-top:6px">Tu as lancé tous tes dés. Passe l'appareil.</p>
    </div>`;
  if (p.rollPanel && p.rollPanel.kind === "leaderChoice") {
    return `<div class="card section-card" style="margin-top:12px">
      <div class="label-top">Dé Premier joueur</div>
      ${renderLeaderChoiceBox()}
    </div>`;
  }
  if (p.pending.length === 0) return "";
  return `<div class="card section-card" style="margin-top:12px">
    <div class="label-top">Tes dés choisis</div>
    <div class="mini" style="margin-top:6px">${p.pending.map(labelDie).join(" · ")}</div>
    <div style="margin-top:12px">
      <button class="btn cyan" data-act="roll-dice" data-id="${p.id}">🎲 Lancer mes dés</button>
    </div>
  </div>`;
}

function renderRolled(p) {
  if (state.phase !== "roll" || !p.rolled.length) return "";
  return `<div class="card section-card" style="margin-top:12px">
    <div class="label-top">Résultats des dés</div>
    <div class="grid g3" style="margin-top:10px">
      ${p.rolled.map(r => `
        <div class="card">
          <div class="mini">${labelDie(r.type)}</div>
          <div style="font-size:22px;font-weight:800;margin-top:6px">${esc(r.face)}</div>
        </div>`).join("")}
    </div>
  </div>`;
}

function renderTargetTop(p) {
  if (state.phase !== "action" || state.actionChoice !== "target") return "";
  if (p.rollPanel && (p.rollPanel.kind === "chooseTargetOptions" || p.rollPanel.kind === "chooseTarget")) {
    return renderRollPanel(p);
  }
  if (!p.chosenTarget && !p.finishedTarget && !p.abandonedThisTurn) {
    return `<div class="card section-card" style="margin-top:12px">
      <div class="label-top">Ta cible</div>
      <div class="mini" style="margin-top:8px">Clique sur "Attaquer la cible" pour choisir parmi tes 2 options.</div>
    </div>`;
  }
  if (p.chosenTarget && !p.finishedTarget && !p.abandonedThisTurn) {
    const t = p.chosenTarget;
    return `<div class="card target-frame" style="margin-top:12px;display:flex;gap:14px;align-items:flex-start">
      ${t.img ? `<img src="targets/${t.img}" alt="${esc(t.name)}" style="width:90px;flex-shrink:0;border-radius:6px;border:1px solid rgba(185,47,69,.32)">` : ""}
      <div style="flex:1;min-width:0">
        <div class="label-top">Cible désignée${state.mode === "solo" && state.soloEnemyAi ? ` · IA : ${esc(state.soloEnemyAi.name)}` : ""}</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;margin-top:4px">${esc(t.name)}</div>
        ${t.story ? `<div class="target-story" style="margin-top:6px;font-size:11px;line-height:1.6;color:var(--muted)">${esc(t.story)}</div>` : ""}
        <div class="mini" style="margin-top:8px;padding-top:6px;border-top:1px solid var(--line)">
          Progression : <strong>${p.targetHits}/${t.hits}</strong> touches · ${t.skill.map(k => SKILLS[k]).join(" + ")} ≥ ${t.threshold}
        </div>
        ${state.mode === "solo" && state.soloEnemyAi ? `<div class="mini warn" style="margin-top:4px">${esc(state.soloEnemyAi.desc)}</div>` : ""}
      </div>
    </div>`;
  }
  return "";
}

function renderPurchasePanel(p) {
  if (state.phase !== "roll" || !p.rolled.length) return "";
  return `<div class="card section-card" style="margin-top:12px">
    <div class="label-top">Gestion</div>
    <strong>Achat / ressources / constructions</strong>

    <div class="row" style="margin-top:10px">
      <button class="btn outline" data-act="buy" data-id="${p.id}" data-kind="pv">1 PV</button>
      <span class="mini">2 datacoins</span>
      <button class="btn outline" data-act="buy" data-id="${p.id}" data-kind="ammo">1 munition</button>
      <span class="mini">1 datacoin</span>
    </div>

    <div class="row" style="margin-top:10px">
      <button class="btn outline" data-act="buy" data-id="${p.id}" data-kind="res" data-res="cds">1 CD</button>
      <button class="btn outline" data-act="buy" data-id="${p.id}" data-kind="res" data-res="bobines">1 Bobine</button>
      <button class="btn outline" data-act="buy" data-id="${p.id}" data-kind="res" data-res="batteries">1 Batterie</button>
      <span class="mini">3 datacoins</span>
    </div>

    ${p.choiceRes ? `<div class="note" style="margin-top:10px">
      <div class="mini">Ressource(s) au choix disponible(s) : ${p.choiceRes}</div>
      <div class="row" style="margin-top:8px">
        <button class="btn outline" data-act="choose-res" data-id="${p.id}" data-res="cds">Prendre 1 CD</button>
        <button class="btn outline" data-act="choose-res" data-id="${p.id}" data-res="bobines">Prendre 1 Bobine</button>
        <button class="btn outline" data-act="choose-res" data-id="${p.id}" data-res="batteries">Prendre 1 Batterie</button>
      </div>
    </div>` : ""}

    <div class="screen-grid" style="margin-top:12px">
      <div class="note">
        <div><strong>Construire arme de poing</strong></div>
        <div class="mini" style="margin-top:6px">Niv. 3 : 1 batterie + 2 bobines + 1 CD</div>
        <div class="mini">Niv. 6 : 2 batteries + 1 bobine + 2 CD</div>
        <div class="row" style="margin-top:8px">
          <button class="btn outline" data-act="buy" data-id="${p.id}" data-kind="buildM3">Construire poing niv. 3</button>
        </div>
        <div class="row" style="margin-top:8px">
          <button class="btn outline" data-act="buy" data-id="${p.id}" data-kind="buildM6">Construire poing niv. 6</button>
        </div>
      </div>
      <div class="note">
        <div><strong>Construire arme de tir</strong></div>
        <div class="mini" style="margin-top:6px">Niv. 3 : 1 batterie + 3 CD + 2 bobines</div>
        <div class="mini">Niv. 6 : 2 batteries + 3 bobines + 2 CD</div>
        <div class="row" style="margin-top:8px">
          <button class="btn outline" data-act="buy" data-id="${p.id}" data-kind="buildG3">Construire tir niv. 3</button>
        </div>
        <div class="row" style="margin-top:8px">
          <button class="btn outline" data-act="buy" data-id="${p.id}" data-kind="buildG6">Construire tir niv. 6</button>
        </div>
      </div>
    </div>

    ${state.players.indexOf(p) === state.leader && !state.actionChoice ? `
    <div class="section-card" style="margin-top:14px">
      <div class="label-top">Choix de l'action du tour</div>
      <p class="mini" style="margin-top:6px">Tu es le premier joueur — choisis l'action que tout le monde fera ce tour.</p>
      <div class="row" style="margin-top:10px">
        <button class="btn pink"  data-act="choose-action" data-kind="quest">Faire les quêtes</button>
        <button class="btn cyan"  data-act="choose-action" data-kind="target">Attaquer une cible</button>
        ${state.mode !== "solo" && state.players.length > 1 ? `<button class="btn pink" data-act="choose-action" data-kind="duel">Affaiblir un joueur</button>` : ""}
      </div>
    </div>` : ""}
    ${state.players.indexOf(p) === state.leader && state.actionChoice ? `
    <div class="note" style="margin-top:12px">
      Action du tour choisie : <strong>${{ target: "Attaquer une cible", quest: "Faire les quêtes", duel: "Affaiblir un joueur" }[state.actionChoice] || state.actionChoice}</strong>
    </div>` : ""}

    <div style="margin-top:12px">
      <button class="btn green" data-act="done-purchase" data-id="${p.id}"
        ${p.done ? "disabled" : (state.players.indexOf(p) === state.leader && !state.actionChoice ? "disabled" : "")}>
        ${p.done ? "Terminé ✓" : "Terminer et passer →"}
      </button>
      ${state.players.indexOf(p) === state.leader && !state.actionChoice && !p.done
        ? `<div class="mini warn" style="margin-top:6px">Choisis l'action du tour avant de terminer.</div>` : ""}
    </div>
  </div>`;
}

function renderQuests(p) {
  return `<div class="card section-card hide-in-draft" style="margin-top:12px">
    <div class="label-top">Quêtes personnelles</div>
    <strong>Quêtes choisies</strong>
    <div class="grid" style="margin-top:10px">
      ${p.chosen.map(q => {
        const ready     = p.questReady.includes(q.effect);
        const used      = p.questPowerUses[q.effect] || 0;
        const remaining = Math.max(0, 3 - used);
        return `<div class="card">
          <div class="between"><strong>${esc(q.name)}</strong><span class="badge">${p.questProgress[q.id] || 0}/${q.hits}</span></div>
          <div class="mini" style="margin-top:6px">${q.effect}</div>
          <div class="mini" style="margin-top:4px">Échec : ${q.failType === "hp" ? "-" + q.failAmount + " PV" : "+" + q.failAmount + " Warning"} ${p.abandonedQuests.includes(q.id) ? "· abandonnée ce tour" : ""}</div>
          ${ready ? `<div class="row" style="margin-top:8px">
            <button class="btn green" data-act="open-power" data-id="${p.id}" data-effect="${esc(q.effect)}" ${(state.phase === "action" && remaining > 0) ? "" : "disabled"}>Capacité activée</button>
            <span class="mini">${remaining}/3 utilisations</span>
          </div>` : ""}
        </div>`;
      }).join("")}
    </div>
  </div>`;
}

function renderPowerPanel(p) {
  if (state.phase !== "action" || !p.rollPanel || p.rollPanel.kind !== "usePower") return "";
  const effect  = p.rollPanel.effect;
  const players = state.players;
  const help = state.mode === "solo"
    ? (effect === "+3 / -3"             ? "En solo, utilise-le sur toi pour +3 à ton prochain d20."
     : effect === "Force une relance"   ? "En solo, tu forces la relance de ton propre prochain d20."
     :                                   "En solo, ton prochain 20 naturel infligera 2 dégâts.")
    : (effect === "+3 / -3"             ? "Sur toi : +3 au prochain d20. Sur un autre joueur : -3 à son prochain d20."
     : effect === "Force une relance"   ? "Le joueur ciblé devra relancer son prochain d20."
     :                                   "Le prochain 20 naturel du joueur ciblé infligera 2 dégâts.");
  const btns = players.map(tp => `<button class="btn outline" data-act="apply-power" data-id="${p.id}" data-target="${tp.id}" data-effect="${esc(effect)}">${esc(tp.name)}</button>`).join("");
  return `<div class="note" style="margin-top:12px">
    <strong>Utiliser la capacité</strong>
    <div class="mini" style="margin-top:8px">${esc(effect)}</div>
    <div class="mini" style="margin-top:6px">${help}</div>
    <div class="mini" style="margin-top:6px">Choisis le joueur ciblé. L'effet est consommé dès que tu cliques.</div>
    <div class="row" style="margin-top:10px">${btns}</div>
    <div class="row" style="margin-top:8px">
      <button class="btn outline" data-act="close-power" data-id="${p.id}">Fermer</button>
    </div>
  </div>`;
}

function renderActionPanel(p) {
  if (state.phase !== "action" || !state.actionChoice) return "";

  let info = "";
  if (state.actionChoice === "target" && p.finishedTarget && !p.abandonedThisTurn)
    info = `<div class="note" style="margin-top:10px">Tu as abattu ta cible, bien joué. Attends que les autres aient battu leur cible ou abandonnent.</div>`;
  if (state.actionChoice === "target" && p.abandonedThisTurn)
    info = `<div class="note" style="margin-top:10px">Tu as abandonné le combat, attends que les autres aient battu leur cible ou abandonné comme toi.</div>`;
  if (state.actionChoice === "quest" && p.committedQuestId && !p.finishedQuestsThisTurn && !p.abandonedQuestThisTurn)
    info = `<div class="note" style="margin-top:10px">Ta quête du tour est sélectionnée. Lance le dé 20 jusqu'à la réussir complètement, ou abandonne.</div>`;
  if (state.actionChoice === "quest" && p.finishedQuestsThisTurn && !p.abandonedQuestThisTurn)
    info = `<div class="note" style="margin-top:10px">Contrat rempli. Une trace de plus dans ton dossier. Vous devez attendre que l'autre joueur termine la sienne ou abandonne.</div>`;
  if (state.actionChoice === "quest" && p.abandonedQuestThisTurn)
    info = `<div class="note" style="margin-top:10px">Vous avez abandonné votre quête. Vous devez attendre que l'autre joueur termine ou abandonne sa quête comme vous.</div>`;

  const targetControls = `
    <button class="btn cyan" data-act="open-action" data-id="${p.id}" data-kind="target" ${(p.finishedTarget || p.abandonedThisTurn) ? "disabled" : ""}>
      ${(p.targetReady && !p.finishedTarget && !p.abandonedThisTurn) ? "Continuer l'attaque" : "Attaquer la cible"}
    </button>
    <button class="btn outline" data-act="abandon-action" data-id="${p.id}" ${(p.finishedTarget || p.abandonedThisTurn) ? "disabled" : ""}>Abandonner</button>`;

  let questControls = "";
  if (!p.finishedQuestsThisTurn && !p.abandonedQuestThisTurn) {
    questControls = p.committedQuestId
      ? `<button class="btn pink" data-act="open-action" data-id="${p.id}" data-kind="quest">🎲 Relancer</button>
         <button class="btn outline" data-act="abandon-action" data-id="${p.id}">Abandonner</button>`
      : `<button class="btn pink" data-act="open-action" data-id="${p.id}" data-kind="quest">Choisir ma quête du tour</button>`;
  }

  // Duel : gestion séparée
  if (state.actionChoice === "duel") {
    const isLeader = state.players.indexOf(p) === state.leader;
    const duelDone = state.duel && state.duel.phase === "done";
    const nextTurnDuel = (isLeader && duelDone)
      ? `<div style="margin-top:14px"><button class="btn green" data-act="next-turn">Passer au tour suivant →</button></div>`
      : "";
    return `<div class="card section-card only-action" style="margin-top:12px">
      <div class="label-top">Phase d'action · Duel</div>
      ${isLeader
        ? `<div class="mini" style="margin-top:8px;line-height:1.5">Tu as lancé le défi. Résous le duel dans la zone ci-dessus.</div>`
        : `<div class="mini" style="margin-top:8px;line-height:1.5">Le premier joueur a lancé un défi. Attends qu'il soit résolu.</div>`}
      ${duelDone
        ? `<div class="note" style="margin-top:10px">Duel terminé. ${state.duel.attackerWins > state.duel.defenderWins
            ? state.players.find(x => x.id === state.duel.attackerId)?.name + " remporte le duel."
            : state.duel.defenderWins > state.duel.attackerWins
              ? state.players.find(x => x.id === state.duel.defenderId)?.name + " remporte le duel."
              : "Égalité parfaite."}</div>`
        : ""}
      ${nextTurnDuel}
    </div>`;
  }

  const allDoneAction = state.players.every(x =>
    state.actionChoice === "target"
      ? (x.finishedTarget || x.abandonedThisTurn)
      : (x.finishedQuestsThisTurn || x.abandonedQuestThisTurn)
  );
  const nextTurnBtn = (allDoneAction && !p.rollPanel)
    ? `<div style="margin-top:14px"><button class="btn green" data-act="next-turn">Passer au tour suivant →</button></div>`
    : "";

  return `<div class="card section-card only-action" style="margin-top:12px">
    <div class="label-top">Phase d'action</div>
    <strong>Action personnelle</strong>
    ${!p.rollPanel ? `<div class="row" style="margin-top:10px">
      ${state.actionChoice === "target" ? targetControls : questControls}
    </div>` : ""}
    ${info}
    ${nextTurnBtn}
    ${renderPowerPanel(p)}
    ${renderRollPanel(p)}
  </div>`;
}

function renderRollPanel(p) {
  if (!p.rollPanel) return "";

  if (p.rollPanel.kind === "chooseQuestList") {
    const openQs = p.chosen.filter(q => (p.questProgress[q.id] || 0) < q.hits && !p.abandonedQuests.includes(q.id));
    return `<div class="note" style="margin-top:12px">
      <div class="label-top">Contrats disponibles</div>
      <div class="target-story" style="margin-top:8px;font-size:12px;line-height:1.65;color:var(--muted)">
        Le Discret a transmis la liste. Chaque contrat rempli renforce ton profil dans la matrice — et te rapproche un peu plus de ta liberté dans la réalité.
      </div>
      <div class="grid" style="margin-top:14px">
        ${openQs.map(q => `
          <div class="card">
            <div class="between"><strong>${esc(q.name)}</strong><span class="badge">${p.questProgress[q.id] || 0}/${q.hits}</span></div>
            ${q.story ? `<div class="target-story" style="margin-top:8px;font-size:11px;line-height:1.6;color:var(--muted)">${esc(q.story)}</div>` : ""}
            <div class="mini" style="margin-top:8px;padding-top:8px;border-top:1px solid var(--line)">${SKILLS[q.skill]} + d20 + arme ≥ ${q.threshold}</div>
            <div class="mini">Échec : ${q.failType === "hp" ? "-" + q.failAmount + " PV" : "+" + q.failAmount + " Warning"}</div>
            <div class="row" style="margin-top:8px">
              <button class="btn outline" data-act="pick-quest"    data-id="${p.id}" data-qid="${q.id}">Accepter le contrat</button>
              <button class="btn outline" data-act="abandon-quest" data-id="${p.id}" data-qid="${q.id}">Ignorer</button>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
  }

  if (p.rollPanel.kind === "chooseTargetOptions") {
    return `<div class="note" style="margin-top:12px">
      <div class="label-top">Transmission du Discret</div>
      <div class="target-story" style="margin-top:8px;font-size:12px;line-height:1.65;color:var(--muted)">
        Deux noms s'affichent sur ton écran rétinien. Le Discret a sélectionné tes cibles. Élimine l'une d'elles pour prouver ta valeur — et avancer vers ta liberté.
      </div>
      <div class="grid g2" style="margin-top:14px">
        ${p.targetOptions.map((t, i) => `
          <div class="card target-frame" style="display:flex;flex-direction:column">
            ${t.img ? `<img src="targets/${t.img}" alt="${esc(t.name)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;object-position:top;border-radius:6px;border:1px solid rgba(185,47,69,.32);margin-bottom:10px">` : ""}
            <div class="between"><strong style="font-family:'Bebas Neue',sans-serif;font-size:18px">${esc(t.name)}</strong><span class="badge">+${t.xp} XP</span></div>
            ${t.story ? `<div class="target-story" style="margin-top:8px;font-size:11px;line-height:1.6;color:var(--muted)">${esc(t.story)}</div>` : ""}
            <div class="mini" style="margin-top:8px;padding-top:8px;border-top:1px solid var(--line)">${t.skill.map(k => SKILLS[k]).join(" + ")} ≥ ${t.threshold}</div>
            <div class="mini">${t.hits} touches · -${t.fail} PV en cas d'échec</div>
            <button class="btn cyan" data-act="pick-target" data-id="${p.id}" data-idx="${i}" style="margin-top:auto;padding-top:10px;width:100%">Désigner cette cible</button>
          </div>`).join("")}
      </div>
    </div>`;
  }

  if (p.rollPanel.kind === "chooseQuest" || p.rollPanel.kind === "chooseTarget") {
    const isTarget   = p.rollPanel.kind === "chooseTarget";
    const obj        = isTarget ? p.chosenTarget : p.chosen.find(q => q.id === p.rollPanel.questId);
    const skillKeys  = isTarget ? obj.skill : [obj.skill];
    const skillLabel = skillKeys.map(k => SKILLS[k]).join(" + ");
    const gunUsable  = p.gunLevel >= 3;
    return `<div class="note" style="margin-top:12px">
      <div class="label-top">${isTarget ? "Engagement · Cible" : "Exécution · Contrat"}</div>
      <strong style="font-family:'Bebas Neue',sans-serif;font-size:20px;display:block;margin-top:6px">${esc(obj.name)}</strong>
      ${obj.story ? `<div class="target-story" style="margin-top:8px;font-size:12px;line-height:1.65;color:var(--muted)">${esc(obj.story)}</div>` : ""}
      <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--line)">
        <div class="mini">${skillLabel} + d20 + bonus d'arme ≥ ${obj.threshold}</div>
        ${!isTarget ? `<div class="mini" style="margin-top:4px">Échec : ${obj.failType === "hp" ? "-" + obj.failAmount + " PV" : "+" + obj.failAmount + " Warning"}</div>` : ""}
      </div>
      <div class="row" style="margin-top:12px">
        <button class="btn outline" data-act="submit-action" data-id="${p.id}" data-kind="${p.rollPanel.kind}" data-weapon="melee" data-ammo="0">✋ Corps à corps (+${p.meleeLevel})</button>
        <button class="btn outline" data-act="submit-action" data-id="${p.id}" data-kind="${p.rollPanel.kind}" data-weapon="gun"   data-ammo="0" ${gunUsable ? "" : "disabled"}>🤜 Tir (+${gunUsable ? p.gunLevel : 0})</button>
        ${gunUsable ? [1,2,3].map(n => `<button class="btn outline" data-act="submit-action" data-id="${p.id}" data-kind="${p.rollPanel.kind}" data-weapon="gun" data-ammo="${n}" ${p.ammo >= n ? "" : "disabled"}>Tir + ${n} mun. (+${p.gunLevel + n})</button>`).join("") : ""}
      </div>
      ${!isTarget ? `<div class="row" style="margin-top:8px">
        <button class="btn outline" data-act="abandon-quest" data-id="${p.id}" data-qid="${obj.id}">Abandonner le contrat</button>
      </div>` : ""}
    </div>`;
  }

  if (p.rollPanel.kind === "ready") {
    const d = p.rollPanel.data;
    const allDone = state.players.every(x =>
      state.actionChoice === "target"
        ? (x.finishedTarget || x.abandonedThisTurn)
        : (x.finishedQuestsThisTurn || x.abandonedQuestThisTurn)
    );
    // Boutons après résultat
    let afterBtns = "";
    if (state.actionChoice === "quest" && !p.finishedQuestsThisTurn && !p.abandonedQuestThisTurn) {
      afterBtns = `<div class="row" style="margin-top:12px">
        <button class="btn pink" data-act="open-action" data-id="${p.id}" data-kind="quest">🎲 Relancer</button>
        <button class="btn outline" data-act="abandon-action" data-id="${p.id}">Abandonner</button>
      </div>`;
    } else if (state.actionChoice === "target" && !p.finishedTarget && !p.abandonedThisTurn) {
      afterBtns = `<div class="row" style="margin-top:12px">
        <button class="btn cyan" data-act="open-action" data-id="${p.id}" data-kind="target">🎲 Continuer l'attaque</button>
        <button class="btn outline" data-act="abandon-action" data-id="${p.id}">Abandonner</button>
      </div>`;
    }
    if (allDone) {
      afterBtns += `<div style="margin-top:14px">
        <button class="btn green" data-act="next-turn">Passer au tour suivant →</button>
      </div>`;
    }
    const flavorSuccess = [
      "Le système ne t'a pas vu venir.",
      "Ton avatar s'exécute avec précision. Le Discret enregistre.",
      "Données transmises. Contrat avancé.",
      "La matrice résiste — mais pas cette fois.",
      "Impact confirmé. Tu te rapproches de ta liberté."
    ];
    const flavorFail = [
      "Le signal s'est brouillé au dernier moment.",
      "La cible a contre-attaqué. Tu encaisses.",
      "Erreur système. Le Discret n'est pas satisfait.",
      "Ton avatar tremble. La matrice te repousse.",
      "Trop de bruit dans le réseau. Recommence."
    ];
    const flavor = d.success
      ? flavorSuccess[Math.floor(d.natural * flavorSuccess.length / 20)]
      : flavorFail[Math.floor(d.natural * flavorFail.length / 20)];
    return `<div class="big-roll d20-cinematic ${d.success ? "ok" : "bad"}" style="margin-top:12px">
      <div class="roll-badge">${d.success ? "CONTRAT AVANCÉ" : "TENTATIVE ÉCHOUÉE"}</div>
      <div class="mini" style="margin-top:10px">${esc(d.label)}</div>
      <div class="big-roll-num">${d.natural}</div>
      <div style="font-size:24px;font-weight:900;margin-top:8px">${d.total}</div>
      <div style="margin-top:8px;font-weight:900">${d.success ? "RÉUSSITE" : "ÉCHEC"} · seuil ${d.threshold}</div>
      <div class="target-story" style="margin-top:10px;font-size:12px;line-height:1.6;opacity:.75">${flavor}</div>
      <div class="mini" style="margin-top:6px">${esc(d.extra || "")}</div>
      ${afterBtns}
    </div>`;
  }

  return "";
}

function renderDuel() {
  const d = state.duel;
  if (!d) {
    // Étape 1 : choisir la cible
    const others = state.players.filter(p => p.id !== state.players[state.leader].id);
    return `<div class="card target-frame" style="margin-top:12px">
      <div class="label-top">Affaiblir un joueur</div>
      <p class="mini" style="margin-top:6px;line-height:1.5">Le premier joueur choisit un adversaire. Les deux s'affrontent sur 4 lancers. Le plus bas à chaque lancer perd 1 PV. Celui qui remporte le plus de lancers gagne -2 Warnings.</p>
      <div class="row" style="margin-top:12px">
        ${others.map(p => `<button class="btn outline" data-act="duel-pick" data-id="${p.id}">${esc(p.name)}</button>`).join("")}
      </div>
    </div>`;
  }

  const attacker = state.players.find(p => p.id === d.attackerId);
  const defender = state.players.find(p => p.id === d.defenderId);

  if (d.phase === "attackerSetup") {
    return renderDuelSetup(attacker, "attacker");
  }
  if (d.phase === "defenderSetup") {
    return renderDuelSetup(defender, "defender");
  }
  if (d.phase === "rolling") {
    const round = d.rounds.length + 1;
    const isAttackerTurn = !d.rounds.length || d.rounds[d.rounds.length - 1].defenderRoll !== undefined
      ? (d.rounds.length < 4 && (d.rounds.length === 0 || d.rounds[d.rounds.length - 1].defenderRoll !== undefined))
      : false;
    const current = d.attackerTurn ? attacker : defender;
    const rolledA = d.rounds.filter(r => r.attackerRoll !== undefined).length;
    const rolledD = d.rounds.filter(r => r.defenderRoll !== undefined).length;
    return `<div class="card target-frame" style="margin-top:12px">
      <div class="label-top">Duel · Round ${round}/4</div>
      <div class="between" style="margin-top:10px">
        <span>${esc(attacker.name)} — ${d.attackerWins} victoire(s)</span>
        <span>${esc(defender.name)} — ${d.defenderWins} victoire(s)</span>
      </div>
      <div class="grid" style="margin-top:10px">
        ${d.rounds.map((r, i) => `<div class="pill">
          <span>Round ${i+1}</span>
          <span>${esc(attacker.name)} : ${r.attackerTotal} vs ${esc(defender.name)} : ${r.defenderTotal}
            — ${r.attackerTotal > r.defenderTotal ? `${esc(attacker.name)} gagne` : r.defenderTotal > r.attackerTotal ? `${esc(defender.name)} gagne` : "Égalité"}</span>
        </div>`).join("")}
      </div>
      <div class="note" style="margin-top:12px">
        <strong>À ${esc(current.name)} de lancer</strong>
        <div class="mini" style="margin-top:4px">Compétence : ${SKILLS[d.attackerTurn ? d.attackerSkill : d.defenderSkill]} · Arme : +${d.attackerTurn ? (d.attackerWeapon === "gun" ? d.attackerGunBonus : attacker.meleeLevel) : (d.defenderWeapon === "gun" ? d.defenderGunBonus : defender.meleeLevel)}</div>
        <button class="btn pink" data-act="duel-roll" style="margin-top:10px">🎲 Lancer</button>
      </div>
    </div>`;
  }

  if (d.phase === "done") {
    const aW = d.attackerWins, dW = d.defenderWins;
    const winner = aW > dW ? attacker : dW > aW ? defender : null;
    return `<div class="card target-frame" style="margin-top:12px">
      <div class="label-top">Duel terminé</div>
      <div class="grid" style="margin-top:10px">
        ${d.rounds.map((r, i) => `<div class="pill">
          <span>Round ${i+1}</span>
          <span>${esc(attacker.name)} : ${r.attackerTotal} vs ${esc(defender.name)} : ${r.defenderTotal}</span>
        </div>`).join("")}
      </div>
      <div class="note" style="margin-top:12px">
        ${winner
          ? `<strong>${esc(winner.name)} remporte le duel (${aW > dW ? aW : dW}/4) et gagne -2 Warnings.</strong>`
          : "<strong>Égalité parfaite — aucun effet.</strong>"}
      </div>
    </div>`;
  }
  return "";
}

function renderDuelSetup(p, role) {
  const isAttacker = role === "attacker";
  const d = state.duel;
  const attacker = state.players.find(x => x.id === d.attackerId);
  const gunUsable = p.gunLevel >= 3;
  return `<div class="card target-frame" style="margin-top:12px">
    <div class="label-top">Duel · ${isAttacker ? "Attaquant" : "Défenseur"} — ${esc(p.name)}</div>
    <p class="mini" style="margin-top:6px">Choisis ta compétence et ton arme pour ce duel.</p>
    <div class="grid g2" style="margin-top:12px">
      <div>
        <div class="label-top">Compétence</div>
        <div class="grid" style="margin-top:6px">
          ${Object.entries(SKILLS).map(([k, v]) => `
            <button class="btn ${((isAttacker ? d.attackerSkill : d.defenderSkill) === k) ? "cyan" : "outline"}"
              data-act="duel-skill" data-role="${role}" data-skill="${k}">
              ${v} (${p.skills[k] || 0})
            </button>`).join("")}
        </div>
      </div>
      <div>
        <div class="label-top">Arme</div>
        <div class="grid" style="margin-top:6px">
          <button class="btn ${((isAttacker ? d.attackerWeapon : d.defenderWeapon) === "melee") ? "cyan" : "outline"}"
            data-act="duel-weapon" data-role="${role}" data-weapon="melee">
            ✋ Poing (+${p.meleeLevel})
          </button>
          <button class="btn ${((isAttacker ? d.attackerWeapon : d.defenderWeapon) === "gun") ? "cyan" : "outline"}"
            data-act="duel-weapon" data-role="${role}" data-weapon="gun" ${gunUsable ? "" : "disabled"}>
            🤜 Tir (+${gunUsable ? p.gunLevel : 0})
          </button>
          ${gunUsable && (isAttacker ? d.attackerWeapon : d.defenderWeapon) === "gun" ? `
          <div class="mini">Munitions supplémentaires :</div>
          ${[1,2,3].map(n => `<button class="btn ${((isAttacker ? d.attackerAmmo : d.defenderAmmo) === n) ? "cyan" : "outline"}"
            data-act="duel-ammo" data-role="${role}" data-n="${n}" ${p.ammo >= n ? "" : "disabled"}>
            +${n} mun. (total +${p.gunLevel + n})
          </button>`).join("")}` : ""}
        </div>
      </div>
    </div>
    <div style="margin-top:14px">
      <button class="btn green" data-act="duel-confirm" data-role="${role}"
        ${(isAttacker ? d.attackerSkill : d.defenderSkill) && (isAttacker ? d.attackerWeapon : d.defenderWeapon) ? "" : "disabled"}>
        Confirmer mon choix →
      </button>
    </div>
  </div>`;
}

function labelDie(t) {
  return ({ datacoin: "Datacoin", skill: "Compétence", weapon: "Arme", resource: "Ressource", mystery: "Mystère", leader: "Premier joueur" })[t] || t;
}

// ── Game logic ────────────────────────────

function applyNormalDie(p, t, face) {
  const c = CRIMINALS.find(x => x.key === p.criminal);
  if (t === "datacoin") p.datacoins += Number(face.replace("D", ""));

  if (t === "skill") {
    if (face === "A")  p.skills.agilite++;
    if (face === "D")  p.skills.discretion++;
    if (face === "F")  p.skills.folie++;
    if (face === "V")  p.skills.violence++;
    if (face === "R")  p.skills.ruse++;
    if (face === "C?") p.freeSkill++;
    maybeAwardSkill10Xp(p);
  }

  if (t === "weapon") {
    if (face === "Tir"   && (p.gunLevel   < 3 || (p.gunBuilt3   && p.gunLevel   < 6) || (p.gunBuilt6   && p.gunLevel   < 7))) { p.gunLevel++;   if (c.key === "psychopathe") p.ammo += 2; }
    if (face === "Poing" && (p.meleeLevel < 3 || (p.meleeBuilt3 && p.meleeLevel < 6) || (p.meleeBuilt6 && p.meleeLevel < 7)))   p.meleeLevel++;
    if (face === "2 Munitions") p.ammo += 2;
    if (face === "Warning")     p.warnings++;
  }

  if (t === "resource") {
    if (face === "1 CD")       p.cds++;
    if (face === "1 Bobine")   p.bobines++;
    if (face === "1 Batterie") p.batteries++;
    if (face === "2 CD")       p.cds      += 2;
    if (face === "2 Bobines")  p.bobines  += 2;
    if (face === "2 Batteries")p.batteries += 2;
  }

  if (t === "mystery") {
    if (face === "Compétence au choix") p.freeSkill++;
    if (face === "Arme au choix")       p.freeWeapon++;
    if (face === "2 PV")   { let gain = 2; if (c.key === "missionnaire") gain += 2; p.hp = Math.min(p.maxHp, p.hp + gain); }
    if (face === "1 Warning")    p.warnings++;
    if (face === "2 Munitions")  p.ammo += 2;
    if (face === "Ressource au choix") p.choiceRes++;
  }
}

function applyLeader(face, choice) {
  state.players.forEach(p => {
    const c = CRIMINALS.find(x => x.key === p.criminal);
    if      (face === "Double réussite")                          p.doubleHit = true;
    else if (face === "+3 à tous les d20")                        p.plus3     = true;
    else if (face === "2 PV (tous)")                              { let gain = 2; if (c.key === "missionnaire") gain += 2; p.hp = Math.min(p.maxHp, p.hp + gain); }
    else if (face === "1 compétence au choix (tous)" && choice)   { p.skills[choice]++; maybeAwardSkill10Xp(p); }
    else if (face === "1 arme/compétence au choix (tous)" && choice) {
      if      (choice === "gun"   && p.gunLevel   < 7) p.gunLevel++;
      else if (choice === "melee" && p.meleeLevel < 7) p.meleeLevel++;
      else if (SKILLS[choice]) { p.skills[choice]++; maybeAwardSkill10Xp(p); }
    }
    else if (face === "Ressource au choix (tous)" && choice) {
      if (choice === "cds")      p.cds++;
      if (choice === "bobines")  p.bobines++;
      if (choice === "batteries")p.batteries++;
    }
  });
  addLog(`Effet du dé premier joueur : ${face}${choice ? ` · ${choice}` : ""}.`);
}

// ── Séquence helper ───────────────────────
// Retourne l'index du joueur suivant en ordre circulaire depuis le leader.
// filter(p) optionnel : ne retourne que les joueurs qui passent le filtre.
// Retourne null si aucun suivant trouvé.
function seqNext(currentIdx, filter) {
  const n = state.players.length;
  for (let i = 1; i < n; i++) {
    const idx = (currentIdx + i) % n;
    if (!filter || filter(state.players[idx])) return idx;
  }
  return null;
}

// ── Actions ───────────────────────────────

function pickDieAction(die) {
  if (state.phase !== "draft") return;
  const idx = state.draftOrder[state.draftStep], p = state.players[idx];
  if (!state.pool.includes(die)) return;
  const max = idx === state.leader ? 3 : 2;
  const playerDice = p.pending.filter(d => d !== "leader");
  if (playerDice.length >= max) return;
  if (playerDice.includes(die)) { addLog(`${p.name} a déjà choisi un dé de type ${labelDie(die)}.`); render(); return; }
  p.pending.push(die);
  state.pool.splice(state.pool.indexOf(die), 1);
  if (state.draftStep === state.draftOrder.length - 1) {
    state.phase = "roll"; state.draftLocked = false;
    state.seqPlayerIdx = state.leader; state.seqLocked = true;
    addLog("Phase de tour — " + esc(state.players[state.leader].name) + " commence.");
  } else {
    state.draftStep++;
    const nextIdx = state.draftOrder[state.draftStep];
    if (nextIdx !== idx) state.draftLocked = true;
  }
  checkGameOver();
  render();
}

function rollDiceAction(id) {
  const p = state.players.find(x => x.id === id);
  if (!p || !p.pending.length) return;
  p.rolled = [];
  let leaderFaceNeedingChoice = null;
  for (const t of p.pending) {
    const face = pick(DICE[t]);
    p.rolled.push({ type: t, face });
    if (t === "leader" && ["1 compétence au choix (tous)","1 arme/compétence au choix (tous)","Ressource au choix (tous)"].includes(face)) {
      leaderFaceNeedingChoice = face;
    } else if (t === "leader") {
      applyLeader(face, null);
    } else {
      applyNormalDie(p, t, face);
    }
  }
  p.pending = [];
  if (id === state.players[state.leader].id && leaderFaceNeedingChoice) {
    p.rollPanel = { kind: "leaderChoice", face: leaderFaceNeedingChoice };
  }
  // Le joueur reste sur son écran pour faire ses achats — pas d'avancée ici
  render();
}

function resolveLeaderAction(choice) {
  const p = state.players[state.leader];
  if (!p || !p.rollPanel || p.rollPanel.kind !== "leaderChoice") return;
  applyLeader(p.rollPanel.face, choice);
  p.rollPanel = null;
  // Le leader reste sur son écran pour faire ses achats et choisir l'action
  render();
}

function buyAction(id, kind, res) {
  const p = state.players.find(x => x.id === id);
  if (!p) return;

  if (kind === "pv"   && p.datacoins >= 2) { p.datacoins -= 2; p.hp = Math.min(p.maxHp, p.hp + 1); }
  if (kind === "ammo" && p.datacoins >= 1) { p.datacoins -= 1; p.ammo += 1; }
  if (kind === "res"  && p.datacoins >= 3) { p.datacoins -= 3; p[res] += 1; }

  if (kind === "buildM3" && p.meleeLevel >= 3 && !p.meleeBuilt3 && p.batteries >= 1 && p.bobines >= 2 && p.cds >= 1) {
    p.batteries -= 1; p.bobines -= 2; p.cds -= 1; p.meleeBuilt3 = true;
  }
  if (kind === "buildM6" && p.meleeLevel >= 6 && p.meleeBuilt3 && !p.meleeBuilt6 && p.batteries >= 2 && p.bobines >= 1 && p.cds >= 2) {
    p.batteries -= 2; p.bobines -= 1; p.cds -= 2; p.meleeBuilt6 = true;
  }
  if (kind === "buildG3" && p.gunLevel >= 3 && !p.gunBuilt3 && p.batteries >= 1 && p.bobines >= 2 && p.cds >= 3) {
    p.batteries -= 1; p.bobines -= 2; p.cds -= 3; p.gunBuilt3 = true;
  }
  if (kind === "buildG6" && p.gunLevel >= 6 && p.gunBuilt3 && !p.gunBuilt6 && p.batteries >= 2 && p.bobines >= 3 && p.cds >= 2) {
    p.batteries -= 2; p.bobines -= 3; p.cds -= 2; p.gunBuilt6 = true;
  }

  checkGameOver();
  render();
}

function chooseResAction(id, res) {
  const p = state.players.find(x => x.id === id);
  if (!p || p.choiceRes < 1) return;
  p.choiceRes--;
  if (res === "cds")      p.cds++;
  if (res === "bobines")  p.bobines++;
  if (res === "batteries")p.batteries++;
  render();
}

// ── Duel actions ──────────────────────────

function duelPickAction(defenderId) {
  const attacker = state.players[state.leader];
  state.duel = {
    attackerId:    attacker.id,
    defenderId,
    attackerSkill:  null, attackerWeapon: null, attackerAmmo: 0, attackerGunBonus: 0,
    defenderSkill:  null, defenderWeapon: null, defenderAmmo: 0, defenderGunBonus: 0,
    rounds:         [],
    attackerWins:   0,
    defenderWins:   0,
    phase:          "attackerSetup",
    attackerTurn:   true
  };
  render();
}

function duelSkillAction(role, skill) {
  const d = state.duel;
  if (!d) return;
  if (role === "attacker") d.attackerSkill = skill;
  else                     d.defenderSkill = skill;
  render();
}

function duelWeaponAction(role, weapon) {
  const d = state.duel;
  if (!d) return;
  if (role === "attacker") {
    d.attackerWeapon = weapon;
    d.attackerAmmo   = 0;
    if (weapon === "gun") {
      const p = state.players.find(x => x.id === d.attackerId);
      d.attackerGunBonus = p.gunLevel;
    }
  } else {
    d.defenderWeapon = weapon;
    d.defenderAmmo   = 0;
    if (weapon === "gun") {
      const p = state.players.find(x => x.id === d.defenderId);
      d.defenderGunBonus = p.gunLevel;
    }
  }
  render();
}

function duelAmmoAction(role, n) {
  const d = state.duel;
  if (!d) return;
  if (role === "attacker") {
    const p = state.players.find(x => x.id === d.attackerId);
    d.attackerAmmo     = n;
    d.attackerGunBonus = p.gunLevel + n;
  } else {
    const p = state.players.find(x => x.id === d.defenderId);
    d.defenderAmmo     = n;
    d.defenderGunBonus = p.gunLevel + n;
  }
  render();
}

function duelConfirmAction(role) {
  const d = state.duel;
  if (!d) return;
  if (role === "attacker") {
    d.phase       = "defenderSetup";
    d.attackerTurn = false;
  } else {
    d.phase       = "rolling";
    d.attackerTurn = true;
  }
  render();
}

function duelRollAction() {
  const d = state.duel;
  if (!d || d.phase !== "rolling") return;

  const attacker = state.players.find(p => p.id === d.attackerId);
  const defender = state.players.find(p => p.id === d.defenderId);

  if (d.attackerTurn) {
    // Attacker rolls
    const skill = attacker.skills[d.attackerSkill] || 0;
    const weapon = d.attackerWeapon === "gun" ? d.attackerGunBonus : attacker.meleeLevel;
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + skill + weapon;
    // Find or create current round entry
    if (!d.rounds.length || d.rounds[d.rounds.length - 1].defenderRoll !== undefined) {
      d.rounds.push({ attackerRoll: roll, attackerTotal: total });
    } else {
      // shouldn't happen but safety
      d.rounds[d.rounds.length - 1].attackerRoll  = roll;
      d.rounds[d.rounds.length - 1].attackerTotal = total;
    }
    d.attackerTurn = false; // now defender's turn
    addLog(`Duel — ${attacker.name} lance ${roll} + ${skill} + ${weapon} = ${total}`);
  } else {
    // Defender rolls
    const skill  = defender.skills[d.defenderSkill] || 0;
    const weapon = d.defenderWeapon === "gun" ? d.defenderGunBonus : defender.meleeLevel;
    const roll   = Math.floor(Math.random() * 20) + 1;
    const total  = roll + skill + weapon;
    const cur = d.rounds[d.rounds.length - 1];
    cur.defenderRoll  = roll;
    cur.defenderTotal = total;
    addLog(`Duel — ${defender.name} lance ${roll} + ${skill} + ${weapon} = ${total}`);

    // Resolve round
    if (cur.attackerTotal > cur.defenderTotal) {
      d.attackerWins++;
      defender.hp = Math.max(0, defender.hp - 1);
      addLog(`${attacker.name} gagne le round — ${defender.name} perd 1 PV.`);
    } else if (cur.defenderTotal > cur.attackerTotal) {
      d.defenderWins++;
      attacker.hp = Math.max(0, attacker.hp - 1);
      addLog(`${defender.name} gagne le round — ${attacker.name} perd 1 PV.`);
    } else {
      addLog("Égalité — aucune perte.");
    }

    if (d.rounds.length < 4) {
      d.attackerTurn = true; // next round starts with attacker
    } else {
      // Duel over
      d.phase = "done";
      if (d.attackerWins > d.defenderWins) {
        attacker.warnings = Math.max(0, attacker.warnings - 2);
        addLog(`${attacker.name} remporte le duel — -2 Warnings.`);
      } else if (d.defenderWins > d.attackerWins) {
        defender.warnings = Math.max(0, defender.warnings - 2);
        addLog(`${defender.name} remporte le duel — -2 Warnings.`);
      } else {
        addLog("Duel terminé — égalité parfaite.");
      }
      // consume ammo if gun was used
      if (d.attackerWeapon === "gun" && d.attackerAmmo > 0) attacker.ammo = Math.max(0, attacker.ammo - d.attackerAmmo);
      if (d.defenderWeapon === "gun" && d.defenderAmmo > 0) defender.ammo = Math.max(0, defender.ammo - d.defenderAmmo);
    }
  }
  render();
}

function donePurchaseAction(id) {
  const p = state.players.find(x => x.id === id);
  if (!p || p.done) return;
  const isLeader = state.players.indexOf(p) === state.leader;
  if (!p.rolled.length) return; // doit avoir lancé ses dés avant
  if (isLeader && !state.actionChoice) return; // le leader doit choisir l'action avant
  p.done = true;
  addLog(`${p.name} a terminé son tour.`);
  if (state.players.every(x => x.done)) {
    state.phase = "action";
    state.seqLocked = false;
    const actionLabel = { target: "Attaque des cibles.", quest: "Quêtes.", duel: "Affaiblir un joueur." }[state.actionChoice] || "Action.";
    addLog("Phase d'action — " + actionLabel);
  } else {
    const next = seqNext(state.seqPlayerIdx, pl => !pl.done);
    if (next !== null) {
      state.seqPlayerIdx = next;
      state.seqLocked    = true;
    }
  }
  render();
}

function chooseActionAction(kind) {
  if (state.actionChoice) return;
  state.actionChoice = kind;
  if (kind === "target") {
    state.players.forEach(p => {
      const tier = stage(p);
      const pool = [...TARGETS[tier]];
      const i1 = Math.floor(Math.random() * pool.length);
      const t1 = pool.splice(i1, 1)[0];
      const t2 = pool[Math.floor(Math.random() * pool.length)];
      p.targetOptions = [t1, t2];
      p.chosenTarget  = null;
    });
    if (state.mode === "solo") {
      state.soloEnemyAi = pick(SOLO_ENEMY_AI);
      state.soloEnemyThresholdBonus = 0;
      state.soloEnemyShieldFresh    = state.soloEnemyAi && state.soloEnemyAi.key === "first_hit_shield";
      addLog(`Phase cible solo — IA ennemie : ${state.soloEnemyAi.name}. Choisis ta cible.`);
    } else {
      addLog("Chaque joueur choisit sa cible parmi 2 options.");
    }
  }
  const labels = { target: "attaquer la cible", quest: "faire les quêtes", duel: "affaiblir un joueur" };
  addLog(`Choix verrouillé : ${labels[kind] || kind}.`);
  render();
}

function openActionAction(id, kind) {
  if (kind === "target") startMusic("attack");
  const p = state.players.find(x => x.id === id);
  if (kind === "target") {
    if (p.finishedTarget || p.abandonedThisTurn) { addLog(`${p.name} ne peut plus relancer la cible ce tour.`); render(); return; }
    if (!p.chosenTarget) {
      p.rollPanel = { kind: "chooseTargetOptions" };
    } else {
      p.targetReady = true;
      p.rollPanel   = { kind: "chooseTarget" };
    }
  } else {
    if (p.finishedQuestsThisTurn || p.abandonedQuestThisTurn) { addLog(`${p.name} a terminé ou abandonné sa quête pour ce tour.`); render(); return; }
    p.rollPanel = p.committedQuestId
      ? { kind: "chooseQuest", questId: p.committedQuestId }
      : { kind: "chooseQuestList" };
  }
  render();
}

function pickQuestAction(id, qid) {
  const p = state.players.find(x => x.id === id);
  p.committedQuestId = qid;
  p.rollPanel = { kind: "chooseQuest", questId: qid };
  addLog(`${p.name} choisit sa quête pour ce tour.`);
  render();
}

function abandonQuestAction(id, qid) {
  const p = state.players.find(x => x.id === id);
  if (!p || p.abandonedQuestThisTurn || p.finishedQuestsThisTurn) return;
  if (!p.abandonedQuests.includes(qid)) p.abandonedQuests.push(qid);
  p.committedQuestId    = null;
  p.rollPanel           = null;
  p.abandonedQuestThisTurn  = true;
  p.finishedQuestsThisTurn  = true;
  addLog(`${p.name} : Vous avez abandonné votre quête. Vous devez attendre que l'autre joueur termine ou abandonne sa quête comme vous.`);
  render();
}

function submitActionAction(id, kind, weapon, ammo) {
  const p   = state.players.find(x => x.id === id);
  const obj = kind === "chooseTarget" ? p.chosenTarget : p.chosen.find(q => q.id === p.rollPanel.questId);
  if (!obj) return;

  const natural    = 1 + Math.floor(Math.random() * 20);
  const skillKeys  = kind === "chooseTarget" ? obj.skill : [obj.skill];
  let totalSkill   = skillKeys.reduce((s, k) => s + (p.skills[k] || 0), 0);
  let weaponBonus  = 0;

  if (weapon === "melee") weaponBonus = p.meleeLevel;
  if (weapon === "gun")   {
    if (p.gunLevel < 3) return;
    const spend = Math.min(Number(ammo), p.ammo);
    p.ammo -= spend;
    weaponBonus = p.gunLevel + spend;
  }

  const modPlus3       = p.plus3        ? 3 : 0;
  const modMinus3      = p.powerMinus3  ? 3 : 0;
  const modSystemPlus2 = p.systemPlus2  ? 2 : 0;
  const modSystemMinus2= p.systemMinus2 ? 2 : 0;

  let naturalRolled = natural;
  if (p.forceReroll) { naturalRolled = 1 + Math.floor(Math.random() * 20); p.forceReroll = false; }

  const total   = naturalRolled + modPlus3 - modMinus3 + modSystemPlus2 - modSystemMinus2 + totalSkill + weaponBonus;
  p.plus3       = false;
  if (p.powerMinus3)  p.powerMinus3  = 0;
  if (p.systemPlus2)  p.systemPlus2  = 0;
  if (p.systemMinus2) p.systemMinus2 = 0;

  const success = total >= obj.threshold;
  let extra = "";
  if (modPlus3)        extra += "+3 appliqué. ";
  if (modMinus3)       extra += "-3 appliqué. ";
  if (modSystemPlus2)  extra += "+2 système appliqué. ";
  if (modSystemMinus2) extra += "-2 système appliqué. ";

  if (kind === "chooseTarget") {
    if (success) {
      let dmg = p.doubleHit ? 2 : 1;
      if ((naturalRolled === 20 && p.questReady.includes("20 naturel = 2 dégâts")) || (naturalRolled === 20 && p.doubleNat20)) dmg = Math.max(dmg, 2);
      p.targetHits += dmg;
      if (p.targetHits >= obj.hits) {
        p.xp += obj.xp;
        skillKeys.forEach(k => { p.skills[k]++; });
        maybeAwardSkill10Xp(p);
        const prevStage = stage(p);
        if (prevStage === 1) p.kills1++; else if (prevStage === 2) p.kills2++;
        if (p.kills1 === 3 && !state.rankLvl2.includes(p.id)) {
          state.rankLvl2.push(p.id);
          const rank  = state.rankLvl2.length;
          const bonus = rank === 1 ? 8 : rank === 2 ? 5 : 0;
          p.xp += bonus;
          p.freeSkill  += 1;
          p.freeWeapon += 1;
          addLog(`${p.name} débloque les cibles niveau 2 : +${bonus} XP, +1 compétence au choix, +1 niveau d'arme au choix.`);
        }
        p.targetHits = 0; p.finishedTarget = true; p.targetReady = false;
        extra = "Tu as abattu ta cible, bien joué. Attends que les autres aient battu leur cible ou abandonnent.";
        addLog(`${p.name} bat ${obj.name}.`);
      } else {
        addLog(`${p.name} touche ${obj.name} (${p.targetHits}/${obj.hits}).`);
      }
    } else {
      p.hp = Math.max(0, p.hp - obj.fail);
      addLog(`${p.name} échoue contre ${obj.name}.`);
    }
  } else {
    if (success) {
      p.questProgress[obj.id] = (p.questProgress[obj.id] || 0) + 1;
      if (p.questProgress[obj.id] >= obj.hits && !p.questReady.includes(obj.effect)) p.questReady.push(obj.effect);
      if (p.questProgress[obj.id] >= obj.hits) {
        p.finishedQuestsThisTurn = true;
        p.committedQuestId = null;
        extra = "Contrat rempli. Une trace de plus dans ton dossier. Vous devez attendre que l'autre joueur termine la sienne ou abandonne.";
      } else {
        p.finishedQuestsThisTurn = false;
        p.committedQuestId = obj.id;
        extra = `Réussite ${p.questProgress[obj.id]}/${obj.hits}. Continue sur cette même quête jusqu'à la compléter ou abandonner.`;
      }
      addLog(`${p.name} réussit ${obj.name}.`);
    } else {
      if (obj.failType === "hp") p.hp = Math.max(0, p.hp - obj.failAmount);
      else p.warnings += obj.failAmount;
      p.finishedQuestsThisTurn = false;
      p.committedQuestId = obj.id;
      extra = (obj.failType === "hp" ? `-${obj.failAmount} PV` : `+${obj.failAmount} Warning`) + ` · Progression ${p.questProgress[obj.id] || 0}/${obj.hits}. Tu peux continuer cette même quête ou abandonner.`;
      addLog(`${p.name} rate ${obj.name}.`);
    }
  }

  p.doubleNat20 = false;
  p.rollPanel   = { kind: "ready", data: { label: obj.name, natural: naturalRolled, total, success, threshold: obj.threshold, extra } };
  if (kind === "chooseTarget" && !p.finishedTarget && !p.abandonedThisTurn) p.targetReady = true;
  // Repasser en ambient après le résultat du lancer
  if (kind === "chooseTarget") setTimeout(() => startMusic("ambient"), 1800);
  checkGameOver();
  playRollSound(success);
  if (!success) triggerBloodEffect();
  render();
}

function pickTargetAction(id, idx) {
  const p = state.players.find(x => x.id === id);
  if (!p || p.chosenTarget || !p.targetOptions[idx]) return;
  p.chosenTarget = p.targetOptions[idx];
  p.targetReady  = true;
  p.rollPanel    = { kind: "chooseTarget" };
  addLog(`${p.name} choisit sa cible : ${p.chosenTarget.name}.`);
  render();
}

function closePanelAction(id) {
  const p = state.players.find(x => x.id === id);
  if (!p) return;
  p.rollPanel = null;
  render();
}

function abandonAction(id) {
  const p = state.players.find(x => x.id === id);
  if (!p) return;
  if (state.actionChoice === "target" && (p.abandonedThisTurn  || p.finishedTarget))          return;
  if (state.actionChoice === "quest"  && (p.abandonedQuestThisTurn || p.finishedQuestsThisTurn)) return;
  p.rollPanel = null;
  if (state.actionChoice === "target") {
    p.finishedTarget = true; p.abandonedThisTurn = true; p.targetReady = false;
    startMusic("ambient");
  } else {
    p.finishedQuestsThisTurn = true; p.abandonedQuestThisTurn = true;
  }
  addLog(state.actionChoice === "target"
    ? `${p.name} : Tu as abandonné le combat, attends que les autres aient battu leur cible ou abandonné comme toi.`
    : `${p.name} : Vous avez abandonné votre quête. Vous devez attendre que l'autre joueur termine ou abandonne sa quête comme vous.`);
  render();
}

function startSetupAction() { state.mode = "multi"; state.playerCount = Math.max(2, state.playerCount); state.screen = "setup"; state.setupStep = 0; state.setupLock = false; initSetup(); render(); }
function startSoloAction()  { state.mode = "solo";  state.playerCount = 1; state.screen = "setup"; state.setupStep = 0; state.setupLock = false; initSetup(); render(); }
function setPlayerCountAction(v) { state.playerCount = Number(v); }

async function startOnlineAction() {
  state.mode = "multi";
  state.playerCount = Math.max(2, state.playerCount);
  initSetup();
  state.lobby = { isHost: true, players: [] };
  state.screen = "lobby";
  render();
  const code = await createOnlineGame();
  if (!code) return;
  render();
}

async function joinOnlineAction() {
  const input = document.getElementById("join-code");
  const code  = (input ? input.value.trim().toUpperCase() : "");
  if (code.length !== 4) { alert("Entre un code à 4 lettres."); return; }
  const ok = await joinOnlineGame(code);
  if (!ok) return;
  // Enregistre ce joueur comme non-hôte
  state.lobby = { isHost: false, players: [] };
  state.screen = "lobby";
  render();
}

async function onlineLaunchAction() {
  if (!state.lobby || !state.lobby.isHost) return;
  state.mode = "multi";
  state.screen = "setup";
  state.setupStep = 0;
  state.setupLock = false;
  initSetup();
  render();
}

function setupNextAction() {
  const p = state.setup[state.setupStep];
  if (!p.name.trim()) { alert("Entre un surnom avant de continuer."); return; }
  if (p.chosen.length !== 3) { alert("Choisis exactement 3 quêtes avant de continuer."); return; }
  state.setupStep++;
  state.setupLock = true;
  render();
}

function setupFieldAction(i, k, v) {
  const p = state.setup[i];
  p[k] = v;
  if (k === "criminal") {
    const c = CRIMINALS.find(x => x.key === v);
    p.skills = { agilite: 0, ruse: 0, violence: 0, folie: 0, discretion: 0 };
    p.skills[c.skill] = 2;
  }
  render();
}

function toggleQuestAction(i, qid) {
  const p = state.setup[i], q = p.quests.find(x => x.id === qid);
  if (p.chosen.some(x => x.id === qid)) p.chosen = p.chosen.filter(x => x.id !== qid);
  else if (p.chosen.length < 3) p.chosen.push(q);
  render();
}

function launchAction() {
  const last = state.setup[state.setupStep];
  if (!last.name.trim()) { alert("Entre un surnom avant de lancer la partie."); return; }
  if (last.chosen.length !== 3) { alert("Choisis exactement 3 quêtes avant de lancer la partie."); return; }
  initGame(); render();
}

function boostSkillAction(id, skill) {
  const p = state.players.find(x => x.id === id);
  if (!p || p.freeSkill < 1) return;
  p.freeSkill--;
  p.skills[skill]++;
  maybeAwardSkill10Xp(p);
  render();
}

function boostWeaponAction(id, weapon) {
  const p = state.players.find(x => x.id === id);
  if (!p || p.freeWeapon < 1) return;
  p.freeWeapon--;
  if (weapon === "melee" && (p.meleeLevel < 3 || (p.meleeBuilt3 && p.meleeLevel < 6) || (p.meleeBuilt6 && p.meleeLevel < 7))) p.meleeLevel++;
  if (weapon === "gun"   && (p.gunLevel   < 3 || (p.gunBuilt3   && p.gunLevel   < 6) || (p.gunBuilt6   && p.gunLevel   < 7))) p.gunLevel++;
  render();
}

function openPowerAction(id, effect) {
  const p = state.players.find(x => x.id === id);
  if (!p || state.phase !== "action") return;
  if ((p.questPowerUses[effect] || 0) >= 3) return;
  p.rollPanel = { kind: "usePower", effect };
  render();
}

function closePowerAction(id) {
  const p = state.players.find(x => x.id === id);
  if (!p) return;
  if (p.rollPanel && p.rollPanel.kind === "usePower") p.rollPanel = null;
  render();
}

function applyPowerAction(id, targetId, effect) {
  const p = state.players.find(x => x.id === id);
  const t = state.players.find(x => x.id === targetId);
  if (!p || !t || state.phase !== "action") return;
  const used = p.questPowerUses[effect] || 0;
  if (used >= 3) return;

  if (effect === "+3 / -3") {
    if (targetId === id) { t.plus3 = true; addLog(`${p.name} utilise sa capacité sur ${t.name} : +3 à son prochain d20.`); }
    else                 { t.powerMinus3 = (t.powerMinus3 || 0) + 1; addLog(`${p.name} utilise sa capacité sur ${t.name} : -3 à son prochain d20.`); }
  } else if (effect === "Force une relance") {
    t.forceReroll = true;
    addLog(`${p.name} oblige ${t.name} à relancer son prochain d20.`);
  } else if (effect === "20 naturel = 2 dégâts") {
    t.doubleNat20 = true;
    addLog(`${p.name} active l'effet "20 naturel = 2 dégâts" sur ${t.name}.`);
  }

  p.questPowerUses[effect] = used + 1;
  addLog(`${p.name} a maintenant ${Math.max(0, 3 - p.questPowerUses[effect])}/3 utilisation(s) restante(s) pour cette capacité.`);
  p.rollPanel = null;
  render();
}

// ── Event delegation ──────────────────────

document.addEventListener("input", e => {
  const t = e.target;
  if (t.dataset.field && t.dataset.idx !== undefined && t.tagName === "INPUT") {
    setupFieldAction(Number(t.dataset.idx), t.dataset.field, t.value);
  }
});

document.addEventListener("change", e => {
  const t = e.target;
  if (t.id === "player-count-home") setPlayerCountAction(t.value);
  if (t.id === "player-count") setPlayerCountAction(t.value);
  if (t.dataset.field && t.dataset.idx !== undefined && t.tagName === "SELECT") {
    setupFieldAction(Number(t.dataset.idx), t.dataset.field, t.value);
  }
});

document.addEventListener("click", e => {
  if (e.target.id === "btn-mute") { toggleMute(); return; }
  unlockAudio();
  const t = e.target.closest("[data-act]");
  if (!t) return;
  const a = t.dataset.act;
  if (a === "start-setup")   startSetupAction();
  if (a === "start-solo")    startSoloAction();
  if (a === "start-online")  startOnlineAction();
  if (a === "join-online")   joinOnlineAction();
  if (a === "online-launch") onlineLaunchAction();
  if (a === "launch")        launchAction();
  if (a === "toggle-quest")  toggleQuestAction(Number(t.dataset.idx), t.dataset.qid);
  if (a === "pick-die")      pickDieAction(t.dataset.die);
  if (a === "roll-dice")     rollDiceAction(t.dataset.id);
  if (a === "resolve-leader")resolveLeaderAction(t.dataset.choice);
  if (a === "buy")           buyAction(t.dataset.id, t.dataset.kind, t.dataset.res);
  if (a === "choose-res")    chooseResAction(t.dataset.id, t.dataset.res);
  if (a === "done-purchase") donePurchaseAction(t.dataset.id);
  if (a === "choose-action") chooseActionAction(t.dataset.kind);
  if (a === "open-action")   openActionAction(t.dataset.id, t.dataset.kind);
  if (a === "pick-quest")    pickQuestAction(t.dataset.id, t.dataset.qid);
  if (a === "abandon-quest") abandonQuestAction(t.dataset.id, t.dataset.qid);
  if (a === "submit-action") submitActionAction(t.dataset.id, t.dataset.kind, t.dataset.weapon, t.dataset.ammo);
  if (a === "close-panel")   closePanelAction(t.dataset.id);
  if (a === "abandon-action")abandonAction(t.dataset.id);
  if (a === "boost-skill")   boostSkillAction(t.dataset.id, t.dataset.skill);
  if (a === "boost-weapon")  boostWeaponAction(t.dataset.id, t.dataset.weapon);
  if (a === "open-power")    openPowerAction(t.dataset.id, t.dataset.effect);
  if (a === "apply-power")   applyPowerAction(t.dataset.id, t.dataset.target, t.dataset.effect);
  if (a === "close-power")   closePowerAction(t.dataset.id);
  if (a === "duel-pick")     duelPickAction(t.dataset.id);
  if (a === "duel-skill")    duelSkillAction(t.dataset.role, t.dataset.skill);
  if (a === "duel-weapon")   duelWeaponAction(t.dataset.role, t.dataset.weapon);
  if (a === "duel-ammo")     duelAmmoAction(t.dataset.role, Number(t.dataset.n));
  if (a === "duel-confirm")  duelConfirmAction(t.dataset.role);
  if (a === "duel-roll")     duelRollAction();
  if (a === "end-turn")      nextTurn();
  if (a === "next-turn")     nextTurn();
  if (a === "pick-target")   pickTargetAction(t.dataset.id, Number(t.dataset.idx));
  if (a === "show-private")  { state.lockScreen = t.dataset.id; state.privateView = null; render(); }
  if (a === "unlock-private"){ state.privateView = t.dataset.id; state.lockScreen = null; render(); }
  if (a === "close-private") { state.privateView = null; render(); }
  if (a === "cancel-lock")   { state.lockScreen = null; render(); }
  if (a === "pick-gender")   { state.setup[Number(t.dataset.idx)].gender = t.dataset.gender; render(); }
  if (a === "setup-next")    setupNextAction();
  if (a === "setup-unlock")  { state.setupLock = false; render(); }
  if (a === "draft-unlock")  { state.draftLocked = false; render(); }
  if (a === "seq-unlock")    { state.seqLocked = false; render(); }
});

// ── Boot ──────────────────────────────────
initSetup();
render();

