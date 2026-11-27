import { Container, Grid } from "@mui/material";

import PageHeader from "../../components/ui/PageHeader/PageHeader";

import SalesWidget from "./Widget/sales/SalesWidget";
import StatWidget from "./Widget/stat/StatWidget";
import UsersStatsWidget from "./Widget/user-stats/UsersStatsWidget";
import WelcomeWidget from "./Widget/welcome/WelcomeWidget";

const Dashboard = () => {
  return (
    <Container maxWidth={false}>
      <PageHeader title="Dashboard" />
      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr" },
          gap: 16,
        }}
      >
        <WelcomeWidget
          title="Welcome"
          description="This is an example sentence to welcome a user"
        />
        <WelcomeWidget
          title="Welcome"
          description="This is an example sentence to welcome a user"
        />
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 16,
          mt: 2,
        }}
      >
        <StatWidget
          title="Active users"
          value="12 153"
          footerText="Current Month"
        />
        <StatWidget title="Users" value="19 539" footerText="Current Month" />
        <StatWidget title="Sales" value="1 521" footerText="Current Month" />
        <StatWidget title="Posts" value="126" footerText="Current Month" />
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 16,
          mt: 2,
        }}
      >
        <SalesWidget />
        <UsersStatsWidget />
      </Grid>
    </Container>
  );
};
export default Dashboard;
