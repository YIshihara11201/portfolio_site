import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import footerIconStyles from "../../../styles/Common/Nav/FooterIcon.module.css";

const FooterIcon = ({ text, icon, to }) => {
  return (
    <div className={footerIconStyles.container}>
      <Link href={to}>
        <a>
          <FontAwesomeIcon icon={icon} className={footerIconStyles.icon} />
          <div className={footerIconStyles.text}>{text}</div>
        </a>
      </Link>
    </div>
  );
};

export default FooterIcon;
