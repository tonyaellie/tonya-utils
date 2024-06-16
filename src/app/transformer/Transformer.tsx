'use client';

// TODO:
// - [ ] make edge red if its going to be replaced
// - [ ] in certain cases, the node text is not updated correctly (e.g. deleting an input node)
// - [ ] improve efficiency of calculateNodeText and the calls to it
// - [ ] add more operations
// - [ ] add import/export

import React, { useEffect, useState } from 'react';

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  ControlButton,
  ReactFlowProvider,
  useReactFlow,
  // useOnSelectionChange,
} from 'reactflow';

import { nodeOrigin, nodeTypes } from './Nodes';
import { store } from './store';

import 'reactflow/dist/base.css';

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
    // onSelectionChange,
  } = store();
  const { screenToFlowPosition } = useReactFlow();
  
  // useOnSelectionChange({
  //   onChange: onSelectionChange,
  // });

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
        <MiniMap
          style={{ background: '#435' }}
          maskColor="#66666666"
          nodeColor={(node) => {
            switch (node.type) {
              case 'input':
                return '#f792cd';
              case 'output':
                return '#cd0482';
              default:
                return '#fa3aa6';
            }
          }}
        />
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
    store.getState().calculateNodeText();
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
