import React, { useState } from 'react';
import "../App.css";
import Table from './PointsTable'
import SattaForm from './Sattaform';

const serverEndpoint = "http://localhost:8000"
export default function Login() {
    let [user, setUser] = useState({ authenticated: false, token: null })

    let isSattaOn = true;
    let sattaLagaDiya = false;
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')

    function handleChange(event) {
        switch (event.target.id) {
            case 'email': setEmail(event.target.value)
                break;
            case 'password': setPassword(event.target.value)
                break;
            default: return;
        }
    }

    function handleSubmit(event) {
        console.log("Submitted form")
        fetch(serverEndpoint + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "email": email, "password": password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.authenticated) {
                    setUser({ authenticated: true, token: data.token })
                    fetch(serverEndpoint + '/pingAppliances', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ "token": data.token })
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.type === 'success') {
                                console.log("success");
                            }
                        })
                    setEmail("")
                    setPassword("")
                } else {
                    setUser({ authenticated: false, token: null })
                }
            })
    }

    return (
        <article className="room">
            {user.authenticated || true ?
                (
                    <div className="searchContainer">
                        <h1>
                            Welcome to the Satta Site.
                        </h1>
                        {
                            (isSattaOn && !sattaLagaDiya) || 1 ? (<SattaForm />)
                                : (<div>Satta is off </div>)
                        }
                        <Table />

                    </div>
                ) : (<div className="searchContainer">
                    <div className="flexchild">
                        <h2>Login</h2>
                        <p style={{ color: "grey" }}> Please enter the following details: </p>
                    </div>
                    <form className="flexchild">
                        <label for="Email">Username</label>
                        <br />
                        <input type="text" className="textbox" id="email" onChange={(event) => {
                            event.preventDefault();
                            handleChange(event);
                        }} />
                        <br />
                        <label for="url">Password</label>
                        <br />
                        <input type="password" className="textbox" id="password" onChange={(event) => {
                            event.preventDefault();
                            handleChange(event);
                        }}
                        />
                        <br />
                        <button className="btn" onClick={(event) => {
                            event.preventDefault();
                            handleSubmit(event)
                        }}>Submit</button>
                    </form>
                </div>
                )
            }
            <h4 align="center">
                <strike>
                    RCB HI JEETEGI
                </strike>
            </h4>
        </article >
    )
}
