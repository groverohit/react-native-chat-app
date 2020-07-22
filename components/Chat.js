import React from "react";
import { Text, View } from "react-native";

export default class Chat extends React.Component {
  render() {
    //store the background color to use
    let color = this.props.route.params.color;

    //store the title to use
    let name = this.props.route.params.name;

    //sets the title
    this.props.navigation.setOptions({ title: name });

    return (
      <View
        style={{
          backgroundColor: color,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "red" }}>This is the Chat Screen</Text>
      </View>
    );
  }
}
