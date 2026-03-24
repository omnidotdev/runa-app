import { CheckCircle2Icon } from "lucide-react";

type Props = {
  progressPercentage: number;
  color?: string;
};

const CircularProgress = ({ progressPercentage, color }: Props) => {
  return progressPercentage === 100 ? (
    <CheckCircle2Icon className="size-3.5 text-green-500" />
  ) : (
    <svg className="size-3.5" viewBox="0 0 20 20">
      <title>Circular Progress</title>
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-input"
      />
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${progressPercentage * 0.503} 50.3`}
        transform="rotate(-90 10 10)"
        className="transition-all duration-500"
      />
    </svg>
  );
};

export default CircularProgress;
