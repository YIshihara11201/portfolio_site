import Media from "../Media";
import Link from "next/link";
import sideNavStyles from "../../../styles/Common/Nav/SideNav.module.css";

const SideNav = () => {
  return (
    <nav className={sideNavStyles.container}>
      <button>
        <a
          className={sideNavStyles.resume}
          href="https://drive.google.com/file/d/1LDYYngU9fNAYTXMpx3U0FhyOLBXitiDy/view?usp=sharing"
        >
          Resume
        </a>
      </button>
      <div className={sideNavStyles.links}>
        <Link href="/">About</Link>
        <Link href="/works">Works</Link>
        <Link href="/contact">Contact</Link>
      </div>

      <div className={sideNavStyles.media}>
        <Media />
      </div>
      <div className={sideNavStyles.acknowledgement}>
        This portfolio was inspired by <br /> <i>Apple.com</i> in 1997
      </div>
    </nav>
  );
};

export default SideNav;
