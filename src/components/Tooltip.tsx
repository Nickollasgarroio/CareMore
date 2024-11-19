import { Tooltip, Button } from "@nextui-org/react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function TooltipComponent({ content, children }: TooltipProps) {
  return (
    <Tooltip content={content}>
      <Button>{children}</Button>
    </Tooltip>
  );
}
