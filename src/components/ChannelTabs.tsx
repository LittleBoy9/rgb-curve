import { memo, useState, useCallback, CSSProperties } from 'react';
import { Channel, TabsStyle } from '../types';
import { CHANNELS, CHANNEL_INFO } from '../utils/curve';
import { DEFAULT_STYLES, CHANNEL_COLORS } from '../utils/constants';

interface ChannelTabsProps {
  activeChannel: Channel;
  onChange: (channel: Channel) => void;
  style?: TabsStyle;
  disabled?: boolean;
}

export const ChannelTabs = memo(function ChannelTabs({
  activeChannel,
  onChange,
  style,
  disabled = false,
}: ChannelTabsProps) {
  const [hoveredChannel, setHoveredChannel] = useState<Channel | null>(null);

  const mergedStyle = {
    ...DEFAULT_STYLES.tabs,
    ...style,
    tab: {
      ...DEFAULT_STYLES.tabs.tab,
      ...style?.tab,
    },
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: mergedStyle.gap,
    padding: '4px',
    backgroundColor: mergedStyle.background,
    borderRadius: mergedStyle.borderRadius,
  };

  const getTabStyle = useCallback(
    (channel: Channel): CSSProperties => {
      const isActive = channel === activeChannel;
      const isHovered = channel === hoveredChannel;
      const tab = mergedStyle.tab!;

      return {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: tab.padding,
        borderRadius: tab.borderRadius,
        fontSize: tab.fontSize,
        fontWeight: tab.fontWeight,
        color: isActive ? tab.activeColor : tab.color,
        backgroundColor: isActive
          ? tab.activeBackground
          : isHovered
          ? tab.hoverBackground
          : tab.background,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
      };
    },
    [activeChannel, hoveredChannel, mergedStyle.tab, disabled]
  );

  const getIndicatorStyle = (channel: Channel): CSSProperties => {
    const color = CHANNEL_COLORS[channel];
    const isActive = channel === activeChannel;

    return {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: color,
      boxShadow: isActive ? `0 0 6px ${color}` : 'none',
      transition: 'box-shadow 0.15s ease',
    };
  };

  const handleClick = useCallback(
    (channel: Channel) => {
      if (!disabled) {
        onChange(channel);
      }
    },
    [disabled, onChange]
  );

  return (
    <div style={containerStyle} role="tablist">
      {CHANNELS.map((channel) => (
        <button
          key={channel}
          role="tab"
          aria-selected={channel === activeChannel}
          aria-disabled={disabled}
          style={getTabStyle(channel)}
          onClick={() => handleClick(channel)}
          onMouseEnter={() => setHoveredChannel(channel)}
          onMouseLeave={() => setHoveredChannel(null)}
        >
          <span style={getIndicatorStyle(channel)} />
          <span>{CHANNEL_INFO[channel].label}</span>
        </button>
      ))}
    </div>
  );
});
