import React, { useEffect, useRef } from 'react';
import Tree from 'react-d3-tree';
import * as d3 from 'd3';
import * as Plot from "@observablehq/plot";

const TreeVisualization = ({ data }) => {
  

  const dummyRootData = { ID: "Crawl Head", children: data};
  const dummyNoNullData = {
    name: "Seed URL Parent",
    ID: dummyRootData.ID,
    children: dummyRootData.children.null
  };


  populateNamesAndAvg(dummyNoNullData);

  function populateNamesAndAvg(node){
    if(node.children && node.children.length > 0){
      const avgScoreSum = node.children.reduce((sum, child) => sum + child.Avg_score, 0);
      const avgScore = avgScoreSum / node.children.length;
      const formatAvg = avgScore.toFixed(3);

      if(node.ID === "Crawl Head"){
        node.name= `Crawl Root Node, ${node.children.length}`
      }
      else{
        node.name= `${getDomainFromUrl(node.URL)}, ${(node.Avg_score).toFixed(3)}, ${node.children.length}, ${formatAvg}`;
      }
      for(const child of node.children){
        populateNamesAndAvg(child);
      }
    }
    else{

      node.name = `${getDomainFromUrl(node.URL)}, 0, ${(node.Avg_score).toFixed(3)}`;
      delete node.children;
    }
  }

  function getDomainFromUrl(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch (error) {
      // Handle invalid URLs or exceptions
      return null;
    }
  }
  

  const treeConfig = {
    nodeSize: { x: 200, y: 100 }, // Adjust node size as needed
    separation: { siblings: 1, nonSiblings: 2 },
    orientation: 'vertical', // Set the orientation to 'vertical' for top-down
  };



  return (
    <div id="treeWrapper" style={{ width: '80vw', height: '60vh' }}>
      <Tree
        data={dummyNoNullData}
        orientation={'horizontal'} // Set the orientation again here
        translate={{ x: 100, y: 200 }} // Adjust the translation as needed
        pathFunc={'curved'}
        depthFactor={1200}
        initialDepth={1}
        zoom={0.25} // Adjust zoom level as needed
        scaleExtent={{ min: 0.1, max: 3 }} // Adjust scale extent as needed
        transitionDuration={0}
        nodeSvgShape={{ shape: 'rect', shapeProps: { width: 80, height: 40, x: 0, y: 40} }} // Adjust node shape and size as needed
        separation={treeConfig.separation}
        nodeSize={treeConfig.nodeSize}
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        shouldCollapseNeighborNodes={false}
        pan={{enable: false}}
      />
    </div>
  );
};

export default TreeVisualization;
