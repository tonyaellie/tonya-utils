import { X } from 'lucide-react';
import type { NodeOrigin, NodeProps, NodeTypes } from 'reactflow';
import { Position, Handle } from 'reactflow';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
    <Select value={type} onValueChange={(newValue) => updateType(id, newValue)}>
      <SelectTrigger className="nodrag w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="input">Input</SelectItem>
        <SelectItem value="transform">Transform</SelectItem>
        <SelectItem value="output">Output</SelectItem>
      </SelectContent>
    </Select>
  );
};

export const RemoveNodeButton = ({ id }: { id: string }) => {
  const { removeNode } = store();
  return (
    <Button
      variant="destructive"
      size="icon"
      className="nodrag"
      onClick={() => removeNode(id)}
    >
      <X />
    </Button>
  );
};

export const InputNode = ({ data, id }: NodeProps<InputNodeData>) => {
  const { updateInput } = store();
  return (
    <div className="rounded-md border-2 bg-background">
      <div className="flex flex-row items-center justify-between rounded-t border-b-2 bg-green-900 p-2 font-bold">
        <SelectNodeType type={data.type} id={id} />
        <RemoveNodeButton id={id} />
      </div>
      <Textarea
        id="text"
        className="nodrag m-4 h-32 w-96 p-2"
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
    <div className="rounded-md border-2 bg-background">
      <Handle
        type="target"
        position={Position.Left}
        className="h-8 w-4 rounded bg-gray-700"
      />
      <div className="flex flex-row items-center justify-between rounded-t border-b-2 bg-blue-900 p-2 font-bold">
        <SelectNodeType type={data.type} id={id} />
        <RemoveNodeButton id={id} />
      </div>
      <div className="m-4 flex flex-col items-center justify-center">
        <div className="flex flex-row items-center justify-center space-x-2">
          <Label htmlFor="operation" className="font-bold">
            Operation
          </Label>
          <Select
            value={data.operation}
            onValueChange={(newValue) => updateOperation(id, newValue)}
          >
            <SelectTrigger className="w-96" id="operation">
              <SelectValue className="nodrag" />
            </SelectTrigger>
            <SelectContent>
              {operationNames.map((operation) => (
                <SelectItem
                  key={operation}
                  value={operation}
                  className="capitalize"
                >
                  {operation.replaceAll('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
    <div className="rounded-md border-2 bg-background">
      <Handle
        type="target"
        position={Position.Left}
        className="h-8 w-4 rounded bg-gray-700"
      />
      <div className="flex flex-row items-center justify-between gap-2 rounded-t border-b-2 bg-primary p-2">
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
