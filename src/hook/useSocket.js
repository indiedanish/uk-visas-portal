import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import apiConfig from '../configs/api.config';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const serverUrl = apiConfig.socketURL;

  useEffect(() => {
    // Establish socket connection when component mounts
    const socketInstance = io(serverUrl);

    // Set the socket instance
    setSocket(socketInstance);

    // Cleanup on component unmount: disconnect the socket
    return () => {
      socketInstance.disconnect();
      console.log('Disconnected from server');
    };
  }, [serverUrl]); // Only reconnect if the serverUrl changes

  return socket;
};

export default useSocket;
