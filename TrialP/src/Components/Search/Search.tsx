import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import TextField from "@mui/material/TextField/TextField";
import React from "react";

const Search = () => {

    return(<div>
        <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={[]}
            //options={top100Films.map((option) => option.title)}
            renderInput={(params) => <TextField {...params} label="Поиск" />}
        />
    </div>)
}