import React from 'react';

import ChannelList from '../components/ChannelList';
import Notifications from '../components/Notifications';

import './Channel.css';

export default function ChannelLayout({ children }) {
  return <div className='channel-layout'>
    <Notifications/>

    <aside className='channel-layout-sidebar'>
      <h6 className='title'>channels:</h6>
      <ChannelList/>
    </aside>

    <div className='channel-layout-main'>
      {children}
    </div>
  </div>;
}