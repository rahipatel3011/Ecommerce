export default function Toaster({purpose, message}) {

    let classes = "toast align-items-center text-white border-0";
    if(purpose === 'create'){
        classes += " bg-success";
    }
    else if(purpose === 'delete'){
        classes += "bg-danger";
    }

  return (
    <div
      className={classes}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">{message}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
}
