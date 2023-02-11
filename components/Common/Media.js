import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import mediaStyles from "../../styles/Common/Media.module.css";

const Media = () => {
  return (
    <div className={mediaStyles.container}>
      <div className={mediaStyles.icon}>
        <a
          href="mailto:yusukeishihara87@gmail.com"
          className={mediaStyles.mail}
        >
          <FontAwesomeIcon icon={faEnvelope} className={mediaStyles.icon} />
        </a>
      </div>
      <div className={mediaStyles.icon}>
        <a
          href="https://github.com/YIshihara11201"
          className={mediaStyles.github}
        >
          <FontAwesomeIcon icon={faGithub} className={mediaStyles.icon} />
        </a>
      </div>
      <div className={mediaStyles.icon}>
        <a
          href="https://www.linkedin.com/in/yusuke-ishihara/"
          className={mediaStyles.linkedin}
        >
          <FontAwesomeIcon icon={faLinkedin} className={mediaStyles.icon} />
        </a>
      </div>
    </div>
  );
};

export default Media;
