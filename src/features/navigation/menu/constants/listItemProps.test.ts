import { listItemPrimaryTypographyProps } from "./listItemProps";

it("truncates long labels on one line", () => {
  expect(listItemPrimaryTypographyProps.sx).toMatchObject({
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  });
});
