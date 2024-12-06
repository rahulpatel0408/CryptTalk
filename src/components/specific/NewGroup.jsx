import { useInputValidation } from '6pp'
import { Stack, Dialog, DialogTitle, TextField, Typography } from '@mui/material';
import React from 'react'


const NewGroup = () => {
    const groupname = useInputValidation("");

  return (
    <Dialog open>
        <Stack>
            <DialogTitle> New Group</DialogTitle>
            <TextField/>
            <Typography>Members</Typography>
            <Stack></Stack>

        </Stack>

    </Dialog>
  )
}

export default NewGroup