import React from 'react';

import moment from 'moment';
import remark from 'remark';
import remarkReact from 'remark-react';
import remarkEmoji from 'remark-emoji';

import binarySearch from 'binary-search';
import { prerenderUserName } from '../utils';

export function compareMessages(a, b) {
  if (a.height < b.height) {
    return -1;
  } else if (a.height > b.height) {
    return 1;
  }

  if (a.hash > b.hash) {
    return 1;
  } else if (a.hash < b.hash) {
    return -1;
  } else {
    return 0;
  }
}

export function appendMessage(messages, message) {
  let index = binarySearch(messages, message, compareMessages);
  if (index >= 0) {
    // Duplicate
    return;
  }

  index = -1 - index;
  messages.splice(index, 0, enrichMessage(message));
}

export function ExternalLink(props) {
  return <a target='blank' href={props.href}>{props.children}</a>;
}

export function enrichMessage(message) {
  if (message.isRoot) {
    return Object.assign({}, message, { enriched: null });
  }

  const publicKeys = message.author.publicKeys;
  const displayPath = message.author.displayPath.map((component, i) => {
    const { name, color } = prerenderUserName({
      name: component,
      publicKey: publicKeys[i],
      isInternal: message.author.isInternal,
    });

    const publicKey = publicKeys[i];
    return {
      publicKey,
      name,
      color,
    };
  });

  const time = moment(message.timestamp * 1000);

  const text = remark()
    .use(remarkReact, {
      remarkReactComponents: {
        a: ExternalLink,
      }
    })
    .use(remarkEmoji)
    .processSync(message.json.text || '').contents;

  // TODO(indutny): highlight mentions
  return {
    ...message,
    enriched: {
      displayPath,
      time: {
        short: time.format('HH:mm:ss'),
        full: time.format('lll'),
      },
      text,
    },
  };
}

export function computeIdentityFilter(list) {
  const sanitized = list.map((name) => {
    // NOTE: We are very conservative
    return name.toLowerCase().replace(/([^a-z0-9])/g, '\\$1');
  });

  return new RegExp(`(\\s|^)(${sanitized.join('|')})([\\s:!.,;]|$)`);
}
