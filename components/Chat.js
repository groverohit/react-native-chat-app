import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";

import { GiftedChat } from "react-native-gifted-chat";
import { color } from "react-native-reanimated";

// import firestore/firebase
const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      loggedInText: "",
    };

    // connect to firestore
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAmKB0gRWp2h2T97NBgaVaPN19Q9gxuZaA",
        authDomain: "react-native-chat-app-rohit.firebaseapp.com",
        databaseURL: "https://react-native-chat-app-rohit.firebaseio.com",
        projectId: "react-native-chat-app-rohit",
        storageBucket: "react-native-chat-app-rohit.appspot.com",
        messagingSenderId: "606586911420",
        appId: "1:606586911420:web:a3c1d5abcc511e65beaeb9",
        measurementId: "G-N1B8LE67W0",
      });
    }
    // reference to messages collection
    this.referenceMessages = firebase.firestore().collection("messages");
  }

  //authenticates the user, sets the state to sned messages and gets past messages
  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        try {
          await firebase.auth().signInAnonymously();
        } catch (error) {
          console.log(`Unable to sign in: ${error.message}`);
        }
      }
      this.setState({
        user: {
          _id: user.uid,
          name: this.props.route.params.name,
          avatar: "https://placeimg.com/140/140/any",
        },
        loggedInText: `${this.props.route.params.name} has entered the chat`,
        messages: [],
      });
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  //Function to sned messages
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
      }
    );
  }

  //Updates the messages in the state from Firestore when called
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // loop through documents
    querySnapshot.forEach((doc) => {
      // get data snapshot
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages,
    });
  };

  //Pushes messages to Firestore database
  addMessages = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      sent: true,
    });
  };

  render() {
    //Get seleceted background color
    let bcolor = this.props.route.params.color;

    //Get selected user name
    let name = this.props.route.params.name;

    //Set title to usernam
    this.props.navigation.setOptions({ title: name });

    return (
      <View
        style={{
          flex: 1,
          //Set background color to selected
          backgroundColor: bcolor,
        }}
      >
        <Text>{this.state.loggedInText}</Text>

        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
        />
      </View>
    );
  }
}
