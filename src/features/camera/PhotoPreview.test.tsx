import { render, screen } from "@testing-library/react";

import PhotoPreview from "./PhotoPreview";

describe("PhotoPreview", () => {
  const renderPreview = (source: "local" | "remote" | null) =>
    render(
      <PhotoPreview
        src="data:image/png;base64,AAAA"
        source={source}
        onRetake={jest.fn()}
        onVerify={jest.fn()}
      />,
    );

  it("names where the photo came from", () => {
    renderPreview("remote");

    expect(screen.getByText("Preview (remote)")).toBeInTheDocument();
  });

  it("omits the source when it is unknown", () => {
    renderPreview(null);

    expect(screen.getByText("Preview")).toBeInTheDocument();
  });
});
