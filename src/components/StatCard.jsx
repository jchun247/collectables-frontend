import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const StatCard = ({ title, value, icon, valueColorClass = "text-slate-800 dark:text-slate-100" }) => (
  <Card className="shadow-sm dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
      <CardTitle className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">{title}</CardTitle>
      {icon && <span className="h-4 w-4">{icon}</span>}
    </CardHeader>
    <CardContent className="pb-3 px-4">
      <div className={`text-2xl font-bold ${valueColorClass}`}>
        {value}
      </div>
    </CardContent>
  </Card>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  valueColorClass: PropTypes.string,
};

export default StatCard;
