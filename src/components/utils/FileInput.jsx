import React from 'react';
import { Close } from '@material-ui/icons';

const FileInput = ({source, onChange, onClick, deleteImg}) => {

    return (
      <>
        <div className="box-input-file row mx-0 bg-white">
        <input 
            style={{position: 'absolute', width: '100%', height: '100%', opacity: 0.0}}
          className="upload mx-auto"
          type="file"
          onChange={(e) => onChange(e)}
        />
        <img alt=""
          src={source}
          style={{ width: 133, height: 100 }}
        />
        <a onClick={(e) => onClick(e.target.id)} />
      </div>
       <Close style={{position: 'absolute', right: 0}} onClick={deleteImg} />
       </>
    )
}


export default FileInput;


