import ChatPage from "../(components)/ChatPage";
import UserLayout from "../(components)/UserLayout";

const Chat = () => {
  return (
    <UserLayout>
      {/* <div className="h-screen py-4 w-5/6"> */}
        <ChatPage />
      {/* </div> */}
    </UserLayout>
  );
};

export default Chat;
