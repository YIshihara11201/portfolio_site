import Link from "next/link";
import FooterIcon from "./FooterIcon";
import {
  faUser,
  faEnvelope,
  faSuitcase,
} from "@fortawesome/free-solid-svg-icons";
import footerStyles from "../../../styles/Common/Nav/Footer.module.css";

const Footer = () => {
  return (
    <div className={footerStyles.footer}>
      <FooterIcon text={"About"} icon={faUser} to="/" />
      <FooterIcon text={"Works"} icon={faSuitcase} to="/works" />
      <FooterIcon text={"Contact"} icon={faEnvelope} to="/contact" />
    </div>
  );
};

export default Footer;
