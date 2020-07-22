import React from "react";
import { Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

export default class Chat extends React.Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    this.setState({
      //default messages to load
      messages: [
        {
          _id: 1,
          text: "Hello " + this.props.route.params.name,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: "Normal message",
          createdAt: new Date(),
          user: {
            _id: 3,
            name: "React Native",
            avatar: "https://placeimg.com/141/141/any",
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    //store the background color to use
    let color = this.props.route.params.color;

    //store the title to use
    let name = this.props.route.params.name;

    //sets the title
    //this.props.navigation.setOptions({ title: name });

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }
}
