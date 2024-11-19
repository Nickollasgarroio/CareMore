import { Button } from "@nextui-org/react";

import { BackSVG } from "@/assets/BackSVG.tsx";
import { title, subtitle } from "@/components/primitives";

interface Props {
  size?: number;
  href?: string;
  className?: string;
  titulo?: string;
  subtitulo?: string;
}

export const BackButton: React.FC<Props> = ({
  size,
  className,
  titulo,
  subtitulo,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4 max-w-[400px]">
        <Button
          isIconOnly
          className={className}
          onClick={() => window.history.back()}
        >
          <BackSVG fill="currentColor" size={size} />
        </Button>
        <div className="flex-1 text-center">
          <h1 className={title({ color: "blue" })}>{titulo}</h1>
        </div>
      </div>
      <span className="flex-1 text-center">
        <h1 className={subtitle()}>{subtitulo}</h1>
      </span>
    </div>
  );
};
