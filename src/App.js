import React from 'react';
import './App.css';
import { useGlobalState } from './providers/root';
import { useToast } from '@chakra-ui/react';
import { getGPSCoordinates } from './utils/gps';
import { checkForFirebaseAuth } from './api/firebase';
import UserMap from './components/Map';
import Router from './router';

function App() {

  const { dispatch } = useGlobalState();
  const toast = useToast();


  const showSuccessToast = () => {
    toast({
      title: "Authenticated",
      description: "We've successfully signed you in.",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  React.useEffect(() => {
    checkForFirebaseAuth(dispatch, showSuccessToast);
  }, [])

  return (
    <Router />
  );
}

export default App;
