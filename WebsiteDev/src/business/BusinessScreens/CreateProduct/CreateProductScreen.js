import React, { useState } from "react";
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
import { useLocation } from "react-router-dom";

export default function CreateProductScreen() {
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [servicePriceType, setServicePriceType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(false);
  const [email, setEmail] = useState(false);
  const [requestHours, setRequestHours] = useState(0);
  const [creditCard, setCreditCard] = useState(false);
  const [cash, setCash] = useState(false);
  const [business, setBusiness] = useState();
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const [address, setAddress] = useState(false);
  const [questions, setQuestions] = useState();

  const ComponentDidMount = () => {
    const biz = location.state.business;
    setBusiness(biz);
    setQuestions(new Array());
    console.log(questions);
    setLoaded(true);
  };

  if (loaded === false) {
    ComponentDidMount();
  }

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
            onChange={setServiceName}
            value={serviceName}
          />
        </div>
        <div>
          <Typography>Service Description</Typography>
          <EditText
            className="createproductinput"
            labelText={"Give a little description for your customers to see..."}
            widthPercent={300}
            onChange={setServiceDescription}
            value={serviceDescription}
          />
        </div>

        <div>
          <Typography class="createproducttitles">Price</Typography>
          <div className="buttonlistcontainer">
            <DropdownButton
              id="createproductdropdown-basic-button"
              title="rate"
            >
              <Dropdown.Item>per</Dropdown.Item>
              <Dropdown.Item>Test</Dropdown.Item>
            </DropdownButton>
            <EditText class="createproductsecondpriceinput" widthPercent={50} />
          </div>
        </div>
        <div>
          <h3>Select what you need from the customer.</h3>
        </div>
        <div className="buttonlistcontainer">
          <div>
            <HelpButton
              fullWidth={false}
              label="Phone Number"
              onClick={() => {
                setPhoneNumber(true);
              }}
            />
          </div>
          <div class="productbuttoncontainer">
            <HelpButton
              fullWidth={false}
              label="Email"
              onClick={() => {
                setEmail(true);
              }}
            />
          </div>
          <div class="productbuttoncontainer">
            <HelpButton
              fullWidth={false}
              label="Address"
              onClick={() => {
                setAddress(true);
              }}
            />
          </div>
        </div>
        <div class="textmorespace">
          <h3>Any Additional Requests?</h3>
        </div>
        {loaded ? (
          questions.map((question, i) => (
            <div>
              <Typography>Question {i + 1}</Typography>
              <div className="createproducticondiv">
                <EditText
                  class="createproductinput"
                  labelText={"Enter Question Here"}
                  widthPercent={300}
                  onChange={setQuestions}
                  value={serviceDescription}
                />
                <FaTrash />
              </div>
            </div>
          ))
        ) : (
          <div></div>
        )}
        {loaded ? (
          <div>
            <p>
              Add more questions{" "}
              <MdAddCircle onClick={setQuestions(questions.push(""))} />
            </p>
          </div>
        ) : (
          <div></div>
        )}
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
            <EditText labelText={"0"} widthPercent={50} value={requestHours} onChange={setRequestHours}></EditText>
            <p className="createproductparagraphs">Requests</p>
          </div>
        </div>
        <div>
          <h3>How will you accept payments?</h3>
        </div>
        <div className="buttonlistcontainer">
          <div>
            <HelpButton
              fullWidth={false}
              label="Credit/Debit Card"
              onClick={() => {
                setCreditCard(true);
                setCash(false);
              }}
            />
          </div>
          <div class="productbuttoncontainer">
            <HelpButton
              fullWidth={false}
              label="Cash"
              onClick={() => {
                setCreditCard(false);
                setCash(true);
              }}
            />
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
