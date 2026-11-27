import { render, screen } from "@testing-library/react";

import { profile } from "../../testUtils";

import UserAvatar from "./UserAvatar";

it("shows the profile image", () => {
  render(<UserAvatar profile={profile() as never} alt="me" />);
  expect(screen.getByAltText("me")).toHaveAttribute(
    "src",
    "data:image/png;base64,AAAA",
  );
});

it("falls back to an icon when the profile has no image", () => {
  render(<UserAvatar profile={profile({ image: "" }) as never} />);

  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.getByTestId("PersonIcon")).toBeInTheDocument();
});
