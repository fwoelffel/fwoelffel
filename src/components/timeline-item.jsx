import React from 'react';
import ExternalLink from './external-link';

const TimelineItem = ({
  start,
  end,
  what,
  where,
  location,
  link,
  children: description,
}) => (
  <div className='timeline-item'>
    <div className='timeline-marker' />
    <div className='timeline-content'>
      <p className='heading'>
        {start} - {end}
      </p>
      <span className='title is-6'>{what}</span>
      <br />
      <span className='title is-7'>
        {!!link ? <ExternalLink to={link}>{where}</ExternalLink> : where}
      </span>
      <span style={{ 'font-size': '0.8em' }}>
        {!!location ? ' - ' + location : null}
      </span>
      <div>{description}</div>
    </div>
  </div>
);

export default TimelineItem;