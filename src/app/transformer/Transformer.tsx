'use client';

// TODO:
// - [ ] make edge red if its going to be replaced
// - [ ] in certain cases, the node text is not updated correctly (put a transform node after an input node then a output and then move the input to point to the output)
// - [ ] improve efficiency of calculateNodeText and the calls to it
// - [ ] add more operations
// - [x] remove weird outline around input and output nodes
// - [ ] add import/export

import React, { useEffect, useState } from 'react';

import type {
  Connection,
  Edge,
  EdgeChange,
  IsValidConnection,
  Node,
  NodeChange,
  NodeOrigin,
  NodeProps,
  NodeTypes,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  OnEdgesChange,
  OnNodesChange,
  XYPosition,
} from 'reactflow';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  BackgroundVariant,
  ControlButton,
  getIncomers,
  getOutgoers,
  ReactFlowProvider,
  useReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  Position,
  Handle,
} from 'reactflow';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import 'reactflow/dist/base.css';

type InputNodeData = {
  type: 'input';
  text: string;
};

const operations = [
  'base64_encode',
  'base64_decode',
  'binary_encode_ascii',
  'binary_decode_ascii',
  'binary_encode',
  'binary_decode',
] as const;

type TransformNodeData = {
  type: 'transform';
  operation: (typeof operations)[number];
  text?: string;
};

type OutputNodeData = {
  type: 'output';
  text?: string;
};

type NodeData = InputNodeData | TransformNodeData | OutputNodeData;

const initialNodes = [
  {
    id: 'input-1',
    type: 'input',
    position: { x: 20, y: 200 },
    data: {
      type: 'input',
      text: '',
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
  calculateNodeText: (fromNodeId?: string, includeRoot?: true) => void;
  removeNode: (id: string) => void;
  updateInput: (id: string, input: string) => void;
  updateOperation: (id: string, operation: string) => void;
  updateType: (id: string, type: string) => void;
};

const store = create(
  persist<RFState>(
    (set, get) => ({
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

        get().calculateNodeText(
          get().nodes.find((node) => node.id === connection.source)?.id
        );
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

        const targetIsPane =
          event.target.classList.contains('react-flow__pane');

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
            data: { type: 'transform', operation: 'base64_encode' },
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
      calculateNodeText: (fromNodeId, includeRoot) => {
        const from = fromNodeId
          ? get().nodes.filter((node) => node.id === fromNodeId)
          : get().nodes.filter((node) => node.data.type !== 'input');
        const queue: {
          parent: Node<NodeData, string | undefined>;
          node: Node<NodeData, string | undefined>;
        }[] = [];

        if (includeRoot) {
          from.forEach((node) => {
            queue.push({
              parent: getIncomers(node, get().nodes, get().edges)[0] ?? node,
              node,
            });
          });
        } else {
          from.forEach((node) => {
            getOutgoers(node, get().nodes, get().edges).forEach((outgoer) => {
              queue.push({
                parent: node,
                node: outgoer,
              });
            });
          });
        }

        while (queue.length > 0) {
          const data = queue.shift();
          if (!data) continue;

          const { parent, node } = data;

          let text: string | undefined = undefined;
          switch (node.data.type) {
            case 'transform':
              switch (node.data.operation) {
                case 'base64_encode':
                  text =
                    parent.data.text &&
                    Buffer.from(parent.data.text).toString('base64');
                  break;
                case 'base64_decode':
                  text =
                    parent.data.text &&
                    Buffer.from(parent.data.text, 'base64').toString();
                  break;
                case 'binary_encode_ascii':
                  text =
                    parent.data.text &&
                    parent.data.text
                      .split('')
                      .map((char) => {
                        const charCode = char.charCodeAt(0);
                        return charCode.toString(2).padStart(8, '0');
                      })
                      .join(' ');
                  break;
                case 'binary_decode_ascii':
                  text =
                    parent.data.text &&
                    parent.data.text
                      .split(' ')
                      .map((char) => {
                        const charCode = parseInt(char, 2);
                        return String.fromCharCode(charCode);
                      })
                      .join('');
                  break;
                // TODO: support newlines better
                case 'binary_encode':
                  text =
                    parent.data.text &&
                    parent.data.text
                      .split('')
                      .map((char) => char.replace(/\n/g, ' '))
                      .filter((char) => char.match(/[0-9 ]/))
                      .join('')
                      .split(' ')
                      .map((number) => {
                        return (Number(number) >> 0).toString(2);
                      })
                      .join(' ');
                  break;
                case 'binary_decode':
                  text =
                    parent.data.text &&
                    parent.data.text
                      .split('')
                      .map((char) => char.replace(/\n/g, ' '))
                      .filter((char) => char.match(/[0-1 ]/))
                      .join('')
                      .split(' ')
                      .map((binary) => {
                        return parseInt(binary, 2);
                      })
                      .join(' ');
                  break;
                default:
                  throw new Error('Invalid operation');
              }
              break;
            case 'output':
              text = parent.data.text;
              break;
          }

          set({
            nodes: get().nodes.map((n) => {
              if (n.id === node.id) {
                n.data = { ...n.data, text } as NodeData;
              }

              return n;
            }),
          });

          getOutgoers(node, get().nodes, get().edges).forEach((outgoer) => {
            queue.push({
              parent: node,
              node: outgoer,
            });
          });
        }
      },
      removeNode: (id) => {
        const node = get().nodes.find((node) => node.id === id);
        if (!node) return;

        const otherInputNodes = get().nodes;
        if (otherInputNodes.length === 1) return;

        set({
          nodes: get().nodes.filter((node) => node.id !== id),
          edges: get().edges.filter(
            (edge) => edge.source !== id && edge.target !== id
          ),
        });
      },
      updateInput: (id, input) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id && node.data.type === 'input') {
              node.data = { ...node.data, text: input } as InputNodeData;
            }

            return node;
          }),
        });

        get().calculateNodeText(id);
      },
      updateOperation: (id, operation) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id && node.data.type === 'transform') {
              node.data = { ...node.data, operation } as TransformNodeData;
            }

            return node;
          }),
        });

        get().calculateNodeText(id, true);
      },
      updateType: (id, type) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id && node.data.type !== type) {
              switch (type) {
                case 'input':
                  node.type = 'input';
                  node.data = {
                    type: 'input',
                    text: '',
                  } satisfies InputNodeData;
                  break;
                case 'transform':
                  node.type = 'transform';
                  node.data = {
                    type: 'transform',
                    operation: 'base64_encode',
                  } satisfies TransformNodeData;
                  break;
                case 'output':
                  node.type = 'output';
                  node.data = {
                    type: 'output',
                  } satisfies OutputNodeData;
                  break;
              }
            }

            return node;
          }),
        });

        get().calculateNodeText(id, true);
      },
    }),
    {
      name: 'encoder',
      skipHydration: true,
    }
  )
);

const SelectNodeType = ({ type, id }: { type: string; id: string }) => {
  const { updateType } = store();
  return (
    <select
      id="type"
      className="nodrag h-10 w-32 rounded bg-amethyst-2 p-2 focus:outline-none"
      value={type}
      onChange={(e) => updateType(id, e.target.value)}
    >
      <option value="input">Input</option>
      <option value="transform">Transform</option>
      <option value="output">Output</option>
    </select>
  );
};

const RemoveNodeButton = ({ id }: { id: string }) => {
  const { removeNode } = store();
  return (
    <button
      className="nodrag h-10 w-10 rounded bg-red-900 p-2 focus:outline-none"
      onClick={() => removeNode(id)}
    >
      ×
    </button>
  );
};

const InputNode = ({ data, id }: NodeProps<InputNodeData>) => {
  const { updateInput } = store();
  return (
    <div className="rounded-md border-2 border-primary-500 bg-amethyst-1">
      <div className="flex flex-row items-center justify-between rounded-t border-b-2 border-primary-500 bg-green-900 px-2 py-1 font-bold">
        <SelectNodeType type={data.type} id={id} />
        <RemoveNodeButton id={id} />
      </div>
      <textarea
        id="text"
        className="nodrag mx-4 mb-3 mt-4 h-32 w-96 rounded bg-amethyst-2 p-2 focus:outline-none"
        value={data.text}
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

const TransformNode = ({ data, id }: NodeProps<TransformNodeData>) => {
  const { updateOperation } = store();

  useEffect(() => {
    // get parent node text
  }, []);

  return (
    <div className="rounded-md border-2 border-primary-500 bg-amethyst-1">
      <Handle
        type="target"
        position={Position.Left}
        className="h-8 w-4 rounded bg-gray-700"
      />
      <div className="flex flex-row items-center justify-between rounded-t border-b-2 border-primary-500 bg-blue-900 px-2 py-1 font-bold">
        <SelectNodeType type={data.type} id={id} />
        <RemoveNodeButton id={id} />
      </div>
      <div className="m-4 flex flex-col items-center justify-center">
        <div className="flex flex-row items-center justify-center space-x-2">
          <label htmlFor="operation" className="font-bold">
            Operation
          </label>
          <select
            id="operation"
            className="nodrag h-8 w-96 rounded bg-amethyst-2 p-2 focus:outline-none"
            value={data.operation}
            onChange={(e) => updateOperation(id, e.target.value)}
          >
            {operations.map((operation) => (
              <option key={operation} value={operation} className="capitalize">
                {operation.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="h-8 w-4 rounded bg-gray-700"
      />
    </div>
  );
};

const OutputNode = ({ data, id }: NodeProps<OutputNodeData>) => {
  return (
    <div className="rounded-md border-2 border-primary-500 bg-amethyst-1">
      <Handle
        type="target"
        position={Position.Left}
        className="h-8 w-4 rounded bg-gray-700"
      />
      <div className="flex flex-row items-center justify-between rounded-t border-b-2 border-primary-500 bg-red-900 px-2 py-1 font-bold">
        <SelectNodeType type="output" id={id} />
        <RemoveNodeButton id={id} />
      </div>
      <div className="nodrag m-4 flex cursor-text select-text flex-col items-center justify-center">
        {data.text}
      </div>
    </div>
  );
};

const nodeTypes = {
  input: InputNode,
  transform: TransformNode,
  output: OutputNode,
} satisfies NodeTypes;

const nodeOrigin: NodeOrigin = [0, 0.5];

const TransformerInternal = () => {
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
    calculateNodeText,
  } = store();
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
        fitView={true}
      >
        <Controls style={{ background: '#FFF' }}>
          <ControlButton
            onClick={() => calculateNodeText}
            about="recalculates all values"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 30 30"
            >
              <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path>
            </svg>
          </ControlButton>
        </Controls>
        <MiniMap maskColor="#888" nodeColor="#fa3aa6" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

const Transformer = () => {
  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    console.log('attempting to rehydrate');
    store.persist.rehydrate();
    console.log(store.getState());
    setRehydrated(true);
  }, []);

  return (
    <ReactFlowProvider>
      {rehydrated ? (
        <TransformerInternal />
      ) : (
        <div className="flex h-[80vh] w-full items-center justify-center">
          <div className="text-3xl font-bold">Loading...</div>
        </div>
      )}
    </ReactFlowProvider>
  );
};

export default Transformer;
