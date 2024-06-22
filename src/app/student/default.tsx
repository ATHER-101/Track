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
        <Toolbar sx={{bgcolor:"#0288d1"}}>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1,my:1}}>
            {session ? session?.user?.name : "User Name"}
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#f8f8f8",
              color: "black",
              "&:hover": {
                backgroundColor: "#f4f1f1",
              },
            }}
            href="/api/auth/signout?callbackUrl=/"
          >
            LogOut
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
