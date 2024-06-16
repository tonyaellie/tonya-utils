import type {
  Connection,
  Edge,
  EdgeChange,
  IsValidConnection,
  Node,
  NodeChange,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  OnEdgesChange,
  OnNodesChange,
  // OnSelectionChangeFunc,
  XYPosition,
} from 'reactflow';
import {
  getIncomers,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  getOutgoers,
} from 'reactflow';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { initialEdges, initialNodes } from './initial';
import type {
  InputNodeData,
  NodeData,
  OutputNodeData,
  TransformNodeData,
} from './Nodes';
import { operationNames, operations } from './operations';

import 'reactflow/dist/base.css';

export type RFState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  // selectedNodes: Node<NodeData>[];
  // selectedEdges: Edge[];
  connectingNodeId?: string;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onConnectStart: OnConnectStart;
  onConnectEnd: OnConnectEnd;
  isValidConnection: IsValidConnection;
  screenToFlowPosition?: (position: XYPosition) => XYPosition;
  setScreenToFlowPositionFn: (fn: (position: XYPosition) => XYPosition) => void;
  calculateNodeText: () => void;
  removeNode: (id: string) => void;
  updateInput: (id: string, input: string) => void;
  updateOperation: (id: string, operation: string) => void;
  updateType: (id: string, type: string) => void;
  // onSelectionChange: OnSelectionChangeFunc;
};

export const store = create(
  persist<RFState>(
    (set, get) => ({
      nodes: initialNodes,
      edges: initialEdges,
      // selectedNodes: [],
      // selectedEdges: [],
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

        get().calculateNodeText();
      },
      onConnectStart: (event, params) => {
        if (params.handleType === 'target') return;
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
      calculateNodeText: () => {
        console.log('calculating text');
        const from = get()
          .nodes.map((node) => ({
            ...node,
            parent: getIncomers(node, get().nodes, get().edges)[0],
          }))
          .filter((node) => !node.parent);

        console.log(from.map((node) => node.id));

        const queue: {
          parent: Node<NodeData, string | undefined>;
          node: Node<NodeData, string | undefined>;
        }[] = [];

        from.forEach((node) => {
          set({
            nodes: get().nodes.map((n) => {
              if (n.id === node.id && n.data.type !== 'input') {
                n.data = { ...n.data, text: '' } as NodeData;
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
        });

        while (queue.length > 0) {
          const data = queue.shift();
          if (!data) continue;

          const { parent, node } = data;

          let text: string | undefined = undefined;
          switch (node.data.type) {
            case 'transform':
              if (!operationNames.includes(node.data.operation)) {
                throw new Error('Invalid operation');
              }
              const operation = operations.get(node.data.operation);
              if (!operation) {
                throw new Error('Operation not implemented');
              }

              text = operation(parent.data.text ?? '');

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

        get().calculateNodeText();
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

        get().calculateNodeText();
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

        get().calculateNodeText();
      },
      updateType: (id, type) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id && node.data.type !== type) {
              switch (type) {
                case 'input':
                  set({
                    edges: get().edges.filter((edge) => edge.target !== id),
                  });
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
                  set({
                    edges: get().edges.filter((edge) => edge.source !== id),
                  });
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

        get().calculateNodeText();
      },
      // onSelectionChange: ({ nodes, edges }) => {
      //   set({
      //     selectedNodes: nodes,
      //     selectedEdges: edges,
      //   });
      // },
    }),
    {
      name: 'encoder',
      skipHydration: true,
    }
  )
);
