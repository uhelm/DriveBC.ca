// React
import React from 'react';
import {useNavigate} from 'react-router-dom';

// Components and functions
import { stripRichText } from '../data/helper';
import FriendlyTime from '../FriendlyTime';

// Styling
import './BulletinsList.scss';

// Static files
import logo from '../../images/dbc-logo--white.svg';

export default function Bulletins(props) {
  // State, props and context
  const { bulletins } = props;

  // Navigation
  const navigate = useNavigate();

  function handleClick(bulletin) {
     navigate(`/bulletins/${bulletin.id}`);
  }

  // Rendering
  return (
    <ul className="bulletins-list">
      {!!bulletins && bulletins.map((bulletin, index) => {
        return (
          <li className="bulletin-li unread" key={bulletin.id} onClick={() => handleClick(bulletin)}>
            
            <div className='bulletin-li-title-container'>
              <h3 className='bulletin-li-title'>{bulletin.title}</h3>

              {bulletin.teaser &&
                <div className='bulletin-li-body'>{bulletin.teaser}</div>
              }

              {!bulletin.teaser &&
                <div className='bulletin-li-body'>{stripRichText(bulletin.body)}</div>
              }

              <div className="timestamp-container">
                <span className="bulletin-li-state">{bulletin.first_published_at != bulletin.last_published_at ? "Updated" : "Published" }</span>
                <FriendlyTime date={bulletin.latest_revision_created_at} />
              </div>
            </div>
            <div className='bulletin-li-thumbnail-container'>
              <div className='bulletin-li-thumbnail'>
                <img className="thumbnail-logo" src={logo} alt="Government of British Columbia" />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
