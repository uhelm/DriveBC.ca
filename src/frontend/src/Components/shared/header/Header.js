// React
import React, { useCallback, useContext, useEffect, useState } from "react";

// Navigation
import { useNavigate } from 'react-router-dom';

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { memoize } from 'proxy-memoize'
import { updateAdvisories, updateBulletins } from '../../../slices/cmsSlice';

// External imports
import { faSparkles } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import { useMediaQuery } from '@uidotdev/usehooks';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// Internal imports
import { CMSContext } from '../../../App';
import { getAdvisories } from '../../data/advisories.js';
import { getBulletins } from '../../data/bulletins.js';
import UserNavigation from "./UserNavigation";

// Static files
import logo from '../../..//images/dbc-logo-beta.svg';

// Styling
import './Header.scss';

export default function Header() {
  /* Setup */
  // Redux
  const dispatch = useDispatch();
  const { advisories, bulletins } = useSelector(useCallback(memoize(state => ({
    advisories: state.cms.advisories.list,
    bulletins: state.cms.bulletins.list,
  }))));

  // Navigation
  const navigate = useNavigate();

  // Context
  const { cmsContext } = useContext(CMSContext);

  // States
  const [advisoriesCount, setAdvisoriesCount] = useState();
  const [bulletinsCount, setBulletinsCount] = useState();
  const [expanded, setExpanded] = useState(false);

  // Effects
  const loadAdvisories = async () => {
    let advisoriesData = advisories;

    if (!advisoriesData) {
      advisoriesData = await getAdvisories();

      dispatch(updateAdvisories({
        list: advisoriesData,
        timeStamp: new Date().getTime()
      }));
    }

    setAdvisoriesCount(getUnreadAdvisoriesCount(advisoriesData));
  }

  const loadBulletins = async () => {
    let bulletinsData = bulletins;

    if (!bulletinsData) {
      bulletinsData = await getBulletins();

      dispatch(updateBulletins({
        list: bulletinsData,
        timeStamp: new Date().getTime()
      }));
    }

    setBulletinsCount(getUnreadBulletinsCount(bulletinsData));
  }

  useEffect(() => {
    loadAdvisories();
    loadBulletins();
  }, [cmsContext]);

  /* Helpers */
  const getUnreadAdvisoriesCount = (advisoriesData) => {
    const readAdvisories = advisoriesData.filter(advisory => cmsContext.readAdvisories.includes(
      advisory.id.toString() + '-' + advisory.live_revision.toString()
    ));
    return advisoriesData.length - readAdvisories.length;
  }

  const getUnreadBulletinsCount = (bulletinsData) => {
    const readBulletins = bulletinsData.filter(bulletin => cmsContext.readBulletins.includes(
      bulletin.id.toString() + '-' + bulletin.live_revision.toString()
    ));
    return bulletinsData.length - readBulletins.length;
  }

  /* Handlers */
  const onClickActions = () => {
    setTimeout(() => setExpanded(false));
    sessionStorage.setItem('scrollPosition', 0);
  }

  /* Rendering */
  const xLargeScreen = useMediaQuery('only screen and (min-width : 992px)');

  // Sub components
  const getNavLink = (title, count) => {
    return (
      <Nav.Link active={false} onClick={onClickActions}>
        {title} {!!count && <div className="unread-count">{count}</div>}
      </Nav.Link>
    );
  };

//  const surveyLink = `${window.SURVEY_LINK}` ||
//    'https://forms.office.com/Pages/ResponsePage.aspx?id=AFLbbw09ikqwNtNoXjWa3G-k6A-ZOZVMlxBJti4jf_VURjI4MlRKMlRYQTVFUFJZOU5XTVVZUjEwQS4u';

  const whatsNewHandler = () => {
    const latestImprovementBulletin = bulletins.find(bulletin => bulletin.slug === 'latest-beta-improvements');
    if (latestImprovementBulletin) {
      navigate(`/bulletins/${latestImprovementBulletin.id}`);
      return;
    }

    navigate('/bulletins');
  }

  // Main component
  return (
    <header>
      <Navbar expand="lg" expanded={expanded}>
        <Container>
          <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")}>
            <span className="line line1"></span>
            <span className="line line2"></span>
            <span className="line line3"></span>
          </Navbar.Toggle>

          <Navbar.Brand href="/" tabIndex={xLargeScreen ? "0": "-1"}>
            <img className="header-logo" src={logo} alt="Government of British Columbia" />
          </Navbar.Brand>

          <div className="nav-divider"></div>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                {getNavLink('Map')}
              </LinkContainer>

              <LinkContainer to="/cameras">
                {getNavLink('Cameras')}
              </LinkContainer>

              <LinkContainer to="/delays">
                {getNavLink('Delays')}
              </LinkContainer>

              <LinkContainer to="/advisories">
                {getNavLink('Advisories', advisoriesCount)}
              </LinkContainer>

              <LinkContainer to="/bulletins">
                {getNavLink('Bulletins', bulletinsCount)}
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>

          { xLargeScreen &&
            <button className="btn btn-primary" id="feedback-btn" alt="What's new" tabIndex={0}
              onClick={whatsNewHandler}
              onKeyPress={(keyEvent) => {
                if (keyEvent.charCode == 13 || keyEvent.charCode == 32) {
                  whatsNewHandler();
                }
              }}>
              <FontAwesomeIcon icon={faSparkles} />
              What&apos;s new
            </button>
          }

          <div className="nav-divider" />

          <UserNavigation />
        </Container>
      </Navbar>
    </header>
  );
}
