'use client';

interface DaySummaryProps {
  date: Date;
  sessionCount: number;
  totalProfit: number;
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
}

export function DaySummary({
  date,
  sessionCount,
  totalProfit,
  isSelected,
  isToday,
  isCurrentMonth,
  onClick
}: DaySummaryProps) {
  const isNegative = totalProfit < 0;
  const isPositive = totalProfit > 0;
  const hasTrading = sessionCount > 0;
  
  // Determine background gradient based on profit/loss
  const getBackgroundClass = () => {
    if (!isCurrentMonth) return 'bg-muted/20';
    if (isSelected) return 'bg-blue-500/15 border-blue-500';
    if (hasTrading) {
      if (isPositive) return 'bg-gradient-to-br from-green-500/20 to-green-400/15 border-green-500/40';
      if (isNegative) return 'bg-gradient-to-br from-red-500/20 to-red-400/15 border-red-500/40';
    }
    return 'bg-gradient-to-br from-background to-muted/10 border-border/50';
  };
  
  const getHoverClass = () => {
    if (!isCurrentMonth) return '';
    if (hasTrading) {
      if (isPositive) return 'hover:from-green-500/30 hover:to-green-400/25 hover:border-green-500/60';
      if (isNegative) return 'hover:from-red-500/30 hover:to-red-400/25 hover:border-red-500/60';
    }
    return 'hover:bg-accent/50 hover:border-primary/30';
  };
  
  return (
    <button
      onClick={onClick}
      disabled={!isCurrentMonth}
      className={`
        relative p-3 text-sm rounded-xl border transition-all duration-300 min-h-[90px] group
        flex flex-col justify-between transform hover:scale-105 hover:shadow-lg
        ${getBackgroundClass()}
        ${getHoverClass()}
        ${isCurrentMonth ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}
        ${isToday ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-background' : ''}
        ${isSelected ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-background' : ''}
        ${ 
          isNegative ? 'bg-red-500/20 text-red-700 border border-red-500/30' :
          isPositive ? 'bg-green-500/20 text-green-700 border border-green-500/30' :
          'bg-gray-500/20 text-gray-700 border border-gray-500/30'
        }
      `}
    >
      <div className="font-bold text-lg">{date.getDate()}</div>
      
      {hasTrading && isCurrentMonth ? (
        <div className="w-full space-y-2">
          <div className={`text-sm px-3 py-2 rounded-lg font-bold text-center transform transition-all duration-300 group-hover:scale-110 `}>
            {isPositive ? ' +' : isNegative ? ' -' : ''}${Math.abs(totalProfit).toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground font-medium w-fit">
            {sessionCount} trade{sessionCount > 1 ? 's' : ''} {isPositive ? '🎉' : isNegative ? '💸' : '📊'}
          </div>
        </div>
      ) : isCurrentMonth ? (
        <div className="w-full text-center opacity-60">
          <div className="text-xs text-muted-foreground font-medium">
            No trades 😴
          </div>
        </div>
      ) : null}
    </button>
  );
}