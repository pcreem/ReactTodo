import { Navbar, Button } from 'react-bootstrap'
import React from 'react'

const Nav = (props) => {
  return (
    <>
      <Navbar>
        <Navbar.Brand>
          TodoList
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {props.isLogin && (
            <>
              <Navbar.Text style={{ marginRight: 10 }}>
                Hi: {props.name}
              </Navbar.Text>

              <Button
                variant="outline-secondary"
                type="submit"
                onClick={() => { props.handleLogout() }}
              >Logout</Button>
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default Nav;