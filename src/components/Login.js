import React from 'react'
import { Form, Button, Col, Row } from 'react-bootstrap';
import gql from 'graphql-tag'
import { useMutation } from 'urql'
import { setToken, getToken, deleteToken } from '../token'
import { setUserName, getUserName, deleteUserName } from '../token'
import Todo from './Post'
import Nav from './Nav'

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
      user{
        id
        name
      }
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user{
        id
        name
      }
    }
  }
`

const Login = props => {
  // Used to switch between login and signup button
  const [switchLogin, setSwitch] = React.useState(true)
  const [isLogin, setLogin] = React.useState(!!getToken())
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('')

  const [state, executeMutation] = useMutation(
    switchLogin ? LOGIN_MUTATION : SIGNUP_MUTATION
  );

  const mutate = React.useCallback(() => {
    executeMutation({ email, password, name })
      .then(({ data, error }) => {

        if (error) return null

        const token = data && data[switchLogin ? 'login' : 'signup'].token

        if (token) {
          const user = data && data[switchLogin ? 'login' : 'signup'].user
          setUserName(user.name)
          setToken(token)
          setLogin(!!getToken())
        }
      });
  }, [executeMutation, switchLogin, email, password, name]);

  function refreshPage() {
    deleteToken(); deleteUserName(); setLogin(!!getToken());
    window.location.reload(false);
  }


  return (
    <>
      <Nav name={getUserName()} isLogin={isLogin} handleLogout={() => { refreshPage(); }} />
      <Row className="justify-content-md-center" style={{ marginTop: 100 }}>
        <Col sm={6} >
          {!isLogin && (
            <>
              <h4 className="text-center">{switchLogin ? 'Sign In' : 'Sign Up'}</h4>
              <br></br>
              <Form>
                {!switchLogin && (
                  <Form.Group controlId="formBasicName">
                    <Form.Control
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter name" />
                  </Form.Group>
                )}
                <Form.Group controlId="formBasicEmail">
                  <Form.Control type="email" value={email}
                    onChange={e => setEmail(e.target.value)} placeholder="Enter email" />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Control type="password" value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="Password" />
                </Form.Group>
                <Button variant="outline-secondary"
                  disabled={state.fetching}

                  onClick={() => { mutate(); setEmail(''); setPassword('') }}>
                  {switchLogin ? "login" : "create account"}
                </Button>{' '}
                <Button variant="outline-secondary"
                  disabled={state.fetching}
                  onClick={() => setSwitch(!switchLogin)}
                >
                  {switchLogin ? 'need to create an account?' : 'already have an account?'}
                </Button>
              </Form>
            </>
          )}
          {isLogin && (
            <>
              < Todo handleLogout={() => { deleteToken(); setLogin(!!getToken()); }} />
            </>
          )}
        </Col>
      </Row>


    </>

  )
}

export default Login