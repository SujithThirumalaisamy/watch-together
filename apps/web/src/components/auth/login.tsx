import Google from "../../assets/google.png";
import Github from "../../assets/github.png";

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL ?? "http://localhost:3000";

const Login = () => {
  const google = () => {
    window.open(`${BACKEND_URL}/auth/google`, "_self");
  };

  const github = () => {
    window.open(`${BACKEND_URL}/auth/github`, "_self");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen chess-board text-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-500 drop-shadow-lg">
        Enter the Party World
      </h1>
      <div className="mb-8 md:mb-0 md:mr-8 justify-center flex flex-col">
        <div
          className="flex items-center justify-center chess-board text-white px-4 py-2 rounded-md mb-4 cursor-pointer hover:bg-gray-600 transition-colors duration-300"
          onClick={google}
        >
          <img src={Google} alt="" className="w-6 h-6 mr-2" />
          Sign in with Google
        </div>
        <div
          className="flex items-center justify-center chess-board text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-600 transition-colors duration-300"
          onClick={github}
        >
          <img src={Github} alt="" className="w-6 h-6 mr-2" />
          Sign in with Github
        </div>
      </div>
    </div>
  );
};

export default Login;
