function prettifyTime(str) {
  return str < 10 ? `0${str}` : str;
}

function getTime(message) {
  const date = new Date(message.timestamp);
  return `${prettifyTime(date.getHours())}:${prettifyTime(date.getMinutes())}`;
}

function userMessage(message) {
  return (
    <div className="message__wrapper" key={message.timestamp}>
      <div className={"message_" + message.affiliation}>
        <div className={"message_" + message.affiliation + "_color"}>
          {message.affiliation !== "my" ? (
            <span className="user-name">{message.userName}</span>
          ) : (
            ""
          )}
          <div className="content">
            <p className="content_text">{message.text}</p>
            <span className="content_time">{getTime(message)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function systemMessage(message) {
  return (
    <div className="message__wrapper" key={message.timestamp}>
      <div className="message_system">
        <p className="message_system_text">{message.text}</p>
      </div>
    </div>
  );
}

function renderedMessage(message) {
  switch (message.type) {
    case "message":
      return userMessage(message);
    case "system":
      return systemMessage(message);
    default:
      return;
  }
}

export default renderedMessage;
