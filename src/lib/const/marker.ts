export const MARKER_SIZE = 36;

export type MarkerType = {
  width: number;
  height: number;
  yOffset: number;
  xOffset: number;
};

export const MARKER = {
  SUMMIT: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    yOffset: MARKER_SIZE * 0,
    xOffset: 0
  },
  WATER: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    yOffset: MARKER_SIZE * 1,
    xOffset: 0
  },
  CHECKPOINT: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    yOffset: MARKER_SIZE * 2,
    xOffset: 0
  },
  START_END_POINT: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    yOffset: MARKER_SIZE * 3,
    xOffset: 0
  }
};