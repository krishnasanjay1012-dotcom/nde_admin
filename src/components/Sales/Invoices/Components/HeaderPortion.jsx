import { Close } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
import React from 'react'

const HeaderPortion = ({ content, icon, closefunction }) => {
    return (
        <div
            style={{
                height: '65px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                padding: '0 8px'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {icon && icon} 
                <Typography sx={{ fontSize: '22.1px', fontWeight: 400, color: '#000000' }}>
                    {content}
                </Typography>
            </div>

            {closefunction && (
                <IconButton onClick={closefunction} size="small" color='inherit'>
                    <Close />
                </IconButton>
            )}
        </div>
    )
}

export default HeaderPortion
