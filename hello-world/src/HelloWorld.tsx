import React, {FC, useState} from "react";

const initialHelloProps = {name: "world"};
type HelloProps = Readonly<typeof initialHelloProps>

export const HelloWorld: FC = () => {
    const [state, setState] = useState<HelloProps>(initialHelloProps);
    return <>
        <input
            type="text"
            onChange={data => setState({name: data.target.value})}
        />
        <h1>Hello, {state.name}</h1>
    </>
}