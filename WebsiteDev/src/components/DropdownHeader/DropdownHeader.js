import React, { useEffect, useState } from "react";
import "./DropdownHeader.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../config/fontStyles.css";
import colors from "../../config/colors";
import Modal from "react-modal";
import strings from "../../config/strings";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { faExpeditedssl } from "@fortawesome/free-brands-svg-icons";

export default function DropdownHeader(props) {
  DropdownHeader.propTypes = {
    businessName: PropTypes.string.isRequired,
    divClassName: PropTypes.string.isRequired,
    modalClassName: PropTypes.string.isRequired
  };

  const { businessName, image, modalClassName, divClassName } = props;
  const [modalIsOpen, setIsOpen] = useState(false);
  const history = useHistory();

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
      <div className={divClassName}>
        <div className="bell">
          <FontAwesomeIcon icon="bell" size="2x" />
        </div>
        <div className="image">
          <img src={image} />
        </div>
        <div className="nameandarrow">
          <h2 className="businessname subTextStyle">{businessName}</h2>
          <div onClick={openModal} className="downarrow">
            <FontAwesomeIcon icon="chevron-down" size="2x" />
          </div>
          <div>
            <Modal
              className={modalClassName}
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              overlayClassName="Overlay"
            >
              <div className="modaloptions">
                <div
                  onClick={() =>
                    history.push({
                      pathname: "/editprofile",
                      state: { businessID: "zjCzqSiCpNQELwU3ETtGBANz7hY2" },
                    })
                  }
                  className="editprofile"
                >
                  <FontAwesomeIcon
                    icon="user"
                    className="user"
                    size="2x"
                    style={{ cursor: "pointer" }}
                  />
                  <button
                    style={{ cursor: "pointer" }}
                    className="editprofilebutton smallTextStyle darkBlue"
                  >
                    {strings.EditProfile}
                  </button>
                </div>

                <hr className="hr" />
                <div
                  onClick={() => history.push({ pathname: "/" })}
                  className="logout"
                >
                  <FontAwesomeIcon
                    icon="sign-out-alt"
                    className="signoutalt"
                    size="2x"
                    style={{ cursor: "pointer" }}
                  />
                  <button
                    style={{ cursor: "pointer" }}
                    className="logoutbutton smallTextStyle darkBlue"
                  >
                    {strings.LogOut}
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
  );
}
