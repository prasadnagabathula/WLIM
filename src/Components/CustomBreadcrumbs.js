import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Typography, Box } from '@mui/material';

const CustomBreadcrumbs = ({ paths, isDrawerOpen, currentPath }) => {

    const [marginLeft, setMarginLeft] = useState(100);
  
    useEffect(() => {
      setMarginLeft(isDrawerOpen ? 250 : 0);
    }, [isDrawerOpen]);

    return (
        <Box sx={{ ml: `${marginLeft}px`, transition: 'margin-left 0.3s'}}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                {paths.map((path, index) => {
                const isNonClickable = ['User', 'Admin'].includes(path.label);

                return isNonClickable ? (
                    <Typography
                    key={index}
                    style={{
                        color: '#666', 
                        fontFamily: 'Lato',
                        fontSize: '20px',
                    }}
                    >
                    {path.label}
                    </Typography>
                ) : (
                    <Link
                    key={index}
                    to={path.link}
                    style={{
                        textDecoration: 'none',
                        color: path.link === currentPath ? '#00aae7' : 'inherit',
                        fontFamily: 'Lato',
                        fontSize: '20px',
                    }}
                    >
                    {path.label}
                    </Link>
                );
                })}
            </Breadcrumbs>
            {/* <Breadcrumbs separator="›" aria-label="breadcrumb">
                {paths.map((path, index) => (
                    <Typography
                        key={index}
                        component={path.link ? Link : 'span'} 
                        to={path.link}
                        sx={{fontSize:{xs:'14px', sm:'14px', md:'20px'}}}
                        style={{
                            textDecoration: 'none',
                            color: path.link === currentPath ? '#00aae7' : 'inherit', 
                            pointerEvents: path.link === currentPath ? 'none' : 'auto', 
                            fontFamily: 'Lato',
                            
                        }}
                    >
                        {path.label}
                    </Typography>
                ))}
            </Breadcrumbs> */}
      </Box>
        
    );
};

export default CustomBreadcrumbs;
