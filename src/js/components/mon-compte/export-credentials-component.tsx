import React, { useState } from "react";
import { Typography, Grid as Grid_v4, Select, MenuItem } from "@mui/material";
import { ExportFileButton, CopyButton } from "js/components/commons/buttons";

//This won't work but we just want it to compile for now and remove all the js directory later.
const Grid: any = Grid_v4;

const ExportCredentialsField: React.FC<{
    text: string;
    credentials: any;
    exportTypes: {
        id: string;
        label: string;
        text(c: any): string;
        fileName: string;
    }[];
}> = ({ credentials, exportTypes, text }) => {
    const [exportTypeId, changeExportType] = useState(exportTypes[0].id);
    const exportType = exportTypes.find(type => type.id === exportTypeId)!;

    const handleChange = (e: any) => changeExportType(e.target.value);
    return (
        <React.Fragment>
            <Grid container direction="row" justify="space-between" alignItems="baseline">
                <Grid item container xs={10} justify="flex-start">
                    <Grid item xs={7}>
                        <Typography variant="body1">{text}</Typography>
                    </Grid>
                    <Grid item>
                        <Select
                            style={{ minWidth: 240 }}
                            value={exportTypeId}
                            onChange={handleChange}
                        >
                            {exportTypes.map(({ id, label }, i) => (
                                //@ts-ignore
                                <MenuItem key={i} variant="body1" value={id}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>
                <Grid item container xs={2} justify="flex-end">
                    <Grid item>
                        <ExportFileButton
                            fileName={exportType.fileName}
                            content={exportType.text(credentials)}
                        />
                    </Grid>
                    <Grid item>
                        <CopyButton content={exportType.text(credentials)} />
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default ExportCredentialsField;
