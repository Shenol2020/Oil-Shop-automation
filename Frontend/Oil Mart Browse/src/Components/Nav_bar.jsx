import {Link} from "react-router-dom";
import React, { useState, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext.jsx';

function Navbar() {
  const {isLoggedIn, logout} = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          {/*Disanayake Oil Center*/}
          <img src="/D_logo.png" alt="Bootstrap" width="30" height="24"></img>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home                
              </Link>
            </li>
            
            <li className="nav-item dropdown">
              <button
                className="nav-link"
                href="#"
                role="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasExample" 
                aria-controls="offcanvasExample"                
              >
                Filters
              </button>
              
            </li>
            {/*<li className="nav-item">
              <a className="nav-link disabled" aria-disabled="true">
                Disabled
              </a>
            </li>*/}
          </ul>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success me-2" type="submit">
              Search
            </button>
          </form>
          {/* Conditional Auth Section */}
          <ul className="navbar-nav align-items-center">
            {isLoggedIn ? (
              <li className="nav-item ms-2">
                <button 
                  className="btn btn-primary rounded-circle d-flex justify-content-center align-items-center shadow-sm" 
                  style={{ width: '45px', height: '45px', fontSize: '20px', fontWeight: 'bold' }}
                  title="Account"
                >
                  H
                </button>
              </li>
            ) : (
            <ul className="navbar-nav">
              <li className="nav-item me-2">
                <Link className="btn btn-primary" type="button" to="/signup">
                  Sign up
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-primary" type="button" to="/login">
                  log in
                </Link>
              </li>
            </ul>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
