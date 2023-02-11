import NoSSR from "../NoSSR";
import dateBarStyles from "../../../styles/Common/Date/DateBar.module.css";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DateBar = () => {
  let currentMonth = new Date().getMonth();
  let currentDay = new Date().getDate();

  return (
    <NoSSR>
      <div className={dateBarStyles.datebar_container}>
        <div className={dateBarStyles.datebar_left_box}>
          {monthNames[currentMonth]}
        </div>
        <div className={dateBarStyles.datebar_right_box}>{currentDay}</div>
      </div>
    </NoSSR>
  );
};

export default DateBar;
