import React from "react";
import {Manuscript, ManuscriptStore} from "./redux";
import {connect} from "react-redux";

interface ListManuscriptProps {
    manuscripts: Manuscript[]
}

const ListManuscripts = (props: ListManuscriptProps) => {
    return <>
        <table>
            <thead>
                <th>Title</th>
                <th>Abstract</th>
            </thead>
            <tbody>
            {props.manuscripts.map(m => <><td>{m.title}</td><td>{m.abstract}</td></>)}
            </tbody>
        </table>
    </>
}

ListManuscripts.defaultProps = {manuscripts: []}

const mapStateToProps = (state: ManuscriptStore) => ({
    manuscripts: state.manuscripts
})

export default connect(mapStateToProps)(ListManuscripts)
