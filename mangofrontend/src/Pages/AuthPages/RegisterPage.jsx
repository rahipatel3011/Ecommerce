import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import Input from "../../Components/Input";

export default function RegisterPage() {
  const navigation = useNavigation();
  const data = useActionData();
  let errors;

  if (data) {
    errors = data.errors ? data.errors : { message: data.message };
  }

  return (
    <>
      <Form method="post">
        <div className="login">
          <div className="login-title text-white">
            <h1 className="mb-0">Register</h1>
          </div>
          <div className="login-body">
            {errors &&
              Object.keys(errors).map((key) => (
                <p key={key} className="text-danger">
                  {errors[key]}
                </p>
              ))}

            <Input
              errors={errors}
              name="name"
              type="text"
              className="form-control"
              placeholder="Full Name"
            />

            <Input
              errors={errors}
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
            />

            <Input
              errors={errors}
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
            />

            <Input
              errors={errors}
              name="confirmPassword"
              type="password"
              className="form-control"
              placeholder="Confirm Password"
            />

            <Input
              errors={errors}
              name="phoneNumber"
              type="number"
              className="form-control"
              placeholder="Phone Number"
            />
            <div className="row text-center p-3">
              <button
                className="btn btn-danger col-md-12 p-2"
                disabled={navigation.state === "submitting"}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}

export async function action({ request }) {
  const formData = await request.formData();

  const registerDTO = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    phoneNumber: formData.get("phoneNumber"),
  };

  const baseURL = "https://mangoservicesauthapihost.azurewebsites.net/api/auth";
  let url = `${baseURL}/register`;

  const response = await fetch(url, {
    method: request.method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(registerDTO),
  });

  if (response.status === 400) {
    let resp = await response.json();
    return resp;
  }
  if (!response.ok) {
    throw json({ message: "could not register user." }, { status: 500 });
  }
  return redirect("/login");
}
