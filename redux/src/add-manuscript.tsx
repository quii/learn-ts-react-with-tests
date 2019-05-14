import React from "react";

export const AddManuscript = () => {
    return <>
        <h2>Add new manuscript</h2>
        <label htmlFor={"title"}>Title</label>
        <input type={"text"} id={"title"} />
        <label htmlFor={"abstract"}>Abstract</label>
        <input type={"abstract"} id={"abstract"} />
        <button>Add</button>
    </>
}
