'use client';

// TODO:
// - make edge red if its going to be replaced

import React, { useEffect } from 'react';

import type {
  Connection,
  Edge,
  EdgeChange,
  IsValidConnection,
  Node,
  NodeChange,
  NodeOrigin,
  NodeTypes,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  OnEdgesChange,
  OnNodesChange,
  XYPosition,
} from 'reactflow';
import { getOutgoers } from 'reactflow';
import { ReactFlowProvider } from 'reactflow';
import { useReactFlow } from 'reactflow';
import { applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { Position } from 'reactflow';
import { Handle } from 'reactflow';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  BackgroundVariant,
} from 'reactflow';
import { create } from 'zustand';

import 'reactflow/dist/base.css';

type InputNodeData = {
  type: 'input';
  input: string;
};

type TransformNodeData = {
  type: 'transform';
  operation: 'base64encode' | 'base64decode';
};

type NodeData = InputNodeData | TransformNodeData;

const initialNodes = [
  {
    id: 'input-1',
    type: 'input',
    position: { x: 20, y: 200 },
    data: {
      type: 'input',
      input: 'hello world',
    },
  },
] satisfies Node<NodeData>[];
const initialEdges = [] satisfies Edge[];

type RFState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  connectingNodeId?: string;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onConnectStart: OnConnectStart;
  onConnectEnd: OnConnectEnd;
  isValidConnection: IsValidConnection;
  screenToFlowPosition?: (position: XYPosition) => XYPosition;
  setScreenToFlowPositionFn: (fn: (position: XYPosition) => XYPosition) => void;
  updateInput: (id: string, input: string) => void;
};

const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    const currentEdges = get().edges.filter(
      (edge) => edge.target !== connection.target
    );
    set({
      edges: addEdge(
        {
          ...connection,
          animated: true,
        },
        currentEdges
      ),
    });
  },
  onConnectStart: (event, params) => {
    set({
      connectingNodeId: params.nodeId ?? undefined,
    });
  },
  onConnectEnd: (event) => {
    const { screenToFlowPosition, connectingNodeId } = get();
    if (!screenToFlowPosition || !connectingNodeId) return;

    if (!event.target || !(event.target instanceof Element)) return;

    const targetIsPane = event.target.classList.contains('react-flow__pane');

    if (!targetIsPane) return;

    const id = `transform-${get().nodes.length + 1}-${Date.now()}`;
    if (event instanceof MouseEvent) {
      const newNode = {
        id,
        position: screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        }),
        type: 'transform',
        data: { type: 'transform', operation: 'base64encode' },
      } satisfies Node<NodeData>;

      set({
        nodes: [...get().nodes, newNode],
        edges: [
          ...get().edges,
          {
            id: `e${id}`,
            source: connectingNodeId,
            target: id,
            animated: true,
          },
        ],
        connectingNodeId: undefined,
      });
    }
  },
  isValidConnection: (connection) => {
    const { nodes, edges } = get();
    const target = nodes.find((node) => node.id === connection.target);
    const hasCycle = (node: Node<NodeData>, visited = new Set()) => {
      if (visited.has(node.id)) return false;

      visited.add(node.id);

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true;
        if (hasCycle(outgoer, visited)) return true;
      }
    };
    if (!target || target.id === connection.source) return false;

    return !hasCycle(target);
  },
  setScreenToFlowPositionFn: (fn) => {
    set({
      screenToFlowPosition: fn,
    });
  },
  updateInput: (id, input) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id && node.data.type === 'input') {
          node.data = { ...node.data, input } as InputNodeData;
        }

        return node;
      }),
    });
  },
}));

const InputNode = ({ data, id }: { data: InputNodeData; id: string }) => {
  const { updateInput } = useStore();
  return (
    <div className="rounded-md border-2 border-primary-500 bg-amethyst-1">
      <div className="rounded-t border-b-2 border-primary-500 bg-green-900 px-2 py-1 font-bold">
        Input
      </div>
      <textarea
        id="text"
        className="nodrag mx-4 mb-3 mt-4 h-32 w-96 rounded p-2 focus:outline-none"
        value={data.input}
        onChange={(e) => updateInput(id, e.target.value)}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="h-8 w-4 rounded bg-gray-700"
      />
    </div>
  );
};

const TransformNode = ({ data }: { data: TransformNodeData }) => (
  <div className="rounded-md border-2 border-primary-500 bg-amethyst-1 px-4 py-2">
    <Handle
      type="target"
      position={Position.Left}
      className="h-8 w-4 rounded bg-gray-700"
    />
    <div>This node transforms</div>
    <Handle
      type="source"
      position={Position.Right}
      className="h-8 w-4 rounded bg-gray-700"
    />
  </div>
);

const nodeTypes = {
  input: InputNode,
  transform: TransformNode,
} satisfies NodeTypes;

const nodeOrigin: NodeOrigin = [0, 0.5];

const EncoderInternal = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectStart,
    onConnectEnd,
    isValidConnection,
    setScreenToFlowPositionFn,
  } = useStore();
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    setScreenToFlowPositionFn(screenToFlowPosition);
  }, [screenToFlowPosition, setScreenToFlowPositionFn]);

  return (
    <div className="h-[80vh] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        nodeOrigin={nodeOrigin}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Controls style={{ background: '#FFF' }} />
        <MiniMap maskColor="#888" nodeColor="#fa3aa6" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

const Encoder = () => {
  return (
    <ReactFlowProvider>
      <EncoderInternal />
    </ReactFlowProvider>
  );
};

export default Encoder;
