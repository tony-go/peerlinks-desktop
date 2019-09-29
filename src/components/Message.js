import React from 'react';

import './Message.css';
import File from '../components/ui/File';

export default React.memo(function Message(props) {
  const { channelName, message, isExpanded, setExpandAuthorFor } = props;
  if (message.isRoot) {
    return null;
  }

  const enriched = message.enriched;

  const displayPath = enriched.displayPath.map((component, i) => {
    const style = { color: component.color };
    return <span
      key={i}
      className='message-author-name'
      style={style}
      title={component.publicKey}>
      {component.name}
    </span>;
  });

  let author;
  let authorClass = 'message-author';
  if (displayPath.length === 0) {
    authorClass += ' message-author-root';
    author = `#${channelName}`;
  } else if (isExpanded) {
    author = [];
    for (const component of displayPath) {
      author.push(component);
      author.push(<span>&gt;</span>);
    }
    author.pop();
  } else {
    author = displayPath[displayPath.length - 1];
  }

  const onExpand = (e) => {
    e.preventDefault();

    // Toggle
    if (isExpanded) {
      setExpandAuthorFor(null);
    } else {
      setExpandAuthorFor(message.hash);
    }
  };

  return <div className='message'>
    <div className='message-time-container'>
      <div className='message-time' title={enriched.time.full}>
        {enriched.time.short}
      </div>
    </div>
    <div className='message-content-container'>
      <div className='message-content'>
        <span className={authorClass} onClick={onExpand}>{author}</span>:&nbsp;
        <span className='message-text'>{enriched.file ? <File {...enriched.file} /> : enriched.text}</span>
      </div>
    </div>
  </div>;
});
