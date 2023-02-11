import resumeButtonStyles from "../../../styles/Common/Nav/ResumeButton.module.css";

const ResumeButton = () => {
  return (
    <div className={resumeButtonStyles.resume}>
      <button>
        <a href="https://drive.google.com/file/d/1hDYOTOyXV-C2fGbSx1iFeGW0bdMRp5cq/view?usp=sharing">
          Resume
        </a>
      </button>
    </div>
  );
};

export default ResumeButton;
