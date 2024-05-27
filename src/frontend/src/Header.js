// React
import React, { useState } from "react";

// Third party packages
import { faComment } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// Static files
import logo from './images/dbc-logo-beta.svg';

// Styling
import './Header.scss';


// Third party packages
import {useMediaQuery} from '@uidotdev/usehooks';

export default function Header() {
  // State hooks
  const [expanded, setExpanded] = useState(false);

  // Component functions
  const getNavLink = (title) => {
    return <Nav.Link active={false} onClick={() => setTimeout(() => setExpanded(false))}>{title}</Nav.Link>
  };

  const xLargeScreen = useMediaQuery('only screen and (min-width : 992px)');

  const surveyLink = `${window.SURVEY_LINK}` ||
    'https://forms.office.com/Pages/ResponsePage.aspx?id=AFLbbw09ikqwNtNoXjWa3G-k6A-ZOZVMlxBJti4jf_VURjI4MlRKMlRYQTVFUFJZOU5XTVVZUjEwQS4u';

  // Rendering
  return (
    <header className="header--shown">
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
                {getNavLink('Advisories')}
              </LinkContainer>
              <LinkContainer to="/bulletins">
                {getNavLink('Bulletins')}
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>

          <a href={surveyLink} className="btn btn-primary" id="feedback-btn" target="_blank" rel="noreferrer" alt="Feedback survey"><FontAwesomeIcon icon={faComment} />Give Feedback</a>
        </Container>
      </Navbar>
    </header>
  );
}
