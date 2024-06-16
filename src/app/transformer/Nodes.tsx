import type { NodeOrigin, NodeProps, NodeTypes } from 'reactflow';
import { Position, Handle } from 'reactflow';

import { operationNames } from './operations';
import { store } from './store';

export type InputNodeData = {
  type: 'input';
  text: string;
};

export type TransformNodeData = {
  type: 'transform';
  operation: (typeof operationNames)[number];
  text?: string;
};

export type OutputNodeData = {
  type: 'output';
  text?: string;
};

export type NodeData = InputNodeData | TransformNodeData | OutputNodeData;

export const SelectNodeType = ({ type, id }: { type: string; id: string }) => {
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

export const RemoveNodeButton = ({ id }: { id: string }) => {
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

export const InputNode = ({ data, id }: NodeProps<InputNodeData>) => {
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

export const TransformNode = ({ data, id }: NodeProps<TransformNodeData>) => {
  const { updateOperation } = store();

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
            {operationNames.map((operation) => (
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

export const OutputNode = ({ data, id }: NodeProps<OutputNodeData>) => {
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

export const nodeTypes = {
  input: InputNode,
  transform: TransformNode,
  output: OutputNode,
} satisfies NodeTypes;

export const nodeOrigin: NodeOrigin = [0, 0.5];
