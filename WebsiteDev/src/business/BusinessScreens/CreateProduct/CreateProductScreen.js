import React, { Component } from "react";
import HelpButton from "../../../components/HelpButton";
import EditText from "../../../components/EditText";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import "./CreateProductScreen.css";
import fontStyles from "../../../config/fontStyles";
import { FaArrowDown } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { IconContext } from "react-icons";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export default function CreateProductScreen() {
  return (
    <section style={fontStyles.mainTextStyleBlack}>
      <h2 className="header">Create Service</h2>
      <section class="div">
        <h2 className="heading">Get to know your service!</h2>
        <Card class="container">
          <CardContent class="sscontent">
            <Typography>Service Name</Typography>
            <EditText
              class="input"
              type="name"
              labelText={"Enter title here"}
              widthPercent={200}
            />
          </CardContent>
          <CardContent class="sscontent">
            <Typography>Service Description</Typography>
            <EditText
              class="input"
              labelText={
                "Give a little description for your customers to see..."
              }
              widthPercent={300}
            />
          </CardContent>
          <CardContent class="sscontent">
            <Typography class="titles">Price</Typography>
            <CardContent class="priceinput">
              <DropdownButton id="dropdown-basic-button" title="rate">
                <Dropdown.Item>per</Dropdown.Item>
                <Dropdown.Item>Test</Dropdown.Item>
              </DropdownButton>
              <EditText class="secondpriceinput" widthPercent={50} />
            </CardContent>
          </CardContent>
        </Card>
      </section>
      <section className="section">
        <IconContext.Provider value={{ className: "react-icons" }}>
          <div>
            <FaArrowDown size="5em" vertical-align="middle" />
          </div>
        </IconContext.Provider>
      </section>
      <section class="div">
        <h2 className="heading">
          What information should your customer provide you?
        </h2>
        <Card class="container">
          <CardContent class="content">
            <HelpButton fullWidth={false} label="Phone Number" />
          </CardContent>
          <CardContent class="content">
            <HelpButton fullWidth={false} label="Email" />
          </CardContent>
          <CardContent class="content">
            <HelpButton fullWidth={false} label="Address" />
          </CardContent>
        </Card>
        <section className="section">
          <IconContext.Provider value={{ className: "react-icons" }}>
            <div>
              <FaArrowDown size="5em" vertical-align="middle" />
            </div>
          </IconContext.Provider>
        </section>
      </section>
      <section class="div">
        <h2 className="heading">Any Additional Requests?</h2>
        <Card class="container">
          <CardContent class="content">
            <Typography>Question 1</Typography>
            <div className="icondiv">
              <EditText
                class="input"
                labelText={"Enter Question Here"}
                widthPercent={300}
              />
              <FaTrash />
            </div>
          </CardContent>
          <CardContent>
            <p>
              Add more questions <MdAddCircle />
            </p>
          </CardContent>
        </Card>
        <section className="section">
          <IconContext.Provider value={{ className: "react-icons" }}>
            <div>
              <FaArrowDown size="5em" vertical-align="middle" />
            </div>
          </IconContext.Provider>
        </section>
      </section>
      <section class="div">
        <h2 className="heading">Service specifics</h2>
        <Card class="container">
          <CardContent className="sscontent">
            <Typography>How long will the service take per request?</Typography>
            <div className="icondiv">
              <EditText
                labelText={"0"}
                widthPercent={50}
                className="edittexts"
              />
              <p className="paragraphs">Hours</p>
            </div>
          </CardContent>
          <CardContent className="sscontent">
            <Typography>How many requests can you do at a time?</Typography>
            <div className="icondiv">
              <EditText labelText={"0"} widthPercent={50}></EditText>
              <p className="paragraphs">Requests</p>
            </div>
          </CardContent>
        </Card>
        <section className="section">
          <IconContext.Provider value={{ className: "react-icons" }}>
            <div>
              <FaArrowDown size="5em" vertical-align="middle" />
            </div>
          </IconContext.Provider>
        </section>
      </section>
      <section class="div">
        <h2 className="heading">How will you accept payments?</h2>
        <Card class="container">
          <CardContent class="content">
            <HelpButton fullWidth={false} label="Credit/Debit Card" />
          </CardContent>
          <CardContent class="content">
            <HelpButton fullWidth={false} label="Cash" />
          </CardContent>
          <CardContent class="content">
            <HelpButton fullWidth={false} label="Other" />
          </CardContent>
        </Card>
      </section>
      <section className="footer">
        <p>
          You're all set <FaThumbsUp />
        </p>
        <HelpButton fullWidth={false} label="Create" />
      </section>
    </section>
  );
}
