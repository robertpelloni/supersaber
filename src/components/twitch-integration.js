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

    this.client.connect().catch(console.error);

    this.client.on('message', (channel, tags, message, self) => {
      if (self) return;

      const command = message.trim().toLowerCase();

      // Basic Twitch chat commands mapping
      switch (command) {
        case '!spawn':
          // Spawn a random bomb or block (example integration)
          console.log('Twitch Chat: Spawned an obstacle!');
          this.el.emit('twitch-spawn-obstacle');
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
        default:
          if (command.startsWith('!vote ')) {
            const option = parseInt(command.split(' ')[1], 10);
            if (!isNaN(option) && option >= 1 && option <= 6) {
              this.el.emit('twitch-vote', { user: tags.username, option: option });
            }
          }
          break;
        case '!startvote':
          this.el.emit('twitch-start-voting');
          break;
        case '!stopvote':
          this.el.emit('twitch-stop-voting');
          break;
        case '!nofail':
          this.el.emit('twitch-toggle-nofail');
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
