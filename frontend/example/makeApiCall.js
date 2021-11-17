import { useState, useEffect } from 'react';
import axios from 'axios';
import env from './env';

// THIS IS JUST AN EXAMPLE OF USING STATE AND API CALLS

function MakeApiCall() {
  const [data, setData] = useState('');

  useEffect(() => {
    async function fetchData() {
      const result = await axios(env?.apiUrl); // made separate file to contain env variables
      if (result.status === 200) {
        setData(result.data);
      } else {
        // display error to user
      }
    }
    fetchData();
  }, []); // this [] ensures useEffect() runs only once until the data has been modified at runtime

  const { test } = data;

  return <div>{test}</div>;
}

export default MakeApiCall;
