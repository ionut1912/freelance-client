import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router";

import type { UserRole } from "../../models/UserProfile";
import { routesLinks } from "../../routes/index";
import type { AppDispatch } from "../../store";
import { setRole } from "../../store/auth/slice";

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("Client");
  const dispatch = useDispatch<AppDispatch>();
  const roles = [
    {
      value: "Client" as const,
      icon: "👔",
      label: "I'm a client, hiring for a project",
    },
    {
      value: "Freelancer" as const,
      icon: "💻",
      label: "I'm a freelancer, looking for work",
    },
  ];

  const choose = useCallback((newRole: UserRole) => {
    setSelectedRole(newRole);
  }, []);
  const setUserRole = () => {
    dispatch(setRole(selectedRole));
  };

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen px-4">
      <RadioGroup
        value={selectedRole}
        onChange={(e) => choose(e.target.value as UserRole)}
      >
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ maxWidth: 700, mx: "auto" }}
        >
          {roles.map(({ value, icon, label }) => (
            <Grid key={value} size={{ xs: 12, sm: 6 }}>
              <Card
                className={`w-full h-full shadow-lg ${
                  selectedRole === value ? "border-2 border-blue-500" : ""
                }`}
              >
                <CardActionArea onClick={() => choose(value)}>
                  <FormControlLabel
                    value={value}
                    control={<Radio sx={{ display: "none" }} />}
                    label={
                      <CardContent className="flex flex-col items-center py-8">
                        <span className="text-4xl mb-4">{icon}</span>
                        <Typography
                          variant="h6"
                          align="center"
                          className="font-semibold"
                        >
                          {label}
                        </Typography>
                      </CardContent>
                    }
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>

      <Box className="w-full max-w-sm flex flex-col items-center mt-10">
        <Button
          component={Link}
          onClick={setUserRole}
          to={routesLinks.register}
          variant="contained"
          size="large"
          className="w-full"
          sx={{ textTransform: "none", py: 1.5 }}
        >
          Join as {selectedRole}
        </Button>
        <Typography variant="body2" className="text-center mt-3">
          <Link to={routesLinks.login} className="text-gray-700">
            Already have an account?{" "}
            <span className="text-green-600">Log In</span>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RoleSelection;
