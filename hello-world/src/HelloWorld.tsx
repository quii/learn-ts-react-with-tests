import React from "react";

const initialHelloState = {name: "world"}
type HelloState = Readonly<typeof initialHelloState>

export class HelloWorld extends React.Component<any, HelloState> {

    readonly state: HelloState = initialHelloState;

    render() {
        return (
            <>
                <input
                    type="text"
                    onChange={data => {
                        return this.setState({name: data.target.value});
                    }}
                />
                <h1>Hello, {this.state.name}</h1>
            </>
        )
    }
}