import { NextPage } from "next";
import AuthForm from "../components/AuthForm";

const SignupPage: NextPage = () => {
  return <AuthForm isSignup={true} />;
};

export default SignupPage;
