import { useEffect } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';

const Context = () => {
  const globalContext = useGlobalContext();

  useEffect(() => {
    console.log('Global Context:', globalContext);
  }, [globalContext]); // Runs whenever the context updates

  return <></>;
};

export default Context;
