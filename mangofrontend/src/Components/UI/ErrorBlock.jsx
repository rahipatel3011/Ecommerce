export default function ErrorBlock({ title, message }, props) {
    let classes = "error-block "+ props.className;
    return (
      <div className={classes}>
        <div className="error-block-icon">!</div>
        <div className="error-block-text">
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
      </div>
    );
  }
  