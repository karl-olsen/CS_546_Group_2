import { useState } from 'react';
import env from '../../env';
const axios = require('axios');

const SignIn = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const authenticate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${env.apiUrl}/login`, {
        email,
        password,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return <h1>J</h1>;
};

export default SignIn;
