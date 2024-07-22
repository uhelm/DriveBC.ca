// React
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { memoize } from 'proxy-memoize';
import { pushFavCam, removeFavCam } from '../../../slices/userSlice';

// Navigation
import { useNavigate, useSearchParams } from 'react-router-dom';

// External imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideoSlash, faVideo, faStar } from '@fortawesome/pro-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/pro-regular-svg-icons';
import Button from 'react-bootstrap/Button';
import parse from 'html-react-parser';

// Internal imports
import { addFavoriteCamera, deleteFavoriteCamera } from "../../data/webcams";
import { getCameraOrientation } from '../../cameras/helper';
import FriendlyTime from '../../shared/FriendlyTime';
import trackEvent from '../../shared/TrackEvent';
import ShareURLButton from '../../shared/ShareURLButton';

// Static assets
import colocatedCamIcon from '../../../images/colocated-camera.svg';

// Styling
import './CamPanel.scss';

// Main component
export default function CamPanel(props) {
  /* Setup */
  const { camFeature, isCamDetail } = props;

  const [_searchParams, setSearchParams] = useSearchParams();

  // Redux
  const dispatch = useDispatch();
  const { favCams } = useSelector(useCallback(memoize(state => ({
    favCams: state.user.favCams
  }))));

  // Misc
  const navigate = useNavigate();

  // Refs
  const isInitialMount = useRef(true);

  // useState hooks
  const newCam = camFeature.id ? camFeature : camFeature.getProperties();
  const [rootCam, setRootCam] = useState(newCam);
  const [camera, setCamera] = useState(newCam);
  const [camIndex, setCamIndex] = useState(0);

  // useEffect hooks
  useEffect(() => {
    const newCam = camFeature.id ? camFeature : camFeature.getProperties();
    setRootCam(newCam);
    setCamera(newCam);
    setCamIndex(0);

    setSearchParams(new URLSearchParams({ type: 'camera', id: newCam.id }));
  }, [camFeature]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCamera(rootCam.camGroup[camIndex]);
  }, [camIndex]);

  // Handlers
  const handlePopupClick = e => {
    if (!isCamDetail) {
      navigate(`/cameras/${camera.id}`);
    }
  };

  const favoriteHandler = () => {
    if (favCams.includes(camera.id)) {
      deleteFavoriteCamera(camera.id, dispatch, removeFavCam);

    } else {
      addFavoriteCamera(camera.id, dispatch, pushFavCam);
    }
  }

  // Rendering
  function renderCamGroup(currentCamData) {
    const clickHandler = i => {
      setCamIndex(i); // Trigger re-render
    };

    const res = Object.entries(rootCam.camGroup).map(([index, cam]) => {
      return (
        <Button
          aria-label={getCameraOrientation(cam.orientation)}
          className={
            'camera-direction-btn' +
            (camera.orientation == cam.orientation ? ' current' : '')
          }
          key={cam.id}
          onClick={event => {
            trackEvent('click', 'map', 'camera', cam.name);
            event.stopPropagation();
            clickHandler(index);
          }}>
          {cam.orientation}
        </Button>
      );
    });

    return res;
  }

  return (
    <div className="popup popup--camera">
      <div className="popup__title">
        <div className="popup__title__icon">
          <FontAwesomeIcon icon={faVideo} />
        </div>
        <div className="popup__title__name">
          <p className="name">Camera</p>
          <ShareURLButton />
        </div>
      </div>
      {camera && (
        <div className="popup__content">
          <div className="popup__content__title">
            <p
              className="name"
              onClick={handlePopupClick}
              onKeyDown={keyEvent => {
                if (keyEvent.keyCode == 13) {
                  handlePopupClick();
                }
              }}
              tabIndex={0}>
              {camera.name}
            </p>
          </div>
          {camera.is_on ? (
            <div className="popup__content__image">
              <div className="clip">
                <img src={camera.links.imageDisplay} width="300" />
              </div>
              <div className="timestamp">
                <p className="driveBC">
                  Drive<span>BC</span>
                </p>
                <FriendlyTime
                  date={camera.last_update_modified}
                  asDate={true}
                />
              </div>
            </div>
          ) : (
            <div className="popup__content__image">
              <div className="camera-unavailable">
                <div className="card-pill">
                  <p>Unavailable</p>
                </div>
                <div className="card-img-box unavailable">
                  <FontAwesomeIcon icon={faVideoSlash} />
                </div>
                <p>
                  This camera image is temporarily unavailable. Please check
                  again later.
                </p>
              </div>
              <div className="timestamp">
                <p className="driveBC">
                  Drive<span>BC</span>
                </p>
                <FriendlyTime
                  date={camera.last_update_modified}
                  asDate={true}
                />
              </div>
            </div>
          )}
          <div className="camera-orientations">
            <img
              className="colocated-camera-icon"
              src={colocatedCamIcon}
              role="presentation"
              alt="colocated cameras icon"
            />
            {renderCamGroup()}
          </div>
          <div className="popup__content__description">
            <p>{parse(camera.caption)}</p>
          </div>
          <div className="popup__content__tools">
            {favCams != null &&
              <button
                className={`favourite-btn ${(favCams && favCams.includes(camera.id)) ? 'favourited' : ''}`}
                aria-label={`${(favCams && favCams.includes(camera.id)) ? 'Remove favourite' : 'Add favourite'}`}
                onClick={favoriteHandler}
                >

                {(favCams && favCams.includes(camera.id)) ? 
                (<React.Fragment><FontAwesomeIcon icon={faStar} /><span>Remove</span></React.Fragment>) :
                (<React.Fragment><FontAwesomeIcon icon={faStarOutline} /><span>Save</span></React.Fragment>) }
              </button>
            }
          </div>
        </div>
      )}
    </div>
  );
}
