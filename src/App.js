import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { Auth, API } from 'aws-amplify';
import aws_exports from './aws-exports';
import Button from 'react-bootstrap/Button'
import Jumbotron from 'react-bootstrap/Jumbotron';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
Amplify.configure(aws_exports);

async function createCheater() {
  const data = {
    body: {
      id: "shit",
      player_id: 123456,
      anomaly: 1.0456,
      fraud: 0
    }
  };
  const apiData = await API.post('cheaterapi', '/cheater', data);
  console.log({ apiData })
  const moreData = await API.get('cheaterapi', '/cheater')
  console.log({moreData})
}

class App extends Component {
  intervalID;

  state = {
    data: [],
  }

  componentDidMount() {
    this.getData()
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID)
  }

  getData = () => {
    API.get('cheaterapi', '/cheater')
    .then(response => {
      let data = [].concat(response)
        .sort((a,b) => a.player_id - b.player_id )
      this.setState({data: data})
      this.intervalID = setTimeout(this.getData.bind(this), 5000);
    })
  }

  banPlayer = (player) => {
    player['banned'] = true
    console.log(player)
    API.put('cheaterapi', '/cheater', {body: player})
    .then(response => console.log(response))
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Octank Cheater Management
          </p>
          
        
        </header>
        <Jumbotron className="App-Jumbotron">
          

          <Table striped bordered hover variant="dark" className="App-Table">
            <thead>
              <tr>
                <th>Player ID</th>
                <th>Anomaly Score</th>
                <th>Cheat Detected</th>
                <th>Banned</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((item)=>{
                return (
                  <tr key={item.player_id}>
                    <td>{item.player_id}</td>
                    <td>{item.anomaly}</td>
                    <td>{item.fraud > 0 ? <p className="Banned-Text">Cheater</p> : 'OK'}</td>
                    <td>{item.banned ? <p className="Banned-Text">Banned</p> : 'no'}</td>
                    <td><Button disabled={item.banned} onClick={()=>this.banPlayer(item)}> Ban Player </Button></td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Jumbotron>
      </div>
    );
  }
}

export default withAuthenticator(App, true);
