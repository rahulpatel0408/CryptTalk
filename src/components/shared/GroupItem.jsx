import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Divider, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";

const GroupItem = memo(({
    group,
    chatId,
    sameGroup,
}) => {
    
    const { name, avatar, _id } = group;
    return (
        <Link
            sx={{
                padding: "0",
            }}
            to={`/groups/?group=${_id}`}
            onClick={(e)=>{
                if(chatId===_id) e.preventDefault();
            }}
        >
            <Box
                sx={{
                    alignItems: "center",
                    justifyContent: 'center',
                    display: "flex",
                    alignItems: "center",
                    // backgroundColor: "#ffffff",
                    gap: "1rem",
                    position: "relative",
                    "&:hover": {
                        backgroundColor: "#ffffff",
                    }
                }}>
                <Box
                    sx={{
                        alignItems: "center",
                        justifyContent: 'center',
                        display: "flex",
                        alignItems: "center",
                        padding: "1rem",
                        margin: '5px',
                        width: "100%",
                        backgroundColor: sameGroup ? "#555555" : "#ffffff",
                        color: sameGroup ? "white" : "#333333",
                        gap: "1rem",
                        position: "relative",
                        borderRadius: '25px',
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                            transform: 'scale(1.02)',
                            backgroundColor: sameGroup ? "#333333" : "#efefef",
                        },
                    }}
                >
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: 'center',

                    }}>

                        <AvatarCard avatar={avatar} />
                        <Stack>
                            <Typography>{name}</Typography>
                        </Stack>
                    </Box>
                </Box>
            </Box>
            <Divider variant="middle" flexItem></Divider>
        </Link>
    );
});

export default memo(GroupItem);
