import SiteTitle from "./SiteTitle";
import ResumeButton from "./ResumeButton";
import navStyles from "../../../styles/Common/Nav/Nav.module.css";

const Nav = () => {
  return (
    <nav className={navStyles.nav}>
      <div className={navStyles.title}>
        <SiteTitle />
      </div>
      <div className={navStyles.resume}>
        <ResumeButton />
      </div>
    </nav>
  );
};

export default Nav;
