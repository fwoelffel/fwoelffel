import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import * as styles from './achievements.module.scss';
import { graphql, useStaticQuery } from 'gatsby';

const query = graphql`
  query {
    allAchievementsYaml {
      nodes {
        title
        date
        description
      }
    }
  }
`;

const Achievement = ({ title, description, date }) => (
  <>
    <h3 className='title is-6'>{title}</h3>
    {!!date ? <h4 className='subtitle is-7'>{date}</h4> : null}
    {!!description ? <p>{description}</p> : null}
  </>
);

const Achievements = () => {
  const { allAchievementsYaml } = useStaticQuery(query);
  return (
    <section className='section'>
      <h2 className='title is-2'>
        <FaTrophy /> Achievements
      </h2>
      <div className='is-divider' />
      <ul>
        {allAchievementsYaml.nodes.map((achievement, index) => (
          <li>
            <Achievement
              title={achievement.title}
              description={achievement.description}
              date={achievement.date}
            />
            {index < allAchievementsYaml.nodes.length - 1 ? (
              <hr className={styles.separator} />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Achievements;
