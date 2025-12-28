import {
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
  CSSProperties,
} from 'react';
import {
  RGBCurveProps,
  RGBCurveRef,
  Channel,
  CurveChangeData,
  ChannelPoints,
  LUTData,
} from '../types';
import { CurveCanvas } from './CurveCanvas';
import { ChannelTabs } from './ChannelTabs';
import { useCurvePoints } from '../hooks/useCurvePoints';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_STYLES } from '../utils/constants';

export const RGBCurve = forwardRef<RGBCurveRef, RGBCurveProps>(
  function RGBCurve(
    {
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT,
      defaultPoints,
      points: controlledPoints,
      defaultChannel = 'master',
      activeChannel: controlledChannel,
      onChange,
      onChannelChange,
      styles = {},
      showTabs = true,
      showHistogram = false,
      histogramData,
      disabled = false,
      className,
      interpolation = 'monotone',
    },
    ref
  ) {
    // Channel state
    const [internalChannel, setInternalChannel] =
      useState<Channel>(defaultChannel);
    const activeChannel = controlledChannel ?? internalChannel;

    // Handle onChange to wrap with channel info
    const handlePointsChange = useCallback(
      (newPoints: ChannelPoints, newLut: LUTData) => {
        if (onChange) {
          const data: CurveChangeData = {
            points: newPoints,
            lut: newLut,
            activeChannel,
          };
          onChange(data);
        }
      },
      [onChange, activeChannel]
    );

    // Curve points state
    const {
      points,
      lut,
      addPoint,
      removePoint,
      updatePoint,
      resetChannel,
      resetAll,
      setAllPoints,
    } = useCurvePoints({
      defaultPoints,
      controlledPoints,
      interpolation,
      onChange: handlePointsChange,
    });

    // Handle channel change
    const handleChannelChange = useCallback(
      (channel: Channel) => {
        if (!controlledChannel) {
          setInternalChannel(channel);
        }
        if (onChannelChange) {
          onChannelChange(channel);
        }
      },
      [controlledChannel, onChannelChange]
    );

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        reset: resetAll,
        resetChannel,
        getLUT: () => lut,
        getPoints: () => points,
        setPoints: setAllPoints,
      }),
      [resetAll, resetChannel, lut, points, setAllPoints]
    );

    // Merge styles
    const mergedStyles = useMemo(() => {
      return {
        container: { ...DEFAULT_STYLES.container, ...styles.container },
        canvasWrapper: {
          ...DEFAULT_STYLES.canvasWrapper,
          ...styles.canvasWrapper,
        },
        grid: { ...DEFAULT_STYLES.grid, ...styles.grid },
        curve: {
          master: { ...DEFAULT_STYLES.curve.master, ...styles.curve?.master },
          red: { ...DEFAULT_STYLES.curve.red, ...styles.curve?.red },
          green: { ...DEFAULT_STYLES.curve.green, ...styles.curve?.green },
          blue: { ...DEFAULT_STYLES.curve.blue, ...styles.curve?.blue },
        },
        controlPoint: {
          ...DEFAULT_STYLES.controlPoint,
          ...styles.controlPoint,
        },
        tabs: {
          ...DEFAULT_STYLES.tabs,
          ...styles.tabs,
          tab: { ...DEFAULT_STYLES.tabs.tab, ...styles.tabs?.tab },
        },
        histogram: { ...DEFAULT_STYLES.histogram, ...styles.histogram },
      };
    }, [styles]);

    // Get current channel's curve style
    const currentCurveStyle = mergedStyles.curve[activeChannel];

    const containerStyle: CSSProperties = {
      ...mergedStyles.container,
      width: 'fit-content',
    };

    return (
      <div style={containerStyle} className={className}>
        {showTabs && (
          <ChannelTabs
            activeChannel={activeChannel}
            onChange={handleChannelChange}
            style={mergedStyles.tabs}
            disabled={disabled}
          />
        )}

        <CurveCanvas
          width={width}
          height={height}
          points={points[activeChannel]}
          channel={activeChannel}
          gridStyle={mergedStyles.grid}
          curveStyle={currentCurveStyle}
          controlPointStyle={mergedStyles.controlPoint}
          histogramStyle={{
            ...mergedStyles.histogram,
            show: showHistogram,
          }}
          histogramData={histogramData}
          wrapperStyle={mergedStyles.canvasWrapper}
          disabled={disabled}
          interpolation={interpolation}
          onAddPoint={addPoint}
          onRemovePoint={removePoint}
          onUpdatePoint={updatePoint}
        />
      </div>
    );
  }
);
