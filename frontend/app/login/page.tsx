import AuthForm from "../components/AuthForm";
import { NextPage } from "next";
const LoginPage: NextPage = () => {
  return <AuthForm isSignup={false} />;
};
export default LoginPage;
