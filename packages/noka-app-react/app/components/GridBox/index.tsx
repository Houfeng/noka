import { Box, SxProps, Theme } from "@mui/material";
import React, { ReactNode, useLayoutEffect, useRef, useState } from "react";

export type GridBoxPros = {
  children: ReactNode;
  size: [number, number];
  sx?: SxProps<Theme>;
};

type DOMElement = HTMLElement | SVGElement;

export function bindResizeHandler(
  element: DOMElement | DOMElement[] | null,
  handler: (() => void) | null,
) {
  if (!element || !handler) return () => {};
  if (typeof ResizeObserver === "undefined") return () => {};
  const elements = Array.isArray(element) ? element : [element];
  const validElements = elements.filter((it) => !!it);
  if (validElements.length < 1) return () => {};
  const observer = new ResizeObserver(handler);
  validElements.forEach((item) => observer.observe(item));
  return () => observer.disconnect();
}

export function GridBox(props: GridBoxPros) {
  const ref = useRef<HTMLDivElement>();
  const { children, size, sx } = props;
  const [[colWidth, rowHeight], setState] = useState<[number, number]>([0, 0]);
  useLayoutEffect(() => {
    if (!ref.current) return;
    return bindResizeHandler(ref.current, () => {
      if (!ref.current) return;
      const { clientWidth } = ref.current;
      const columns = Math.ceil(clientWidth / size[0]);
      const colWidth = clientWidth / columns;
      setState([colWidth, size[1] || colWidth]);
    });
  }, []);
  return (
    <Box
      component="div"
      ref={ref}
      sx={{
        ...sx,
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit,${colWidth}px)`,
        gridTemplateRows: `repeat(auto-fit, ${rowHeight}px)`,
        "&>*": { width: `${colWidth}px`, height: `${rowHeight}px` },
      }}
    >
      {children}
    </Box>
  );
}
