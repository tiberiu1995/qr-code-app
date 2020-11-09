import React from 'react';
import { Close } from '@material-ui/icons';
import { Box } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Typography } from '@material-ui/core';

const FileInput = ({source, onChange, onClick, deleteImg}) => {

    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        position="relative" 
        style={{ width: 210 }}
        className="box-input-file row bg-white">
        <img alt=""
          src={source}
          style={{ width: 100, minHeight: 20, margin: 'auto'}}
        />
        <Close style={{position: 'absolute', right: 54, background: 'white'}} onClick={deleteImg} />
        <Box 
          display="flex" 
          flexDirection="column" 
          style={{
            width: 133
            }} 
          position="relative"
          my={1}
          mx="auto">
          <Button variant="contained" color="primary"><Typography>Choose file</Typography></Button>
          <input 
            className="upload mx-auto"
            type="file"
            style={{
              position: 'absolute', 
              height: '100%',
              cursor: 'pointer',
              width: 'inherit',
              opacity: 0,
              overflow: 'hidden'}}
            onChange={(e) => onChange(e)}
          />
        </Box>
        <a onClick={(e) => onClick(e.target.id)} />
      </Box>
    )
}


export default FileInput;


