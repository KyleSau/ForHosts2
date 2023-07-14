const LoginButton: React.FC = () => {
    return (
      <a href="//app.forhosts.com"  rel="noopener noreferrer">
        <button
          className={`transition-all duration-500 ease-in-out transform  px-5 py-2 rounded-lg text-black font-bold border border-black hover:bg-sitecolor`}
        >
          Login
        </button>
      </a>
    );
  };
  
  export default LoginButton;