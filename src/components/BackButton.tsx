import { Button, Divider, Spacer } from "@nextui-org/react";

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
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative flex items-center w-full max-w-[400px]">
        {/* Botão no canto esquerdo */}
        <div className="absolute left-0">
          <Button isIconOnly onClick={() => window.history.back()}>
            <BackSVG fill="currentColor" size={size} />
          </Button>
        </div>

        {/* Título centralizado */}
        <div className="flex-1 text-center">
          <h1 className={title({ color: "blue" })}>{titulo}</h1>
        </div>
      </div>
      {/* <Spacer y={2} /> */}

      {/* Subtítulo centralizado */}
      <div className="w-full text-center mt-2">
        <h2 className={subtitle()}>{subtitulo}</h2>
      </div>
      <Divider className="w-2/3 max-w-[300px] " />
      <Spacer y={8} />
    </div>
  );
};
