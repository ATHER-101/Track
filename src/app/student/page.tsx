import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(options);
  if (!session || session?.user?.role != "student") {
    redirect("/signIn");
  }

  console.log(session?.user);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{bgcolor:"white" , color:"#2F4040"}}>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1 }}
          >
            <Avatar
              alt={session ? session?.user?.name : "User Name"}
              src="/static/images/avatar/1.jpg"
            />
          </IconButton>
          <Box sx={{ flexGrow: 1 ,my:1}}> 
            <Typography variant="body1" component="div" sx={{p:0}}>
            {session ? session?.user?.name : "User Name"}
          </Typography>
            <Typography variant="body2" component="div" sx={{p:0}}>
            {session ? capitalizeString(session?.user?.role) : "Role"}
          </Typography>
          </Box>
         
          <Button
            variant="outlined"
            href="/api/auth/signout?callbackUrl=/"
          >
            LogOut
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function capitalizeString(str:string) {
  return str.length > 0 ? str[0].toUpperCase() + str.slice(1) : str;
}
