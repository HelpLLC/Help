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
    <div>
      <h2 className="createproductheading">Create Service</h2>
      <div class="createproductcontainer">
        <div>
          <h3>Service Information</h3>
        </div>
        <div>
          <Typography>Service Name</Typography>
          <EditText
            class="createproductinput"
            type="name"
            labelText={"Enter title here"}
            widthPercent={200}
          />
        </div>
        <div>
          <Typography>Service Description</Typography>
          <EditText
            className="createproductinput"
            labelText={"Give a little description for your customers to see..."}
            widthPercent={300}
          />
        </div>

        <div>
          <Typography class="createproducttitles">Price</Typography>
          <CardContent class="createproductpriceinput">
            <DropdownButton
              id="createproductdropdown-basic-button"
              title="rate"
            >
              <Dropdown.Item>per</Dropdown.Item>
              <Dropdown.Item>Test</Dropdown.Item>
            </DropdownButton>
            <EditText class="createproductsecondpriceinput" widthPercent={50} />
          </CardContent>
        </div>
        <div>
          <h3>Select what you need from the customer.</h3>
        </div>
        <div className="buttonlistcontainer">
          <div>
            <HelpButton fullWidth={false} label="Phone Number" />
          </div>
          <div class="productbuttoncontainer">
            <HelpButton fullWidth={false} label="Email" />
          </div>
          <div class="productbuttoncontainer">
            <HelpButton fullWidth={false} label="Address" />
          </div>
        </div>
        <div class="textmorespace">
          <h3>Any Additional Requests?</h3>
        </div>
        <div>
          <Typography>Question 1</Typography>
          <div className="createproducticondiv">
            <EditText
              class="createproductinput"
              labelText={"Enter Question Here"}
              widthPercent={300}
            />
            <FaTrash />
          </div>
          <div>
            <p>
              Add more questions <MdAddCircle />
            </p>
          </div>
        </div>
        <div>
          <h3>Service specifics</h3>
        </div>
        <div>
          <Typography>How long will the service take per request?</Typography>
          <div className="createproducticondiv">
            <EditText
              labelText={"0"}
              widthPercent={50}
              className="createproductedittexts"
            />
            <p className="createproductparagraphs">Hours</p>
          </div>
        </div>
        <div>
          <Typography>How many requests can you do at a time?</Typography>
          <div className="createproducticondiv">
            <EditText labelText={"0"} widthPercent={50}></EditText>
            <p className="createproductparagraphs">Requests</p>
          </div>
        </div>
        <div>
          <h3>How will you accept payments?</h3>
        </div>
        <div className="buttonlistcontainer">
          <div>
            <HelpButton fullWidth={false} label="Credit/Debit Card" />
          </div>
          <div class="productbuttoncontainer">
            <HelpButton fullWidth={false} label="Cash" />
          </div>
          <div class="productbuttoncontainer">
            <HelpButton fullWidth={false} label="Other" />
          </div>
        </div>
        <div className="textmorespace">
          <h3>
            You're all set <FaThumbsUp />
          </h3>
        </div>
        <div>
          <HelpButton fullWidth={false} label="Create" />
        </div>
      </div>
      {/*
      
      </section>
      
  */}
    </div>
  );
}
