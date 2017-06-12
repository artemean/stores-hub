import React, { Component } from 'react';
import firebase from 'firebase';
// import reactfire from 'reactfire';

const config = {
    apiKey: "AIzaSyCLBJNYm1P4xSPtibR1yNshqqu3Cw3ai4o",
    authDomain: "stores-hub.firebaseapp.com",
    databaseURL: "https://stores-hub.firebaseio.com",
    projectId: "stores-hub",
    storageBucket: "stores-hub.appspot.com",
    messagingSenderId: "463422181236"
};
firebase.initializeApp(config);

class TodoList2 extends Component {
    render() {
        const _this = this;
        const createItem = function(item, index) {
            return (
                <li key={ index }>
                    { item.text }
                    <span onClick={ _this.props.removeItem.bind(null, item['.key']) }
                          style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}>
            X
          </span>
                </li>
            );
        };
        return <ul>{ this.props.items.map(createItem) }</ul>;
    }
}

class TodoApp2 extends Component {
    state = {
        items: [],
        text: ''
    };

    componentWillMount() {
        this.firebaseRef = firebase.database().ref('todoApp/items');
        this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
            let items = [];

            dataSnapshot.forEach(function(childSnapshot) {
                let item = childSnapshot.val();
                item['.key'] = childSnapshot.key;
                items.push(item);
            });

            this.setState({
                items: items
            });
        }.bind(this));
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    removeItem(key) {
        const firebaseRef = firebase.database().ref('todoApp/items');
        firebaseRef.child(key).remove();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const textValue = e.target.querySelector('input').value;

        if (textValue && textValue.trim().length !== 0) {
            this.firebaseRef.push({
                text: textValue
            });
            this.setState({
                text: ''
            });
        }
    };

    render() {
        return (
            <div>
                <TodoList2 items={ this.state.items } removeItem={ this.removeItem } />
                <form onSubmit={ this.handleSubmit }>
                    <input />
                    <button>{ 'Add #' + (this.state.items.length + 1) }</button>
                </form>
            </div>
        );
    }
}

class App extends Component {
  render() {
    return (
      <div className="App">
          <TodoApp2 />
      </div>
    );
  }
}

export default App;

