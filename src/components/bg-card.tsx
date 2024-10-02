/* eslint-disable prettier/prettier */

interface BgCardProps {
  children: React.ReactNode;
}
export const BgCard: React.FC<BgCardProps> = ({ children }) => {
  return (
    <div className="border-2 border-opacity-35 border-zinc-500 rounded-xl p-4">
      {children}
    </div>
  );
};
