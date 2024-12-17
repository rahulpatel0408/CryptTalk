import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import React from "react";
import { tranformImage } from "../../lib/features";
//todo transform
const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction={"row"} spacing={0.5} sx={{}}>
      <AvatarGroup
        max={max}
        sx={{
          position: "relative",
        }}
      >
        <Box width={"5rem"} height={"3rem"}  >
          {avatar.map((i, index) => (
            <Avatar
              key={Math.random() * 100}
              src={tranformImage(i)}
              alt={`Avatar ${index}`}
              sx={{
                border: "2px solid #000",
                width: "3rem",
                height: "3rem",
                position: "absolute",
                left: {
                  xs: `${0.5 + index}rem`,
                  sm: `${index}rem`,
                },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
