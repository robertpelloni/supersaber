import genresList from '../constants/genres.js';
/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-operators */
/* global localStorage */
import utils from '../utils.js';

const challengeDataStore = {};
const NUM_LEADERBOARD_DISPLAY = 10;
const SEARCH_PER_PAGE = 6;
const SONG_NAME_TRUNCATE = 24;
const SONG_SUB_NAME_TRUNCATE = 32;

const DAMAGE_DECAY = 0.25;
const DAMAGE_MAX = 10;

const DEBUG_CHALLENGE = {
  author: 'Superman',
  difficulty: 'Expert',
  id: '31',
  image: 'assets/img/molerat.jpg',
  songName: 'Friday',
  songLength: 100,
  songSubName: 'Rebecca Black'
};

/**
 * State handler.
 *
 * 1. `handlers` is an object of events that when emitted to the scene will run the handler.
 *
 * 2. The handler function modifies the state.
 *
 * 3. Entities and components that are `bind`ed automatically update:
 *    `bind__<componentName>="<propertyName>: some.item.in.state"`
 */
AFRAME.registerState({
  nonBindedStateKeys: ['genres'],

  initialState: {
    activeHand: localStorage.getItem('hand') || 'right',

    twitchVotingActive: false,
    twitchVotes: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0},
    twitchVoters: [],

    multiplayerEnabled: false,
    multiplayerRoom: 'ROOM1',

    customSaberModel: null,
    isDraggingAsset: false,
    assetUploadStatus: '',
    challenge: {  // Actively playing challenge.
      author: '',
      difficulty: '',
      id: AFRAME.utils.getUrlParameter('challenge'),  // Will be empty string if not playing.
      image: '',
      isLoading: false,
      isBeatsPreloaded: false,  // Whether we have passed the negative time.
      numBeats: undefined,
      songDuration: 0,
      songName: '',
      songSubName: ''
    },
    controllerType: '',
    damage: 0,
    genre: '',
    genres: genresList,
    genreMenuOpen: false,
    inVR: false,
    is2DDesktopMode: false, // Windowed "corner of desk" mode
    isGameOver: false,  // Game over screen.
    isPaused: false,  // Playing, but paused. Not active during menu.
    isPlaying: false,  // Actively playing (slicing beats).
    isSearching: false,  // Whether search is open.
    isSongFetching: false,  // Fetching stage.
    isSongLoading: false,
    isEditing: false,
    editorAudioUrl: '',
    editorAudioName: '',  // Either fetching or decoding.
    isVictory: false,  // Victory screen.
    campaign: {
      active: false,
      currentLevel: 1,
      objective: {
        minScore: 0,
        maxMisses: 0,
        minCombo: 0,
        requiredModifiers: []
      },
      progress: {} // stores completed levels
    },
    leaderboard: [],
    leaderboardFetched: false,
    leaderboardQualified: false,
    leaderboardNames: '',
    leaderboardScores: '',
    menuActive: true,
    campaignMenuActive: false,
    practiceMenuActive: false,
    practice: {
      active: false,
      playbackRate: 1.0,
      startTime: 0
    },
    menuDifficulties: [],  // List of strings of available difficulties for selected.
    modifiers: {
      ghostNotes: false,
      disappearingArrows: false,
      fastSong: false,
      noFail: false,
      oneSaber: false,
      mode360: false,
      instaFail: false,
      batteryEnergy: false,
      strictAngles: false,
      proMode: false,
      smallNotes: false
    },
    twitchChannel: 'robertpelloni',
    menuSelectedChallenge: {  // Currently selected challenge in the main menu.
      author: '',
      difficulty: '',
      downloads: '',
      downloadsText: '',
      genre: '',
      id: '',
      index: -1,
      image: '',
      numBeats: undefined,
      songDuration: 0,
      songInfoText: '',
      songLength: undefined,
      songName: '',
      songSubName: ''
    },
    score: {
      accuracy: 0,  // Out of 100.
      beatsHit: 0,
      beatsMissed: 0,
      beatsText: '',
      combo: 0,
      maxCombo: 0,
      multiplier: 1,
      rank: '',  // Grade (S to F).
      score: 0
    },
    search: {
      active: true,
      page: 0,
      hasError: false,
      hasNext: false,
      hasPrev: false,
      query: '',
      results: [],
      songNameTexts: '',  // All names in search results merged together.
      songSubNameTexts: ''  // All sub names in search results merged together.
    },
    searchResultsPage: []
  },

  handlers: {
    'editor-select-type': function (state, type) {
      state.editorActiveType = parseInt(type, 10);
    },
    'editor-select-direction': function (state, dir) {
      state.editorActiveCutDirection = parseInt(dir, 10);
    },
    /**
     * Swap left-handed or right-handed mode.
     */
    activehandswap: state => {
      state.activeHand = state.activeHand === 'right' ? 'left' : 'right';
      localStorage.setItem('activeHand', state.activeHand);
    },

    beathit: (state, payload) => {
      if (state.modifiers.batteryEnergy && state.damage > 0) {
        state.damage = Math.max(0, state.damage - 2); // Regen slight energy on hit
      }
      if (state.damage > DAMAGE_DECAY) {
        state.damage -= DAMAGE_DECAY;
      }
      state.score.beatsHit++;
      state.score.combo++;
      if (state.score.combo > state.score.maxCombo) {
        state.score.maxCombo = state.score.combo;
      }

      payload.score = isNaN(payload.score) ? 100 : payload.score;
      state.score.score += Math.floor((((payload.score * state.score.multiplier))));

      // Might be a math formula for this, but the multiplier system is easy reduced.
      if (state.score.combo < 2) {
        state.score.multiplier = 1;
      } else if (state.score.combo < 6) {
        state.score.multiplier = 2;
      } else if (state.score.combo < 14) {
        state.score.multiplier = 4;
      } else {
        state.score.multiplier = 8;
      }

      updateScoreAccuracy(state);
    },

    beatmiss: state => {
      state.score.beatsMissed++;
      takeDamage(state);
      updateScoreAccuracy(state);
    },

    beatwrong: state => {
      state.score.beatsMissed++;
      takeDamage(state);
      updateScoreAccuracy(state);
    },

    beatloaderfinish: (state, payload) => {
      state.challenge.isLoading = false;
    },

    beatloaderpreloadfinish: (state) => {
      if (state.menuActive) { return; }  // Cancelled.
      state.challenge.isBeatsPreloaded = true;
    },

    beatloaderstart: (state) => {
      state.challenge.isBeatsPreloaded = false;
      state.challenge.isLoading = true;
    },

    controllerconnected: (state, payload) => {
      state.controllerType = payload.name;
    },

    /**
     * To work on game over page.
     *
     * ?debugstate=gameplay
     */
    debuggameplay: state => {
      resetScore(state);

      // Set challenge. `beat-loader` is listening.
      Object.assign(state.challenge, state.menuSelectedChallenge);

      // Reset menu.
      state.menuActive = false;
      state.menuSelectedChallenge.id = '';

      state.isSearching = false;
      state.isSongLoading = false;
    },

    /**
     * To work on game over page.
     *
     * ?debugstate=gameover
     */
    debuggameover: state => {
      state.isGameOver = true;
      state.menuActive = false;
    },

    /**
     * To work on victory page.
     *
     * ?debugstate=loading
     */
    debugloading: state => {
      DEBUG_CHALLENGE.id = '-1';
      Object.assign(state.menuSelectedChallenge, DEBUG_CHALLENGE);
      Object.assign(state.challenge, DEBUG_CHALLENGE);
      state.menuActive = false;
      state.isSongFetching = true;
      state.isSongLoading = true;
    },

    /**
     * To work on victory page.
     *
     * ?debugstate=victory
     */
    debugvictory: state => {
      Object.assign(state.menuSelectedChallenge, DEBUG_CHALLENGE);
      Object.assign(state.challenge, DEBUG_CHALLENGE);
      state.isVictory = true;
      state.leaderboardQualified = true;
      state.menuActive = false;
      state.score.accuracy = 74.99;
      state.score.beatsHit = 125;
      state.score.beatsMissed = 125;
      state.score.maxCombo = 123;
      state.score.rank = 'C';
      state.score.score = 9001;
      computeBeatsText(state);
    },

    gamemenuresume: (state) => {
      state.isPaused = false;
    },

    gamemenurestart: (state) => {
      resetScore(state);
      state.challenge.isBeatsPreloaded = false;
      state.isGameOver = false;
      state.isPaused = false;
      state.isSongLoading = true;
      state.isVictory = false;
      state.leaderboardQualified = false;
    },

    'campaign-start': function (state, payload) {
      state.campaign.active = true;
      state.campaign.currentLevel = payload.level || 1;
      state.campaign.objective = payload.objective || { minScore: 0, maxMisses: 0, minCombo: 0, requiredModifiers: [] };
      state.menuActive = false;
    },
    'campaign-exit': function (state) {
      state.campaign.active = false;
    },
    gamemenuexit: (state) => {
      resetScore(state);
      state.challenge.isBeatsPreloaded = false;
      state.isGameOver = false;
      state.isPaused = false;
      state.isVictory = false;
      state.menuActive = true;
      state.challenge.id = '';
      state.leaderboardQualified = false;
    },

    'toggle-practice': function (state) {
      state.practiceMenuActive = !state.practiceMenuActive;
    },
    'exit-practice': function (state) {
      state.practiceMenuActive = false;
      state.practice.active = false;
    },
    'practice-set-speed': function (state, payload) {
      state.practice.playbackRate = parseFloat(payload);
    },
    'practice-set-time': function (state, payload) {
      state.practice.startTime = parseFloat(payload);
    },
    'play-practice': function (state) {
      state.practice.active = true;
      state.menuActive = false;
      state.practiceMenuActive = false;
    },
    'toggle-campaign': function (state) {
      state.campaignMenuActive = !state.campaignMenuActive;
    },
    'exit-campaign': function (state) {
      state.campaignMenuActive = false;
    },
    'play-campaign-level-1': function (state) {
      state.campaign.active = true;
      state.campaign.currentLevel = 1;
      state.campaign.objective = { minScore: 5000, maxMisses: 5 };
      state.menuActive = false;
      state.campaignMenuActive = false;
      // Normally we'd load a specific song here
    },
    'play-campaign-level-2': function (state) {
      state.campaign.active = true;
      state.campaign.currentLevel = 2;
      state.campaign.objective = { minCombo: 50, maxMisses: 0 };
      state.menuActive = false;
      state.campaignMenuActive = false;
    },
    genreclear: (state) => {
      state.genre = '';
    },

    genremenuclose: (state) => {
      state.genreMenuOpen = false;
    },

    genremenuopen: (state) => {
      state.genreMenuOpen = true;
    },

    keyboardclose: (state) => {
      state.isSearching = false;
    },

    keyboardopen: (state) => {
      state.isSearching = true;
      state.menuSelectedChallenge.id = '';
    },

    /**
     * High scores.
     */
    leaderboard: (state, payload) => {
      state.leaderboard.length = 0;
      state.leaderboardFetched = true;
      state.leaderboardNames = '';
      state.leaderboardScores = '';
      for (let i = 0; i < payload.scores.length; i++) {
        let score = payload.scores[i];
        state.leaderboard.push(score);
        state.leaderboardNames += `${score.username} (${score.accuracy || 0}%)\n`;
        state.leaderboardScores += `${score.score}\n`;
      }
      state.leaderboardLoading = false;
    },

    leaderboardqualify: state => {
      state.leaderboardQualified = true;
    },

    /**
     * Insert new score into leaderboard locally.
     */
    leaderboardscoreadded: (state, payload) => {
      state.leaderboard.splice(payload.index, 0, payload.scoreData);
      state.leaderboardNames = '';
      state.leaderboardScores = '';
      for (let i = 0; i < NUM_LEADERBOARD_DISPLAY; i++) {
        let score = state.leaderboard[i];
        state.leaderboardNames += `${score.username} (${score.accuracy || 0}%)\n`;
        state.leaderboardScores += `${score.score}\n`;
      }
    },

    leaderboardsubmit: state => {
      state.leaderboardQualified = false;
    },

    'asset-drag-enter': (state) => {
      state.isDraggingAsset = true;
      state.assetUploadStatus = 'Drop 3D Model/Texture here...';
    },

    'asset-drag-leave': (state) => {
      state.isDraggingAsset = false;
      state.assetUploadStatus = '';
    },

    'asset-load-error': (state, msg) => {
      state.isDraggingAsset = false;
      state.assetUploadStatus = msg;
    },

    'asset-load-start': (state, msg) => {
      state.isDraggingAsset = true;
      state.assetUploadStatus = msg;
    },

    'custom-saber-loaded': (state, url) => {
      state.customSaberModel = url;
      state.isDraggingAsset = false;
      state.assetUploadStatus = 'Custom Saber Loaded!';
      console.log('Custom Saber Model Set:', url);
    },

    'custom-texture-loaded': (state, url) => {
      // Stub for future texture application to blocks or stage
      state.isDraggingAsset = false;
      state.assetUploadStatus = 'Custom Texture Loaded!';
      console.log('Custom Texture Set:', url);
    },

    'editor-audio-loaded': (state, payload) => {
      state.editorAudioUrl = payload.url;
      state.editorAudioName = payload.name;
      state.isEditing = true;
      state.menuActive = false; // Force menu hide
      state.isDraggingAsset = false;
      state.assetUploadStatus = 'Audio Loaded for Editing!';
      console.log('Editor Audio Loaded:', payload.name);
    },

    custommodloaded: (state, payload) => {
      // Create a spoofed search result list so the menu can display it immediately
      console.log('Custom Mod Load Emitted:', payload);
      const fakeResults = [payload];
      state.search.hasError = false;
      state.search.page = 0;
      state.search.query = 'Local Mod';
      state.search.results = fakeResults;

      // Inject to the global store
      challengeDataStore[payload.id] = payload;

      // Select it automatically
      state.genre = '';
      state.menuSelectedChallenge.id = payload.id;
      Object.assign(state.menuSelectedChallenge, payload);
      computeMenuSelectedChallengeIndex(state);
      updateMenuSongInfo(state, payload);
    },

    /**
     * Song clicked from menu.
     */
    menuchallengeselect: (state, id) => {
      // Copy from challenge store populated from search results.
      let challenge = challengeDataStore[id];
      Object.assign(state.menuSelectedChallenge, challenge);

      // Populate difficulty options.
      state.menuDifficulties.length = 0;
      for (let i = 0; i < challenge.difficulties.length; i++) {
        state.menuDifficulties.unshift(challenge.difficulties[i]);
      }
      state.menuDifficulties.sort(difficultyComparator);

      // Default to easiest difficulty.
      state.menuSelectedChallenge.difficulty = state.menuDifficulties[0];

      state.menuSelectedChallenge.image = utils.getS3FileUrl(id, 'image.jpg');
      updateMenuSongInfo(state, challenge);

      computeMenuSelectedChallengeIndex(state);
      state.isSearching = false;

      clearLeaderboard(state);
      state.leaderboardLoading = true;
    },

    menuchallengeunselect: state => {
      state.menuSelectedChallenge.id = '';
      clearLeaderboard(state);
    },

    menudifficultyselect: (state, difficulty) => {
      state.menuSelectedChallenge.difficulty = difficulty;
      updateMenuSongInfo(state, state.menuSelectedChallenge);

      clearLeaderboard(state);
      state.leaderboardLoading = true;
    },

    minehit: state => {
      takeDamage(state);
    },

    pausegame: (state) => {
      if (!state.isPlaying) { return; }
      state.isPaused = true;
    },

    /**
     * Start challenge.
     * Transfer staged challenge to the active challenge.
     */
    playbuttonclick: (state) => {
      resetScore(state);

      // Set challenge. `beat-loader` is listening.
      Object.assign(state.challenge, state.menuSelectedChallenge);

      // Reset menu.
      state.menuActive = false;
      state.menuSelectedChallenge.id = '';

      state.isSearching = false;
      state.isSongLoading = true;
    },

    searcherror: (state, payload) => {
      state.search.hasError = true;
    },

    searchprevpage: function (state) {
      if (state.search.page === 0) { return; }
      state.search.page--;
      computeSearchPagination(state);
    },

    searchnextpage: function (state) {
      if (state.search.page > Math.floor(state.search.results.length / SEARCH_PER_PAGE)) {
        return;
      }
      state.search.page++;
      computeSearchPagination(state);
    },

    /**
     * Update search results. Will automatically render using `bind-for` (menu.html).
     */
    searchresults: (state, payload) => {
      var i;
      state.search.hasError = false;
      state.search.page = 0;
      state.search.query = payload.query;
      state.search.results = payload.results;
      for (i = 0; i < payload.results.length; i++) {
        let result = payload.results[i];
        result.songSubName = result.songSubName || 'Unknown Artist';
        result.shortSongName = truncate(result.songName, SONG_NAME_TRUNCATE).toUpperCase();
        result.shortSongSubName = truncate(result.songSubName, SONG_SUB_NAME_TRUNCATE);
        challengeDataStore[result.id] = result;
      }
      computeSearchPagination(state);

      if (payload.isGenreSearch) {
        state.genreMenuOpen = false;
        state.genre = payload.genre;
        state.menuSelectedChallenge.id = '';
      } else {
        state.genre = '';
        computeMenuSelectedChallengeIndex(state);
      }
    },

    songfetchfinish: (state) => {
      state.isSongFetching = false;
    },

    songloadcancel: state => {
      state.challenge.isBeatsPreloaded = false;
      state.challenge.isLoading = false;
      state.isSongLoading = false;
      state.isSongFetching = false;
      state.menuActive = true;
    },

    songloadfinish: (state) => {
      state.isSongFetching = false;
      state.isSongLoading = false;
    },

    songloadstart: (state) => {
      state.isSongFetching = true;
      state.isSongLoading = true;
    },

    'enter-vr': (state) => {
      state.inVR = true;
      state.is2DDesktopMode = false;
    },

    'exit-vr': (state) => {
      state.inVR = false;
    },

    'toggle-editor': function (state) {
      state.isEditing = !state.isEditing;
      console.log('Editor Mode: ' + state.isEditing);
      if (state.isEditing) {
        state.menuActive = false; // Hide menu when in editor
      } else {
        state.menuActive = true;
      }
    },

    'toggle-2d-mode': (state) => {
      state.is2DDesktopMode = !state.is2DDesktopMode;
    },

    'toggle-modifier': (state, payload) => {
      if (state.modifiers[payload] !== undefined) {
        state.modifiers[payload] = !state.modifiers[payload];
      }
    },

    'set-twitch-channel': (state, payload) => {
      state.twitchChannel = payload;
    },

    victory: function (state) {
      if (state.campaign.active) {
        // Check objectives
        const obj = state.campaign.objective;
        let failed = false;
        if (obj.minScore && state.score.score < obj.minScore) failed = true;
        if (obj.maxMisses && state.score.beatsMissed > obj.maxMisses) failed = true;
        if (obj.minCombo && state.score.maxCombo < obj.minCombo) failed = true;

        if (failed) {
          state.isGameOver = true;
          return;
        } else {
          state.campaign.progress[state.campaign.currentLevel] = true;
          state.campaign.currentLevel++;
        }
      }
      state.isVictory = true;

      // Percentage is score divided by total possible score.
      const accuracy = (state.score.score / (state.challenge.numBeats * 110)) * 100;
      state.score.accuracy = isNaN(accuracy) ? 0 : accuracy;
      state.score.score = isNaN(state.score.score) ? 0 : state.score.score;

      if (accuracy >= 95) {
        state.score.rank = 'S';
      } else if (accuracy >= 93) {
        state.score.rank = 'A';
      } else if (accuracy >= 90) {
        state.score.rank = 'A-';
      } else if (accuracy >= 88) {
        state.score.rank = 'B+';
      } else if (accuracy >= 83) {
        state.score.rank = 'B';
      } else if (accuracy >= 80) {
        state.score.rank = 'B-';
      } else if (accuracy >= 78) {
        state.score.rank = 'C+';
      } else if (accuracy >= 73) {
        state.score.rank = 'C';
      } else if (accuracy >= 70) {
        state.score.rank = 'C-';
      } else if (accuracy >= 60) {
        state.score.rank = 'D';
      } else {
        state.score.rank = 'F';
      }

      computeBeatsText(state);
    },

    victoryfake: function (state) {
      state.score.accuracy = '74.99';
      state.score.rank = 'C';
    },

    wallhitstart: function (state) {
      takeDamage(state);
    },

    /**
     * Twitch Integration Events
     */
    'twitch-spawn-obstacle': function (state) {
      if (!state.isPlaying) return;
      // Emit event for beat-loader or obstacle manager to handle
      this.el.emit('spawn-random-obstacle');
    },

    'twitch-speed-up': function (state) {
      if (!state.isPlaying) return;
      state.score.multiplier = Math.min(state.score.multiplier * 2, 8);
      // Actual audio/beat speedup would require modifying howler.js audio rate
      // For this phase, we add a visual indicator or multiplier bump
      console.log('Twitch Speed Up Applied!');
    },

    'twitch-slow-down': function (state) {
      if (!state.isPlaying) return;
      state.score.multiplier = Math.max(state.score.multiplier / 2, 1);
      console.log('Twitch Slow Down Applied!');
    },

    'twitch-hype-train': function (state) {
      if (!state.isPlaying) return;
      state.score.multiplier = 8;
      state.score.score += 1000;
      updateScoreAccuracy(state);
    },

    'twitch-toggle-ghost': function (state) {
      state.modifiers.ghostNotes = !state.modifiers.ghostNotes;
      console.log('Twitch Chat toggled Ghost Notes!');
    },

    'twitch-start-voting': function (state) {
      console.log('Twitch Chat: Voting started!');
      state.twitchVotingActive = true;
      state.twitchVotes = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
      state.twitchVoters = [];
    },
    'twitch-stop-voting': function (state) {
      console.log('Twitch Chat: Voting stopped!');
      state.twitchVotingActive = false;
    },
    'twitch-vote': function (state, payload) {
      const user = payload.user;
      const option = payload.option;
      if (!state.twitchVotingActive) return;
      if (state.twitchVoters.indexOf(user) !== -1) return;
      if (state.twitchVotes[option] !== undefined) {
        state.twitchVotes[option]++;
        state.twitchVoters.push(user);
        console.log('Twitch Chat: ' + user + ' voted for option ' + option);
      }
    },
    'multiplayer-toggle': function (state) {
      state.multiplayerEnabled = !state.multiplayerEnabled;
      console.log('Multiplayer Toggled: ' + state.multiplayerEnabled);
    },
    'modifiertoggleghost': function (state) {
      state.modifiers.ghostNotes = !state.modifiers.ghostNotes;
    },
    'modifiertoggledisappearing': function (state) {
      state.modifiers.disappearingArrows = !state.modifiers.disappearingArrows;
    },
    'modifiertogglefastsong': function (state) {
      state.modifiers.fastSong = !state.modifiers.fastSong;
    },
    'modifiertogglenofail': function (state) {
      state.modifiers.noFail = !state.modifiers.noFail;
    },
    'modifiertoggleonesaber': function (state) {
      state.modifiers.oneSaber = !state.modifiers.oneSaber;
    },
    'modifiertoggle360': function (state) {
      state.modifiers.mode360 = !state.modifiers.mode360;
    },
    'modifiertoggleinstafail': function (state) {
      state.modifiers.instaFail = !state.modifiers.instaFail;
    },
    'modifiertogglebatteryenergy': function (state) {
      state.modifiers.batteryEnergy = !state.modifiers.batteryEnergy;
    },
    'modifiertogglestrictangles': function (state) {
      state.modifiers.strictAngles = !state.modifiers.strictAngles;
    },
    'modifiertogglepromode': function (state) {
      state.modifiers.proMode = !state.modifiers.proMode;
    },
    'modifiertogglesmallnotes': function (state) {
      state.modifiers.smallNotes = !state.modifiers.smallNotes;
    },
    'multiplayer-set-room': function (state, payload) {
      state.multiplayerRoom = payload;
      console.log('Multiplayer Room set to: ' + payload);
    },
    'twitch-toggle-nofail': function (state) {
      state.modifiers.noFail = !state.modifiers.noFail;
      console.log('Twitch Chat toggled No Fail!');
    }
  },

  /**
   * Post-process the state after each action.
   */
  computeState: (state) => {
    state.isPlaying =
      !state.menuActive && !state.isPaused && !state.isVictory && !state.isGameOver &&
      !state.challenge.isLoading && !state.isSongLoading && !!state.challenge.id;

    const anyMenuOpen = state.menuActive || state.isPaused || state.isVictory ||
                        state.isGameOver || state.isSongLoading || state.isSongFetching;
    state.leftRaycasterActive = anyMenuOpen && state.activeHand === 'left' && state.inVR;
    state.rightRaycasterActive = anyMenuOpen && state.activeHand === 'right' && state.inVR;

    // Song is decoding if it is loading, but not fetching.
    if (state.isSongLoading) {
      state.loadingText = state.isSongFetching ? 'Downloading song...' : 'Processing song...';
    } else {
      state.loadingText = '';
    }
  }
});

function computeSearchPagination (state) {
  let numPages = Math.ceil(state.search.results.length / SEARCH_PER_PAGE);
  state.search.hasPrev = state.search.page > 0;
  state.search.hasNext = state.search.page < numPages - 1;

  state.search.songNameTexts = '';
  state.search.songSubNameTexts = '';

  state.searchResultsPage.length = 0;
  state.searchResultsPage.__dirty = true;
  for (let i = state.search.page * SEARCH_PER_PAGE;
       i < state.search.page * SEARCH_PER_PAGE + SEARCH_PER_PAGE; i++) {
    if (!state.search.results[i]) { break; }
    state.searchResultsPage.push(state.search.results[i]);

    state.search.songNameTexts +=
      truncate(state.search.results[i].songName, SONG_NAME_TRUNCATE).toUpperCase() + '\n';
    state.search.songSubNameTexts +=
      truncate(state.search.results[i].songSubName, SONG_SUB_NAME_TRUNCATE) + '\n';
  }

  for (let i = 0; i < state.searchResultsPage.length; i++) {
    state.searchResultsPage[i].index = i;
  }

  computeMenuSelectedChallengeIndex(state);
}

function truncate (str, length) {
  if (!str) { return ''; }
  if (str.length >= length) {
    return str.substring(0, length - 3) + '...';
  }
  return str;
}

const DIFFICULTIES = ['Easy', 'Normal', 'Hard', 'Expert', 'ExpertPlus'];
function difficultyComparator (a, b) {
  const aIndex = DIFFICULTIES.indexOf(a);
  const bIndex = DIFFICULTIES.indexOf(b);
  if (aIndex < bIndex) { return -1; }
  if (aIndex > bIndex) { return 1; }
  return 0;
}

function takeDamage (state) {
  if (!state.isPlaying) { return; }
  state.score.combo = 0;
  state.score.multiplier = state.score.multiplier > 1
    ? Math.ceil(state.score.multiplier / 2)
    : 1;
  if (AFRAME.utils.getUrlParameter('godmode') || state.modifiers.noFail) { return; }

  if (state.modifiers.instaFail) {
    state.damage = 100;
  } else if (state.modifiers.batteryEnergy) {
    state.damage += 25; // 4 lives
  } else {
    state.damage++;
  }

  if (state.damage >= 100) {
    state.isGameOver = true;
  }
}

function resetScore (state) {
  state.damage = 0;
  state.score.beatsHit = 0;
  state.score.beatsMissed = 0;
  state.score.combo = 0;
  state.score.maxCombo = 0;
  state.score.score = 0;
  state.score.multiplier = 1;
}

function computeMenuSelectedChallengeIndex (state) {
  state.menuSelectedChallenge.index = -1;
  for (let i = 0; i < state.searchResultsPage.length; i++) {
    if (state.searchResultsPage[i].id === state.menuSelectedChallenge.id) {
      state.menuSelectedChallenge.index = i;
      break;
    }
  }
}

function formatSongLength (songLength) {
  songLength /= 60;
  const minutes = `${Math.floor(songLength)}`;
  return `${minutes}:${Math.round(((songLength) - minutes) * 60)}`;
}

function computeBeatsText (state) {
  state.score.beatsText =
    `${state.score.beatsHit} / ${state.score.beatsMissed + state.score.beatsHit} BEATS`;
}

function clearLeaderboard (state) {
  state.leaderboard.length = 0;
  state.leaderboard.__dirty = true;
  state.leaderboardNames = '';
  state.leaderboardScores = '';
  state.leaderboardFetched = false;
}

function updateMenuSongInfo (state, challenge) {
  state.menuSelectedChallenge.songInfoText = `By ${truncate(challenge.author, 12)} ${challenge.genre && challenge.genre !== 'Uncategorized' ? '/ ' + challenge.genre : ''}\n${challenge.downloads} Downloads\nUpvotes: ${challenge.upvotes} / Downvotes: ${challenge.downvotes}\n${formatSongLength(challenge.songDuration)} / ${challenge.numBeats[state.menuSelectedChallenge.difficulty]} beats`;
}

function updateScoreAccuracy (state) {
  // Update live accuracy.
  const currentNumBeats = state.score.beatsHit + state.score.beatsMissed;
  state.score.accuracy = (state.score.score / (currentNumBeats * 110)) * 100;
}
