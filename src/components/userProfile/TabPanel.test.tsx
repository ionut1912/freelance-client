import { render, screen } from "@testing-library/react";

import TabPanel from "../../components/userProfile/TabPanel";

it("renders content only for the selected index", () => {
  const { rerender } = render(
    <TabPanel value={0} index={0}>
      content
    </TabPanel>,
  );
  expect(screen.getByRole("tabpanel")).toHaveTextContent("content");
  rerender(
    <TabPanel value={1} index={0}>
      content
    </TabPanel>,
  );
  expect(screen.queryByText("content")).not.toBeInTheDocument();
});

it("is hidden, and linked to its tab, when not selected", () => {
  render(
    <TabPanel value={0} index={2}>
      content
    </TabPanel>,
  );
  const panel = screen.getByRole("tabpanel", { hidden: true });

  expect(panel).not.toBeVisible();
  expect(panel).toHaveAttribute("aria-labelledby", "simple-tab-2");
  expect(panel).toBeEmptyDOMElement();
});
