import { Tooltip } from "../../tooltip";
import DefaultTipIcon, { DefaultTipIconProps } from "../Icons/DefaultTipIcon";

export interface LabelWithTooltipProps {
  label: React.ReactNode;
  tooltip?: {
    content: React.ReactNode;
    defaultIconProps?: DefaultTipIconProps;
    Icon?: React.ReactNode;
    tooltipProps?: Record<string, unknown>;
  };
}

const LabelWithTooltip = ({ label, tooltip }: LabelWithTooltipProps) => {
  if (!tooltip) return <>{label}</>;

  const { content, defaultIconProps, Icon, tooltipProps } = tooltip;

  return (
    <>
      {label}
      <Tooltip content={content} {...tooltipProps}>
        {Icon ? (
          Icon
        ) : (
          <button>
            <DefaultTipIcon {...defaultIconProps} />
          </button>
        )}
      </Tooltip>
    </>
  );
};

export default LabelWithTooltip;
