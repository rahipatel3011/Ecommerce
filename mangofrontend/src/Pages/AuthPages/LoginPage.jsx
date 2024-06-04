import {
  Form,
  json,
  redirect,
  useNavigate,
} from "react-router-dom";
import { PersonFill, LockFill } from "react-bootstrap-icons";
import { getAuthToken } from "../../Utils/helper";
import { useContext } from "react";
import {TokenContext} from "../../Store/TokenContextProvider.jsx";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../Utils/AuthHttp";

export default function LoginPage() {
  const navigate = useNavigate();
  const { token, addToken } = useContext(TokenContext);
  
  const {mutate, isPending, isError, error} = useMutation({
    mutationFn: login,
    onSuccess: (data)=>{
      addToken(data.token);
      navigate("/");
    }
  });
  if(token){
    navigate("/");
  }

  function handleFormSubmit(event){
    event.preventDefault();
    let formData = new FormData(event.target);
    const loginDTO = Object.fromEntries(formData);
    mutate({loginDTO});
  }

  return (
    <>
      <Form method="post" onSubmit={handleFormSubmit}>
        <div className="login">
          <div className="login-title text-white">
            <h1 className="mb-0">Login</h1>
          </div>
          <div className="login-body">
            {isError && <p className="text-danger"> {error?.message} </p>}
            
            <div className="input-group mb-3">
              <span
                style={{ backgroundColor: "#C4B6B6" }}
                className="input-group-text p-3"
              >
                <PersonFill size="20" />
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
              />
            </div>

            <div className="input-group mb-3">
              <span
                style={{ backgroundColor: "#C4B6B6" }}
                className="input-group-text p-3"
              >
                <LockFill size="20" />
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="password"
              />
            </div>
            <div className="row text-center p-3">
              <button className="btn btn-danger col-md-12 p-2" disabled={isPending}>Login</button>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}

export async function action({ request }) {


  const formData = await request.formData();
  const loginDTO = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const baseURL = "https://localhost:7002/api/auth";
  let url = `${baseURL}/login`;
  const response = await fetch(url, {
    method: request.method,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(loginDTO),
  });
  
 

  if (response.status === 401 || response.status === 400) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: "could not authenticate user." }, { status: 500 });
  }
  const data = await response.json();

  // const expiryTime = new Date();
  // expiryTime.setHours(expiryTime.getHours() + 2);
  // addToken(data.result.token, expiryTime);

  localStorage.setItem("jwt", data.result.token);
  return redirect("/");
}


export function loader(){
  if(getAuthToken()){
    return redirect("/")
  }
  return null;
}
