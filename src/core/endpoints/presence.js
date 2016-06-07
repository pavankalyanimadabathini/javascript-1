/* @flow */

import Networking from '../components/networking';
import Config from '../components/config';
import Logger from '../components/logger';
import Responders from '../presenters/responders';
import BaseEndoint from './base.js';
import { endpointDefinition, statusStruct } from '../flow_interfaces';

type presenceConstruct = {
  networking: Networking,
  config: Config
};

/*
type hereNowArguments = {
  channels: Array<string>,
  channelGroups: Array<string>,
  uuids: ?boolean,
  state: ?boolean
}
*/

type whereNowArguments = {
  uuid: string,
}

type whereNowResponse = {
  channels: Array<string>,
}

type getStateArguments = {
  uuid: string,
  channels: Array<string>,
  channelGroups: Array<string>
}

/*
type setStateArguments = {
  channels: Array<string>,
  channelGroups: Array<string>,
  state: Object | string | number | boolean
}
*/

export default class extends BaseEndoint {
  networking: Networking;
  config: Config;
  _r: Responders;
  _l: Logger;

  constructor({ networking, config }: presenceConstruct) {
    super({ networking });
    this.networking = networking;
    this.config = config;
    this._r = new Responders('#endpoints/presence');
    this._l = Logger.getLogger('#endpoints/presence');
  }

  whereNow(args: whereNowArguments, callback: Function) {
    let { uuid = this.config.UUID } = args;
    const endpointConfig: endpointDefinition = {
      params: {
        uuid: { required: false }
      },
      url: '/v2/presence/sub-key/' + this.config.subscribeKey + '/uuid/' + uuid
    };

    if (!callback) {
      return this._l.error('Missing Callback');
    }

    // validate this request and return false if stuff is missing
    if (!this.validateEndpointConfig(endpointConfig)) { return; }

    // create base params
    const params = this.createBaseParams(endpointConfig);

    this.networking.GET(params, endpointConfig, (status: statusStruct, payload: Object) => {
      if (status.error) return callback(status);

      let response: whereNowResponse = {
        channels: payload.payload.channels
      };

      callback(status, response);
    });
  }

  /*
  hereNow(args: hereNowArguments, callback: Function) {
    let { channels = [], channelGroups = [], uuids = true, state } = args;
    let data = {};

    if (!uuids) data.disable_uuids = 1;
    if (state) data.state = 1;

    // Make sure we have a Channel
    if (!callback) {
      return this._l.error('Missing Callback');
    }

    if (channelGroups.length > 0) {
      data['channel-group'] = channelGroups.join(',');
    }

    let stringifiedChannels = channels.length > 0 ? channels.join(',') : null;
    let stringifiedChannelGroups = channelGroups.length > 0 ? channelGroups.join(',') : null;
    this._networking.fetchHereNow(stringifiedChannels, stringifiedChannelGroups, data, callback);
  }

  getState(args: getStateArguments, callback: Function) {
    let { uuid, channels = [], channelGroups = [] } = args;
    let data: Object = {};

    if (!callback) {
      return this._l.error('Missing Callback');
    }

    if (channels.length === 0 && channelGroups.length === 0) {
      return callback(this._r.validationError('Channel or Channel Group must be supplied'));
    }

    if (channelGroups.length > 0) {
      data['channel-group'] = channelGroups.join(',');
    }

    let stringifiedChannels = channels.length > 0 ? channels.join(',') : ',';
    this._networking.fetchState(uuid, stringifiedChannels, data, callback);
  }
  */

  /*
  setState(args: setStateArguments, callback: Function) {
    let { state, channels = [], channelGroups = [] } = args;
    let data: Object = {};
    let channelsWithPresence: Array<string> = [];
    let channelGroupsWithPresence: Array<string> = [];

    if (!callback) {
      return this._l.error('Missing Callback');
    }

    if (channels.length === 0 && channelGroups.length === 0) {
      return callback(this._r.validationError('Channel or Channel Group must be supplied'));
    }

    if (!state) {
      return callback(this._r.validationError('State must be supplied'));
    }

    data.state = state;

    channels.forEach((channel) => {
      if (this._state.getChannel(channel)) {
        this._state.addToPresenceState(channel, state);
        channelsWithPresence.push(channel);
      }
    });

    channelGroups.forEach((channel) => {
      if (this._state.getChannelGroup(channel)) {
        this._state.addToPresenceState(channel, state);
        channelGroupsWithPresence.push(channel);
      }
    });

    if (channelsWithPresence.length === 0 && channelGroupsWithPresence.length === 0) {
      return callback(this._r.validationError('No subscriptions exists for the states'));
    }

    if (channelGroupsWithPresence.length > 0) {
      data['channel-group'] = channelGroupsWithPresence.join(',');
    }

    let stringifiedChannels = channelsWithPresence.length > 0 ? channelsWithPresence.join(',') : ',';

    this._networking.setState(stringifiedChannels, data, (err: Object, response: Object) => {
      if (err) return callback(err, response);
      this._state.announceStateChange();
      return callback(err, response);
    });
  }
  */

  /*
  heartbeat(callback: Function) {
    let data: Object = {
      state: JSON.stringify(this._state.getPresenceState()),
      heartbeat: this._state.getPresenceTimeout()
    };

    let channels = this._state.getSubscribedChannels();
    let channelGroups = this._state.getSubscribedChannelGroups();

    if (channelGroups.length > 0) {
      data['channel-group'] = channelGroups.join(',');
    }

    let stringifiedChannels = channels.length > 0 ? channels.join(',') : ',';

    this._networking.performHeartbeat(stringifiedChannels, data, callback);
  }
  */

}
