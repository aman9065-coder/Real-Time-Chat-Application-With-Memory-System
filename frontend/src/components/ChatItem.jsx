import { Link } from "react-router-dom";

const ChatItem = ({ chat }) => {
  return (
    <Link
      to={`/chat/${chat._id}`}
      className="border p-2 hover:bg-gray-200 cursor-pointer"
    >
      {chat.title || "chat"}
    </Link>
  );
};

export default ChatItem;
