import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_BASE_URL = "http://192.168.149.199:8085";
// const SOCKET_BASE_URL = "http://10.8.20.66:8085";
// const SOCKET_BASE_URL = "http://localhost:8085";



export const useSocket = (room, username) => {
  const [socket, setSocket] = useState(null);
  const [socketResponse, setSocketResponse] = useState({
    room: "",
    content: "",
    username: "",
    messageType: "",
    createdDateTime: "",
  });


  const [allUsers, setAllUsers] = useState(0);
  const [isConnected, setConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState("");
  const [endGame, setEndGame] = useState(0);

  useEffect(() => {
    console.log('Info: ', username, room);
    const s = io(SOCKET_BASE_URL, {
      reconnection: true,
      query: `username=${username}&room=${room}`,
    });

    s.on("connect", () => {
      console.log("Socket connected");
      setConnected(true);
      setSocket(s);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    s.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
    });

    s.on("read_message", (res) => {
      console.log("Response from server: ", res);
      setSocketResponse(res);
    });
    s.on("AMOUNT", (res) => {
      console.log("Response from ALL_USERS: ", res);
      setAllUsers(res);
    });

    s.on("start_game", () => {
      console.log("Game started");
      setGameStarted(true);
    });
    s.on("question", (res) => {
      try {
        console.log("Question: ", res);
        res = res
          .replace(/(\w+)=/g, '"$1":')  
          .replace(/'/g, '"')
          .replace(/Option\{/g, '{')
          .replace(/\},/g, '},'); 
        let jsonObject = JSON.parse(res);
        setQuestion(jsonObject);
      } catch (error) {
        console.log("Failed to parse question:", error);
      }
    });
    s.on("results", (res) => {
      res = res
      .replace(/(\w+)=/g, '"$1":')  
      .replace(/'/g, '"')
      .replace(/Option\{/g, '{')
      .replace(/\},/g, '},'); 
      setResult(res);
    });
    s.on("score", (res) => {
        setScore(res);
    });
    s.on("game_end", (res) => {
      setEndGame(res);
    });
  }, [room, username]);
  

  const sendData = useCallback(
    (payload) => {
      if (socket && isConnected) {
        socket.emit("send_message", {
          room: room,
          content: payload.content,
          username: username,
          messageType: payload.messageType ||"CLIENT",
        });
      } else {
        console.warn("Socket is not connected yet.");
      }
    },
    [socket, isConnected, room, username]
  );
  return { socketResponse, isConnected, sendData, allUsers ,gameStarted, question, result, score, endGame };
};