import React from "react";

export class HelloWorld extends React.Component<any, {name: string}> {

    constructor(props: any) {
        super(props);
        this.state = {name: "world"}
    }

    render() {
        return (
            <>
                <input
                    type="text"
                    onChange={data => this.setState({name: data.target.value})}
                />
                <h1>Hello, {this.state.name}</h1>
            </>
        )
    }
}