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
  
  // Clean, minimal styling without borders
  const getBackgroundClass = () => {
    if (!isCurrentMonth) return 'bg-muted/10 opacity-50';
    if (isSelected) return 'bg-blue-100 dark:bg-blue-900/30';
    if (hasTrading) {
      if (isPositive) return 'bg-green-100 dark:bg-green-900/30';
      if (isNegative) return 'bg-red-100 dark:bg-red-900/30';
    }
    return 'bg-muted/20 hover:bg-muted/30';
  };
  
  const getTextColor = () => {
    if (!isCurrentMonth) return 'text-muted-foreground';
    if (isSelected) return 'text-blue-900 dark:text-blue-100';
    if (hasTrading) {
      if (isPositive) return 'text-green-900 dark:text-green-100';
      if (isNegative) return 'text-red-900 dark:text-red-100';
    }
    return 'text-foreground';
  };
  
  return (
    <button
      onClick={onClick}
      disabled={!isCurrentMonth}
      className={`
        relative p-3 text-sm rounded-lg transition-all duration-200 min-h-[80px]
        flex flex-col justify-between
        ${getBackgroundClass()}
        ${getTextColor()}
        ${isCurrentMonth ? 'cursor-pointer' : 'cursor-not-allowed'}
        ${isToday ? 'ring-1 ring-primary/50' : ''}
      `}
    >
      <div className="font-semibold text-base">{date.getDate()}</div>
      
      {hasTrading && isCurrentMonth ? (
        <div className="w-full">
          <div className="text-sm font-medium text-center mb-1">
            {isPositive ? '+' : isNegative ? '-' : ''}${Math.abs(totalProfit).toFixed(0)}
          </div>
          <div className="text-xs opacity-70 text-center">
            {sessionCount} trade{sessionCount > 1 ? 's' : ''}
          </div>
        </div>
      ) : isCurrentMonth ? (
        <div className="w-full text-center">
          <div className="text-xs opacity-50">
            No trades
          </div>
        </div>
      ) : null}
    </button>
  );
}