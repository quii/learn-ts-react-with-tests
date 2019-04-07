import React, {Component} from "react";

export class HelloWorld extends Component {

    static defaultGreeting = <h1>Hello, world</h1>;

    render() {
        return HelloWorld.defaultGreeting
    }
}