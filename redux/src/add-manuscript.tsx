import React, {FC, useState} from "react";
import {createManuscript} from "./actions";
import {connect} from "react-redux";
import {Dispatch} from "redux";

const defaultProps = {
    add: (title: string, abtract: string) => {}
}
type AddManuscriptProps = Readonly<typeof defaultProps>

const AddManuscript: FC<AddManuscriptProps> = (props) => {
    const [title, setTitle] = useState('')
    const [abstract, setAbstract] = useState('')
    return <>
        <h2>Add new manuscript</h2>
        <label htmlFor={"title"}>Title</label>
        <input type={"text"} id={"title"} onChange={e => setTitle(e.target.value)} />
        <label htmlFor={"abstract"}>Abstract</label>
        <input type={"abstract"} id={"abstract"} onChange={e => setAbstract(e.target.value)} />
        <button onClick={() => props.add(title, abstract)}>Add</button>
    </>
}

AddManuscript.defaultProps = defaultProps

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        add: (title: string, abstract: string) => dispatch(createManuscript({title, abstract})),
    }
}

export default connect(null, mapDispatchToProps)(AddManuscript)