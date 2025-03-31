import background from "../../assets/landing.jpg";
import CodeEditor from "./codeEditor";
import Timer from "./timer";

function CodingPage() {
  return (
    <>
      <div
        style={{
          // borderRadius: "50px 50px 50px 50px",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          display: "flex",
          width: "100%",
        }}
        className="flex flex-col justify-center items-center"
      >
        <Timer />
        <CodeEditor />
      </div>
    </>
  );
}

export default CodingPage;
