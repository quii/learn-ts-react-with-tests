import React from "react";

export class HelloWorld extends React.Component<any, { name?: string }> {

    render() {
        const name = this.state != null ? this.state.name : "world";
        return (
            <>
                <input
                    type="text"
                    onChange={data => {
                        return this.setState({name: data.target.value});
                    }}
                />
                <h1>Hello, {name}</h1>
            </>
        )
    }
}