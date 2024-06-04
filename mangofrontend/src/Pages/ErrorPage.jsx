import { useRouteError } from "react-router-dom";
import Header from "../Components/Header";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "And error occured";
  let message = "Something went wrong";
  console.log(error);
  if (error.status === 500) {
    message = error.data.message;
  }

  if (error.status === 401) {
    title = "Not Found!";
    message = "Could not find resource or page.";
  }

  return (
    <div className="text-center">
      <Header />
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  );
}
