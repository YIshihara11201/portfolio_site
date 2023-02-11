import Link from "next/link";
import siteTitleStyles from "../../../styles/Common/Nav/SiteTitle.module.css";

const SiteTitle = () => {
  return (
    <div className={siteTitleStyles.title}>
      <Link href="/">Yusuke Ishihara</Link>
    </div>
  );
};

export default SiteTitle;
