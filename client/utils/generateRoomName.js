const generateRoomName = (senderEmail, receiverEmail) => {
  const sortedEmails = [senderEmail, receiverEmail].sort();
  const roomName = sortedEmails.join("_");
  return roomName;
};

export default generateRoomName;
