import React, {useState} from "react";
import {InlineEditableTextfield} from "@atlaskit/inline-edit";

export default function InlineEditableText({text}) {
    const [editValue, setEditValue] = useState(text);
    return (
        <InlineEditableTextfield
            onConfirm={value => setEditValue(value)}
            placeholder={editValue}
            defaultValue={editValue}
            startWithEditViewOpen
        />
    );
}