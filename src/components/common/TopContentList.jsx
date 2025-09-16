import React from 'react';
import { Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';

// items = [{id, title, views, readers, avg}]
const TopContentList = ({ title, items }) => {
  return (
    <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
        <List>
            {items.map((item, index) => (
                <React.Fragment key={item.id}>
                    <ListItem disablePadding>
                        <ListItemText 
                            primary={`${index + 1}. ${item.title}`}
                            // === THE FIX IS HERE ===
                            // We now check if views and readers exist before trying to display them.
                            secondary={
                                (item.views && item.readers) ? (
                                    <Typography component="span" variant="body2" color="text.secondary">
                                        {`${item.views.toLocaleString()} Views • ${item.readers.toLocaleString()} Readers`}
                                    </Typography>
                                ) : null
                            }
                        />
                    </ListItem>
                    {index < items.length - 1 && <Divider component="li" sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />}
                </React.Fragment>
            ))}
        </List>
    </Box>
  );
};

export default TopContentList;