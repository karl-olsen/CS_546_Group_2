import { useState } from "react"
const axios = require('axios')

const SignIn = () => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const authenticate = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3001/login', {
                email,
                password
            })
        } catch(e) {
            console.log(e)
        }
    }

    return (
        <form onSubmit={async (e) => await authenticate(e)}>
            <label>
                Email:
                <input type="text" onChange={(e) => setEmail(e.target.value)}/>
            </label>
            <label>
                Password:
                <input type="text" onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <input type="submit" value="Submit" />
      </form>
    )
}

export default SignIn