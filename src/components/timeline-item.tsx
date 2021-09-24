import React from 'react';
import ExternalLink from './external-link';
import  * as styles from './timeline-item.module.scss';

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
      <span className='is-size-7'>{!!location ? ' - ' + location : null}</span>
      {!!description ? (
        <div className={'has-text-justified ' + styles.description}>
          {description}
        </div>
      ) : null}
    </div>
  </div>
);

export default TimelineItem;
