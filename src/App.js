import React from 'react';
import './App.css';
import { useGlobalState } from './providers/root';
import { useToast } from '@chakra-ui/react';
import { checkForFirebaseAuth } from './api/firebase';
import Router from './router';
import Header from './components/Header';
import Zindex from './common/Zindex';

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
    <Zindex zIndex={1}>
      <Header />
      <Router />
    </Zindex>
  );
}

export default App;
