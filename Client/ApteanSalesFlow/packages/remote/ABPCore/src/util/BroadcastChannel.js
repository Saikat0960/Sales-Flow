Ext.define('ABP.util.BroadcastChannel', {
    singleton: true,

    broadcastAvailable: true, // assume it'll work until it fails
    broadcastChannels: [],
    
    create: function(channelName, callback, scope) {
        try {
            var channel = new BroadcastChannel(channelName);
            channel.onmessage = callback.bind(scope);
            this.broadcastChannels.push(channel);
        }
        catch (err) {
            this._broadcastAvailable = false;
            console.error("Unable to create broadcast channel");
        }
    },

    remove: function(channelName) {
        var channel = Ext.Array.findBy(this.broadcastChannels, function(item) {return channelName === item.name});
        if (channel) {
            channel.close();
            Ext.Array.remove(channel);
        }
    },

    send: function(channelName, message) {
        var channel = Ext.Array.findBy(this.broadcastChannels, function(item) {return channelName === item.name});
        if (channel) {
            channel.postMessage(message);
        }
    }
});