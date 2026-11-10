const tmi = require('tmi.js');

AFRAME.registerComponent('twitch-integration', {
  schema: {
    channel: {type: 'string', default: 'robertpelloni'}, // Default channel, could be made configurable in UI
    enabled: {type: 'boolean', default: true}
  },

  init: function () {
    if (!this.data.enabled) return;

    this.client = new tmi.Client({
      connection: {
        secure: true,
        reconnect: true
      },
      channels: [this.data.channel]
    });

    this.client.connect().then(() => {
      console.log('[Twitch] Connected successfully to #' + this.data.channel);
      this.el.emit('twitch-connected', { channel: this.data.channel });
    }).catch((err) => {
      console.error('[Twitch] Connection error:', err);
      this.el.emit('twitch-connection-error', { error: err });
    });

    this.client.on('message', (channel, tags, message, self) => {
      if (self) return;

      // Emit incoming chat message for UI loggers and viewer feeds
      this.el.emit('twitch-chat-message', {
        user: tags['display-name'] || tags.username,
        color: tags.color || '#88c0d0',
        message: message,
        badges: tags.badges || {},
        timestamp: Date.now()
      });

      const command = message.trim().toLowerCase();

      const isMod = tags.mod || (tags.badges && tags.badges.broadcaster === '1') || tags.username === channel.replace('#', '');

      // Basic Twitch chat commands mapping
      switch (command) {
        case '!spawn':
        case '!bomb':
          console.log('Twitch Chat: Spawned an obstacle!');
          this.el.emit('twitch-spawn-obstacle');
          break;
        case '!heal':
          console.log('Twitch Chat: Healed player!');
          this.el.emit('twitch-heal');
          break;
        case '!dance':
          console.log('Twitch Chat: Laser dance lightshow!');
          this.el.emit('twitch-dance');
          break;
        case '!clearmines':
          console.log('Twitch Chat: Clear mines!');
          this.el.emit('twitch-clear-mines');
          break;
        case '!speedup':
          console.log('Twitch Chat: Speed increased!');
          this.el.emit('twitch-speed-up');
          break;
        case '!slowdown':
          console.log('Twitch Chat: Speed decreased!');
          this.el.emit('twitch-slow-down');
          break;
        case '!hype':
          console.log('Twitch Chat: HYPE!');
          this.el.emit('twitch-hype-train');
          break;
        case '!ghostnotes':
          this.el.emit('twitch-toggle-ghost');
          break;
        case '!nofail':
          this.el.emit('twitch-toggle-nofail');
          break;
        case '!startvote':
          if (isMod) {
            console.log('[Twitch] Moderator ' + tags.username + ' started voting');
            this.el.emit('twitch-start-voting');
          } else {
            console.log('[Twitch] Unauthorized startvote attempt by ' + tags.username);
          }
          break;
        case '!stopvote':
          if (isMod) {
            console.log('[Twitch] Moderator ' + tags.username + ' stopped voting');
            this.el.emit('twitch-stop-voting');
          } else {
            console.log('[Twitch] Unauthorized stopvote attempt by ' + tags.username);
          }
          break;
        default:
          if (command.startsWith('!vote ')) {
            const option = parseInt(command.split(' ')[1], 10);
            if (!isNaN(option) && option >= 1 && option <= 6) {
              this.el.emit('twitch-vote', { user: tags.username, option: option });
            }
          }
          break;
      }
    });
  },

  update: function (oldData) {
    if (this.data.channel !== oldData.channel && this.client) {
      this.client.disconnect().then(() => {
        if (this.data.enabled && this.data.channel) {
          this.init();
        }
      });
    }
  },

  remove: function () {
    if (this.client) {
      this.client.disconnect();
    }
  }
});
