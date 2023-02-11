import Head from "next/head";
import DateBar from "./Date/DateBar";
import YearText from "./Date/YearText";
import SideNav from "./Navigation/SideNav";
import Nav from "./Navigation/Nav";
import Footer from "./Navigation/Footer";
import layoutStyles from "../../styles/Common/Layout.module.css";

const Layout = ({ children }) => {
  return (
    <div className={layoutStyles.container}>
      <Head>
        <title>YIshihara11201</title>
      </Head>

      {/* when display size is greater than 992px, DateBar, YearText, and Nav is removed.*/}
      {/* when display size is greater than 992px SideNav is arranged*/}
      <Nav />
      <SideNav />
      <div>
        <div className={layoutStyles.calendar}>
          <DateBar />
          <YearText />
        </div>
        {/* <div className={layoutStyles.main_content}>{children}</div> */}
        <div>{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
