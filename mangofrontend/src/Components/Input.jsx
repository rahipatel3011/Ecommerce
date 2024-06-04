export default function Input({name, ...props }) {
  

  return (
    <>
      {/* {data && Object.keys(JSON.parse(data).errors).map(key=>key.toLowerCase() === 'password' ? JSON.parse(data).errors[key] : null)} */}

      {/* <p className="text-danger mb-1">{error}</p> */}

      <div className="input-group mb-3">
        <span
          style={{ backgroundColor: "#C4B6B6" }}
          className="input-group-text p-3"
        ></span>
        <input name={name} {...props} />
      </div>
    </>
  );
}
