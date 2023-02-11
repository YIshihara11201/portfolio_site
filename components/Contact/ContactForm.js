import React, { useState } from "react";
import Media from "../Common/Media";
import contactFormStyles from "../../styles/Contact/ContactForm.module.css";

export const Name = ({ fullname, eventHandler }) => {
  return (
    <div className={contactFormStyles.name_container}>
      <label style={{ paddingBottom: "5px", fontSize: 18 }}>Name</label>
      <input
        type="text"
        name="fullname"
        value={fullname}
        onChange={(e) => {
          eventHandler(e.target.value);
        }}
        className={contactFormStyles.name}
      />
    </div>
  );
};

export const Email = ({ email, eventHandler }) => {
  return (
    <div className={contactFormStyles.email_container}>
      <label style={{ paddingBottom: "5px", fontSize: 18 }}>Email</label>
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => {
          eventHandler(e.target.value);
        }}
        className={contactFormStyles.email}
      />
    </div>
  );
};

export const Message = ({ message, eventHandler }) => {
  return (
    <div className={contactFormStyles.message_container}>
      <label style={{ paddingBottom: "5px", fontSize: 18 }}>Message</label>
      <textarea
        className={contactFormStyles.message}
        name="message"
        value={message}
        onChange={(e) => {
          eventHandler(e.target.value);
        }}
      ></textarea>
    </div>
  );
};

const ContactForm = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [buttonText, setButtonText] = useState("Send message");

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailureMessage, setShowFailureMessage] = useState(false);

  const handleValidation = () => {
    let tempErrors = {};
    let isValid = true;

    if (fullname.length <= 0) {
      tempErrors["fullname"] = true;
      isValid = false;
    }
    if (email.length <= 0) {
      tempErrors["email"] = true;
      isValid = false;
    }
    if (message.length <= 0) {
      tempErrors["message"] = true;
      isValid = false;
    }

    setErrors({ ...tempErrors });
    console.log("errors", errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValidForm = handleValidation();

    if (isValidForm) {
      setButtonText("Sending");
      const res = await fetch("/api/send", {
        body: JSON.stringify({
          email: email,
          fullname: fullname,
          message: message,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const { error } = await res.json();
      if (error) {
        setShowSuccessMessage(false);
        setShowFailureMessage(true);
        setButtonText("Send message");
        return;
      }
      setShowSuccessMessage(true);
      setShowFailureMessage(false);
      setButtonText("Send message");
    }
  };

  return (
    <div className={contactFormStyles.container}>
      <h1 className={contactFormStyles.title}>Contact Form</h1>
      <div className={contactFormStyles.media_container}>
        <Media />
      </div>

      {showSuccessMessage ? (
        <h2>Thank you for contacting me!</h2>
      ) : showFailureMessage ? (
        <h2>Sorry, something went wrong.</h2>
      ) : (
        <form onSubmit={handleSubmit}>
          <Name fullname={fullname} eventHandler={setFullname} />
          <Email email={email} eventHandler={setEmail} />
          <Message message={message} eventHandler={setMessage} />

          <div className={contactFormStyles.button_container}>
            <button type="submit" className={contactFormStyles.submit_button}>
              {buttonText}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
