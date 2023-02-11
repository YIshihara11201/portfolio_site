import ContactForm from "../components/Contact/ContactForm";
import contactStyles from "../styles/Contact/Contact.module.css";

const Contact = () => {
  return (
    <div className={contactStyles.container}>
      <div className={contactStyles.inner_container}>
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;
