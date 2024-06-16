import type { Edge, Node } from 'reactflow';

import type { NodeData } from './Nodes';

export const initialNodes = [
  {
    id: 'input-1',
    type: 'input',
    position: { x: 20, y: 200 },
    data: {
      type: 'input',
      text: 'Type text here!',
    },
  },
  {
    id: 'transform-1',
    type: 'transform',
    position: { x: 520, y: 200 },
    data: {
      type: 'transform',
      operation: 'base64_encode',
    },
  },
  {
    id: 'transform-2',
    type: 'transform',
    position: { x: 520, y: 400 },
    data: {
      type: 'transform',
      operation: 'base64_decode',
    },
  },
  {
    id: 'output-1',
    type: 'output',
    position: { x: 1120, y: 200 },
    data: {
      type: 'output',
    },
  },
  {
    id: 'output-2',
    type: 'output',
    position: { x: 1120, y: 400 },
    data: {
      type: 'output',
    },
  },
] satisfies Node<NodeData>[];
export const initialEdges = [
  {
    id: 'e-1',
    source: 'input-1',
    target: 'transform-1',
    animated: true,
  },
  {
    id: 'e-2',
    source: 'transform-1',
    target: 'output-1',
    animated: true,
  },
  {
    id: 'e-3',
    source: 'transform-1',
    target: 'transform-2',
    animated: true,
  },
  {
    id: 'e-4',
    source: 'transform-2',
    target: 'output-2',
    animated: true,
  },
] satisfies Edge[];
