import { Button } from "@nextui-org/react";

import { BackSVG } from "@/assets/BackSVG.tsx";
import { Link } from "react-router-dom";

interface Props {
  fill?: string;
  filled?: boolean;
  size?: number;
  height?: number;
  width?: number;
  label?: string;
  href?: string;
  //   onClick?: () => void;
}
export const BackButton: React.FC<Props> = ({
  fill,
  filled,
  size,
  height,
  width,
  label,
  href,
}) => {
  return (
    // <Link to={href || }>
    <Button isIconOnly onClick={() => window.history.back()}>
      <BackSVG fill="currentColor" size={size} />
    </Button>
  );
};
